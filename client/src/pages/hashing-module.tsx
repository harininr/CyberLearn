import { Layout } from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useHash, useSign, useVerify, useGenerateRsa } from "@/hooks/use-modules";
import { Loader2, Fingerprint, FileCheck, ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function HashingModule() {
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold mb-2">Hashing & Signatures</h1>
        <p className="text-muted-foreground">Verify data integrity and authenticity.</p>
      </div>

      <Tabs defaultValue="hashing" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="hashing">Hashing (One-way)</TabsTrigger>
          <TabsTrigger value="signatures">Digital Signatures</TabsTrigger>
        </TabsList>

        <TabsContent value="hashing">
          <HashingSection />
        </TabsContent>

        <TabsContent value="signatures">
          <SignatureSection />
        </TabsContent>
      </Tabs>
    </Layout>
  );
}

function HashingSection() {
  const [text, setText] = useState("Hello World");
  const [algo, setAlgo] = useState<"sha256" | "md5">("sha256");
  const [salt, setSalt] = useState("");
  const [hash, setHash] = useState("");
  
  const doHash = useHash();

  const handleHash = () => {
    doHash.mutate({ text, algorithm: algo, salt: salt || undefined }, {
      onSuccess: (data) => setHash(data.hash)
    });
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Hash Generator</CardTitle>
          <CardDescription>Creates a fixed-size string from any input. Deterministic & Irreversible.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Input Text</Label>
            <Textarea value={text} onChange={e => setText(e.target.value)} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Algorithm</Label>
              <Select value={algo} onValueChange={(v: any) => setAlgo(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sha256">SHA-256 (Secure)</SelectItem>
                  <SelectItem value="md5">MD5 (Insecure)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Salt (Optional)</Label>
              <Input value={salt} onChange={e => setSalt(e.target.value)} placeholder="Add randomness" />
            </div>
          </div>

          <Button onClick={handleHash} disabled={doHash.isPending} className="w-full">
            {doHash.isPending ? <Loader2 className="mr-2 animate-spin" /> : <Fingerprint className="mr-2 w-4 h-4" />}
            Generate Hash
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle>Output Hash</CardTitle>
          <CardDescription>
            {algo.toUpperCase()} Digest ({algo === 'sha256' ? '64' : '32'} hex characters)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-background border rounded-lg font-mono text-sm break-all shadow-inner min-h-[60px] flex items-center">
            {hash || <span className="text-muted-foreground italic">Output will appear here...</span>}
          </div>
          
          <div className="mt-6 p-4 bg-blue-500/10 rounded-lg text-sm text-blue-600 border border-blue-500/20">
            <strong>Educational Note:</strong> Changing even a single character in the input will result in a completely different hash. This is called the "Avalanche Effect".
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SignatureSection() {
  const [keys, setKeys] = useState<{ pub: string, priv: string } | null>(null);
  const [doc, setDoc] = useState("Contract Agreement v1");
  const [signature, setSignature] = useState("");
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);

  const generate = useGenerateRsa();
  const sign = useSign();
  const verify = useVerify();
  const { toast } = useToast();

  const handleGenerate = () => {
    generate.mutate(undefined, {
      onSuccess: (data) => {
        setKeys({ pub: data.publicKey, priv: data.privateKey });
        toast({ title: "Identity Keys Created", description: "You now have a digital identity." });
      }
    });
  };

  const handleSign = () => {
    if (!keys) return;
    sign.mutate({ text: doc, privateKey: keys.priv }, {
      onSuccess: (data) => {
        setSignature(data.signature);
        setVerificationResult(null);
      }
    });
  };

  const handleVerify = () => {
    if (!keys || !signature) return;
    verify.mutate({ text: doc, signature, publicKey: keys.pub }, {
      onSuccess: (data) => setVerificationResult(data.isValid)
    });
  };

  return (
    <div className="space-y-6">
      {/* Identity Setup */}
      {!keys ? (
        <Card className="text-center py-12">
          <CardContent>
            <ShieldAlert className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-bold mb-2">No Identity Keys Found</h3>
            <p className="text-muted-foreground mb-6">You need a key pair to sign documents.</p>
            <Button onClick={handleGenerate} disabled={generate.isPending}>
              {generate.isPending ? <Loader2 className="mr-2 animate-spin" /> : "Create Digital Identity"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Sign Document</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Document Text</Label>
                <Textarea value={doc} onChange={e => setDoc(e.target.value)} />
              </div>
              <Button onClick={handleSign} disabled={sign.isPending} className="w-full">
                Sign with Private Key
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle>Digital Signature</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-background border rounded font-mono text-xs h-32 overflow-y-auto break-all">
                {signature || <span className="text-muted-foreground italic">Signature will appear here...</span>}
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="font-semibold mb-2">Verification</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Check if the signature matches the document using the Public Key. Try modifying the document text above and then verifying!
                </p>
                <Button variant="outline" onClick={handleVerify} disabled={verify.isPending || !signature} className="w-full">
                  Verify Signature
                </Button>
              </div>

              {verificationResult !== null && (
                <div className={`p-4 rounded-lg flex items-center gap-2 ${verificationResult ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                  {verificationResult ? <FileCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                  <span className="font-bold">{verificationResult ? "Valid Signature" : "Invalid Signature - Tampering Detected!"}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
