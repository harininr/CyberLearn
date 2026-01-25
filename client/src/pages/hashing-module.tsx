import { Layout } from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useHash, useSign, useVerify, useGenerateRsa } from "@/hooks/use-modules";
import { Loader2, Fingerprint, FileCheck, ShieldAlert, Lock, Unlock, Hash, CheckCircle, AlertCircle, Info, BookOpen, Copy, RotateCcw, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";

export default function HashingModule() {
  const [activeTab, setActiveTab] = useState<"hashing" | "signatures">("hashing");

  return (
    <Layout>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <Fingerprint className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-display font-bold">Hashing & Digital Signatures</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Explore cryptographic hashing and digital signatures. Understand data integrity, authenticity, and non-repudiation.
        </p>
      </div>

      {/* Learning Overview */}
      <Card className="mb-8 border-primary/20">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Hash className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold">Hashing</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                One-way transformation that verifies data integrity
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-purple-500" />
                <h3 className="font-semibold">Signing</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Private key encryption of a hash to prove authenticity
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Unlock className="w-5 h-5 text-green-500" />
                <h3 className="font-semibold">Verification</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Public key decryption to verify signature validity
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "hashing" | "signatures")} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="hashing" className="gap-2">
            <Hash className="w-4 h-4" />
            Hashing
          </TabsTrigger>
          <TabsTrigger value="signatures" className="gap-2">
            <FileCheck className="w-4 h-4" />
            Digital Signatures
          </TabsTrigger>
        </TabsList>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Theory Panel */}
          <div className="lg:col-span-1">
            <TheoryPanel activeTab={activeTab} />
          </div>

          {/* Practical Section */}
          <div className="lg:col-span-2">
            <TabsContent value="hashing" className="space-y-6 mt-0">
              <HashingSection />
            </TabsContent>

            <TabsContent value="signatures" className="space-y-6 mt-0">
              <SignatureSection />
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </Layout>
  );
}

function TheoryPanel({ activeTab }: { activeTab: "hashing" | "signatures" }) {
  const hashingTheory = {
    title: "Cryptographic Hashing",
    description: "One-way function that maps data of any size to a fixed-size string.",
    properties: [
      {
        icon: "🔒",
        title: "One-way",
        description: "Cannot reverse-engineer original data from hash"
      },
      {
        icon: "🎲",
        title: "Deterministic",
        description: "Same input always produces same hash"
      },
      {
        icon: "🌋",
        title: "Avalanche Effect",
        description: "Small change in input → completely different hash"
      },
      {
        icon: "⚖️",
        title: "Collision Resistant",
        description: "Hard to find two inputs with same hash"
      }
    ],
    useCases: [
      "Password storage",
      "Data integrity verification",
      "Digital signatures",
      "Blockchain transactions"
    ]
  };

  const signatureTheory = {
    title: "Digital Signatures",
    description: "Mathematical scheme for verifying authenticity and integrity of digital messages.",
    steps: [
      {
        step: 1,
        title: "Hash Document",
        description: "Create fixed-size digest of the message"
      },
      {
        step: 2,
        title: "Sign Hash",
        description: "Encrypt hash with sender's private key"
      },
      {
        step: 3,
        title: "Verify",
        description: "Decrypt with sender's public key and compare hashes"
      }
    ],
    benefits: [
      "Authentication - proves signer's identity",
      "Integrity - detects message tampering",
      "Non-repudiation - signer cannot deny signing"
    ]
  };

  const theory = activeTab === "hashing" ? hashingTheory : signatureTheory;

  return (
    <Card className="sticky top-6">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          <CardTitle>Core Concepts</CardTitle>
        </div>
        <CardDescription>
          {activeTab === "hashing" ? "Properties of Cryptographic Hash Functions" : "How Digital Signatures Work"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Info className="w-4 h-4" />
            {theory.title}
          </h4>
          <p className="text-sm text-muted-foreground">{theory.description}</p>
        </div>

        <Separator />

        {activeTab === "hashing" ? (
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Hash Function Properties</h4>
            <div className="space-y-3">
              {hashingTheory.properties.map((prop, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">{prop.icon}</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{prop.title}</p>
                    <p className="text-xs text-muted-foreground">{prop.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Common Uses</h4>
              <div className="flex flex-wrap gap-2">
                {hashingTheory.useCases.map((use, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {use}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Signature Process</h4>
            <div className="space-y-3">
              {signatureTheory.steps.map((step) => (
                <div key={step.step} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center flex-shrink-0">
                    {step.step}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{step.title}</p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Key Benefits</h4>
              <div className="space-y-2">
                {signatureTheory.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <Accordion type="single" collapsible>
          <AccordionItem value="comparison">
            <AccordionTrigger className="text-sm">
              {activeTab === "hashing" ? "Hash Algorithm Comparison" : "Signature Standards"}
            </AccordionTrigger>
            <AccordionContent className="text-xs space-y-3">
              {activeTab === "hashing" ? (
                <>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="font-medium">SHA-256</span>
                      <Badge variant="default" className="h-5">Secure</Badge>
                    </div>
                    <p className="text-muted-foreground">256-bit output, used in Bitcoin, TLS, Git</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="font-medium">MD5</span>
                      <Badge variant="destructive" className="h-5">Broken</Badge>
                    </div>
                    <p className="text-muted-foreground">128-bit output, vulnerable to collisions</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="font-medium">SHA-3</span>
                      <Badge variant="default" className="h-5">Modern</Badge>
                    </div>
                    <p className="text-muted-foreground">Keccak algorithm, resistant to known attacks</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="font-medium">RSA-PSS</span>
                      <Badge variant="default" className="h-5">Recommended</Badge>
                    </div>
                    <p className="text-muted-foreground">Probabilistic signature scheme with padding</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="font-medium">ECDSA</span>
                      <Badge variant="default" className="h-5">Efficient</Badge>
                    </div>
                    <p className="text-muted-foreground">Elliptic curve based, smaller keys</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="font-medium">Ed25519</span>
                      <Badge variant="default" className="h-5">Modern</Badge>
                    </div>
                    <p className="text-muted-foreground">Edwards-curve, fast and secure</p>
                  </div>
                </>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}

function HashingSection() {
  const [text, setText] = useState("Hello World");
  const [algo, setAlgo] = useState<"sha256" | "md5">("sha256");
  const [salt, setSalt] = useState("");
  const [hash, setHash] = useState("");
  const [showAvalanche, setShowAvalanche] = useState(true);
  const [hashHistory, setHashHistory] = useState<Array<{ text: string; hash: string; algo: string }>>([]);
  
  const doHash = useHash();
  const { toast } = useToast();

  const handleHash = () => {
    doHash.mutate({ text, algorithm: algo, salt: salt || undefined }, {
      onSuccess: (data) => {
        setHash(data.hash);
        setHashHistory(prev => [
          { text, hash: data.hash, algo },
          ...prev.slice(0, 4)
        ]);
      }
    });
  };

  const copyHash = () => {
    navigator.clipboard.writeText(hash);
    toast({
      title: "Hash Copied",
      description: "Hash copied to clipboard",
    });
  };

  const generateRandomText = () => {
    const texts = [
      "The quick brown fox jumps over the lazy dog",
      "Cryptography is fascinating!",
      "Secure all the things! 🔒",
      "Cybersecurity matters in 2024",
      "Hash functions are one-way"
    ];
    const randomText = texts[Math.floor(Math.random() * texts.length)];
    setText(randomText);
  };

  const demonstrateAvalanche = () => {
    const original = text;
    const modified = text + "!"; // Just add one character
    setText(modified);
    
    // After a brief delay, show the comparison
    setTimeout(() => {
      handleHash();
      toast({
        title: "Avalanche Effect",
        description: "Notice how one character changed the entire hash!",
      });
    }, 100);
  };

  return (
    <div className="space-y-6">
      {/* Interactive Demo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="w-5 h-5" />
            Hash Function Playground
          </CardTitle>
          <CardDescription>Experiment with different inputs and see the hash transformation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Algorithm Selection */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label>Hash Algorithm</Label>
              <Select value={algo} onValueChange={(v: any) => setAlgo(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sha256">
                    <div className="flex items-center justify-between w-full">
                      <span>SHA-256</span>
                      <Badge variant="default">Secure</Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="md5">
                    <div className="flex items-center justify-between w-full">
                      <span>MD5</span>
                      <Badge variant="destructive">Insecure</Badge>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Info className="w-4 h-4" />
                <span>{algo === "sha256" ? "256-bit output (64 hex chars)" : "128-bit output (32 hex chars)"}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Salt (Optional)</Label>
              <div className="flex gap-2">
                <Input 
                  value={salt} 
                  onChange={e => setSalt(e.target.value)} 
                  placeholder="Add randomness to prevent rainbow tables"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSalt(Math.random().toString(36).substring(2, 10))}
                >
                  Random
                </Button>
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Input Text</Label>
              <Button variant="ghost" size="sm" onClick={generateRandomText}>
                <RotateCcw className="w-3 h-3 mr-1" />
                Random Text
              </Button>
            </div>
            <Textarea 
              value={text} 
              onChange={e => setText(e.target.value)} 
              className="font-mono text-sm min-h-[100px]"
              placeholder="Enter text to hash..."
            />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{text.length} characters</span>
              <span className="text-muted-foreground">{new Blob([text]).size} bytes</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={handleHash} 
              disabled={doHash.isPending} 
              className="flex-1"
              size="lg"
            >
              {doHash.isPending ? (
                <>
                  <Loader2 className="mr-2 animate-spin" />
                  Hashing...
                </>
              ) : (
                <>
                  <Fingerprint className="mr-2" />
                  Generate Hash
                </>
              )}
            </Button>
            <Button 
              variant="secondary" 
              onClick={demonstrateAvalanche}
              disabled={doHash.isPending}
            >
              Test Avalanche Effect
            </Button>
          </div>

          {/* Avalanche Effect Demo */}
          {showAvalanche && hash && (
            <Alert className="bg-blue-500/10 border-blue-500/20">
              <AlertCircle className="w-4 h-4 text-blue-500" />
              <AlertDescription>
                <div className="space-y-1">
                  <p className="font-semibold">Avalanche Effect Demonstrated</p>
                  <p className="text-sm">
                    Even the smallest change in input creates a completely different hash. 
                    This property ensures that similar inputs don't produce similar outputs.
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Hash Output & History */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Hash Output */}
        <Card className="bg-muted/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Hash Output</CardTitle>
              {hash && (
                <Button variant="ghost" size="sm" onClick={copyHash}>
                  <Copy className="w-4 h-4" />
                </Button>
              )}
            </div>
            <CardDescription>
              {algo.toUpperCase()} Digest - Fixed length output regardless of input size
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {hash ? (
              <>
                <div className="p-4 bg-background border rounded-lg shadow-inner">
                  <div className="font-mono text-sm break-all min-h-[80px]">
                    {hash}
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-3 border-t">
                    <div className="text-xs text-muted-foreground">
                      {hash.length} characters
                    </div>
                    <Badge variant={algo === "sha256" ? "default" : "destructive"}>
                      {algo.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Hash Properties:</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-card border rounded text-center">
                      <div className="text-xs text-muted-foreground">Fixed Size</div>
                      <div className="font-semibold">{hash.length} chars</div>
                    </div>
                    <div className="p-2 bg-card border rounded text-center">
                      <div className="text-xs text-muted-foreground">Hex Format</div>
                      <div className="font-semibold">0-9, a-f</div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-muted-foreground text-center border-2 border-dashed rounded-lg p-6">
                <Hash className="w-12 h-12 mb-4 opacity-50" />
                <p className="font-medium mb-2">No hash generated yet</p>
                <p className="text-sm">Enter text and click "Generate Hash" to see the transformation</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Hash History */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Hashes</CardTitle>
            <CardDescription>Compare different inputs and their hashes</CardDescription>
          </CardHeader>
          <CardContent>
            {hashHistory.length > 0 ? (
              <div className="space-y-3">
                {hashHistory.map((item, index) => (
                  <div key={index} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.text}</p>
                        <p className="text-xs text-muted-foreground truncate">{item.hash}</p>
                      </div>
                      <Badge variant="outline" className="flex-shrink-0">
                        {item.algo}
                      </Badge>
                    </div>
                    <Progress 
                      value={100 * (item.text.length / Math.max(...hashHistory.map(h => h.text.length)))} 
                      className="h-1"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-muted-foreground text-center border-2 border-dashed rounded-lg">
                <div>
                  <p className="font-medium mb-2">No history yet</p>
                  <p className="text-sm">Generated hashes will appear here</p>
                </div>
              </div>
            )}
            
            {hashHistory.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Info className="w-4 h-4" />
                  <span>Notice how different inputs produce completely unrelated hashes</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SignatureSection() {
  const [keys, setKeys] = useState<{ pub: string; priv: string } | null>(null);
  const [doc, setDoc] = useState("I, Alice, agree to pay Bob $1000 by Dec 31, 2024.");
  const [signature, setSignature] = useState("");
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);
  const [modifiedDoc, setModifiedDoc] = useState("");
  const [showProcess, setShowProcess] = useState(true);

  const generate = useGenerateRsa();
  const sign = useSign();
  const verify = useVerify();
  const { toast } = useToast();

  const handleGenerate = () => {
    generate.mutate(undefined, {
      onSuccess: (data) => {
        setKeys({ pub: data.publicKey, priv: data.privateKey });
        toast({
          title: "Digital Identity Created",
          description: "You now have a public/private key pair for signing",
        });
      },
    });
  };

  const handleSign = () => {
    if (!keys) return;
    sign.mutate(
      { text: doc, privateKey: keys.priv },
      {
        onSuccess: (data) => {
          setSignature(data.signature);
          setVerificationResult(null);
          toast({
            title: "Document Signed",
            description: "Digital signature created with your private key",
          });
        },
      }
    );
  };

  const handleVerify = (textToVerify: string = doc) => {
    if (!keys || !signature) return;
    verify.mutate(
      { text: textToVerify, signature, publicKey: keys.pub },
      {
        onSuccess: (data) => {
          setVerificationResult(data.isValid);
          if (data.isValid) {
            toast({
              title: "Signature Valid",
              description: "Document integrity verified",
            });
          } else {
            toast({
              title: "Signature Invalid",
              description: "Document may have been tampered with",
              variant: "destructive",
            });
          }
        },
      }
    );
  };

  const tamperWithDocument = () => {
    const tampered = doc.replace("$1000", "$10000").replace("Alice", "Eve");
    setModifiedDoc(tampered);
    handleVerify(tampered);
  };

  return (
    <div className="space-y-8">
      {/* Digital Identity Setup */}
      {!keys ? (
        <Card className="text-center py-12 border-primary/20">
          <CardContent className="space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Create Your Digital Identity</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                To sign documents, you need a public/private key pair. This creates your unique digital identity.
              </p>
            </div>
            <Button onClick={handleGenerate} disabled={generate.isPending} size="lg">
              {generate.isPending ? (
                <>
                  <Loader2 className="mr-2 animate-spin" />
                  Generating Keys...
                </>
              ) : (
                <>
                  <Key className="mr-2" />
                  Generate RSA Key Pair
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Signature Process Visualization */}
          {showProcess && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Digital Signature Process</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setShowProcess(false)}>
                    Hide
                  </Button>
                </div>
                <CardDescription>Follow the three-step signing and verification process</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {/* Step 1 */}
                  <div className="relative">
                    <div className="absolute left-1/2 -translate-x-1/2 top-6 w-px h-8 bg-border md:hidden" />
                    <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
                      <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center mb-3">
                        1
                      </div>
                      <h4 className="font-semibold mb-2">Hash Document</h4>
                      <p className="text-sm text-muted-foreground">
                        Create SHA-256 hash of the document content
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="relative">
                    <div className="absolute left-1/2 -translate-x-1/2 top-6 w-px h-8 bg-border md:hidden" />
                    <div className="p-4 border rounded-lg bg-purple-50 dark:bg-purple-950/20">
                      <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center mb-3">
                        2
                      </div>
                      <h4 className="font-semibold mb-2">Encrypt Hash</h4>
                      <p className="text-sm text-muted-foreground">
                        Encrypt the hash with your private key
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="relative">
                    <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/20">
                      <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center mb-3">
                        3
                      </div>
                      <h4 className="font-semibold mb-2">Verification</h4>
                      <p className="text-sm text-muted-foreground">
                        Decrypt with public key and compare hashes
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Interactive Signature Demo */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Signing Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Sign Document
                </CardTitle>
                <CardDescription>Create a digital signature using your private key</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Document to Sign</Label>
                  <Textarea
                    value={doc}
                    onChange={(e) => setDoc(e.target.value)}
                    className="font-mono text-sm min-h-[120px]"
                    placeholder="Enter the document content..."
                  />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{doc.length} characters</span>
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 text-red-500"
                      onClick={tamperWithDocument}
                    >
                      Simulate Tampering
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Your Private Key</Label>
                  <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded text-xs font-mono h-20 overflow-y-auto">
                    {keys.priv.substring(0, 100)}...
                  </div>
                  <p className="text-xs text-muted-foreground">
                    ⚠️ Never share your private key. It's used for signing only.
                  </p>
                </div>

                <Button onClick={handleSign} disabled={sign.isPending} className="w-full" size="lg">
                  {sign.isPending ? (
                    <>
                      <Loader2 className="mr-2 animate-spin" />
                      Signing...
                    </>
                  ) : (
                    <>
                      <FileCheck className="mr-2" />
                      Sign Document
                    </>
                  )}
                </Button>

                {!showProcess && (
                  <Button variant="link" className="w-full" onClick={() => setShowProcess(true)}>
                    Show signing process steps
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Verification Panel */}
            <Card className="bg-muted/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Unlock className="w-5 h-5" />
                  Verify Signature
                </CardTitle>
                <CardDescription>Verify authenticity using the public key</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Signature Display */}
                <div className="space-y-3">
                  <Label>Digital Signature</Label>
                  <div className="p-4 bg-background border rounded-lg">
                    {signature ? (
                      <div className="font-mono text-xs break-all max-h-40 overflow-y-auto">
                        {signature}
                      </div>
                    ) : (
                      <div className="h-32 flex items-center justify-center text-muted-foreground italic text-center">
                        <div>
                          <FileCheck className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p>Signature will appear here after signing</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Verification Area */}
                <div className="space-y-4">
                  <div className="space-y-3">
                    <Label>Public Key for Verification</Label>
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded text-xs font-mono h-20 overflow-y-auto">
                      {keys.pub.substring(0, 100)}...
                    </div>
                    <p className="text-xs text-muted-foreground">
                      ✅ This key can be shared publicly. Anyone can use it to verify your signatures.
                    </p>
                  </div>

                  <Button
                    variant="secondary"
                    onClick={() => handleVerify()}
                    disabled={verify.isPending || !signature}
                    className="w-full"
                  >
                    {verify.isPending ? (
                      <>
                        <Loader2 className="mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <ShieldAlert className="mr-2" />
                        Verify Signature
                      </>
                    )}
                  </Button>
                </div>

                {/* Verification Result */}
                {verificationResult !== null && (
                  <div className={`p-4 rounded-lg border ${verificationResult ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                    <div className="flex items-center gap-3">
                      {verificationResult ? (
                        <>
                          <CheckCircle className="w-6 h-6 text-green-500" />
                          <div>
                            <h4 className="font-bold text-green-600">Signature Valid</h4>
                            <p className="text-sm text-green-600/80">Document is authentic and untampered</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-6 h-6 text-red-500" />
                          <div>
                            <h4 className="font-bold text-red-600">Signature Invalid</h4>
                            <p className="text-sm text-red-600/80">
                              {modifiedDoc ? 'Document was tampered with!' : 'Document may have been modified'}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                    
                    {modifiedDoc && !verificationResult && (
                      <div className="mt-3 pt-3 border-t border-red-500/20">
                        <p className="text-sm font-medium mb-1">Tampered Document:</p>
                        <p className="text-sm text-muted-foreground font-mono">{modifiedDoc}</p>
                        <p className="text-xs text-red-600 mt-2">
                          This demonstrates how signatures detect even minor changes
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Educational Note */}
                <Alert>
                  <Info className="w-4 h-4" />
                  <AlertDescription className="text-sm">
                    <span className="font-semibold">Non-Repudiation:</span> The signer cannot deny having signed the document, as only their private key could have created the signature.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>

          {/* Key Management */}
          <Card>
            <CardHeader>
              <CardTitle>Key Management</CardTitle>
              <CardDescription>Your digital identity keys</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    Public Key (Shareable)
                  </Label>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      navigator.clipboard.writeText(keys.pub);
                      toast({ title: "Copied", description: "Public key copied" });
                    }}
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </Button>
                </div>
                <Textarea
                  readOnly
                  value={keys.pub}
                  className="font-mono text-xs h-32 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    Private Key (Secret)
                  </Label>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      navigator.clipboard.writeText(keys.priv);
                      toast({ title: "Copied", description: "Private key copied" });
                    }}
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </Button>
                </div>
                <Textarea
                  readOnly
                  value={keys.priv}
                  className="font-mono text-xs h-32 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
                />
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Keep this key secret! Anyone with it can forge your signature.
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}