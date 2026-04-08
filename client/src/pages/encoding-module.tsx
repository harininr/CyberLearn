import { Layout } from "@/components/layout/Layout";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Code,
    FileCode,
    ArrowRightLeft,
    Copy,
    CheckCircle,
    AlertTriangle,
    QrCode,
    Eye,
    EyeOff,
    Lock,
    Unlock,
    Fingerprint,
    Binary,
    FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BackButton } from "@/components/ui/back-button";

export default function EncodingModule() {
    const [activeTab, setActiveTab] = useState<"base64" | "hex" | "url" | "theory">("base64");
    const [inputText, setInputText] = useState("");
    const [encodedText, setEncodedText] = useState("");
    const [decodedText, setDecodedText] = useState("");
    const [copied, setCopied] = useState(false);

    const { toast } = useToast();

    // Base64 encoding/decoding
    const encodeBase64 = () => {
        try {
            const encoded = btoa(inputText);
            setEncodedText(encoded);
            toast({ title: "Encoded!", description: "Text encoded to Base64" });
        } catch (e) {
            toast({ title: "Error", description: "Failed to encode", variant: "destructive" });
        }
    };

    const decodeBase64 = () => {
        try {
            const decoded = atob(encodedText);
            setDecodedText(decoded);
            toast({ title: "Decoded!", description: "Base64 decoded to text" });
        } catch (e) {
            toast({ title: "Error", description: "Invalid Base64 string", variant: "destructive" });
        }
    };

    // Hex encoding/decoding
    const encodeHex = () => {
        try {
            const hex = Array.from(inputText)
                .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
                .join('');
            setEncodedText(hex);
            toast({ title: "Encoded!", description: "Text encoded to Hexadecimal" });
        } catch (e) {
            toast({ title: "Error", description: "Failed to encode", variant: "destructive" });
        }
    };

    const decodeHex = () => {
        try {
            const text = encodedText.match(/.{1,2}/g)?.map(byte =>
                String.fromCharCode(parseInt(byte, 16))
            ).join('') || '';
            setDecodedText(text);
            toast({ title: "Decoded!", description: "Hex decoded to text" });
        } catch (e) {
            toast({ title: "Error", description: "Invalid hex string", variant: "destructive" });
        }
    };

    // URL encoding/decoding
    const encodeURL = () => {
        try {
            const encoded = encodeURIComponent(inputText);
            setEncodedText(encoded);
            toast({ title: "Encoded!", description: "Text URL encoded" });
        } catch (e) {
            toast({ title: "Error", description: "Failed to encode", variant: "destructive" });
        }
    };

    const decodeURL = () => {
        try {
            const decoded = decodeURIComponent(encodedText);
            setDecodedText(decoded);
            toast({ title: "Decoded!", description: "URL decoded to text" });
        } catch (e) {
            toast({ title: "Error", description: "Invalid URL encoded string", variant: "destructive" });
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast({ title: "Copied!", description: "Text copied to clipboard" });
    };

    const clearAll = () => {
        setInputText("");
        setEncodedText("");
        setDecodedText("");
    };

    const handleEncode = () => {
        if (activeTab === "base64") encodeBase64();
        else if (activeTab === "hex") encodeHex();
        else if (activeTab === "url") encodeURL();
    };

    const handleDecode = () => {
        if (activeTab === "base64") decodeBase64();
        else if (activeTab === "hex") decodeHex();
        else if (activeTab === "url") decodeURL();
    };

    return (
        <Layout>
            <BackButton to="/" label="Back to Dashboard" />

            <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                    <Code className="w-8 h-8 text-primary" />
                    <h1 className="text-3xl font-display font-bold">Encoding & Decoding</h1>
                </div>
                <p className="text-muted-foreground text-lg">
                    Learn about different encoding schemes used in cybersecurity and data transmission.
                </p>
            </div>

            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-6">
                <TabsList className="grid w-full grid-cols-4 max-w-lg">
                    <TabsTrigger value="base64" className="gap-2">
                        <FileCode className="w-4 h-4" />
                        Base64
                    </TabsTrigger>
                    <TabsTrigger value="hex" className="gap-2">
                        <Binary className="w-4 h-4" />
                        Hex
                    </TabsTrigger>
                    <TabsTrigger value="url" className="gap-2">
                        <FileText className="w-4 h-4" />
                        URL
                    </TabsTrigger>
                    <TabsTrigger value="theory" className="gap-2">
                        <Fingerprint className="w-4 h-4" />
                        Theory
                    </TabsTrigger>
                </TabsList>

                {/* Encoding/Decoding Tabs */}
                {["base64", "hex", "url"].map((tab) => (
                    <TabsContent key={tab} value={tab} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Encode Section */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Lock className="w-5 h-5" />
                                        Encode
                                    </CardTitle>
                                    <CardDescription>
                                        Convert plaintext to {tab === "base64" ? "Base64" : tab === "hex" ? "Hexadecimal" : "URL encoded"} format
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Input Text (Plaintext)</Label>
                                        <Textarea
                                            value={inputText}
                                            onChange={(e) => setInputText(e.target.value)}
                                            placeholder="Enter text to encode..."
                                            rows={4}
                                        />
                                    </div>

                                    <Button onClick={handleEncode} className="w-full">
                                        <Lock className="w-4 h-4 mr-2" />
                                        Encode to {tab === "base64" ? "Base64" : tab === "hex" ? "Hex" : "URL"}
                                    </Button>

                                    {encodedText && (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label>Encoded Output</Label>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => copyToClipboard(encodedText)}
                                                >
                                                    {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                                </Button>
                                            </div>
                                            <div className="p-3 bg-muted rounded-lg font-mono text-sm break-all">
                                                {encodedText}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Decode Section */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Unlock className="w-5 h-5" />
                                        Decode
                                    </CardTitle>
                                    <CardDescription>
                                        Convert {tab === "base64" ? "Base64" : tab === "hex" ? "Hexadecimal" : "URL encoded"} back to plaintext
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Encoded Input</Label>
                                        <Textarea
                                            value={encodedText}
                                            onChange={(e) => setEncodedText(e.target.value)}
                                            placeholder={`Enter ${tab === "base64" ? "Base64" : tab === "hex" ? "hex" : "URL encoded"} string...`}
                                            rows={4}
                                        />
                                    </div>

                                    <Button onClick={handleDecode} variant="secondary" className="w-full">
                                        <Unlock className="w-4 h-4 mr-2" />
                                        Decode from {tab === "base64" ? "Base64" : tab === "hex" ? "Hex" : "URL"}
                                    </Button>

                                    {decodedText && (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label>Decoded Output</Label>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => copyToClipboard(decodedText)}
                                                >
                                                    {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                                </Button>
                                            </div>
                                            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                                                {decodedText}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        <div className="flex justify-center">
                            <Button variant="outline" onClick={clearAll}>
                                Clear All
                            </Button>
                        </div>

                        {/* Info Cards */}
                        <div className="grid md:grid-cols-3 gap-4">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm">What is {tab === "base64" ? "Base64" : tab === "hex" ? "Hexadecimal" : "URL"} Encoding?</CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm text-muted-foreground">
                                    {tab === "base64" && "Base64 converts binary data to ASCII text using 64 characters (A-Z, a-z, 0-9, +, /)."}
                                    {tab === "hex" && "Hexadecimal represents each byte as two hex digits (0-9, A-F)."}
                                    {tab === "url" && "URL encoding replaces unsafe characters with % followed by hex values."}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm">Common Use Cases</CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm text-muted-foreground">
                                    {tab === "base64" && "Email attachments, JWT tokens, data URLs, embedding images in HTML/CSS."}
                                    {tab === "hex" && "Color codes (#FF0000), MAC addresses, cryptographic hashes, debugging."}
                                    {tab === "url" && "Query parameters, form data, special characters in URLs."}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm">Security Note</CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm text-muted-foreground">
                                    <Alert className="bg-amber-500/10 border-amber-500/20">
                                        <AlertTriangle className="w-4 h-4" />
                                        <AlertDescription>
                                            Encoding is NOT encryption! It's reversible and provides no security.
                                        </AlertDescription>
                                    </Alert>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                ))}

                {/* Theory Tab */}
                <TabsContent value="theory" className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileCode className="w-5 h-5" />
                                    Encoding vs Encryption
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="p-3 border rounded-lg">
                                        <Badge className="mb-2">Encoding</Badge>
                                        <ul className="text-sm space-y-1">
                                            <li>• Transforms data for compatibility</li>
                                            <li>• No key required</li>
                                            <li>• Easily reversible by anyone</li>
                                            <li>• NOT secure for sensitive data</li>
                                        </ul>
                                    </div>

                                    <div className="p-3 border rounded-lg bg-green-500/5">
                                        <Badge variant="secondary" className="mb-2">Encryption</Badge>
                                        <ul className="text-sm space-y-1">
                                            <li>• Protects data confidentiality</li>
                                            <li>• Requires secret key</li>
                                            <li>• Only key holder can decrypt</li>
                                            <li>• Secure for sensitive data</li>
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <QrCode className="w-5 h-5" />
                                    Encoding Types
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="p-3 border rounded-lg">
                                        <div className="font-medium mb-1">Base64</div>
                                        <p className="text-sm text-muted-foreground">
                                            Uses 64 ASCII characters to represent binary data. Commonly used in email, JWT tokens, and data URIs.
                                        </p>
                                    </div>

                                    <div className="p-3 border rounded-lg">
                                        <div className="font-medium mb-1">Hexadecimal</div>
                                        <p className="text-sm text-muted-foreground">
                                            Base-16 encoding using 0-9 and A-F. Used for colors, memory addresses, and cryptographic values.
                                        </p>
                                    </div>

                                    <div className="p-3 border rounded-lg">
                                        <div className="font-medium mb-1">URL Encoding</div>
                                        <p className="text-sm text-muted-foreground">
                                            Replaces unsafe URL characters with %XX. Essential for web forms and query parameters.
                                        </p>
                                    </div>

                                    <div className="p-3 border rounded-lg">
                                        <div className="font-medium mb-1">QR Codes</div>
                                        <p className="text-sm text-muted-foreground">
                                            2D barcodes that encode text, URLs, or data. Used for contactless payments, ticketing, and authentication.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-amber-500" />
                                Security Risks & Best Practices
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div className="font-medium text-red-500">❌ Common Mistakes</div>
                                    <ul className="text-sm space-y-2">
                                        <li>• Using Base64 to "hide" passwords</li>
                                        <li>• Thinking encoded data is encrypted</li>
                                        <li>• Storing sensitive data in URLs</li>
                                        <li>• Double encoding causing issues</li>
                                    </ul>
                                </div>

                                <div className="space-y-3">
                                    <div className="font-medium text-green-500">✅ Best Practices</div>
                                    <ul className="text-sm space-y-2">
                                        <li>• Use encoding for data transport only</li>
                                        <li>• Always encrypt sensitive data first</li>
                                        <li>• Validate decoded data before use</li>
                                        <li>• Use proper input sanitization</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </Layout>
    );
}
