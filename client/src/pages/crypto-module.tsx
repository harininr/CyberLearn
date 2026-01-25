import { Layout } from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useAesEncrypt, useAesDecrypt, useGenerateRsa, useRsaEncrypt, useRsaDecrypt } from "@/hooks/use-modules";
import { Loader2, Lock, Unlock, Key, ArrowRight, Copy, Info, BookOpen, Shield, ShieldCheck, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

export default function CryptoModule() {
  const [activeTab, setActiveTab] = useState<"aes" | "rsa">("aes");

  return (
    <Layout>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-display font-bold">Cryptography Learning Lab</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Learn cryptographic concepts through interactive visualization. Understand how symmetric and asymmetric encryption protect data.
        </p>
      </div>

      {/* Learning Path */}
      <Card className="mb-8 border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Learning Progress</h3>
              <p className="text-sm text-muted-foreground mb-2">Complete both modules to master basic cryptography</p>
              <Progress value={activeTab === "aes" ? 50 : 100} className="w-full md:w-64" />
            </div>
            <div className="flex gap-2">
              <Badge variant={activeTab === "aes" ? "default" : "secondary"} className="gap-2">
                <BookOpen className="w-3 h-3" />
                AES Module
              </Badge>
              <Badge variant={activeTab === "rsa" ? "default" : "secondary"} className="gap-2">
                <BookOpen className="w-3 h-3" />
                RSA Module
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "aes" | "rsa")} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="aes" className="gap-2">
            <Lock className="w-4 h-4" />
            Symmetric (AES)
          </TabsTrigger>
          <TabsTrigger value="rsa" className="gap-2">
            <Key className="w-4 h-4" />
            Asymmetric (RSA)
          </TabsTrigger>
        </TabsList>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Theory Section */}
          <div className="lg:col-span-1">
            <TheoryPanel activeTab={activeTab} />
          </div>

          {/* Practical Section */}
          <div className="lg:col-span-2">
            <TabsContent value="aes" className="space-y-6 mt-0">
              <AesSection />
            </TabsContent>

            <TabsContent value="rsa" className="space-y-6 mt-0">
              <RsaSection />
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </Layout>
  );
}

function TheoryPanel({ activeTab }: { activeTab: "aes" | "rsa" }) {
  const aesTheory = {
    title: "Symmetric Encryption (AES)",
    description: "Uses the same key for both encryption and decryption.",
    concepts: [
      {
        title: "Key Concept",
        description: "Single shared secret key must be kept confidential by both parties."
      },
      {
        title: "Speed & Efficiency",
        description: "Much faster than asymmetric encryption, suitable for large data."
      },
      {
        title: "Common Uses",
        description: "File encryption, database encryption, SSL/TLS (for bulk data)."
      },
      {
        title: "Key Management Challenge",
        description: "Secure key exchange between parties is difficult."
      }
    ],
    analogy: "Like a physical lockbox where both sender and receiver have the same key."
  };

  const rsaTheory = {
    title: "Asymmetric Encryption (RSA)",
    description: "Uses a key pair: public key (encrypt) and private key (decrypt).",
    concepts: [
      {
        title: "Key Concept",
        description: "Public key can be shared openly, private key must be kept secret."
      },
      {
        title: "Security Foundation",
        description: "Based on mathematical problems (prime factorization) that are hard to solve."
      },
      {
        title: "Common Uses",
        description: "Digital signatures, key exchange, secure email (PGP)."
      },
      {
        title: "Speed Consideration",
        description: "Slower than symmetric, typically used for small data like keys."
      }
    ],
    analogy: "Like a mailbox with a public slot (anyone can drop mail) but only the owner has the key to open it."
  };

  const theory = activeTab === "aes" ? aesTheory : rsaTheory;

  return (
    <Card className="sticky top-6">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          <CardTitle>Learning Concepts</CardTitle>
        </div>
        <CardDescription>{theory.title}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Info className="w-4 h-4" />
            Core Principle
          </h4>
          <p className="text-sm text-muted-foreground">{theory.description}</p>
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="font-semibold text-sm">Key Characteristics</h4>
          {theory.concepts.map((concept, i) => (
            <div key={i} className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-sm font-medium">{concept.title}</span>
              </div>
              <p className="text-xs text-muted-foreground pl-4">{concept.description}</p>
            </div>
          ))}
        </div>

        <Separator />

        <Alert className="bg-primary/5 border-primary/20">
          <Info className="w-4 h-4" />
          <AlertDescription className="text-sm">
            <span className="font-semibold">Analogy:</span> {theory.analogy}
          </AlertDescription>
        </Alert>

        <Accordion type="single" collapsible>
          <AccordionItem value="security-tip">
            <AccordionTrigger className="text-sm">
              Security Best Practices
            </AccordionTrigger>
            <AccordionContent className="text-xs space-y-2 text-muted-foreground">
              <p>• Always use cryptographically secure random keys</p>
              <p>• For AES, prefer 256-bit keys when possible</p>
              <p>• Never reuse IVs (Initialization Vectors) with the same key</p>
              <p>• RSA keys should be at least 2048 bits (4096 recommended)</p>
              <p>• Store private keys in secure hardware when possible</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}

function AesSection() {
  const [text, setText] = useState("Confidential Data");
  const [key, setKey] = useState("0123456789abcdef0123456789abcdef");
  const [encrypted, setEncrypted] = useState("");
  const [iv, setIv] = useState("");
  const [decrypted, setDecrypted] = useState("");
  const [showSteps, setShowSteps] = useState(true);

  const encrypt = useAesEncrypt();
  const decrypt = useAesDecrypt();

  const handleEncrypt = async () => {
    encrypt.mutate({ text, key }, {
      onSuccess: (data) => {
        setEncrypted(data.encrypted);
        setIv(data.iv);
        setDecrypted("");
      }
    });
  };

  const handleDecrypt = async () => {
    decrypt.mutate({ encrypted, key, iv }, {
      onSuccess: (data) => setDecrypted(data.decrypted)
    });
  };

  const steps = [
    { number: 1, title: "Input", description: "Enter plaintext and secret key", status: "complete" },
    { number: 2, title: "Key Expansion", description: "Expand 128-bit key into round keys", status: encrypt.isPending ? "active" : "pending" },
    { number: 3, title: "Initial Round", description: "AddRoundKey with first round key", status: "pending" },
    { number: 4, title: "Main Rounds", description: "9 rounds of SubBytes, ShiftRows, MixColumns, AddRoundKey", status: "pending" },
    { number: 5, title: "Final Round", description: "SubBytes, ShiftRows, AddRoundKey (no MixColumns)", status: "pending" },
    { number: 6, title: "Output", description: "Ciphertext + IV ready", status: encrypted ? "complete" : "pending" },
  ];

  return (
    <div className="space-y-6">
      {/* Step-by-Step Visualization */}
      {showSteps && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">AES Encryption Process</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowSteps(false)}>
                Hide
              </Button>
            </div>
            <CardDescription>Follow the 10-round AES-128 process visually</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className={`relative p-3 rounded-lg border text-center ${
                    step.status === "complete"
                      ? "bg-green-500/10 border-green-500/20"
                      : step.status === "active"
                      ? "bg-blue-500/10 border-blue-500/20"
                      : "bg-muted/30"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${
                    step.status === "complete"
                      ? "bg-green-500 text-white"
                      : step.status === "active"
                      ? "bg-blue-500 text-white animate-pulse"
                      : "bg-muted"
                  }`}>
                    {step.status === "complete" ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <h4 className="font-semibold text-sm mb-1">{step.title}</h4>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center text-sm text-muted-foreground">
              <AlertCircle className="w-4 h-4 mr-2" />
              <span>AES-128 uses 10 rounds. Each round applies confusion and diffusion.</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Interactive Panel */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Encryption Setup
            </CardTitle>
            <CardDescription>Configure symmetric encryption parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="plaintext">Plaintext Message</Label>
                <Badge variant="outline" className="text-xs">
                  {text.length} chars
                </Badge>
              </div>
              <Textarea
                id="plaintext"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="font-mono text-sm min-h-[100px]"
                placeholder="Enter your secret message..."
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="key">Secret Key (Hex)</Label>
                <Badge variant={key.length === 32 ? "default" : "destructive"} className="text-xs">
                  {key.length}/32 chars
                </Badge>
              </div>
              <div className="relative">
                <Input
                  id="key"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="font-mono pr-10"
                  placeholder="32 hex characters (16 bytes)"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-7 w-7 p-0"
                  onClick={() => setKey("0123456789abcdef0123456789abcdef")}
                >
                  Reset
                </Button>
              </div>
              {key.length !== 32 && (
                <Alert variant="destructive" className="py-2">
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription className="text-xs">
                    Key must be exactly 32 hex characters for AES-128
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="pt-2">
              <Button
                onClick={handleEncrypt}
                disabled={encrypt.isPending || key.length !== 32}
                className="w-full"
                size="lg"
              >
                {encrypt.isPending ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" />
                    Encrypting...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2" />
                    Encrypt with AES-128-CBC
                  </>
                )}
              </Button>
              {!showSteps && (
                <Button
                  variant="link"
                  className="w-full mt-2"
                  onClick={() => setShowSteps(true)}
                >
                  Show encryption process steps
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Output Panel */}
        <div className="space-y-6">
          <Card className={encrypted ? "border-primary/20" : ""}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Encrypted Result
              </CardTitle>
              <CardDescription>Ciphertext and Initialization Vector (IV)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {encrypted ? (
                <>
                  <div className="space-y-2">
                    <Label className="text-sm flex items-center justify-between">
                      <span>Ciphertext (Hex)</span>
                      <Badge variant="secondary">Secured</Badge>
                    </Label>
                    <div className="p-3 bg-card border rounded-lg font-mono text-xs break-all max-h-32 overflow-y-auto">
                      {encrypted}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      This is your original message transformed by 10 rounds of AES operations
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Initialization Vector (IV)</Label>
                    <div className="p-3 bg-muted/30 border rounded-lg font-mono text-sm">
                      {iv}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      IV ensures identical plaintexts produce different ciphertexts
                    </p>
                  </div>

                  <div className="pt-4">
                    <div className="flex items-center justify-center text-muted-foreground mb-4">
                      <div className="text-center">
                        <ArrowRight className="w-6 h-6 mx-auto animate-pulse" />
                        <span className="text-xs mt-1">Ready for decryption</span>
                      </div>
                    </div>

                    <Button
                      variant="secondary"
                      onClick={handleDecrypt}
                      disabled={decrypt.isPending}
                      className="w-full"
                    >
                      {decrypt.isPending ? (
                        <>
                          <Loader2 className="mr-2 animate-spin" />
                          Decrypting...
                        </>
                      ) : (
                        <>
                          <Unlock className="mr-2" />
                          Decrypt with Same Key
                        </>
                      )}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-muted-foreground text-center border-2 border-dashed rounded-lg p-6">
                  <Lock className="w-12 h-12 mb-4 opacity-50" />
                  <p className="font-medium mb-2">No encrypted data yet</p>
                  <p className="text-sm">Enter your message and click "Encrypt" to see the transformation</p>
                </div>
              )}
            </CardContent>
          </Card>

          {decrypted && (
            <Card className="border-green-500/30 bg-green-500/5 animate-in slide-in-from-bottom-4">
              <CardHeader>
                <CardTitle className="text-green-600 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" />
                  Decryption Successful!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm">Original Message Restored</Label>
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <p className="font-mono text-sm">{decrypted}</p>
                  </div>
                </div>
                <Alert className="bg-green-500/10 border-green-500/20">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <AlertDescription className="text-sm">
                    <span className="font-semibold">Perfect match!</span> The decrypted message matches the original plaintext.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function RsaSection() {
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [message, setMessage] = useState("Hello RSA!");
  const [encrypted, setEncrypted] = useState("");
  const [decrypted, setDecrypted] = useState("");
  const [keyStrength, setKeyStrength] = useState<"2048" | "4096">("2048");

  const { toast } = useToast();
  const generate = useGenerateRsa();
  const encrypt = useRsaEncrypt();
  const decrypt = useRsaDecrypt();

  const handleGenerate = () => {
    generate.mutate({ bits: parseInt(keyStrength) }, {
      onSuccess: (data) => {
        setPublicKey(data.publicKey);
        setPrivateKey(data.privateKey);
        toast({
          title: "Key Pair Generated",
          description: `${keyStrength}-bit RSA keys created successfully.`,
        });
      }
    });
  };

  const handleEncrypt = () => {
    if (!publicKey) {
      toast({
        title: "Missing Public Key",
        description: "Please generate a key pair first.",
        variant: "destructive",
      });
      return;
    }
    encrypt.mutate({ text: message, publicKey }, {
      onSuccess: (data) => {
        setEncrypted(data.encrypted);
        setDecrypted("");
      }
    });
  };

  const handleDecrypt = () => {
    decrypt.mutate({ encrypted, privateKey }, {
      onSuccess: (data) => setDecrypted(data.decrypted)
    });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: `${label} copied to clipboard`,
    });
  };

  return (
    <div className="space-y-8">
      {/* Key Generation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Generate RSA Key Pair
          </CardTitle>
          <CardDescription>
            Create your public/private key pair. The public key can be shared openly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="space-y-1">
              <Label>Key Strength</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={keyStrength === "2048" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setKeyStrength("2048")}
                >
                  2048-bit (Recommended)
                </Button>
                <Button
                  type="button"
                  variant={keyStrength === "4096" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setKeyStrength("4096")}
                >
                  4096-bit (Strong)
                </Button>
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={generate.isPending}
              size="lg"
              className="gap-2"
            >
              {generate.isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Key className="w-4 h-4" />
              )}
              Generate {keyStrength}-bit Keys
            </Button>
          </div>

          <Separator />

          {/* Keys Display */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <span className="bg-blue-500 w-2 h-2 rounded-full"></span>
                  Public Key (Share with anyone)
                </Label>
                {publicKey && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(publicKey, "Public key")}
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </Button>
                )}
              </div>
              <Textarea
                readOnly
                value={publicKey}
                className="font-mono text-xs h-40 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 resize-none"
                placeholder="Public key will appear here after generation..."
              />
              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>Anyone can use this to encrypt messages only you can read</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <span className="bg-red-500 w-2 h-2 rounded-full"></span>
                  Private Key (Keep secret!)
                </Label>
                {privateKey && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(privateKey, "Private key")}
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </Button>
                )}
              </div>
              <Textarea
                readOnly
                value={privateKey}
                className="font-mono text-xs h-40 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800 resize-none"
                placeholder="Private key will appear here after generation..."
              />
              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>Never share this key. It can decrypt all messages sent to your public key.</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Demonstration */}
      <div className="space-y-6">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <h3 className="font-semibold text-lg mb-2">Asymmetric Encryption Flow</h3>
            <p className="text-sm text-muted-foreground">
              Follow the one-way encryption process: Public key encrypts, only private key decrypts
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Step 1: Message & Encryption */}
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 bg-blue-500 h-full" />
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm">
                  1
                </div>
                <CardTitle className="text-base">Encrypt with Public Key</CardTitle>
              </div>
              <CardDescription>Anyone can perform this step</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Original Message</Label>
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message to encrypt..."
                />
              </div>
              <div className="space-y-2">
                <Label>Using Public Key</Label>
                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border rounded text-xs font-mono h-20 overflow-y-auto">
                  {publicKey ? (
                    publicKey.substring(0, 80) + "..."
                  ) : (
                    <span className="text-muted-foreground italic">Generate keys first</span>
                  )}
                </div>
              </div>
              <Button
                onClick={handleEncrypt}
                disabled={!publicKey || encrypt.isPending}
                className="w-full"
              >
                {encrypt.isPending ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" />
                    Encrypting...
                  </>
                ) : (
                  "Encrypt Message"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Step 2: Encrypted Result */}
          <Card className="relative overflow-hidden bg-muted/30">
            <div className="absolute top-0 left-0 w-2 bg-purple-500 h-full" />
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm">
                  2
                </div>
                <CardTitle className="text-base">Encrypted Ciphertext</CardTitle>
              </div>
              <CardDescription>Unreadable without private key</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Base64 Encoded Result</Label>
                <div className="p-3 rounded border bg-background font-mono text-xs h-40 overflow-y-auto break-all">
                  {encrypted ? (
                    encrypted
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground italic text-center">
                      <div>
                        <Lock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>Encrypted text will appear here</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                This ciphertext can be safely transmitted over insecure channels.
              </p>
            </CardContent>
          </Card>

          {/* Step 3: Decryption */}
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 bg-green-500 h-full" />
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm">
                  3
                </div>
                <CardTitle className="text-base">Decrypt with Private Key</CardTitle>
              </div>
              <CardDescription>Only you can perform this step</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Using Private Key</Label>
                <div className="p-3 bg-red-50 dark:bg-red-950/20 border rounded text-xs font-mono h-20 overflow-y-auto">
                  {privateKey ? (
                    privateKey.substring(0, 80) + "..."
                  ) : (
                    <span className="text-muted-foreground italic">Generate keys first</span>
                  )}
                </div>
              </div>
              <Button
                variant="secondary"
                onClick={handleDecrypt}
                disabled={!encrypted || !privateKey || decrypt.isPending}
                className="w-full"
              >
                {decrypt.isPending ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" />
                    Decrypting...
                  </>
                ) : (
                  "Decrypt Message"
                )}
              </Button>

              {decrypted && (
                <div className="space-y-2 animate-in slide-in-from-bottom">
                  <Label>Decrypted Message</Label>
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <p className="font-mono text-sm break-words">{decrypted}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span>Successfully decrypted with private key</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Learning Insight */}
        <Alert className="bg-primary/5 border-primary/20">
          <Info className="w-4 h-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-semibold">Why this is secure:</p>
              <ul className="text-sm space-y-1 list-disc pl-4">
                <li>Public key encryption is a one-way function</li>
                <li>Private key is never shared or transmitted</li>
                <li>Mathematically infeasible to derive private key from public key</li>
                <li>Even with encrypted message, only private key holder can read it</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}