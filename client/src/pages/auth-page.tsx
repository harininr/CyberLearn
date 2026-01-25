import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Shield, ArrowRight, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InsertUser, LoginRequest } from "@shared/routes";

// Define form schemas matching the API types
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  username: z.string().min(3, "Minimum 3 characters"),
  password: z.string().min(6, "Minimum 6 characters"),
  role: z.enum(["Student", "Instructor"]),
});

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { user, login, register } = useAuth();
  
  if (user) {
    setLocation("/");
    return null;
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left Panel - Hero */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-zinc-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900/90 to-black/80"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-teal-500/20 p-2 rounded-lg backdrop-blur-sm border border-teal-500/30">
              <Shield className="w-8 h-8 text-teal-400" />
            </div>
            <span className="text-xl font-bold font-display tracking-tight">CyberEase</span>
          </div>
          
          <h1 className="text-5xl font-bold font-display leading-tight mb-6">
            Master Cybersecurity <br/> Through Simulation
          </h1>
          <p className="text-zinc-400 text-lg max-w-md leading-relaxed">
            Interactive modules for cryptography, hashing, and defense strategies. Learn by doing in a safe, controlled environment.
          </p>
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-4 text-sm text-zinc-400">
            <div className="flex -space-x-2">
              {[1,2,3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-zinc-900 flex items-center justify-center text-xs">
                  User
                </div>
              ))}
            </div>
            <p>Join thousands of students learning security.</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Forms */}
      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
            <p className="text-muted-foreground mt-2">Enter your credentials to access the simulator.</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <LoginForm login={login} />
            </TabsContent>
            
            <TabsContent value="register">
              <RegisterForm register={register} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function LoginForm({ login }: { login: ReturnType<typeof useAuth>["login"] }) {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    login.mutate(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input id="username" {...form.register("username")} placeholder="Enter username" />
        {form.formState.errors.username && (
          <p className="text-xs text-destructive">{form.formState.errors.username.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" {...form.register("password")} placeholder="••••••••" />
        {form.formState.errors.password && (
          <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={login.isPending}>
        {login.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lock className="mr-2 h-4 w-4" />}
        Sign In
      </Button>
    </form>
  );
}

function RegisterForm({ register }: { register: ReturnType<typeof useAuth>["register"] }) {
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "Student",
    },
  });

  const onSubmit = (data: z.infer<typeof registerSchema>) => {
    // @ts-ignore - casting for strict api type match
    register.mutate(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reg-username">Username</Label>
        <Input id="reg-username" {...form.register("username")} placeholder="Choose a username" />
        {form.formState.errors.username && (
          <p className="text-xs text-destructive">{form.formState.errors.username.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="reg-password">Password</Label>
        <Input id="reg-password" type="password" {...form.register("password")} placeholder="Create a password" />
        {form.formState.errors.password && (
          <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Role</Label>
        <div className="grid grid-cols-2 gap-4">
          <label className={`
            flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all
            ${form.watch("role") === "Student" ? "border-primary bg-primary/5 text-primary ring-1 ring-primary" : "hover:border-primary/50"}
          `}>
            <input type="radio" value="Student" {...form.register("role")} className="sr-only" />
            Student
          </label>
          <label className={`
            flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all
            ${form.watch("role") === "Instructor" ? "border-primary bg-primary/5 text-primary ring-1 ring-primary" : "hover:border-primary/50"}
          `}>
            <input type="radio" value="Instructor" {...form.register("role")} className="sr-only" />
            Instructor
          </label>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={register.isPending}>
        {register.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
        Create Account
      </Button>
    </form>
  );
}
