import { Layout } from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useAesEncrypt, useAesDecrypt, useGenerateRsa, useRsaEncrypt, useRsaDecrypt } from "@/hooks/use-modules";
import { Loader2, Lock, Unlock, Key, ArrowRight, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CryptoModule() {
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold mb-2">Cryptography Module</h1>
        <p className="text-muted-foreground">Experiment with Symmetric (AES) and Asymmetric (RSA) encryption.</p>
      </div>

      <Tabs defaultValue="aes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="aes">AES (Symmetric)</TabsTrigger>
          <TabsTrigger value="rsa">RSA (Asymmetric)</TabsTrigger>
        </TabsList>

        <TabsContent value="aes" className="space-y-6">
          <AesSection />
        </TabsContent>

        <TabsContent value="rsa" className="space-y-6">
          <RsaSection />
        </TabsContent>
      </Tabs>
    </Layout>
  );
}

function AesSection() {
  const [text, setText] = useState("Confidential Data");
  const [key, setKey] = useState("0123456789abcdef0123456789abcdef"); // 32 hex chars = 16 bytes = 128 bit
  const [encrypted, setEncrypted] = useState("");
  const [iv, setIv] = useState("");
  const [decrypted, setDecrypted] = useState("");

  const encrypt = useAesEncrypt();
  const decrypt = useAesDecrypt();

  const handleEncrypt = async () => {
    encrypt.mutate({ text, key }, {
      onSuccess: (data) => {
        setEncrypted(data.encrypted);
        setIv(data.iv);
        setDecrypted(""); // clear old decrypt
      }
    });
  };

  const handleDecrypt = async () => {
    decrypt.mutate({ encrypted, key, iv }, {
      onSuccess: (data) => setDecrypted(data.decrypted)
    });
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Input Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Input Parameters</CardTitle>
          <CardDescription>Configure your plaintext and secret key.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Plaintext Message</Label>
            <Textarea 
              value={text} 
              onChange={e => setText(e.target.value)} 
              className="font-mono text-sm min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label>Secret Key (Hex, 32 chars)</Label>
            <Input 
              value={key} 
              onChange={e => setKey(e.target.value)} 
              className="font-mono"
            />
          </div>
          <Button onClick={handleEncrypt} disabled={encrypt.isPending} className="w-full">
            {encrypt.isPending ? <Loader2 className="mr-2 animate-spin" /> : <Lock className="mr-2 w-4 h-4" />}
            Encrypt with AES-CBC
          </Button>
        </CardContent>
      </Card>

      {/* Output Panel */}
      <div className="space-y-6">
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle>Encrypted Output</CardTitle>
            <CardDescription>Ciphertext + Initialization Vector (IV)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {encrypted ? (
              <>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Ciphertext (Hex)</Label>
                  <div className="p-3 bg-card border rounded-lg font-mono text-sm break-all">
                    {encrypted}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">IV (Hex)</Label>
                  <div className="p-3 bg-card border rounded-lg font-mono text-sm">
                    {iv}
                  </div>
                </div>
                <div className="pt-4 flex justify-center">
                  <ArrowRight className="text-muted-foreground animate-pulse" />
                </div>
                <Button variant="secondary" onClick={handleDecrypt} disabled={decrypt.isPending} className="w-full">
                   {decrypt.isPending ? <Loader2 className="mr-2 animate-spin" /> : <Unlock className="mr-2 w-4 h-4" />}
                   Decrypt Output
                </Button>
              </>
            ) : (
              <div className="h-40 flex items-center justify-center text-muted-foreground text-sm italic border-2 border-dashed rounded-lg">
                Encryption output will appear here
              </div>
            )}
          </CardContent>
        </Card>

        {decrypted && (
          <Card className="border-green-500/20 bg-green-500/5">
            <CardHeader>
              <CardTitle className="text-green-600">Decrypted Result</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-mono text-sm">{decrypted}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function RsaSection() {
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [message, setMessage] = useState("Hello RSA");
  const [encrypted, setEncrypted] = useState("");
  const [decrypted, setDecrypted] = useState("");
  
  const { toast } = useToast();
  const generate = useGenerateRsa();
  const encrypt = useRsaEncrypt();
  const decrypt = useRsaDecrypt();

  const handleGenerate = () => {
    generate.mutate(undefined, {
      onSuccess: (data) => {
        setPublicKey(data.publicKey);
        setPrivateKey(data.privateKey);
        toast({ title: "Keys Generated", description: "New RSA Keypair created successfully." });
      }
    });
  };

  const handleEncrypt = () => {
    if (!publicKey) {
      toast({ title: "Missing Key", description: "Generate keys first!", variant: "destructive" });
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: "Copied to clipboard" });
  };

  return (
    <div className="space-y-8">
      {/* Key Management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Key Management</CardTitle>
            <CardDescription>Generate a public/private key pair (2048-bit)</CardDescription>
          </div>
          <Button onClick={handleGenerate} disabled={generate.isPending}>
            {generate.isPending ? <Loader2 className="mr-2 animate-spin" /> : <Key className="mr-2 w-4 h-4" />}
            Generate Keys
          </Button>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Public Key (Shareable)</Label>
              {publicKey && <Button size="sm" variant="ghost" onClick={() => copyToClipboard(publicKey)}><Copy className="w-3 h-3" /></Button>}
            </div>
            <Textarea readOnly value={publicKey} className="font-mono text-xs h-32 bg-muted/50 resize-none" placeholder="Generate keys to see public key..." />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Private Key (Secret)</Label>
              {privateKey && <Button size="sm" variant="ghost" onClick={() => copyToClipboard(privateKey)}><Copy className="w-3 h-3" /></Button>}
            </div>
            <Textarea readOnly value={privateKey} className="font-mono text-xs h-32 bg-muted/50 resize-none" placeholder="Generate keys to see private key..." />
          </div>
        </CardContent>
      </Card>

      {/* Operation Flow */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Step 1 */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 bg-blue-500 h-full"/>
          <CardHeader><CardTitle className="text-sm">1. Message</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input value={message} onChange={e => setMessage(e.target.value)} placeholder="Enter message" />
            <Button className="w-full" onClick={handleEncrypt} disabled={!publicKey || encrypt.isPending}>
              Encrypt with Public Key
            </Button>
          </CardContent>
        </Card>

        {/* Step 2 */}
        <Card className="relative overflow-hidden bg-muted/30">
          <div className="absolute top-0 left-0 w-1 bg-purple-500 h-full"/>
          <CardHeader><CardTitle className="text-sm">2. Encrypted (Base64)</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded border bg-background font-mono text-xs h-24 overflow-y-auto break-all">
              {encrypted || <span className="text-muted-foreground italic">Waiting for encryption...</span>}
            </div>
            <Button variant="secondary" className="w-full" onClick={handleDecrypt} disabled={!encrypted || decrypt.isPending}>
              Decrypt with Private Key
            </Button>
          </CardContent>
        </Card>

        {/* Step 3 */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 bg-green-500 h-full"/>
          <CardHeader><CardTitle className="text-sm">3. Decrypted</CardTitle></CardHeader>
          <CardContent>
             <div className="p-3 rounded border bg-green-500/10 border-green-500/20 font-mono text-sm h-24 flex items-center justify-center">
              {decrypted || <span className="text-muted-foreground italic">Result</span>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
