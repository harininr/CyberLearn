// File: university-auth-simulation.tsx
import { useState, useEffect, useRef } from "react";
import emailjs from '@emailjs/browser';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Lock,
  Key,
  Shield,
  ShieldCheck,
  User,
  Mail,
  Smartphone,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  Send,
  LogIn,
  UserPlus,
  RefreshCw,
  GraduationCap,
  BookOpen,
  Building,
  Clock,
  Bell,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { AuthSimulationUser, InsertAuthSimulationUser } from "@shared/schema";


// Initialize EmailJS with your credentials
// Get these from https://www.emailjs.com
const EMAILJS_CONFIG = {
  SERVICE_ID: "service_63ovttl", // Replace with your EmailJS service ID
  TEMPLATE_ID: "template_sbn90m5", // Replace with your EmailJS template ID
  PUBLIC_KEY: "a7c3WDTtb4Z_gI8i8" // Replace with your EmailJS public key
};

// Types are now imported from @shared/schema


type AuthStage = "register" | "verify_email" | "sfa_login" | "mfa_login" | "dashboard";

export default function UniversityAuthSimulation() {
  const [stage, setStage] = useState<AuthStage>("register");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [studentId, setStudentId] = useState("");
  const [department, setDepartment] = useState("Computer Science");
  const [registerOtp, setRegisterOtp] = useState("");
  const [loginOtp, setLoginOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userAccount, setUserAccount] = useState<AuthSimulationUser | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [sfaResult, setSfaResult] = useState<"none" | "success" | "failed">("none");
  const [mfaResult, setMfaResult] = useState<"none" | "success" | "failed">("none");
  const [lastLogin, setLastLogin] = useState<string>("");

  const { data: serverUser, isLoading: isLoadingUser } = useQuery<AuthSimulationUser>({
    queryKey: [email ? `/api/simulation/auth/user/${email}` : null],
    enabled: !!email && (stage === "sfa_login" || stage === "register"),
    retry: false
  });

  const registerMutation = useMutation({
    mutationFn: async (user: InsertAuthSimulationUser) => {
      const res = await apiRequest("POST", "/api/simulation/auth/register", user);
      return res.json() as Promise<AuthSimulationUser>;
    },
    onSuccess: (data) => {
      setUserAccount(data);
      queryClient.setQueryData([`/api/simulation/auth/user/${data.email}`], data);
    }
  });

  const activityMutation = useMutation({
    mutationFn: async (action: string) => {
      await apiRequest("POST", "/api/simulation/activity/log", {
        module: "auth",
        timestamp: new Date().toISOString(),
        action,
        details: `User ${email} performed ${action}`
      });
    }
  });


  const { toast } = useToast();
  const timerRef = useRef<NodeJS.Timeout>();

  // Departments for university
  const departments = [
    "Computer Science",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Business Administration",
    "Medicine",
    "Law",
    "Arts & Humanities",
    "Science",
    "Mathematics"
  ];

  // Generate random 6-digit OTP
  const generateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    return otp;
  };

  // Send OTP via EmailJS
  const sendOTPEmail = async (recipientEmail: string, otp: string, purpose: "registration" | "login") => {
    setIsSendingEmail(true);

    try {
      const templateParams = {
        to_email: recipientEmail,
        otp_code: otp,
        purpose: purpose === "registration" ? "University Account Registration" : "Login Verification",
        university_name: "Tech University",
        expiry_minutes: "5"
      };

      await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams,
        EMAILJS_CONFIG.PUBLIC_KEY
      );

      toast({
        title: "📧 OTP Sent Successfully!",
        description: `Check your email (${recipientEmail}) for the verification code.`,
      });

      setOtpSent(true);
      startOTPTimer();
      return true;

    } catch (error) {
      console.error("EmailJS Error:", error);
      toast({
        title: "❌ Email Error",
        description: "Failed to send OTP email. Please check EmailJS configuration.",
        variant: "destructive"
      });

      // Fallback: Show OTP in UI for testing
      toast({
        title: "Test OTP (Email failed)",
        description: `Use OTP: ${otp} for testing`,
      });
      setOtpSent(true);
      startOTPTimer();
      return false;

    } finally {
      setIsSendingEmail(false);
    }
  };

  // Start OTP expiry timer (5 minutes)
  const startOTPTimer = () => {
    setOtpTimer(300); // 5 minutes in seconds

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setOtpTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          toast({
            title: "⏰ OTP Expired",
            description: "The OTP has expired. Please request a new one.",
            variant: "destructive"
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Format timer display
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Registration Step 1: Create account
  const handleRegistration = () => {
    // Validation
    if (!fullName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your full name",
        variant: "destructive"
      });
      return;
    }

    if (!email || !email.includes("@") || !email.includes(".")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid university email address",
        variant: "destructive"
      });
      return;
    }

    // Check for university email pattern
    if (!email.toLowerCase().endsWith('.edu') && !email.toLowerCase().includes('university')) {
      toast({
        title: "University Email Required",
        description: "Please use your university email address",
        variant: "warning"
      });
    }

    if (password.length < 8) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 8 characters long",
        variant: "destructive"
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure both passwords match",
        variant: "destructive"
      });
      return;
    }

    if (!studentId.trim()) {
      toast({
        title: "Missing Student ID",
        description: "Please enter your student ID",
        variant: "destructive"
      });
      return;
    }

    // Generate OTP and send email
    const otp = generateOTP();
    sendOTPEmail(email, otp, "registration");

    // Move to verification stage
    setStage("verify_email");

    toast({
      title: "✅ Registration Details Saved",
      description: "Please verify your email with the OTP we sent.",
    });
  };

  // Registration Step 2: Verify email with OTP
  const handleEmailVerification = () => {
    // Verify email with OTP
    if (!registerOtp || registerOtp !== generatedOtp) {
      toast({
        title: "Invalid OTP",
        description: generatedOtp
          ? `Please enter the correct OTP sent to ${email}`
          : "Please wait for OTP to be generated",
        variant: "destructive"
      });
      return;
    }

    // Create user account in database
    registerMutation.mutate({
      email,
      password,
      fullName,
      studentId,
      department,
      otpSecret: generatedOtp,
      mfaEnabled: true,
      registered: true,
      registrationDate: new Date().toISOString()
    }, {
      onSuccess: () => {
        setStage("sfa_login");
        activityMutation.mutate("Registration Verified");
        toast({
          title: "🎓 Account Verified Successfully!",
          description: `Welcome ${fullName}! Now test Single-Factor Login.`,
        });
      }
    });
  };

  // SFA Login (Password only)
  const handleSFALogin = () => {
    const user = serverUser || userAccount;
    if (!user) {

      toast({
        title: "Account Not Found",
        description: "Please complete registration first",
        variant: "destructive"
      });
      return;
    }

    // Check if email matches
    if (email !== user.email) {
      setSfaResult("failed");
      setLoginAttempts(prev => prev + 1);
      activityMutation.mutate("SFA Failed: Invalid Email");

      toast({
        title: "❌ Login Failed",
        description: "Email not found in our records",
        variant: "destructive"
      });
      return;
    }

    // Check if password matches
    if (password !== user.password) {
      setSfaResult("failed");
      setLoginAttempts(prev => prev + 1);
      activityMutation.mutate("SFA Failed: Wrong Password");

      toast({
        title: "❌ Login Failed",
        description: "Incorrect password",
        variant: "destructive"
      });
      return;
    }

    // Successful SFA login
    setSfaResult("success");
    setLoginAttempts(0);
    setLastLogin(new Date().toLocaleString());
    activityMutation.mutate("SFA Success");


    toast({
      title: "✅ SFA Login Successful!",
      description: `Welcome back, ${userAccount.fullName}!`,
    });

    // Send MFA OTP to email
    const otp = generateOTP();
    sendOTPEmail(user.email, otp, "login");


    // Move to MFA stage after delay
    setTimeout(() => {
      setStage("mfa_login");
      toast({
        title: "🔐 MFA Required",
        description: "Check your email for the second factor OTP",
      });
    }, 5000);
  };

  // MFA Login (Password + OTP)
  const handleMFALogin = () => {
    const user = serverUser || userAccount;
    if (!user) return;

    if (!loginOtp || loginOtp !== generatedOtp) {
      setMfaResult("failed");
      activityMutation.mutate("MFA Failed: Invalid OTP");

      toast({
        title: "❌ MFA Failed",
        description: generatedOtp
          ? `Incorrect OTP. Check email for code: ${generatedOtp}`
          : "OTP expired. Please request a new one",
        variant: "destructive"
      });
      return;
    }

    // Successful MFA login
    setMfaResult("success");
    setLastLogin(new Date().toLocaleString());
    activityMutation.mutate("MFA Success");

    toast({
      title: "✅ MFA Login Successful!",
      description: "Both factors authenticated. Maximum security achieved!",
    });

    // Move to dashboard after delay
    setTimeout(() => {
      setStage("dashboard");
    }, 5000);
  };


  // Resend OTP
  const handleResendOTP = () => {
    if (otpTimer > 60) { // Can resend after 1 minute
      toast({
        title: "Please Wait",
        description: `You can resend OTP in ${Math.floor((otpTimer - 60) / 60)} minutes`,
        variant: "destructive"
      });
      return;
    }

    const otp = generateOTP();
    const purpose = stage === "verify_email" ? "registration" : "login";
    sendOTPEmail(email, otp, purpose);

    toast({
      title: "🔄 OTP Resent",
      description: "New verification code sent to your email",
    });
  };

  // Reset simulation
  const resetSimulation = () => {
    setStage("register");
    setUserAccount(null);
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setStudentId("");
    setRegisterOtp("");
    setGeneratedOtp("");
    setLoginOtp("");
    setSfaResult("none");
    setMfaResult("none");
    setLoginAttempts(0);
    setOtpSent(false);
    setOtpTimer(0);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    toast({
      title: "Simulation Reset",
      description: "Start a new university registration",
    });
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Handle existing user
  useEffect(() => {
    if (serverUser && serverUser.registered && stage === "register") {
      setUserAccount(serverUser);
      setStage("sfa_login");
      toast({
        title: "Account Found",
        description: `Welcome back, ${serverUser.fullName}! Please login.`,
      });
    }
  }, [serverUser, stage]);

  // Auto-generate student ID
  useEffect(() => {
    if (fullName && !studentId && stage === "register") {
      const initials = fullName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      setStudentId(`${initials}${randomNum}`);
    }
  }, [fullName, stage]);


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Building className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">Tech University Authentication System</h1>
                <p className="text-blue-200">
                  Real email OTP authentication for university applications
                </p>
              </div>
            </div>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {stage === "register" && "📝 Register"}
            {stage === "verify_email" && "📧 Verify Email"}
            {stage === "sfa_login" && "1️⃣ SFA Login"}
            {stage === "mfa_login" && "2️⃣ MFA Login"}
            {stage === "dashboard" && "🎓 Student Dashboard"}
          </Badge>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center">
        <div className="flex items-center">
          {["register", "verify_email", "sfa_login", "mfa_login", "dashboard"].map((s, index) => (
            <div key={s} className="flex items-center">
              <div className={`flex flex-col items-center ${stage === s ||
                (s === "verify_email" && stage === "sfa_login") ||
                (s === "sfa_login" && (stage === "mfa_login" || stage === "dashboard")) ||
                (s === "mfa_login" && stage === "dashboard")
                ? "text-primary" : "text-muted-foreground"
                }`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${stage === s ||
                  (s === "verify_email" && stage === "sfa_login") ||
                  (s === "sfa_login" && (stage === "mfa_login" || stage === "dashboard")) ||
                  (s === "mfa_login" && stage === "dashboard")
                  ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}>
                  {s === "register" && <UserPlus className="w-5 h-5" />}
                  {s === "verify_email" && <Mail className="w-5 h-5" />}
                  {s === "sfa_login" && <Key className="w-5 h-5" />}
                  {s === "mfa_login" && <ShieldCheck className="w-5 h-5" />}
                  {s === "dashboard" && <GraduationCap className="w-5 h-5" />}
                </div>
                <span className="text-xs font-medium">
                  {s === "register" && "Register"}
                  {s === "verify_email" && "Verify"}
                  {s === "sfa_login" && "SFA"}
                  {s === "mfa_login" && "MFA"}
                  {s === "dashboard" && "Dashboard"}
                </span>
              </div>
              {index < 4 && <div className="w-12 h-1 bg-border mx-2"></div>}
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Panel: Current Stage Form */}
        <div className="space-y-6">
          {/* Registration Form */}
          {stage === "register" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  University Account Registration
                </CardTitle>
                <CardDescription>
                  Create your Tech University student account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <Label>Full Name *</Label>
                    <Input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <Label> Email *</Label>
                    <Input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@gmail.com"
                      type="email"
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                    </div>
                  </div>

                  <div>
                    <Label>Student ID *</Label>
                    <Input
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      placeholder="Will auto-generate from name"
                    />
                  </div>

                  <div>
                    <Label>Department *</Label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                    >
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label>Password *</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a strong password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Minimum 8 characters with letters and numbers
                    </div>
                  </div>

                  <div>
                    <Label>Confirm Password *</Label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your password"
                    />
                  </div>
                </div>

                <Alert className="bg-blue-500/10 border-blue-500/20">
                  <Bell className="w-4 h-4" />
                  <AlertDescription className="text-sm">
                    After registration, you'll receive an OTP via email to verify your account.
                  </AlertDescription>
                </Alert>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleRegistration}
                  className="w-full"
                  size="lg"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Register Account
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Email Verification */}
          {stage === "verify_email" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Verify Your Email
                </CardTitle>
                <CardDescription>
                  We've sent a 6-digit OTP to {email}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-blue-500" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Check your inbox for the verification code
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label>Enter 6-digit OTP</Label>
                    <Input
                      value={registerOtp}
                      onChange={(e) => setRegisterOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="Enter code from email"
                      maxLength={6}
                      className="text-center text-2xl tracking-widest"
                    />
                  </div>

                  {otpTimer > 0 && (
                    <div className="text-center">
                      <div className="text-sm font-medium">OTP expires in: {formatTimer(otpTimer)}</div>
                      <Progress value={(otpTimer / 300) * 100} className="mt-2" />
                    </div>
                  )}

                  {isSendingEmail ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Sending OTP email...</span>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={handleResendOTP}
                        variant="outline"
                        className="flex-1"
                        disabled={otpTimer > 60}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Resend OTP {otpTimer > 60 && `(${Math.ceil((otpTimer - 60) / 60)}m)`}
                      </Button>

                      <Button
                        onClick={handleEmailVerification}
                        className="flex-1"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Verify Email
                      </Button>
                    </div>
                  )}
                </div>

                <Alert className="bg-amber-500/10 border-amber-500/20">
                  <AlertTriangle className="w-4 h-4" />
                  <AlertDescription className="text-sm">
                    <strong>Testing Note:</strong> If email doesn't arrive, check console for OTP or
                    configure EmailJS with your credentials.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}

          {/* SFA Login */}
          {stage === "sfa_login" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Single-Factor Login (SFA)
                </CardTitle>
                <CardDescription>
                  Login with email and password only
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <Label>University Email</Label>
                    <Input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your registered email"
                    />
                  </div>

                  <div>
                    <Label>Password</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                {sfaResult === "success" && (
                  <Alert className="bg-green-500/10 border-green-500/20">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <AlertDescription>
                      <div className="space-y-1">
                        <p className="font-bold">✅ SFA Authentication Successful</p>
                        <p className="text-sm">
                          <strong>Security Risk:</strong> With SFA, if someone steals your password,
                          they have full access to your university account.
                        </p>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                {sfaResult === "failed" && (
                  <Alert className="bg-red-500/10 border-red-500/20">
                    <XCircle className="w-4 h-4 text-red-600" />
                    <AlertDescription>
                      <div className="space-y-1">
                        <p className="font-bold">❌ Login Failed</p>
                        <p className="text-sm">
                          Wrong credentials. Attempts: {loginAttempts}
                        </p>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleSFALogin}
                  className="w-full"
                  size="lg"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Login with SFA
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* MFA Login */}
          {stage === "mfa_login" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" />
                  Multi-Factor Login (MFA)
                </CardTitle>
                <CardDescription>
                  Password verified. Now enter OTP from your email.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 border rounded-lg bg-green-500/5">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="font-bold">First Factor Verified</span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Password authentication successful for {userAccount?.email}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Second Factor: One-Time Password</Label>
                      {otpSent && generatedOtp && (
                        <Badge variant="outline">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatTimer(otpTimer)}
                        </Badge>
                      )}
                    </div>
                    <Input
                      value={loginOtp}
                      onChange={(e) => setLoginOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="Enter 6-digit OTP from email"
                      maxLength={6}
                      className="text-center text-2xl tracking-widest"
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      Check your email ({userAccount?.email}) for the OTP
                    </div>
                  </div>

                  {isSendingEmail ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Sending OTP email...</span>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={handleResendOTP}
                        variant="outline"
                        className="flex-1"
                        disabled={otpTimer > 60}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Resend OTP
                      </Button>

                      <Button
                        onClick={handleMFALogin}
                        className="flex-1"
                      >
                        <ShieldCheck className="w-4 h-4 mr-2" />
                        Verify & Login
                      </Button>
                    </div>
                  )}
                </div>

                {mfaResult === "success" && (
                  <Alert className="bg-green-500/10 border-green-500/20">
                    <ShieldCheck className="w-4 h-4 text-green-600" />
                    <AlertDescription>
                      <div className="space-y-1">
                        <p className="font-bold">✅ MFA Authentication Successful</p>
                        <p className="text-sm">
                          <strong>Security Benefit:</strong> Even with stolen password, attackers
                          cannot access your account without the OTP from your email.
                        </p>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                {mfaResult === "failed" && (
                  <Alert className="bg-red-500/10 border-red-500/20">
                    <XCircle className="w-4 h-4 text-red-600" />
                    <AlertDescription>
                      <div className="space-y-1">
                        <p className="font-bold">❌ MFA Failed</p>
                        <p className="text-sm">
                          Invalid OTP. Please check your email and try again.
                        </p>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}

          {/* Student Dashboard */}
          {stage === "dashboard" && userAccount && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Student Dashboard
                </CardTitle>
                <CardDescription>
                  Welcome to Tech University Portal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                    {userAccount.fullName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-bold text-lg">{userAccount.fullName}</div>
                    <div className="text-sm text-muted-foreground">{userAccount.email}</div>
                    <Badge variant="outline" className="mt-1">{userAccount.department}</Badge>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 border rounded-lg">
                      <div className="text-xs text-muted-foreground">Student ID</div>
                      <div className="font-bold">{userAccount.studentId}</div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="text-xs text-muted-foreground">Account Type</div>
                      <div className="font-bold">Student</div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="text-xs text-muted-foreground">Last Login</div>
                      <div className="font-bold">{lastLogin}</div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="text-xs text-muted-foreground">Security Level</div>
                      <div className="font-bold flex items-center gap-1">
                        <ShieldCheck className="w-4 h-4 text-green-500" />
                        MFA Enabled
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-bold">Quick Actions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Courses
                    </Button>
                    <Button variant="outline">
                      <Bell className="w-4 h-4 mr-2" />
                      Notifications
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={resetSimulation}
                  variant="outline"
                  className="w-full"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Start New Simulation
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>

        {/* Right Panel: Explanation & Security Info */}
        <div className="space-y-6">
          {/* Current Stage Explanation */}
          <Card>
            <CardHeader>
              <CardTitle>
                {stage === "register" && "🎓 University Registration"}
                {stage === "verify_email" && "📧 Email Verification"}
                {stage === "sfa_login" && "1️⃣ Single-Factor Authentication"}
                {stage === "mfa_login" && "2️⃣ Multi-Factor Authentication"}
                {stage === "dashboard" && "✅ Authentication Complete"}
              </CardTitle>
              <CardDescription>
                {stage === "register" && "Why universities need secure authentication"}
                {stage === "verify_email" && "Protecting student accounts with email verification"}
                {stage === "sfa_login" && "The risks of password-only authentication"}
                {stage === "mfa_login" && "Adding an extra layer of security"}
                {stage === "dashboard" && "Secure access to university resources"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {stage === "register" && (
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-bold mb-2">Why Secure Authentication Matters</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <Shield className="w-4 h-4 text-blue-500 mt-0.5" />
                        <span>Protects student records and grades</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Lock className="w-4 h-4 text-blue-500 mt-0.5" />
                        <span>Secures financial aid information</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Building className="w-4 h-4 text-blue-500 mt-0.5" />
                        <span>Prevents unauthorized access to university systems</span>
                      </li>
                    </ul>
                  </div>
                  <Alert>
                    <AlertTriangle className="w-4 h-4" />
                    <AlertDescription className="text-sm">
                      <strong>Data Protection:</strong> Universities handle sensitive personal and
                      academic data that requires strong authentication measures.
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {stage === "verify_email" && (
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-bold mb-2">Email Verification Process</h4>
                    <ol className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center flex-shrink-0">1</div>
                        <span>System generates unique 6-digit OTP</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center flex-shrink-0">2</div>
                        <span>OTP sent to your university email via EmailJS</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center flex-shrink-0">3</div>
                        <span>You enter OTP to confirm email ownership</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center flex-shrink-0">4</div>
                        <span>Account activated for university services</span>
                      </li>
                    </ol>
                  </div>
                  <Alert className="bg-green-500/10 border-green-500/20">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <AlertDescription className="text-sm">
                      <strong>Real OTP Delivery:</strong> This simulation uses EmailJS to
                      actually send emails to the provided address.
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {stage === "sfa_login" && (
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg bg-red-500/5">
                    <h4 className="font-bold mb-2 text-red-600">SFA Security Risks</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-red-500 mt-0.5" />
                        <span><strong>Password theft</strong> = Complete account compromise</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-red-500 mt-0.5" />
                        <span><strong>Phishing attacks</strong> can easily capture passwords</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-red-500 mt-0.5" />
                        <span><strong>No protection</strong> if password is leaked elsewhere</span>
                      </li>
                    </ul>
                  </div>
                  <Alert className="bg-amber-500/10 border-amber-500/20">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <AlertDescription className="text-sm">
                      <strong>University Impact:</strong> With SFA, attackers could access
                      grades, change courses, or view personal information.
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {stage === "mfa_login" && (
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg bg-green-500/5">
                    <h4 className="font-bold mb-2 text-green-600">MFA Security Benefits</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span><strong>Stolen password</strong> ≠ Account access</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span><strong>Second factor</strong> required from your device/email</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span><strong>Real-time alerts</strong> when OTP is requested</span>
                      </li>
                    </ul>
                  </div>
                  <Alert className="bg-green-500/10 border-green-500/20">
                    <ShieldCheck className="w-4 h-4 text-green-600" />
                    <AlertDescription className="text-sm">
                      <strong>University Security:</strong> MFA prevents unauthorized access even if
                      passwords are compromised through phishing or data breaches.
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {stage === "dashboard" && (
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-bold mb-2">Authentication Comparison</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">Single-Factor (SFA)</span>
                          <Badge variant="destructive">High Risk</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Password only • One point of failure
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">Multi-Factor (MFA)</span>
                          <Badge variant="default">Secure</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Password + OTP • Defense in depth
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <h4 className="font-bold mb-2">University Security Standards</h4>
                    <div className="text-sm space-y-2">
                      <p>Most universities now require MFA for:</p>
                      <ul className="space-y-1">
                        <li>• Student portal access</li>
                        <li>• Grade submission (faculty)</li>
                        <li>• Financial transactions</li>
                        <li>• Sensitive data access</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* User Account Info */}
          {userAccount && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Your Account Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Registered Email</div>
                  <div className="font-medium">{userAccount.email}</div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Student ID</div>
                  <div className="font-medium">{userAccount.studentId}</div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Authentication Status</div>
                  <div className="flex items-center gap-2">
                    {sfaResult === "success" && (
                      <Badge variant="outline" className="gap-1">
                        <Key className="w-3 h-3" />
                        SFA Verified
                      </Badge>
                    )}
                    {mfaResult === "success" && (
                      <Badge variant="default" className="gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        MFA Verified
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  <strong>Note:</strong> This is a simulation. No real data is stored.
                </div>
              </CardContent>
            </Card>
          )}

          {/* Setup Instructions for EmailJS */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Real OTP Setup Instructions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>To enable <strong>real email OTP delivery</strong>:</p>
                <ol className="space-y-1 pl-4">
                  <li>1. Sign up at <a href="https://www.emailjs.com" className="text-blue-500 underline">EmailJS.com</a></li>
                  <li>2. Create an email service (Gmail works)</li>
                  <li>3. Create an email template with variables: {"{"}to_email{"}"}, {"{"}otp_code{"}"}</li>
                  <li>4. Replace the SERVICE_ID, TEMPLATE_ID, and PUBLIC_KEY in the code</li>
                  <li>5. Test with any email address!</li>
                </ol>
                <div className="p-2 bg-amber-500/10 rounded text-xs mt-2">
                  <strong>Testing:</strong> Without EmailJS setup, OTPs will be shown on screen for testing.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer Status */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {stage === "register" && (
                <div className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-blue-500" />
                  <div>
                    <div className="font-medium">Ready to Register</div>
                    <div className="text-sm text-muted-foreground">Enter your university details</div>
                  </div>
                </div>
              )}
              {stage === "verify_email" && (
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-500" />
                  <div>
                    <div className="font-medium">Email Verification Required</div>
                    <div className="text-sm text-muted-foreground">Check your inbox for OTP</div>
                  </div>
                </div>
              )}
              {stage === "sfa_login" && (
                <div className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-blue-500" />
                  <div>
                    <div className="font-medium">Testing Single-Factor Auth</div>
                    <div className="text-sm text-muted-foreground">Password-only login</div>
                  </div>
                </div>
              )}
              {stage === "mfa_login" && (
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                  <div>
                    <div className="font-medium">Testing Multi-Factor Auth</div>
                    <div className="text-sm text-muted-foreground">Password + OTP verification</div>
                  </div>
                </div>
              )}
              {stage === "dashboard" && (
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-purple-500" />
                  <div>
                    <div className="font-medium">Authentication Complete</div>
                    <div className="text-sm text-muted-foreground">Secure access achieved</div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {otpTimer > 0 && (
                <Badge variant="outline">
                  <Clock className="w-3 h-3 mr-1" />
                  OTP: {formatTimer(otpTimer)}
                </Badge>
              )}
              {loginAttempts > 0 && (
                <Badge variant="outline">
                  Attempts: {loginAttempts}
                </Badge>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={resetSimulation}
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}