import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Loader2, MessageSquarePlus, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useConversations, useCreateConversation, useConversation, useChatStream } from "@/hooks/use-chat";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface AITutorProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function AITutor({ isOpen, onToggle }: AITutorProps) {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  
  const { data: conversations } = useConversations();
  const { mutate: createConversation, isPending: isCreating } = useCreateConversation();
  const { data: activeConversation } = useConversation(activeChatId);
  const { sendMessage, streamingContent, isStreaming } = useChatStream(activeChatId || "");

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeConversation?.messages, streamingContent, isOpen]);

  const handleCreateChat = () => {
    createConversation("New Session", {
      onSuccess: (newChat) => setActiveChatId(newChat.id),
    });
  };

  const handleSend = async () => {
    if (!inputValue.trim() || !activeChatId) return;
    const content = inputValue;
    setInputValue("");
    await sendMessage(content);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 h-screen w-80 md:w-96 bg-background/95 backdrop-blur-xl border-l border-border shadow-2xl z-50 flex flex-col"
        >
          {/* Header */}
          <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-sm">AI Tutor</h3>
                <p className="text-xs text-muted-foreground">Always here to help</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCreateChat} disabled={isCreating}>
                <MessageSquarePlus className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onToggle}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Chat List (if no active chat) */}
          {!activeChatId && (
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bot className="w-8 h-8 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">Welcome to CyberEase Tutor</h4>
                  <p className="text-sm text-muted-foreground mb-6">
                    Ask questions about cryptography, hashing, or cybersecurity concepts.
                  </p>
                  <Button onClick={handleCreateChat} disabled={isCreating} className="w-full">
                    {isCreating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <MessageSquarePlus className="w-4 h-4 mr-2" />}
                    Start New Session
                  </Button>
                </div>

                {conversations && conversations.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Recent Sessions</h5>
                    {conversations.map((chat) => (
                      <button
                        key={chat.id}
                        onClick={() => setActiveChatId(chat.id)}
                        className="w-full text-left p-3 rounded-lg border border-border/50 hover:bg-muted/50 hover:border-primary/20 transition-all group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm truncate">{chat.title}</span>
                          <ChevronRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <span className="text-xs text-muted-foreground">{format(new Date(chat.createdAt), 'MMM d, h:mm a')}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Active Conversation */}
          {activeChatId && (
            <>
              <div className="flex items-center px-4 py-2 bg-muted/10 border-b border-border">
                <Button variant="ghost" size="sm" onClick={() => setActiveChatId(null)} className="mr-2 -ml-2 h-7 px-2 text-muted-foreground">
                  ← Back
                </Button>
                <span className="text-xs font-mono text-muted-foreground truncate flex-1">
                  ID: {activeChatId.slice(0, 8)}...
                </span>
              </div>

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {activeConversation?.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex w-full",
                        msg.role === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground rounded-br-none"
                            : "bg-muted text-foreground rounded-bl-none border border-border"
                        )}
                      >
                        <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                        <span className="text-[10px] opacity-50 mt-1 block">
                          {format(new Date(msg.createdAt), 'h:mm a')}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Streaming Message */}
                  {isStreaming && (
                    <div className="flex w-full justify-start">
                      <div className="max-w-[85%] bg-muted text-foreground rounded-2xl rounded-bl-none px-4 py-2.5 text-sm border border-border shadow-sm">
                        <p className="whitespace-pre-wrap leading-relaxed">
                          {streamingContent}
                          <span className="inline-block w-1.5 h-3 ml-1 bg-primary animate-pulse"/>
                        </p>
                      </div>
                    </div>
                  )}
                  <div ref={scrollRef} />
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="p-4 border-t border-border bg-background">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex gap-2"
                >
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask anything..."
                    className="rounded-full bg-muted/50 border-transparent focus:bg-background focus:border-primary/50 transition-all"
                    disabled={isStreaming}
                  />
                  <Button 
                    type="submit" 
                    size="icon" 
                    className="rounded-full shrink-0 shadow-lg shadow-primary/20"
                    disabled={!inputValue.trim() || isStreaming}
                  >
                    {isStreaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </form>
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
