import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type InsertUser, type LoginRequest, type User } from "@shared/schema";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export function useAuth() {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: user, isLoading, error } = useQuery({
    queryKey: [api.auth.user.path],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(api.auth.user.path, { headers });
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to fetch user");
      return api.auth.user.responses[200].parse(await res.json());
    },
    retry: false,
    staleTime: Infinity,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const res = await fetch(api.auth.login.path, {
        method: api.auth.login.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (res.status === 403) {
        const errorData = await res.json();
        if (errorData.mfaRequired) {
          return { mfaRequired: true } as any;
        }
      }

      if (!res.ok) {
        throw new Error("Invalid username or password");
      }

      const userData = await res.json();
      if (userData.token) {
        localStorage.setItem("token", userData.token);
      }
      return api.auth.login.responses[200].parse(userData);
    },
    onSuccess: (data) => {
      if ('mfaRequired' in data) return;
      queryClient.setQueryData([api.auth.user.path], data);
      toast({ title: "Welcome back!", description: `Logged in as ${data.username}` });
    },
    onError: (error: any) => {
      if (error.mfaRequired) return;
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive"
      });
    },
  });

  const setupMfaMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest(api.auth.mfaSetup.method, api.auth.mfaSetup.path);
      return await res.json() as { qrCode: string; secret: string };
    },
  });

  const verifyMfaMutation = useMutation({
    mutationFn: async (code: string) => {
      const res = await apiRequest(api.auth.mfaVerify.method, api.auth.mfaVerify.path, { code });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.auth.user.path] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (registerInput: InsertUser) => {
      const res = await fetch(api.auth.register.path, {
        method: api.auth.register.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerInput),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const err = await res.json();
          throw new Error(err.message || "Registration failed");
        }
        throw new Error("Registration failed");
      }
      const regData = await res.json();
      if (regData.token) {
        localStorage.setItem("token", regData.token);
      }
      return api.auth.register.responses[201].parse(regData);
    },
    onSuccess: () => {
      toast({ title: "Account created", description: "Please log in with your credentials." });
    },
    onError: (error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive"
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest(api.auth.logout.method, api.auth.logout.path);
      localStorage.removeItem("token");
    },
    onSuccess: () => {
      queryClient.setQueryData([api.auth.user.path], null);
      setLocation("/auth");
      toast({ title: "Logged out", description: "See you next time!" });
    },
  });

  return {
    user,
    isLoading,
    error,
    login: loginMutation,
    register: registerMutation,
    logout: logoutMutation,
    setupMfa: setupMfaMutation,
    verifyMfa: verifyMfaMutation,
  };
}
