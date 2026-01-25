import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useBruteForce, useHash } from "@/hooks/use-modules";
import { Loader2, Zap, Clock, Unlock, RotateCcw, Shield, AlertTriangle, Lock, ShieldAlert, Info, BarChart3, Cpu, Hash, Key } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function AttackModule() {
  const [activeTab, setActiveTab] = useState<"simulator" | "education">("simulator");

  return (
    <Layout>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <ShieldAlert className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-display font-bold">Password Attack Simulator</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Understand how attackers crack passwords and learn why strong passwords matter.
        </p>
      </div>

      {/* Security Status Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Password Security Level</span>
          <Badge variant="outline">Educational Tool</Badge>
        </div>
        <div className="h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full" />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Weak</span>
          <span>Moderate</span>
          <span>Strong</span>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "simulator" | "education")} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="simulator" className="gap-2">
            <Zap className="w-4 h-4" />
            Interactive Simulator
          </TabsTrigger>
          <TabsTrigger value="education" className="gap-2">
            <Info className="w-4 h-4" />
            Learn & Protect
          </TabsTrigger>
        </TabsList>

        <TabsContent value="simulator" className="space-y-6 mt-0">
          <AttackSimulator />
        </TabsContent>

        <TabsContent value="education" className="space-y-6 mt-0">
          <EducationSection />
        </TabsContent>
      </Tabs>
    </Layout>
  );
}

function AttackSimulator() {
  const [targetPassword, setTargetPassword] = useState("123");
  const [targetHash, setTargetHash] = useState("");
  const [complexity, setComplexity] = useState([2]); // 1-5 scale
  const [attackSpeed, setAttackSpeed] = useState([3]); // 1-5 scale
  const [hashAlgorithm, setHashAlgorithm] = useState<"md5" | "sha256">("md5");
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState<string>("");

  const doHash = useHash();
  const attack = useBruteForce();
  const { toast } = useToast();

  // Calculate estimated cracking time based on complexity
  useEffect(() => {
    if (targetPassword) {
      const charSetSize = getCharSetSize(complexity[0]);
      const passwordLength = targetPassword.length;
      const totalCombinations = Math.pow(charSetSize, passwordLength);
      const speedMultiplier = Math.pow(10, attackSpeed[0] - 1); // 10^0 to 10^4
      const hashesPerSecond = 1000 * speedMultiplier;
      
      const seconds = totalCombinations / hashesPerSecond;
      
      if (seconds < 1) {
        setEstimatedTime("Instantly");
      } else if (seconds < 60) {
        setEstimatedTime(`${Math.ceil(seconds)} seconds`);
      } else if (seconds < 3600) {
        setEstimatedTime(`${Math.ceil(seconds / 60)} minutes`);
      } else if (seconds < 86400) {
        setEstimatedTime(`${Math.ceil(seconds / 3600)} hours`);
      } else if (seconds < 31536000) {
        setEstimatedTime(`${Math.ceil(seconds / 86400)} days`);
      } else {
        setEstimatedTime(`${Math.ceil(seconds / 31536000)} years`);
      }
    }
  }, [targetPassword, complexity, attackSpeed]);

  const getCharSetSize = (level: number): number => {
    switch(level) {
      case 1: return 10; // digits only
      case 2: return 36; // alphanumeric lowercase
      case 3: return 62; // alphanumeric mixed case
      case 4: return 72; // alphanumeric + basic symbols
      case 5: return 95; // all printable ASCII
      default: return 36;
    }
  };

  const handleSetup = () => {
    doHash.mutate({ text: targetPassword, algorithm: hashAlgorithm }, {
      onSuccess: (data) => {
        setTargetHash(data.hash);
        toast({
          title: "Password Hashed",
          description: `Your password has been converted to a ${hashAlgorithm.toUpperCase()} hash`,
        });
      }
    });
  };

  const handleAttack = () => {
    setSimulationResult(null);
    attack.mutate({ 
      targetHash, 
      complexity: complexity[0],
      hashAlgorithm,
      attackSpeed: attackSpeed[0]
    }, {
      onSuccess: (data) => {
        setSimulationResult(data);
        if (data.success) {
          toast({
            title: "Password Cracked!",
            description: `Found in ${data.timeTaken}ms after ${data.attempts.toLocaleString()} attempts`,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Attack Failed",
            description: "Password resisted brute force attack!",
            variant: "default",
          });
        }
      }
    });
  };

  const resetSimulation = () => {
    setTargetHash("");
    setSimulationResult(null);
    setTargetPassword("");
    setEstimatedTime("");
  };

  const simulateLeak = () => {
    const weakPasswords = ["123456", "password", "qwerty", "admin", "letmein"];
    const randomPass = weakPasswords[Math.floor(Math.random() * weakPasswords.length)];
    setTargetPassword(randomPass);
    toast({
      title: "Simulating Leak",
      description: `Using common weak password: "${randomPass}"`,
    });
  };

  const getPasswordStrength = (password: string): { score: number; label: string; color: string } => {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    if (score <= 2) return { score, label: "Very Weak", color: "text-red-600" };
    if (score <= 3) return { score, label: "Weak", color: "text-orange-600" };
    if (score <= 4) return { score, label: "Moderate", color: "text-yellow-600" };
    if (score <= 5) return { score, label: "Strong", color: "text-green-600" };
    return { score, label: "Very Strong", color: "text-emerald-600" };
  };

  const passwordStrength = getPasswordStrength(targetPassword);

  return (
    <div className="space-y-8">
      {/* Attack Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5" />
            Attack Visualization
          </CardTitle>
          <CardDescription>Watch how different factors affect password cracking speed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-4xl font-bold mb-2">{targetPassword.length}</div>
              <div className="text-sm font-medium">Password Length</div>
              <div className="text-xs text-muted-foreground mt-1">Characters</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-4xl font-bold mb-2">{Math.pow(getCharSetSize(complexity[0]), targetPassword.length).toLocaleString()}</div>
              <div className="text-sm font-medium">Possible Combinations</div>
              <div className="text-xs text-muted-foreground mt-1">Search Space</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-4xl font-bold mb-2">{estimatedTime}</div>
              <div className="text-sm font-medium">Estimated Crack Time</div>
              <div className="text-xs text-muted-foreground mt-1">At current settings</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column: Setup & Configuration */}
        <div className="space-y-6">
          {/* Password Setup */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  1. Target Password
                </span>
                <Badge variant={passwordStrength.score <= 2 ? "destructive" : passwordStrength.score <= 3 ? "default" : "outline"}>
                  {passwordStrength.label}
                </Badge>
              </CardTitle>
              <CardDescription>Choose a password to test against brute force</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Password to Hash</Label>
                  <div className="flex gap-2">
                    <Input
                      type="password"
                      value={targetPassword}
                      onChange={(e) => setTargetPassword(e.target.value)}
                      placeholder="Enter a password to test..."
                      className="flex-1"
                    />
                    <Button variant="outline" onClick={simulateLeak}>
                      Use Weak
                    </Button>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{targetPassword.length} characters</span>
                    <span className={passwordStrength.color}>{passwordStrength.label}</span>
                  </div>
                </div>

                {/* Password Strength Meter */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Password Strength</span>
                    <span>{passwordStrength.score}/6</span>
                  </div>
                  <Progress value={(passwordStrength.score / 6) * 100} className="h-2" />
                  <div className="grid grid-cols-6 gap-1 mt-2">
                    {[1, 2, 3, 4, 5, 6].map((level) => (
                      <div
                        key={level}
                        className={`h-1 rounded ${
                          level <= passwordStrength.score
                            ? passwordStrength.score <= 2
                              ? "bg-red-500"
                              : passwordStrength.score <= 3
                              ? "bg-orange-500"
                              : passwordStrength.score <= 4
                              ? "bg-yellow-500"
                              : "bg-green-500"
                            : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Hash Algorithm</Label>
                  <Select value={hashAlgorithm} onValueChange={(v: any) => setHashAlgorithm(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="md5">
                        <div className="flex items-center justify-between">
                          <span>MD5</span>
                          <Badge variant="destructive">Insecure</Badge>
                        </div>
                      </SelectItem>
                      <SelectItem value="sha256">
                        <div className="flex items-center justify-between">
                          <span>SHA-256</span>
                          <Badge variant="default">Secure</Badge>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {hashAlgorithm === "md5" 
                      ? "MD5 is fast but vulnerable to collisions" 
                      : "SHA-256 is slower but more secure"}
                  </p>
                </div>

                <Button 
                  onClick={handleSetup} 
                  disabled={!targetPassword || doHash.isPending}
                  className="w-full"
                >
                  {doHash.isPending ? (
                    <>
                      <Loader2 className="mr-2 animate-spin" />
                      Hashing Password...
                    </>
                  ) : (
                    <>
                      <Hash className="mr-2" />
                      Generate Hash (Simulate Leak)
                    </>
                  )}
                </Button>
              </div>

              {targetHash && (
                <div className="space-y-2">
                  <Label>Generated Hash</Label>
                  <div className="p-3 bg-muted/50 rounded-lg font-mono text-xs break-all">
                    {targetHash}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This simulates a leaked password hash from a database breach
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Attack Configuration */}
          <Card className={!targetHash ? "opacity-50 pointer-events-none" : ""}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                2. Attack Configuration
              </CardTitle>
              <CardDescription>Configure the brute force attack parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label>Character Set Complexity</Label>
                      <Badge variant="outline">
                        {complexity[0] === 1 ? "Digits Only" : 
                         complexity[0] === 2 ? "Alphanumeric" :
                         complexity[0] === 3 ? "Mixed Case" :
                         complexity[0] === 4 ? "With Symbols" : "Full ASCII"}
                      </Badge>
                    </div>
                    <Slider
                      value={complexity}
                      onValueChange={setComplexity}
                      min={1}
                      max={5}
                      step={1}
                      className="mb-1"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Simple (10 chars)</span>
                      <span>Complex (95 chars)</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Larger character sets exponentially increase search space
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label>Attack Computing Power</Label>
                      <Badge variant="outline">
                        {attackSpeed[0] === 1 ? "Home PC" : 
                         attackSpeed[0] === 2 ? "Gaming Rig" :
                         attackSpeed[0] === 3 ? "Server Farm" :
                         attackSpeed[0] === 4 ? "Botnet" : "Supercomputer"}
                      </Badge>
                    </div>
                    <Slider
                      value={attackSpeed}
                      onValueChange={setAttackSpeed}
                      min={1}
                      max={5}
                      step={1}
                      className="mb-1"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>1K hashes/sec</span>
                      <span>10M hashes/sec</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Real attackers use GPUs and distributed systems for massive speed
                    </p>
                  </div>
                </div>

                <Alert className="bg-amber-500/10 border-amber-500/20">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <AlertDescription className="text-sm">
                    <span className="font-semibold">Real-world attacks:</span> Modern GPUs can test billions of hashes per second!
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <Button 
                    variant="destructive" 
                    onClick={handleAttack} 
                    disabled={attack.isPending || !targetHash}
                    className="w-full"
                    size="lg"
                  >
                    {attack.isPending ? (
                      <>
                        <Loader2 className="mr-2 animate-spin" />
                        Launching Attack...
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2" />
                        Launch Brute Force Attack
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={resetSimulation}
                    className="w-full"
                  >
                    <RotateCcw className="mr-2 w-4 h-4" />
                    Reset Simulation
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Results & Analysis */}
        <div className="space-y-6">
          {/* Attack Progress */}
          {attack.isPending && (
            <Card className="border-primary/50 bg-primary/5">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="relative">
                    <div className="w-20 h-20 mx-auto border-4 border-primary/20 rounded-full flex items-center justify-center">
                      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                    <Zap className="w-8 h-8 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-lg mb-2">Attack In Progress</h3>
                    <p className="text-muted-foreground">Simulating brute force password cracking...</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Trying combinations...</span>
                      <span className="font-mono">{Math.round(1200 * Math.pow(10, attackSpeed[0] - 1)).toLocaleString()} hashes/sec</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="p-3 border rounded-lg">
                      <div className="text-muted-foreground">Search Space</div>
                      <div className="font-mono font-bold">{Math.pow(getCharSetSize(complexity[0]), targetPassword.length).toLocaleString()}</div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="text-muted-foreground">Current Speed</div>
                      <div className="font-mono font-bold">{Math.round(1200 * Math.pow(10, attackSpeed[0] - 1)).toLocaleString()}/s</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Attack Results */}
          {!attack.isPending && simulationResult && (
            <Card className={`${simulationResult.success ? "border-red-500/50 bg-red-500/5" : "border-green-500/50 bg-green-500/5"} animate-in slide-in-from-bottom`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {simulationResult.success ? (
                    <>
                      <Unlock className="w-6 h-6 text-red-600" />
                      <span className="text-red-600">Password Cracked!</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-6 h-6 text-green-600" />
                      <span className="text-green-600">Attack Failed!</span>
                    </>
                  )}
                </CardTitle>
                <CardDescription>
                  {simulationResult.success 
                    ? "The password was vulnerable to brute force" 
                    : "The password resisted the attack parameters"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-4 rounded-lg border ${simulationResult.success ? "bg-red-500/10 border-red-500/20" : "bg-green-500/10 border-green-500/20"}`}>
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs uppercase">Time Taken</span>
                    </div>
                    <p className="text-2xl font-mono font-bold">{simulationResult.timeTaken}ms</p>
                  </div>
                  <div className={`p-4 rounded-lg border ${simulationResult.success ? "bg-red-500/10 border-red-500/20" : "bg-green-500/10 border-green-500/20"}`}>
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <RotateCcw className="w-4 h-4" />
                      <span className="text-xs uppercase">Attempts</span>
                    </div>
                    <p className="text-2xl font-mono font-bold">{simulationResult.attempts.toLocaleString()}</p>
                  </div>
                </div>

                {simulationResult.crackedPassword && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <div className="text-center space-y-2">
                      <div className="text-sm text-red-700 dark:text-red-400 font-medium">Cracked Password:</div>
                      <div className="text-3xl font-mono font-bold tracking-wider text-red-800 dark:text-red-300">
                        {simulationResult.crackedPassword}
                      </div>
                      <div className="text-xs text-red-600/70 dark:text-red-400/70">
                        This would be exposed in a real attack
                      </div>
                    </div>
                  </div>
                )}

                {!simulationResult.success && (
                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <div className="text-center space-y-2">
                      <div className="text-sm text-green-700 dark:text-green-400 font-medium">Attack Failed Because:</div>
                      <ul className="text-sm text-green-600/80 text-left space-y-1">
                        <li>• Password was too long for current attack settings</li>
                        <li>• Character set too large to brute force quickly</li>
                        <li>• Attack stopped before trying all combinations</li>
                      </ul>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <Button 
                    variant={simulationResult.success ? "destructive" : "default"}
                    onClick={() => setShowDetails(!showDetails)}
                    className="w-full"
                  >
                    {showDetails ? "Hide Details" : "Show Technical Details"}
                  </Button>

                  {showDetails && (
                    <div className="p-4 border rounded-lg space-y-3">
                      <h4 className="font-semibold">Attack Statistics</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">Hash Algorithm:</span>
                          <span className="ml-2 font-mono">{simulationResult.hashAlgorithm}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Attack Speed:</span>
                          <span className="ml-2 font-mono">{simulationResult.attackSpeed}/5</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Complexity Level:</span>
                          <span className="ml-2 font-mono">{simulationResult.complexity}/5</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Hashes Per Second:</span>
                          <span className="ml-2 font-mono">
                            {Math.round(1200 * Math.pow(10, simulationResult.attackSpeed - 1)).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Initial State */}
          {!targetHash && !attack.isPending && !simulationResult && (
            <Card className="h-full">
              <CardContent className="h-full min-h-[400px] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-24 h-24 rounded-full bg-muted/30 flex items-center justify-center mb-6">
                  <Shield className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">Ready to Simulate Attack</h3>
                <p className="text-muted-foreground mb-6 max-w-sm">
                  Set up a password hash and configure attack parameters to see how brute force attacks work.
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span>Simulate password database leak</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    <span>Configure attack complexity</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span>Launch brute force simulation</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function EducationSection() {
  const [passwordLength, setPasswordLength] = useState([8]);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [includeMixedCase, setIncludeMixedCase] = useState(true);

  const calculateCombinations = () => {
    let charSet = 26; // lowercase letters
    
    if (includeMixedCase) charSet += 26; // uppercase letters
    if (includeNumbers) charSet += 10; // digits
    if (includeSymbols) charSet += 32; // common symbols
    
    return Math.pow(charSet, passwordLength[0]);
  };

  const formatLargeNumber = (num: number): string => {
    if (num >= 1e18) return `${(num / 1e18).toFixed(2)} quintillion`;
    if (num >= 1e15) return `${(num / 1e15).toFixed(2)} quadrillion`;
    if (num >= 1e12) return `${(num / 1e12).toFixed(2)} trillion`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)} billion`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)} million`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)} thousand`;
    return num.toString();
  };

  const combinations = calculateCombinations();
  const crackTimeSeconds = combinations / (10 * 1e9); // Assuming 10 billion hashes/second

  const getCrackTime = (seconds: number): string => {
    if (seconds < 1) return "Instantly";
    if (seconds < 60) return `${Math.ceil(seconds)} seconds`;
    if (seconds < 3600) return `${Math.ceil(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.ceil(seconds / 3600)} hours`;
    if (seconds < 31536000) return `${Math.ceil(seconds / 86400)} days`;
    if (seconds < 3153600000) return `${Math.ceil(seconds / 31536000)} years`;
    return `${Math.ceil(seconds / 3153600000)} centuries`;
  };

  return (
    <div className="space-y-8">
      {/* Password Security Calculator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Password Security Calculator
          </CardTitle>
          <CardDescription>See how different factors affect password strength</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <Label>Password Length: {passwordLength[0]} characters</Label>
                  <Badge variant="outline">{passwordLength[0]} chars</Badge>
                </div>
                <Slider
                  value={passwordLength}
                  onValueChange={setPasswordLength}
                  min={4}
                  max={20}
                  step={1}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="numbers">Include Numbers (0-9)</Label>
                  <Switch
                    id="numbers"
                    checked={includeNumbers}
                    onCheckedChange={setIncludeNumbers}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="symbols">Include Symbols (!@#$% etc.)</Label>
                  <Switch
                    id="symbols"
                    checked={includeSymbols}
                    onCheckedChange={setIncludeSymbols}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="mixedcase">Mixed Case (Aa)</Label>
                  <Switch
                    id="mixedcase"
                    checked={includeMixedCase}
                    onCheckedChange={setIncludeMixedCase}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Security Analysis</h4>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground">Possible Combinations</div>
                    <div className="text-2xl font-bold font-mono">{formatLargeNumber(combinations)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Estimated Crack Time</div>
                    <div className="text-2xl font-bold">{getCrackTime(crackTimeSeconds)}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      At 10 billion hashes/second (modern GPU cluster)
                    </div>
                  </div>
                </div>
              </div>

              <Alert className="bg-green-500/10 border-green-500/20">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <AlertDescription className="text-sm">
                  <span className="font-semibold">Recommendation:</span> Use at least 12 characters with mixed case, numbers, and symbols.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attack Methods & Defense */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Common Attack Methods
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="destructive">Brute Force</Badge>
                  <span className="text-sm font-semibold">Try all combinations</span>
                </div>
                <p className="text-sm text-muted-foreground">Systematically tries every possible password</p>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="destructive">Dictionary</Badge>
                  <span className="text-sm font-semibold">Common passwords</span>
                </div>
                <p className="text-sm text-muted-foreground">Tries words, names, and common patterns</p>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="destructive">Rainbow Tables</Badge>
                  <span className="text-sm font-semibold">Precomputed hashes</span>
                </div>
                <p className="text-sm text-muted-foreground">Uses precalculated hash databases</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Defense Strategies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="default">Strong Passwords</Badge>
                  <span className="text-sm font-semibold">Length & Complexity</span>
                </div>
                <p className="text-sm text-muted-foreground">Use 12+ characters with variety</p>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="default">Password Managers</Badge>
                  <span className="text-sm font-semibold">Unique passwords</span>
                </div>
                <p className="text-sm text-muted-foreground">Generate and store strong passwords</p>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="default">2FA/MFA</Badge>
                  <span className="text-sm font-semibold">Multi-factor</span>
                </div>
                <p className="text-sm text-muted-foreground">Adds additional verification layer</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle>Password Security Best Practices</CardTitle>
          <CardDescription>Essential guidelines for protecting your accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="space-y-2">
            <AccordionItem value="length">
              <AccordionTrigger className="text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-bold">1</span>
                  </div>
                  <span>Use Long Passwords</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground pl-8">
                Each additional character exponentially increases cracking time. Aim for at least 12-16 characters.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="complexity">
              <AccordionTrigger className="text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-bold">2</span>
                  </div>
                  <span>Mix Character Types</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground pl-8">
                Combine uppercase, lowercase, numbers, and symbols to maximize the search space.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="unique">
              <AccordionTrigger className="text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-bold">3</span>
                  </div>
                  <span>Use Unique Passwords</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground pl-8">
                Never reuse passwords across different services. Use a password manager to track them.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="storage">
              <AccordionTrigger className="text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-bold">4</span>
                  </div>
                  <span>Proper Storage</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground pl-8">
                Services should store salted, hashed passwords, not plaintext. Salting prevents rainbow table attacks.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Real-world Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Real-world Statistics</CardTitle>
          <CardDescription>Understanding the scale of password attacks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <div className="text-3xl font-bold text-red-600">10 Billion</div>
              <div className="text-sm text-muted-foreground mt-1">Hashes/second (modern GPU)</div>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="text-3xl font-bold text-amber-600">81%</div>
              <div className="text-sm text-muted-foreground mt-1">Data breaches involve weak passwords</div>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="text-3xl font-bold text-green-600">100+ Years</div>
              <div className="text-sm text-muted-foreground mt-1">To crack 16-char random password</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}