import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useBruteForce, useHash } from "@/hooks/use-modules";
import { Loader2, Zap, Clock, Unlock, RotateCcw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";

export default function AttackModule() {
  const [targetPassword, setTargetPassword] = useState("abc");
  const [targetHash, setTargetHash] = useState("");
  const [complexity, setComplexity] = useState([1]);
  const [simulationResult, setSimulationResult] = useState<any>(null);

  const doHash = useHash();
  const attack = useBruteForce();

  const handleSetup = () => {
    // Generate hash of the target password first to simulate "leaked db"
    doHash.mutate({ text: targetPassword, algorithm: "md5" }, {
      onSuccess: (data) => setTargetHash(data.hash)
    });
  };

  const handleAttack = () => {
    setSimulationResult(null);
    attack.mutate({ targetHash, complexity: complexity[0] }, {
      onSuccess: (data) => setSimulationResult(data)
    });
  };

  const reset = () => {
    setTargetHash("");
    setSimulationResult(null);
    setTargetPassword("");
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold mb-2">Brute Force Simulator</h1>
        <p className="text-muted-foreground">Visualize how password complexity affects cracking time.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* Step 1: Setup */}
          <Card className={targetHash ? "opacity-50 pointer-events-none" : ""}>
            <CardHeader>
              <CardTitle>1. Setup Target (The "Leak")</CardTitle>
              <CardDescription>Create a password to hash and "leak".</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Target Password (keep it short for demo)</Label>
                <Input 
                  type="password" 
                  value={targetPassword} 
                  onChange={e => setTargetPassword(e.target.value)}
                  placeholder="e.g. 1234" 
                />
              </div>
              <Button onClick={handleSetup} disabled={!targetPassword || doHash.isPending} className="w-full">
                Generate Hash & Lock
              </Button>
            </CardContent>
          </Card>

          {/* Step 2: Attack Config */}
          <Card className={!targetHash ? "opacity-50 pointer-events-none" : ""}>
            <CardHeader>
              <CardTitle>2. Configure Attack</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Attack Complexity</Label>
                  <span className="text-sm font-medium text-primary">
                    {complexity[0] === 1 ? "Low (Numeric)" : complexity[0] === 2 ? "Medium (Alpha)" : "High (Alphanumeric)"}
                  </span>
                </div>
                <Slider 
                  value={complexity} 
                  onValueChange={setComplexity} 
                  min={1} 
                  max={3} 
                  step={1} 
                />
                <p className="text-xs text-muted-foreground pt-1">
                  Higher complexity increases the search space exponentially.
                </p>
              </div>

              <div className="p-4 bg-muted rounded-lg font-mono text-xs break-all">
                <span className="text-muted-foreground block mb-1">Target Hash (MD5):</span>
                {targetHash || "Waiting for setup..."}
              </div>

              <Button variant="destructive" onClick={handleAttack} disabled={attack.isPending} className="w-full">
                {attack.isPending ? <Loader2 className="mr-2 animate-spin" /> : <Zap className="mr-2 w-4 h-4" />}
                Launch Brute Force Attack
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          {attack.isPending && (
            <Card className="border-primary/50 bg-primary/5 animate-pulse">
              <CardContent className="flex flex-col items-center justify-center h-64 text-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <h3 className="font-bold text-lg">Cracking in progress...</h3>
                <p className="text-muted-foreground">Trying combinations against hash</p>
                <div className="w-full max-w-xs mt-6 space-y-2">
                  <Progress value={45} className="h-2" />
                  <p className="text-xs font-mono text-muted-foreground">~1200 hashes/sec</p>
                </div>
              </CardContent>
            </Card>
          )}

          {!attack.isPending && simulationResult && (
            <Card className={simulationResult.success ? "border-green-500/50 bg-green-500/5" : "border-red-500/50 bg-red-500/5"}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {simulationResult.success ? <Unlock className="w-6 h-6 text-green-600" /> : <Lock className="w-6 h-6 text-red-600" />}
                  {simulationResult.success ? "Password Cracked!" : "Attack Failed"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-background rounded-lg border">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Clock className="w-4 h-4" /> <span className="text-xs uppercase">Time Taken</span>
                    </div>
                    <p className="text-2xl font-mono font-bold">{simulationResult.timeTaken}ms</p>
                  </div>
                  <div className="p-4 bg-background rounded-lg border">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <RotateCcw className="w-4 h-4" /> <span className="text-xs uppercase">Attempts</span>
                    </div>
                    <p className="text-2xl font-mono font-bold">{simulationResult.attempts.toLocaleString()}</p>
                  </div>
                </div>

                {simulationResult.crackedPassword && (
                   <div className="mt-4 p-4 bg-green-200/20 border border-green-500/30 rounded-lg text-center">
                     <p className="text-sm text-green-700 dark:text-green-400 mb-1">Match Found:</p>
                     <p className="text-3xl font-mono font-bold tracking-widest text-green-800 dark:text-green-300">{simulationResult.crackedPassword}</p>
                   </div>
                )}

                <Button variant="outline" onClick={reset} className="w-full mt-4">Reset Simulation</Button>
              </CardContent>
            </Card>
          )}
          
          {!targetHash && !attack.isPending && !simulationResult && (
             <div className="h-full flex items-center justify-center p-12 text-muted-foreground border-2 border-dashed rounded-xl">
               <p>Configure and launch an attack to see results</p>
             </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
