import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import {
  Shield,
  Lock,
  User,
  Eye,
  EyeOff,
  Mail,
  Key,
  AlertCircle,
  Cpu,
  Fingerprint,
  Users,
  FileKey,
  Network,
  Bug,
  Sparkles,
  Terminal,
  Code,
  Database,
  Webhook,
  Binary,
  Zap,
  CheckCircle2,
  QrCode
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { QRCodeSVG } from "qrcode.react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";

// Define form schemas
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  otp: z.string().length(6, "Code must be 6 digits").optional(),
  rememberMe: z.boolean().optional(),
});

const registerSchema = z.object({
  username: z.string()
    .min(3, "Minimum 3 characters")
    .max(20, "Maximum 20 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(8, "Minimum 8 characters")
    .regex(/[A-Z]/, "Must contain uppercase letter")
    .regex(/[a-z]/, "Must contain lowercase letter")
    .regex(/[0-9]/, "Must contain number")
    .regex(/[^A-Za-z0-9]/, "Must contain special character"),
  confirmPassword: z.string(),
  enableMfa: z.boolean().default(false),
  terms: z.boolean().refine(val => val === true, "You must accept the terms"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { user, login, register, setupMfa, verifyMfa } = useAuth();
  const [setupData, setSetupData] = useState<{ qrCode: string; secret: string } | null>(null);

  if (user) {
    setLocation("/dashboard");
    return null;
  }

  const handleRegisterSuccess = async (data: any) => {
    // If user checked MFA, call setupMfa
    if (data.enableMfa) {
      try {
        const result = await setupMfa.mutateAsync();
        setSetupData(result);
      } catch (err) {
        console.error("MFA setup failed", err);
      }
    }
  };

  const modules = [
    { icon: <Fingerprint className="w-6 h-6" />, title: "Authentication", desc: "Password security, MFA, secure login flows" },
    { icon: <Users className="w-6 h-6" />, title: "Access Control", desc: "Role-based permissions, security policies" },
    { icon: <Cpu className="w-6 h-6" />, title: "Cryptography", desc: "AES encryption, RSA keys, secure communication" },
    { icon: <Database className="w-6 h-6" />, title: "Hashing", desc: "SHA-256, password storage, data integrity" },
    { icon: <FileKey className="w-6 h-6" />, title: "Digital Signatures", desc: "Message verification, non-repudiation" },
    { icon: <Bug className="w-6 h-6" />, title: "Attack Simulation", desc: "Security testing, vulnerability assessment" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 flex items-center justify-center p-4">
      {/* MFA Setup Dialog */}
      <Dialog open={!!setupData} onOpenChange={() => setSetupData(null)}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <QrCode className="text-cyan-400" />
              Set up MFA
            </DialogTitle>
            <DialogDescription className="text-gray-400 pt-2">
              Scan this QR code with your authenticator app (like Google Authenticator or Authy) to enable MFA.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-6 space-y-6">
            <div className="bg-white p-3 rounded-xl border-4 border-cyan-500/50">
              {setupData && (
                <QRCodeSVG
                  value={setupData.qrCode}
                  size={200}
                  level="H"
                  includeMargin
                />
              )}
            </div>
            <div className="text-center space-y-2 w-full">
              <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Secret Key</p>
              <code className="block p-3 bg-black/40 rounded border border-gray-700 text-cyan-400 font-mono text-sm break-all">
                {setupData?.secret}
              </code>
            </div>
            <div className="w-full space-y-4 pt-4 border-t border-gray-800">
              <p className="text-sm text-gray-300 text-center">Verify your code to finish setup:</p>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  onComplete={(code) => {
                    verifyMfa.mutate(code, {
                      onSuccess: () => setSetupData(null)
                    });
                  }}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>
          </div>
          <DialogFooter className="sm:justify-center">
            <Button
              variant="ghost"
              className="text-gray-400"
              onClick={() => setSetupData(null)}
            >
              Set up later
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Background */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-5"></div>

      <div className="relative w-full max-w-6xl z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Panel - Platform Overview */}
          <div className="text-white space-y-8">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-cyan-600 to-teal-500 p-3 rounded-xl">
                <Shield className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">CyberLearn</h1>
                <p className="text-cyan-200 text-lg">Interactive Security Training Platform</p>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-5xl font-bold leading-tight">
                Learn Security
                <br />
                <span className="text-cyan-400">Through Practice</span>
              </h2>

              <p className="text-xl text-gray-300 leading-relaxed max-w-xl">
                Master cybersecurity concepts through hands-on simulations.
                From encryption to access control, learn by doing in a safe,
                interactive environment designed for practical skill development.
              </p>
            </div>

            {/* Module Grid */}
            <div className="grid grid-cols-2 gap-4">
              {modules.map((module, index) => (
                <div
                  key={index}
                  className="bg-gray-800/50 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-4 hover:border-cyan-400/40 transition-all group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-cyan-500/20 p-2 rounded-lg">
                      {module.icon}
                    </div>
                    <h3 className="font-semibold">{module.title}</h3>
                  </div>
                  <p className="text-sm text-gray-400">{module.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel - Authentication */}
          <div>
            <Card className="bg-gray-900/80 backdrop-blur-sm border border-cyan-500/20 shadow-xl">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <Zap className="w-6 h-6 text-cyan-400" />
                    <span className="text-2xl font-bold text-white">Get Started</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">Access Your Learning Dashboard</h3>
                  <p className="text-gray-400">
                    Sign in to continue your learning or create a new account
                  </p>
                </div>

                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-800/50">
                    <TabsTrigger
                      value="login"
                      className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white"
                    >
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger
                      value="register"
                      className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white"
                    >
                      Create Account
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="login" className="mt-0">
                    <LoginForm login={login} />
                  </TabsContent>

                  <TabsContent value="register" className="mt-0">
                    <RegisterForm register={register} onSuccess={handleRegisterSuccess} />
                  </TabsContent>
                </Tabs>

                <div className="mt-8 pt-6 border-t border-gray-700">
                  <div className="text-center">
                    <p className="text-sm text-gray-400">
                      By continuing, you agree to our{" "}
                      <a href="#" className="text-cyan-400 hover:text-cyan-300 font-medium">
                        Terms
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-cyan-400 hover:text-cyan-300 font-medium">
                        Privacy Policy
                      </a>
                    </p>
                    <div className="mt-4 text-xs text-cyan-500/60">
                      Demo: student / password123
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginForm({ login }: { login: any }) {
  const [showPassword, setShowPassword] = useState(false);
  const [mfaRequired, setMfaRequired] = useState(false);
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      const result = await login.mutateAsync(data);
      if (result && 'mfaRequired' in result && result.mfaRequired) {
        setMfaRequired(true);
      }
    } catch (err) {
      // Error handled by hook toasts
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <AnimatePresence mode="wait">
        {!mfaRequired ? (
          <motion.div
            key="credentials"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
          >
            {login.isError && (
              <Alert variant="destructive" className="bg-red-500/10 border-red-500/50 mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-200">
                  {login.error?.message || "Invalid username or password"}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-300">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <Input
                  id="username"
                  className="pl-10 bg-gray-800 border-gray-700 text-white"
                  placeholder="Enter your username"
                  {...form.register("username")}
                />
              </div>
              {form.formState.errors.username && (
                <p className="text-sm text-red-400">{form.formState.errors.username.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="pl-10 pr-10 bg-gray-800 border-gray-700 text-white"
                  placeholder="Enter your password"
                  {...form.register("password")}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-gray-500 hover:text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </Button>
              </div>
              {form.formState.errors.password && (
                <p className="text-sm text-red-400">{form.formState.errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-2">
                <Controller
                  control={form.control}
                  name="rememberMe"
                  defaultValue={false}
                  render={({ field }) => (
                    <Checkbox
                      id="remember"
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked === true)}
                      className="border-gray-600 data-[state=checked]:bg-cyan-600"
                    />
                  )}
                />
                <Label htmlFor="remember" className="text-sm text-gray-400">Remember me</Label>
              </div>
              <a href="#" className="text-sm text-cyan-400 hover:text-cyan-300 font-medium">Forgot?</a>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="mfa"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6 pt-4"
          >
            <div className="text-center space-y-2">
              <div className="mx-auto bg-cyan-500/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Shield className="text-cyan-400 w-6 h-6" />
              </div>
              <h4 className="text-white font-bold text-lg">MFA Verification</h4>
              <p className="text-gray-400 text-sm">Enter the 6-digit code from your authenticator app.</p>
            </div>

            <div className="flex justify-center flex-col items-center gap-4">
              <Controller
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <InputOTP
                    maxLength={6}
                    value={field.value}
                    onChange={field.onChange}
                    onComplete={() => form.handleSubmit(onSubmit)()}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                )}
              />
              <Button
                type="button"
                variant="ghost"
                className="text-cyan-500 hover:text-cyan-400 text-xs hover:bg-transparent"
                onClick={() => setMfaRequired(false)}
              >
                Back to Sign In
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        type="submit"
        className="w-full h-12 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold"
        disabled={login.isPending}
      >
        {login.isPending ? (
          <div className="flex items-center justify-center gap-2">
            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            {mfaRequired ? "Verifying..." : "Signing in..."}
          </div>
        ) : (
          mfaRequired ? "Verify Code" : "Sign In to Dashboard"
        )}
      </Button>
    </form>
  );
}

function RegisterForm({ register, onSuccess }: { register: ReturnType<typeof useAuth>["register"], onSuccess: (data: any) => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema) as any,
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      enableMfa: false,
      terms: false,
    }
  });

  const password = form.watch("password");

  const getPasswordStrength = () => {
    if (!password) return { score: 0, color: "bg-gray-600", text: "None" };

    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { score, color: "bg-red-500", text: "Weak" };
    if (score <= 3) return { score, color: "bg-yellow-500", text: "Moderate" };
    if (score <= 4) return { score, color: "bg-cyan-500", text: "Strong" };
    return { score, color: "bg-green-500", text: "Very Strong" };
  };

  const onSubmit = (data: any) => {
    register.mutate({
      username: data.username,
      password: data.password,
      role: "Student",
      enableMfa: data.enableMfa
    }, {
      onSuccess: () => onSuccess(data)
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="reg-username" className="text-gray-300">Username</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
            <Input
              id="reg-username"
              className="pl-10 bg-gray-800 border-gray-700 text-white"
              placeholder="Choose a username"
              {...form.register("username")}
            />
          </div>
          {form.formState.errors.username && (
            <p className="text-sm text-red-400">{form.formState.errors.username.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-300">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
            <Input
              id="email"
              type="email"
              className="pl-10 bg-gray-800 border-gray-700 text-white"
              placeholder="Enter your email"
              {...form.register("email")}
            />
          </div>
          {form.formState.errors.email && (
            <p className="text-sm text-red-400">{form.formState.errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="reg-password" className="text-gray-300">Password</Label>
          <div className="relative">
            <Key className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
            <Input
              id="reg-password"
              type={showPassword ? "text" : "password"}
              className="pl-10 pr-10 bg-gray-800 border-gray-700 text-white"
              placeholder="Create a strong password"
              {...form.register("password")}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-gray-500 hover:text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Password strength meter */}
          {password && (
            <div className="mt-2 space-y-2">
              <div className="flex justify-between text-xs text-gray-400">
                <span>Password strength</span>
                <span className={`font-medium ${getPasswordStrength().color.replace('bg-', 'text-')}`}>
                  {getPasswordStrength().text}
                </span>
              </div>
              <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getPasswordStrength().color} transition-all duration-300`}
                  style={{ width: `${(getPasswordStrength().score / 5) * 100}%` }}
                />
              </div>
            </div>
          )}

          {form.formState.errors.password && (
            <p className="text-sm text-red-400">{form.formState.errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password" className="text-gray-300">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
            <Input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              className="pl-10 pr-10 bg-gray-800 border-gray-700 text-white"
              placeholder="Confirm your password"
              {...form.register("confirmPassword")}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-gray-500 hover:text-gray-400"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </Button>
          </div>
          {form.formState.errors.confirmPassword && (
            <p className="text-sm text-red-400">{form.formState.errors.confirmPassword.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-start space-x-2">
          <Controller
            control={form.control}
            name="enableMfa"
            defaultValue={false}
            render={({ field }) => (
              <Checkbox
                id="enableMfa"
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
                className="border-gray-600 data-[state=checked]:bg-cyan-600 mt-1"
              />
            )}
          />
          <Label
            htmlFor="enableMfa"
            className="text-sm text-gray-300 leading-tight font-normal"
          >
            Enable Multi-Factor Authentication (MFA)
          </Label>
        </div>

        <div className="flex items-start space-x-2">
          <Controller
            control={form.control}
            name="terms"
            defaultValue={false}
            render={({ field }) => (
              <Checkbox
                id="terms"
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
                className="border-gray-600 data-[state=checked]:bg-cyan-600 mt-1"
              />
            )}
          />
          <Label
            htmlFor="terms"
            className="text-sm text-gray-300 leading-tight font-normal"
          >
            I agree to the Terms of Service and Privacy Policy
          </Label>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full h-12 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold"
        disabled={register.isPending}
      >
        {register.isPending ? (
          <div className="flex items-center justify-center gap-2">
            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Creating account...
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5" />
            Create Account
          </div>
        )}
      </Button>

      <div className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => (document.querySelector('[value="login"]') as HTMLElement)?.click()}
          className="text-cyan-400 hover:text-cyan-300 font-medium"
        >
          Sign in here
        </button>
      </div>
    </form>
  );
}