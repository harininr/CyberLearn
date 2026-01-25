import { useState, useRef, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type Conversation, type Message } from "@shared/routes";

export function useConversations() {
  return useQuery({
    queryKey: [api.chat.list.path],
    queryFn: async () => {
      const res = await fetch(api.chat.list.path);
      if (!res.ok) throw new Error("Failed to fetch conversations");
      return api.chat.list.responses[200].parse(await res.json());
    },
  });
}

export function useConversation(id: string | null) {
  return useQuery({
    queryKey: [api.chat.get.path, id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) return null;
      const url = buildUrl(api.chat.get.path, { id });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch conversation");
      return api.chat.get.responses[200].parse(await res.json());
    },
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (title: string) => {
      const res = await fetch(api.chat.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error("Failed to create chat");
      return api.chat.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.chat.list.path] });
    },
  });
}

// Custom hook for streaming chat response
export function useChatStream(conversationId: string) {
  const [streamingContent, setStreamingContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const queryClient = useQueryClient();
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    if (!conversationId) return;
    
    setIsStreaming(true);
    setStreamingContent("");
    
    // Optimistically update UI with user message could happen here, 
    // but we'll rely on the caller to show the user message immediately.

    try {
      abortControllerRef.current = new AbortController();
      const url = buildUrl(api.chat.message.path, { id: conversationId });
      
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) throw new Error("Failed to send message");
      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;
        
        // Process line-by-line for SSE format: "data: {...}\n\n"
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || ""; // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.slice(6);
            try {
              const data = JSON.parse(dataStr);
              if (data.content) {
                setStreamingContent(prev => prev + data.content);
              }
              if (data.done) {
                // Done
              }
            } catch (e) {
              console.error("Error parsing SSE JSON", e);
            }
          }
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error("Stream error:", error);
      }
    } finally {
      setIsStreaming(false);
      setStreamingContent("");
      // Invalidate to fetch the full saved message from backend
      queryClient.invalidateQueries({ queryKey: [api.chat.get.path, conversationId] });
    }
  }, [conversationId, queryClient]);

  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsStreaming(false);
    }
  }, []);

  return { sendMessage, streamingContent, isStreaming, abort };
}
