// File: hashing-demo-simulation.tsx
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Lock,
  Key,
  Hash,
  User,
  Database,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Shield,
  ShieldAlert,
  UserPlus,
  LogIn,
  Server,
  Fingerprint,
  ChevronRight,
  RefreshCw,
  Zap,
  ArrowRight,
  Smartphone,
  FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { HashingSimulationUser, InsertHashingSimulationUser } from "@shared/schema";



type Step = {
  id: number;
  title: string;
  description: string;
  userAction: string;
  systemAction: string;
  visual: string;
  icon: React.ReactNode;
};

export default function HashingDemoSimulation() {
  const [activeMode, setActiveMode] = useState<"register" | "login">("register");
  const [username, setUsername] = useState("demo_user");
  const [password, setPassword] = useState("SecurePass123");
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [loginAttempts, setLoginAttempts] = useState(0);

  const { toast } = useToast();

  const { data: userDatabase = [], isLoading: isLoadingDB } = useQuery<HashingSimulationUser[]>({
    queryKey: ["/api/simulation/hashing/users"],
  });

  const createHashingUserMutation = useMutation({
    mutationFn: async (user: InsertHashingSimulationUser) => {
      const res = await apiRequest("POST", "/api/simulation/hashing/register", user);
      return res.json() as Promise<HashingSimulationUser>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/simulation/hashing/users"] });
    }
  });

  const activityMutation = useMutation({
    mutationFn: async (action: string) => {
      await apiRequest("POST", "/api/simulation/activity/log", {
        module: "hashing",
        timestamp: new Date().toISOString(),
        action,
        details: `User ${username} performed ${action}`
      });
    }
  });


  // simulate SHA-256 hashing
  const simulateHash = (text: string): string => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text + "SALT123");
    const hashArray = Array.from(data).map(byte =>
      byte.toString(16).padStart(2, '0')
    );
    return hashArray.join('').substring(0, 64);
  };

  const steps: Step[] = [
    {
      id: 1,
      title: activeMode === "register" ? "User Registration" : "User Login",
      description: activeMode === "register" ? "User creates new account" : "User enters credentials",
      userAction: `Username: "${username}", Password: "********"`,
      systemAction: "Waiting for submission...",
      visual: "👤",
      icon: <User className="w-5 h-5" />
    },
    {
      id: 2,
      title: "Password Hashing",
      description: "System hashes password with salt",
      userAction: "Complete",
      systemAction: "SHA256(password + salt) → Hash",
      visual: "🔒",
      icon: <Hash className="w-5 h-5" />
    },
    {
      id: 3,
      title: "Database Operation",
      description: activeMode === "register" ? "Store hash in database" : "Retrieve hash from database",
      userAction: "Complete",
      systemAction: activeMode === "register" ? "INSERT {username, hash, salt}" : "SELECT hash WHERE username = ?",
      visual: "💾",
      icon: <Database className="w-5 h-5" />
    },
    {
      id: 4,
      title: "Hash Comparison",
      description: activeMode === "register" ? "Confirm storage" : "Compare entered vs stored hash",
      userAction: "Complete",
      systemAction: activeMode === "register" ? "Hash stored successfully" : "hash(input) === hash(stored)",
      visual: "⚖️",
      icon: <Shield className="w-5 h-5" />
    },
    {
      id: 5,
      title: "Authentication Result",
      description: "Final outcome",
      userAction: "Complete",
      systemAction: activeMode === "register" ? "Account created" : "Access granted/denied",
      visual: "✅",
      icon: <CheckCircle className="w-5 h-5" />
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);

      if (currentStep + 1 === 2 && activeMode === "register") {
        const hash = simulateHash(password);
        createHashingUserMutation.mutate({
          username: username || "demo_user",
          passwordHash: hash,
          salt: "SALT123"
        }, {
          onSuccess: () => {
            activityMutation.mutate("Hashed and Registered User");
            toast({
              title: "✅ Account Created",
              description: "Password hashed and stored securely in SQLite",
            });
          }
        });
      }
      //check if hashes are same
      if (currentStep + 1 === 4 && activeMode === "login") {
        const user = userDatabase.find(u => u.username === username);
        const enteredHash = simulateHash(password);
        const isMatch = user?.passwordHash === enteredHash;

        if (isMatch) {
          activityMutation.mutate("Successful Login");
          toast({
            title: "✅ Login Successful",
            description: "Password hash matched!",
          });
        } else {
          setLoginAttempts(prev => prev + 1);
          activityMutation.mutate("Failed Login Attempt");
          toast({
            title: "❌ Login Failed",
            description: "Password hash doesn't match",
            variant: "destructive"
          });
        }
      }

    }
  };

  const resetSimulation = () => {
    setCurrentStep(0);
    setLoginAttempts(0);
    setPassword("SecurePass123");

    toast({
      title: "Simulation Reset",
      description: "Starting from beginning",
    });
  };

  const switchMode = (mode: "register" | "login") => {
    setActiveMode(mode);
    resetSimulation();

    toast({
      title: "Mode Switched",
      description: mode === "register" ? "Registration Mode" : "Login Mode",
    });
  };

  const simulateDatabaseLeak = () => {
    toast({
      title: "🚨 Database Leak Simulated",
      description: "Hackers can only see hashed passwords",
      variant: "destructive"
    });
  };

  const firstUser = userDatabase.length > 0 ? userDatabase[0] : null;
  const isPasswordMatch = firstUser ? firstUser.passwordHash === simulateHash(password) : false;


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-900 to-blue-900 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-8 h-8" />
              <h1 className="text-2xl font-bold">Password Hashing Security Demo</h1>
            </div>
            <p className="text-green-200">
              Manual mode: Click Next Step to see password hashing in action
            </p>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            Step {currentStep + 1}/{steps.length}
          </Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left Column: User Interface */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <span>User</span>
              </CardTitle>
              <CardDescription>Authentication Interface</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={activeMode === "register" ? "default" : "outline"}
                    onClick={() => switchMode("register")}
                    className="flex-col h-auto py-3"
                  >
                    <UserPlus className="w-5 h-5 mb-1" />
                    <span className="text-xs">Register</span>
                  </Button>
                  <Button
                    variant={activeMode === "login" ? "default" : "outline"}
                    onClick={() => switchMode("login")}
                    className="flex-col h-auto py-3"
                  >
                    <LogIn className="w-5 h-5 mb-1" />
                    <span className="text-xs">Login</span>
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Username</Label>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Password</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
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
                  <p className="text-xs text-muted-foreground">
                    Try: "SecurePass123" (correct) or different password
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Status</span>
                  <Badge variant={
                    currentStep === 0 ? "outline" :
                      currentStep < 4 ? "default" :
                        activeMode === "login" && !isPasswordMatch ? "destructive" : "secondary"
                  }>
                    {currentStep === 0 ? "Ready" :
                      currentStep < 4 ? "Processing" :
                        activeMode === "login" && !isPasswordMatch ? "Failed" : "Success"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Step</span>
                  <Badge variant="outline">
                    {currentStep + 1}/5
                  </Badge>
                </div>
              </div>

              <Alert className="bg-blue-500/10 border-blue-500/20">
                <Fingerprint className="w-4 h-4" />
                <AlertDescription className="text-sm">
                  Original password never stored.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>

        {/* Middle Column: Hashing Steps */}
        <div className="lg:col-span-3">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {steps[currentStep]?.icon}
                  Step {currentStep + 1}: {steps[currentStep]?.title}
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={resetSimulation}
                  >
                    Reset
                  </Button>
                  <Button
                    onClick={nextStep}
                    disabled={currentStep >= steps.length - 1}
                  >
                    {currentStep >= steps.length - 1 ? "Complete" : "Next Step"}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
              <CardDescription>
                {steps[currentStep]?.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Visual Flow */}
              <div className="flex items-center justify-between mb-8">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center mx-auto mb-2">
                    <Smartphone className="w-6 h-6 text-white" />
                  </div>
                  <div className="font-bold">User Device</div>
                  <div className="text-xs text-muted-foreground">Inputs Password</div>
                </div>

                <ArrowRight className="w-6 h-6" />

                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center mx-auto mb-2">
                    <Server className="w-6 h-6 text-white" />
                  </div>
                  <div className="font-bold">Hashing System</div>
                  <div className="text-xs text-muted-foreground">Creates Hash</div>
                </div>

                <ArrowRight className="w-6 h-6" />

                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-2">
                    <Database className="w-6 h-6 text-white" />
                  </div>
                  <div className="font-bold">Database</div>
                  <div className="text-xs text-muted-foreground">Stores Hash</div>
                </div>
              </div>

              {/* Current Step Visualization */}
              <div className="p-6 border-2 border-primary rounded-lg bg-primary/5 mb-6">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">{steps[currentStep]?.visual}</div>
                  <div className="text-lg font-bold">{steps[currentStep]?.title}</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg bg-blue-500/5">
                    <div className="text-sm font-bold mb-2">User Action</div>
                    <div className="text-sm">{steps[currentStep]?.userAction}</div>
                  </div>
                  <div className="p-4 border rounded-lg bg-purple-500/5">
                    <div className="text-sm font-bold mb-2">System Action</div>
                    <div className="text-sm font-mono">{steps[currentStep]?.systemAction}</div>
                  </div>
                </div>

                {/* Step-specific details */}
                {currentStep >= 1 && (
                  <div className="mt-4 p-3 bg-blue-500/10 rounded-lg">
                    <div className="text-sm">
                      <strong>Mode:</strong> <Badge variant="outline">{activeMode === "register" ? "Registration" : "Login"}</Badge>
                    </div>
                  </div>
                )}

                {currentStep >= 2 && (
                  <div className="mt-4 p-3 bg-green-500/10 rounded-lg">
                    <div className="text-sm font-bold mb-1">Password Hash:</div>
                    <div className="text-xs font-mono">
                      {simulateHash(password).substring(0, 32)}...
                    </div>
                  </div>
                )}

                {currentStep >= 3 && (
                  <div className="mt-4 p-3 bg-yellow-500/10 rounded-lg">
                    <div className="text-sm">
                      <strong>Database Entry:</strong> {activeMode === "register" ? "Storing hash" : "Retrieving hash"}
                    </div>
                  </div>
                )}

                {currentStep >= 4 && activeMode === "login" && (
                  <div className={`mt-4 p-3 rounded-lg ${isPasswordMatch ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                    <div className="text-sm">
                      <strong>Hash Comparison:</strong> {isPasswordMatch ? "✓ Match" : "✗ No Match"}
                    </div>
                  </div>
                )}
              </div>

              {/* All Steps */}
              <div className="space-y-2">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`p-3 border rounded-lg flex items-center gap-3 ${index === currentStep ? 'border-primary bg-primary/5' : ''
                      } ${index < currentStep ? 'border-green-500/30 bg-green-500/5' : ''}`}
                  >
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center
                      ${index === currentStep ? 'bg-primary text-primary-foreground' : ''}
                      ${index < currentStep ? 'bg-green-500 text-white' : 'bg-muted'}
                    `}>
                      {step.icon}
                    </div>
                    <div>
                      <div className="font-medium">Step {step.id}: {step.title}</div>
                      <div className="text-xs text-muted-foreground">{step.description}</div>
                    </div>
                    {index < currentStep && (
                      <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Database & Security */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                  <Database className="w-5 h-5 text-white" />
                </div>
                <span>Database</span>
              </CardTitle>
              <CardDescription>What's actually stored</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <Badge variant={
                    currentStep < 3 ? "outline" :
                      currentStep < 4 ? "default" : "secondary"
                  }>
                    {currentStep < 3 ? "Ready" :
                      currentStep < 4 ? "Processing" : "Updated"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Users</span>
                  <span className="text-sm">{userDatabase.length}</span>
                </div>
              </div>

              <Separator />

              {/* Database View */}
              <div className="space-y-3">
                <div className="text-sm font-medium">Database Contents:</div>

                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 p-3 border-b">
                    <div className="text-sm font-medium">Users Table</div>
                  </div>
                  <div className="divide-y">
                    {userDatabase.map((user, index) => (
                      <div key={index} className="p-3">
                        <div className="font-medium text-sm mb-1">{user.username}</div>
                        <div className="text-xs text-muted-foreground mb-2">Hash: {user.passwordHash.substring(0, 20)}...</div>
                        <div className="text-xs text-muted-foreground">Salt: {user.salt}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Security Demo */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldAlert className="w-5 h-5 text-amber-600" />
                  <h4 className="font-medium text-amber-800">Security Demo</h4>
                </div>
                <p className="text-sm text-amber-700 mb-3">
                  If database is leaked, hackers only see hashes:
                </p>
                <div className="p-3 bg-white border border-amber-300 rounded text-xs font-mono">
                  {userDatabase[0]?.passwordHash.substring(0, 32)}...
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-3 border-amber-300 text-amber-700 hover:bg-amber-100"
                  onClick={simulateDatabaseLeak}
                >
                  Simulate Database Leak
                </Button>
              </div>

              {/* Hash Comparison */}
              {activeMode === "login" && currentStep >= 4 && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Hash Comparison:</div>
                    <div className="space-y-2">
                      <div>
                        <div className="text-xs text-muted-foreground">Entered:</div>
                        <div className="text-xs font-mono p-2 border rounded bg-blue-50">
                          {simulateHash(password).substring(0, 20)}...
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Stored:</div>
                        <div className="text-xs font-mono p-2 border rounded bg-green-50">
                          {userDatabase[0]?.passwordHash.substring(0, 20)}...
                        </div>
                      </div>
                      <div className={`p-2 rounded ${isPasswordMatch ? 'bg-green-100' : 'bg-red-100'}`}>
                        <div className="flex items-center gap-2">
                          {isPasswordMatch ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                          <span className="text-sm">{isPasswordMatch ? "Hashes Match ✓" : "Hashes Don't Match ✗"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <Alert className="bg-purple-500/10 border-purple-500/20">
                <Key className="w-4 h-4" />
                <AlertDescription className="text-sm">
                  Original password never leaves user device.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Hashing Properties */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Hash className="w-4 h-4" />
              Step 1: Input
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-1">
              <div>• User enters password</div>
              <div>• System adds random salt</div>
              <div>• Creates secure input</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Step 2: Hashing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-1">
              <div>• SHA-256 algorithm</div>
              <div>• One-way transformation</div>
              <div>• Creates unique hash</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Database className="w-4 h-4" />
              Step 3: Storage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-1">
              <div>• Only hash is stored</div>
              <div>• Salt saved with hash</div>
              <div>• Plaintext discarded</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Step 4-5: Verification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-1">
              <div>• Hash entered password</div>
              <div>• Compare with stored hash</div>
              <div>• Grant/deny access</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Final Alert */}
      {currentStep >= steps.length - 1 ? (
        <Alert className={`shadow-lg ${activeMode === "login" && isPasswordMatch
          ? "bg-green-500/10 border-green-500/20"
          : activeMode === "login"
            ? "bg-red-500/10 border-red-500/20"
            : "bg-blue-500/10 border-blue-500/20"
          }`}>
          {activeMode === "login" && isPasswordMatch ? (
            <CheckCircle className="w-4 h-4 text-green-600" />
          ) : activeMode === "login" ? (
            <XCircle className="w-4 h-4 text-red-600" />
          ) : (
            <UserPlus className="w-4 h-4 text-blue-600" />
          )}
          <AlertDescription>
            <strong>
              {activeMode === "register"
                ? "✅ Account Created Successfully!"
                : isPasswordMatch
                  ? "✅ Login Successful!"
                  : "❌ Login Failed!"}
            </strong>
            {activeMode === "register"
              ? " Password has been securely hashed and stored. The original password cannot be retrieved from the hash."
              : isPasswordMatch
                ? " The system compared hashes without ever handling plain passwords. This is secure authentication."
                : " Password hash doesn't match. Try using 'SecurePass123' to see successful login."}
          </AlertDescription>
        </Alert>
      ) : (
        <Alert>
          <Zap className="w-4 h-4" />
          <AlertDescription>
            <strong>Click "Next Step" to continue</strong> through the password hashing process.
            Watch how passwords are transformed into hashes for secure storage.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}