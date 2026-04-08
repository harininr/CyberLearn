// File: digitalsignature-module-theory.tsx
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  FileSignature,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  Shield,
  Key,
  UserCheck,
  FileCheck,
  Hash,
  Send,
  Info,
  BookOpen,
  Calculator,
  Cpu,
  Globe,
  Mail,
  FileText,
  ArrowRightLeft,
  QrCode,
  Zap,
  ArrowRight,
  ShieldCheck,
  Fingerprint,
  ShieldAlert
} from "lucide-react";

type TheoryConcept = {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  details: string[];
};

type ComparisonItem = {
  feature: string;
  digitalSignature: string;
  handwritten: string;
  advantage: "digital" | "handwritten";
};

export default function DigitalSignatureModuleTheory() {
  const [activeSection, setActiveSection] = useState<string>("basics");

  const theoryConcepts: TheoryConcept[] = [
    {
      id: 1,
      title: "What are Digital Signatures?",
      description: "Cryptographic proof of authenticity and integrity",
      icon: <FileSignature className="w-6 h-6" />,
      details: [
        "Mathematical scheme for verifying the authenticity of digital messages or documents",
        "Provides proof that the message was created by a known sender",
        "Ensures the message was not altered in transit",
        "The digital equivalent of a handwritten signature or stamped seal"
      ]
    },
    {
      id: 2,
      title: "Core Components",
      description: "Key elements that make digital signatures work",
      icon: <Key className="w-6 h-6" />,
      details: [
        "Public-Private Key Pair: Mathematically linked keys for signing and verification",
        "Hash Function: Creates unique fingerprint (SHA-256, SHA-384, SHA-512)",
        "Signing Algorithm: RSA, DSA, ECDSA for encrypting the hash",
        "Verification Process: Decrypt and compare to validate authenticity"
      ]
    },
    {
      id: 3,
      title: "How They Work",
      description: "Step-by-step cryptographic process",
      icon: <ShieldCheck className="w-6 h-6" />,
      details: [
        "1. Sender hashes the message using a cryptographic hash function",
        "2. Sender encrypts the hash with their private key (creates signature)",
        "3. Sender transmits message + digital signature to receiver",
        "4. Receiver decrypts signature using sender's public key to get hash",
        "5. Receiver computes hash of received message",
        "6. If hashes match, signature is valid and message is authentic"
      ]
    },
    {
      id: 4,
      title: "Security Properties",
      description: "What digital signatures guarantee",
      icon: <Shield className="w-6 h-6" />,
      details: [
        "Authentication: Verifies the identity of the signer",
        "Integrity: Detects any modification of the signed content",
        "Non-repudiation: Signer cannot deny having signed the document",
        "Freshness: Timestamp can prove when signature was created"
      ]
    },
    {
      id: 5,
      title: "Common Algorithms",
      description: "Mathematical foundations used",
      icon: <Calculator className="w-6 h-6" />,
      details: [
        "RSA (Rivest-Shamir-Adleman): Most widely used, based on factoring large numbers",
        "DSA (Digital Signature Algorithm): US government standard, based on discrete logarithms",
        "ECDSA (Elliptic Curve DSA): More efficient, smaller keys, used in cryptocurrencies",
        "EdDSA (Edwards-curve DSA): Modern, efficient, used in modern protocols"
      ]
    },
    {
      id: 6,
      title: "Real-World Applications",
      description: "Where digital signatures are used today",
      icon: <Globe className="w-6 h-6" />,
      details: [
        "Software Distribution: Verifying OS updates and applications",
        "Email Security: S/MIME and PGP for signed emails",
        "Digital Contracts: Legally binding electronic signatures",
        "Blockchain: Cryptocurrency transaction signing",
        "Document Workflow: Secure approval chains in business"
      ]
    }
  ];

  const comparisonData: ComparisonItem[] = [
    {
      feature: "Authentication",
      digitalSignature: "Mathematical proof of identity",
      handwritten: "Visual inspection required",
      advantage: "digital"
    },
    {
      feature: "Integrity Check",
      digitalSignature: "Automatic detection of tampering",
      handwritten: "Cannot detect document changes",
      advantage: "digital"
    },
    {
      feature: "Non-repudiation",
      digitalSignature: "Cannot deny signing",
      handwritten: "Can deny or claim forgery",
      advantage: "digital"
    },
    {
      feature: "Verification Speed",
      digitalSignature: "Instant (milliseconds)",
      handwritten: "Slow (manual inspection)",
      advantage: "digital"
    },
    {
      feature: "Duplication",
      digitalSignature: "Perfect copies possible",
      handwritten: "Each copy varies slightly",
      advantage: "digital"
    },
    {
      feature: "Physical Presence",
      digitalSignature: "Not required",
      handwritten: "Often required",
      advantage: "handwritten"
    }
  ];

  const useCases = [
    {
      title: "Software Updates",
      description: "Windows, macOS, Android verify updates before installation",
      icon: <Cpu className="w-5 h-5" />,
      benefit: "Prevents malware injection"
    },
    {
      title: "Email Security",
      description: "S/MIME signs emails to prove sender identity",
      icon: <Mail className="w-5 h-5" />,
      benefit: "Prevents phishing attacks"
    },
    {
      title: "Legal Documents",
      description: "Digital contracts with legally binding signatures",
      icon: <FileText className="w-5 h-5" />,
      benefit: "Saves time and paper"
    },
    {
      title: "Banking",
      description: "Secure online transactions and approvals",
      icon: <Calculator className="w-5 h-5" />,
      benefit: "Prevents fraud"
    },
    {
      title: "Blockchain",
      description: "Cryptocurrency transactions signed with private keys",
      icon: <QrCode className="w-5 h-5" />,
      benefit: "Decentralized trust"
    },
    {
      title: "Government",
      description: "Digital IDs, passports, and official documents",
      icon: <ShieldCheck className="w-5 h-5" />,
      benefit: "Reduces forgery"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <FileSignature className="w-8 h-8" />
              <h1 className="text-2xl font-bold">Digital Signatures: Complete Theory Guide</h1>
            </div>
            <p className="text-purple-200">
              Learn how digital signatures provide authentication, integrity, and non-repudiation
            </p>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            Theory Mode
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Navigation & Key Concepts */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Quick Navigation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant={activeSection === "basics" ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setActiveSection("basics")}
              >
                <Info className="w-4 h-4 mr-2" />
                Basics & Concepts
              </Button>
              <Button 
                variant={activeSection === "comparison" ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setActiveSection("comparison")}
              >
                <ArrowRightLeft className="w-4 h-4 mr-2" />
                Comparison
              </Button>
              <Button 
                variant={activeSection === "applications" ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setActiveSection("applications")}
              >
                <Globe className="w-4 h-4 mr-2" />
                Applications
              </Button>
              <Button 
                variant={activeSection === "security" ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setActiveSection("security")}
              >
                <Shield className="w-4 h-4 mr-2" />
                Security Properties
              </Button>
            </CardContent>
          </Card>

          {/* Key Takeaways */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Key Takeaways
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-sm">Provides mathematical proof of authenticity</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-sm">Detects any modification of signed content</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-sm">Prevents signer from denying their signature</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-sm">Essential for secure digital communications</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mathematical Foundation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Mathematical Basis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <div className="font-medium text-sm mb-1">Public-Key Cryptography</div>
                  <div className="text-xs text-gray-600">
                    Asymmetric keys enable secure signing
                  </div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="font-medium text-sm mb-1">Hash Functions</div>
                  <div className="text-xs text-gray-600">
                    SHA-256 creates unique message fingerprints
                  </div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="font-medium text-sm mb-1">Digital Signature Algorithms</div>
                  <div className="text-xs text-gray-600">
                    RSA, DSA, ECDSA for encryption/decryption
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle Column: Theory Content */}
        <div className="lg:col-span-2">
          {activeSection === "basics" && (
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileSignature className="w-6 h-6" />
                  Core Concepts of Digital Signatures
                </CardTitle>
                <CardDescription>
                  Understanding the fundamental principles behind digital signatures
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Visual Explanation */}
                <div className="p-6 border-2 border-primary rounded-lg bg-primary/5">
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center mx-auto mb-2">
                        <UserCheck className="w-6 h-6 text-white" />
                      </div>
                      <div className="font-bold">Signer</div>
                      <div className="text-xs">Uses Private Key</div>
                    </div>
                    
                    <ArrowRight className="w-6 h-6" />
                    
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center mx-auto mb-2">
                        <Send className="w-6 h-6 text-white" />
                      </div>
                      <div className="font-bold">Transmission</div>
                      <div className="text-xs">Message + Signature</div>
                    </div>
                    
                    <ArrowRight className="w-6 h-6" />
                    
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-2">
                        <ShieldCheck className="w-6 h-6 text-white" />
                      </div>
                      <div className="font-bold">Verifier</div>
                      <div className="text-xs">Uses Public Key</div>
                    </div>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg bg-white dark:bg-gray-800">
                    <div className="text-sm font-mono">
                      Signature = Encrypt(Hash(message), Private_Key)
                    </div>
                    <div className="text-xs text-gray-600 mt-2">
                      Mathematical representation of digital signing
                    </div>
                  </div>
                </div>

                {/* Theory Concepts */}
                <div className="space-y-4">
                  {theoryConcepts.map((concept) => (
                    <div key={concept.id} className="border rounded-lg overflow-hidden">
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                            {concept.icon}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{concept.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {concept.description}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <ul className="space-y-2">
                          {concept.details.map((detail, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <div className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400"></div>
                              </div>
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === "comparison" && (
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRightLeft className="w-6 h-6" />
                  Digital vs Handwritten Signatures
                </CardTitle>
                <CardDescription>
                  Comparing traditional and digital signature methods
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-4 font-semibold">Feature</th>
                          <th className="text-left p-4 font-semibold text-blue-600">Digital Signature</th>
                          <th className="text-left p-4 font-semibold text-gray-600">Handwritten Signature</th>
                          <th className="text-left p-4 font-semibold">Advantage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {comparisonData.map((item, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="p-4 font-medium">{item.feature}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span>{item.digitalSignature}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                {item.advantage === "digital" ? (
                                  <XCircle className="w-4 h-4 text-red-600" />
                                ) : (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                )}
                                <span>{item.handwritten}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge variant={item.advantage === "digital" ? "default" : "secondary"}>
                                {item.advantage === "digital" ? "Digital" : "Handwritten"}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                      <Shield className="w-4 h-4 text-blue-600" />
                      <AlertTitle>Digital Signature Advantages</AlertTitle>
                      <AlertDescription className="text-sm">
                        • Mathematical proof of authenticity<br/>
                        • Automated verification<br/>
                        • Tamper-evident by design<br/>
                        • Perfect for digital workflows<br/>
                        • Global scalability
                      </AlertDescription>
                    </Alert>
                    
                    <Alert className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      <FileSignature className="w-4 h-4 text-gray-600" />
                      <AlertTitle>Handwritten Limitations</AlertTitle>
                      <AlertDescription className="text-sm">
                        • Susceptible to forgery<br/>
                        • Cannot detect document changes<br/>
                        • Manual verification required<br/>
                        • Not scalable globally<br/>
                        • Physical presence often needed
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === "applications" && (
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-6 h-6" />
                  Real-World Applications
                </CardTitle>
                <CardDescription>
                  Where digital signatures are used in modern technology
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {useCases.map((useCase, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                          {useCase.icon}
                        </div>
                        <div>
                          <h4 className="font-bold">{useCase.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {useCase.description}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                        <span className="text-sm font-medium text-green-700 dark:text-green-400">
                          Key Benefit: {useCase.benefit}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Alert className="mt-6 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
                  <Info className="w-4 h-4 text-purple-600" />
                  <AlertDescription className="text-sm">
                    <strong>Industry Adoption:</strong> Digital signatures are now legally equivalent 
                    to handwritten signatures in most countries under laws like ESIGN Act (USA), 
                    eIDAS (EU), and IT Act (India).
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}

          {activeSection === "security" && (
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-6 h-6" />
                  Security Properties & Algorithms
                </CardTitle>
                <CardDescription>
                  Understanding the security guarantees and underlying mathematics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Security Properties */}
                <div className="space-y-4">
                  <h3 className="font-bold text-lg">Security Guarantees</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20">
                      <div className="flex items-center gap-2 mb-2">
                        <UserCheck className="w-5 h-5 text-blue-600" />
                        <h4 className="font-bold">Authentication</h4>
                      </div>
                      <p className="text-sm">
                        Verifies the identity of the signer. Only the private key holder 
                        could have created the signature.
                      </p>
                    </div>
                    
                    <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-900/20">
                      <div className="flex items-center gap-2 mb-2">
                        <FileCheck className="w-5 h-5 text-green-600" />
                        <h4 className="font-bold">Integrity</h4>
                      </div>
                      <p className="text-sm">
                        Ensures the message hasn't been altered. Any change to the 
                        content invalidates the signature.
                      </p>
                    </div>
                    
                    <div className="p-4 border rounded-lg bg-purple-50 dark:bg-purple-900/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Fingerprint className="w-5 h-5 text-purple-600" />
                        <h4 className="font-bold">Non-repudiation</h4>
                      </div>
                      <p className="text-sm">
                        Prevents the signer from denying they signed the document. 
                        Creates legal evidence of signing.
                      </p>
                    </div>
                    
                    <div className="p-4 border rounded-lg bg-amber-50 dark:bg-amber-900/20">
                      <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck className="w-5 h-5 text-amber-600" />
                        <h4 className="font-bold">Freshness</h4>
                      </div>
                      <p className="text-sm">
                        Timestamps prove when the signature was created, preventing 
                        replay attacks.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Algorithms */}
                <div className="space-y-4">
                  <h3 className="font-bold text-lg">Common Algorithms</h3>
                  <div className="space-y-3">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                          <Calculator className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold">RSA (Rivest-Shamir-Adleman)</h4>
                          <p className="text-sm text-gray-600">
                            Most widely used, based on factoring large numbers
                          </p>
                        </div>
                      </div>
                      <div className="text-xs font-mono bg-gray-50 dark:bg-gray-800 p-2 rounded">
                        Signature = Hash(message)^d mod n
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                          <Calculator className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold">ECDSA (Elliptic Curve)</h4>
                          <p className="text-sm text-gray-600">
                            More efficient, smaller keys, used in cryptocurrencies
                          </p>
                        </div>
                      </div>
                      <div className="text-xs font-mono bg-gray-50 dark:bg-gray-800 p-2 rounded">
                        Signature = (r, s) where r = k×G, s = k⁻¹(Hash + d×r)
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                          <Calculator className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold">EdDSA (Edwards-curve)</h4>
                          <p className="text-sm text-gray-600">
                            Modern, highly efficient, used in modern protocols
                          </p>
                        </div>
                      </div>
                      <div className="text-xs font-mono bg-gray-50 dark:bg-gray-800 p-2 rounded">
                        Signature = (R, S) where R = r×B, S = r + Hash(R||A||M)×a
                      </div>
                    </div>
                  </div>
                </div>

                <Alert className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                  <ShieldAlert className="w-4 h-4 text-red-600" />
                  <AlertTitle>Security Considerations</AlertTitle>
                  <AlertDescription className="text-sm">
                    • Private keys must be kept absolutely secret<br/>
                    • Use sufficiently large key sizes (≥2048-bit RSA, ≥256-bit ECC)<br/>
                    • Implement proper key management and storage<br/>
                    • Use modern, vetted cryptographic libraries<br/>
                    • Regularly update and rotate keys as needed
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Summary Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Theory Summary
          </CardTitle>
          <CardDescription>
            Essential knowledge about digital signatures
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-bold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                What They Provide
              </h4>
              <ul className="space-y-1 text-sm">
                <li>• Authentication of signer identity</li>
                <li>• Integrity of signed content</li>
                <li>• Non-repudiation evidence</li>
                <li>• Freshness with timestamps</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-bold flex items-center gap-2">
                <Key className="w-4 h-4 text-blue-600" />
                How They Work
              </h4>
              <ul className="space-y-1 text-sm">
                <li>• Public-private key pairs</li>
                <li>• Cryptographic hash functions</li>
                <li>• Asymmetric encryption</li>
                <li>• Hash comparison verification</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-bold flex items-center gap-2">
                <Globe className="w-4 h-4 text-purple-600" />
                Where Used
              </h4>
              <ul className="space-y-1 text-sm">
                <li>• Software distribution</li>
                <li>• Email security</li>
                <li>• Digital contracts</li>
                <li>• Blockchain transactions</li>
              </ul>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <Alert>
            <Zap className="w-4 h-4" />
            <AlertDescription>
              <strong>Key Insight:</strong> Digital signatures transform the problem of trust 
              in digital communications from a social/legal challenge into a mathematical one, 
              enabling secure interactions between parties who may never meet in person.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}