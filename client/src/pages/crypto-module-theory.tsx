// File: cryptography-module-theory.tsx
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
  Lock,
  Unlock,
  Key,
  Shield,
  Hash,
  FileLock,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Info,
  BookOpen,
  Globe,
  Cpu,
  Calculator,
  Clock,
  Users,
  Zap,
  ArrowRight,
  MessageSquare,
  FileText,
  Fingerprint,
  Bell,
  Server,
  Smartphone,
  Mail,
  Database,
  ShieldCheck,
  AlertTriangle,
  Settings
} from "lucide-react";

type TheoryConcept = {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  details: string[];
  category: "basics" | "symmetric" | "asymmetric" | "modern";
};

type Algorithm = {
  name: string;
  type: "Symmetric" | "Asymmetric" | "Hash" | "Hybrid";
  keySize: string;
  useCase: string;
  strength: string;
  icon: React.ReactNode;
};

type SecurityProperty = {
  name: string;
  description: string;
  icon: React.ReactNode;
  examples: string[];
};

export default function CryptographyModuleTheory() {
  const [activeSection, setActiveSection] = useState<string>("basics");
  const [showDetails, setShowDetails] = useState<Record<string, boolean>>({});

  const theoryConcepts: TheoryConcept[] = [
    {
      id: 1,
      title: "What is Cryptography?",
      description: "The art and science of securing communication",
      icon: <Lock className="w-6 h-6" />,
      details: [
        "Practice and study of techniques for secure communication in the presence of adversaries",
        "Transforms readable data (plaintext) into unreadable form (ciphertext)",
        "Ensures confidentiality, integrity, authentication, and non-repudiation",
        "Foundational to modern information security and digital privacy"
      ],
      category: "basics"
    },
    {
      id: 2,
      title: "Core Principles",
      description: "Fundamental concepts of cryptographic systems",
      icon: <ShieldCheck className="w-6 h-6" />,
      details: [
        "Confidentiality: Only authorized parties can read the information",
        "Integrity: Information cannot be altered without detection",
        "Authentication: Verifying the identity of parties involved",
        "Non-repudiation: Parties cannot deny their involvement",
        "Availability: Authorized parties can access information when needed"
      ],
      category: "basics"
    },
    {
      id: 3,
      title: "Symmetric Cryptography",
      description: "Same key for encryption and decryption",
      icon: <Key className="w-6 h-6" />,
      details: [
        "Uses identical secret key for both encryption and decryption",
        "Fast and efficient for bulk data encryption",
        "Key distribution is the main challenge",
        "Examples: AES, DES, 3DES, ChaCha20",
        "Used in: SSL/TLS, disk encryption, file encryption"
      ],
      category: "symmetric"
    },
    {
      id: 4,
      title: "Asymmetric Cryptography",
      description: "Different keys for encryption and decryption",
      icon: <Lock className="w-6 h-6" />,
      details: [
        "Uses mathematically related key pairs: public and private",
        "Public key encrypts, private key decrypts (or vice versa)",
        "Solves key distribution problem but slower than symmetric",
        "Examples: RSA, ECC, ElGamal, Diffie-Hellman",
        "Used in: Digital signatures, key exchange, SSL/TLS"
      ],
      category: "asymmetric"
    },
    {
      id: 5,
      title: "Hash Functions",
      description: "One-way mathematical functions",
      icon: <Hash className="w-6 h-6" />,
      details: [
        "Takes input of any size and produces fixed-size output (hash)",
        "Deterministic: Same input always produces same hash",
        "One-way: Cannot derive original input from hash",
        "Collision resistant: Hard to find two inputs with same hash",
        "Examples: SHA-256, SHA-3, BLAKE2, MD5 (insecure)"
      ],
      category: "modern"
    },
    {
      id: 6,
      title: "Modern Applications",
      description: "Contemporary uses of cryptography",
      icon: <Globe className="w-6 h-6" />,
      details: [
        "SSL/TLS: Secures web traffic (HTTPS)",
        "Blockchain: Cryptocurrency transactions and smart contracts",
        "End-to-end Encryption: Secure messaging (Signal, WhatsApp)",
        "Password Hashing: Secure password storage",
        "Digital Signatures: Document authenticity and integrity"
      ],
      category: "modern"
    }
  ];

  const algorithms: Algorithm[] = [
    {
      name: "AES (Advanced Encryption Standard)",
      type: "Symmetric",
      keySize: "128, 192, or 256 bits",
      useCase: "Data encryption, SSL/TLS, disk encryption",
      strength: "Very Strong",
      icon: <Lock className="w-5 h-5" />
    },
    {
      name: "RSA (Rivest-Shamir-Adleman)",
      type: "Asymmetric",
      keySize: "2048+ bits (recommended)",
      useCase: "Digital signatures, key exchange",
      strength: "Strong",
      icon: <Calculator className="w-5 h-5" />
    },
    {
      name: "ECC (Elliptic Curve Cryptography)",
      type: "Asymmetric",
      keySize: "256-521 bits",
      useCase: "Mobile devices, blockchain, constrained environments",
      strength: "Very Strong",
      icon: <Settings className="w-5 h-5" />
    },
    {
      name: "SHA-256",
      type: "Hash",
      keySize: "256-bit output",
      useCase: "Data integrity, blockchain, password hashing",
      strength: "Very Strong",
      icon: <Hash className="w-5 h-5" />
    },
    {
      name: "ChaCha20-Poly1305",
      type: "Symmetric",
      keySize: "256 bits",
      useCase: "High-speed encryption, mobile devices",
      strength: "Very Strong",
      icon: <Cpu className="w-5 h-5" />
    },
    {
      name: "Diffie-Hellman",
      type: "Asymmetric",
      keySize: "2048+ bits",
      useCase: "Key exchange without prior shared secret",
      strength: "Strong",
      icon: <Key className="w-5 h-5" />
    }
  ];

  const securityProperties: SecurityProperty[] = [
    {
      name: "Confidentiality",
      description: "Information kept secret from unauthorized parties",
      icon: <EyeOff className="w-5 h-5" />,
      examples: ["Encrypted emails", "Secure messaging", "VPN tunnels"]
    },
    {
      name: "Integrity",
      description: "Data cannot be altered without detection",
      icon: <CheckCircle className="w-5 h-5" />,
      examples: ["Digital signatures", "Message authentication codes", "Hash verification"]
    },
    {
      name: "Authentication",
      description: "Verifying the identity of communicating parties",
      icon: <Fingerprint className="w-5 h-5" />,
      examples: ["Digital certificates", "Login systems", "API keys"]
    },
    {
      name: "Non-repudiation",
      description: "Cannot deny sending or receiving information",
      icon: <FileText className="w-5 h-5" />,
      examples: ["Digital signatures", "Audit logs", "Blockchain transactions"]
    },
    {
      name: "Forward Secrecy",
      description: "Compromised keys don't affect past communications",
      icon: <Clock className="w-5 h-5" />,
      examples: ["Perfect Forward Secrecy in TLS", "Ephemeral keys", "Signal protocol"]
    }
  ];

  const cryptographicAttacks = [
    {
      attack: "Brute Force",
      description: "Trying every possible key until correct one found",
      defense: ["Strong key lengths", "Rate limiting", "Account lockout"],
      icon: <Cpu className="w-4 h-4" />
    },
    {
      attack: "Man-in-the-Middle",
      description: "Intercepting and altering communication between parties",
      defense: ["Certificate validation", "Key pinning", "Mutual authentication"],
      icon: <Server className="w-4 h-4" />
    },
    {
      attack: "Side-channel",
      description: "Exploiting physical characteristics of implementation",
      defense: ["Constant-time algorithms", "Hardware security", "Code obfuscation"],
      icon: <Bell className="w-4 h-4" />
    },
    {
      attack: "Cryptanalysis",
      description: "Mathematical analysis to break cryptographic systems",
      defense: ["Strong algorithms", "Regular updates", "Key rotation"],
      icon: <Calculator className="w-4 h-4" />
    },
    {
      attack: "Social Engineering",
      description: "Manipulating people to obtain cryptographic keys",
      defense: ["Security training", "Multi-factor authentication", "Access controls"],
      icon: <Users className="w-4 h-4" />
    }
  ];

  const historicalMilestones = [
    {
      era: "Ancient (Pre-1900)",
      innovations: ["Caesar cipher", "Vigenère cipher", "Enigma machine"],
      impact: "Basic substitution and transposition ciphers"
    },
    {
      era: "Modern (1900-1970)",
      innovations: ["One-time pad", "DES", "Public-key concept"],
      impact: "Foundations of modern cryptography"
    },
    {
      era: "Computer Age (1970-2000)",
      innovations: ["RSA", "AES", "SSL/TLS", "PGP"],
      impact: "Digital cryptography for internet security"
    },
    {
      era: "Contemporary (2000-Present)",
      innovations: ["ECC", "Post-quantum crypto", "Blockchain", "Homomorphic"],
      impact: "Advanced cryptographic protocols and quantum resistance"
    }
  ];

  const useCases = [
    {
      application: "Web Security (HTTPS)",
      description: "Encrypts web traffic between browser and server",
      technologies: ["SSL/TLS", "RSA/ECC", "AES", "SHA-256"],
      icon: <Globe className="w-4 h-4" />
    },
    {
      application: "Secure Messaging",
      description: "End-to-end encrypted communication",
      technologies: ["Signal protocol", "Double Ratchet", "Curve25519", "AES-256"],
      icon: <MessageSquare className="w-4 h-4" />
    },
    {
      application: "Digital Payments",
      description: "Secure financial transactions",
      technologies: ["EMV chips", "Tokenization", "3D Secure", "Blockchain"],
      icon: <Calculator className="w-4 h-4" />
    },
    {
      application: "Data Protection",
      description: "Encrypting data at rest and in transit",
      technologies: ["Full-disk encryption", "Database encryption", "File encryption", "Vaults"],
      icon: <Database className="w-4 h-4" />
    },
    {
      application: "Authentication",
      description: "Verifying user identities",
      technologies: ["Password hashing", "Multi-factor auth", "Biometrics", "Digital certificates"],
      icon: <Fingerprint className="w-4 h-4" />
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Lock className="w-8 h-8" />
              <h1 className="text-2xl font-bold">Cryptography: Complete Theory Guide</h1>
            </div>
            <p className="text-purple-200">
              The science of secure communication in the presence of adversaries
            </p>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            Theory Mode
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Navigation */}
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
                Basics & Principles
              </Button>
              <Button 
                variant={activeSection === "algorithms" ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setActiveSection("algorithms")}
              >
                <Settings className="w-4 h-4 mr-2" />
                Algorithms & Types
              </Button>
              <Button 
                variant={activeSection === "security" ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setActiveSection("security")}
              >
                <ShieldCheck className="w-4 h-4 mr-2" />
                Security Properties
              </Button>
              <Button 
                variant={activeSection === "attacks" ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setActiveSection("attacks")}
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Attacks & Defenses
              </Button>
              <Button 
                variant={activeSection === "applications" ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setActiveSection("applications")}
              >
                <Globe className="w-4 h-4 mr-2" />
                Real-World Applications
              </Button>
            </CardContent>
          </Card>

          {/* Key Facts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Key Facts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-2 border rounded">
                  <div className="text-xs text-gray-600">AES Encryption</div>
                  <div className="font-medium text-sm">Used by US Government for top secret data</div>
                </div>
                <div className="p-2 border rounded">
                  <div className="text-xs text-gray-600">SSL/TLS</div>
                  <div className="font-medium text-sm">Protects 90% of web traffic</div>
                </div>
                <div className="p-2 border rounded">
                  <div className="text-xs text-gray-600">Quantum Threat</div>
                  <div className="font-medium text-sm">RSA 2048 could be broken by 2030 with quantum computers</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Evolution Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Cryptographic Evolution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                  <span className="text-xs font-medium">Ancient</span>
                  <Badge variant="outline">Substitution</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  <span className="text-xs font-medium">Modern</span>
                  <Badge variant="secondary">DES/RSA</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                  <span className="text-xs font-medium">Internet</span>
                  <Badge variant="default">AES/SSL</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                  <span className="text-xs font-medium">Quantum Era</span>
                  <Badge variant="destructive">Post-Quantum</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle Column: Content */}
        <div className="lg:col-span-2">
          {activeSection === "basics" && (
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-6 h-6" />
                  Cryptography Fundamentals
                </CardTitle>
                <CardDescription>
                  Core concepts and principles of secure communication
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Visual Concept */}
                <div className="p-6 border-2 border-primary rounded-lg bg-primary/5">
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center mx-auto mb-2">
                        <MessageSquare className="w-6 h-6 text-white" />
                      </div>
                      <div className="font-bold">Plaintext</div>
                      <div className="text-xs">Original Message</div>
                    </div>
                    
                    <ArrowRight className="w-6 h-6" />
                    
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center mx-auto mb-2">
                        <Lock className="w-6 h-6 text-white" />
                      </div>
                      <div className="font-bold">Encryption</div>
                      <div className="text-xs">Algorithm + Key</div>
                    </div>
                    
                    <ArrowRight className="w-6 h-6" />
                    
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-2">
                        <FileLock className="w-6 h-6 text-white" />
                      </div>
                      <div className="font-bold">Ciphertext</div>
                      <div className="text-xs">Encrypted Message</div>
                    </div>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg bg-white dark:bg-gray-800">
                    <div className="text-sm font-mono">
                      C = E(K, P) where C = ciphertext, E = encryption, K = key, P = plaintext
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      Fundamental encryption equation
                    </div>
                  </div>
                </div>

                {/* Theory Concepts */}
                <div className="space-y-4">
                  {theoryConcepts
                    .filter(concept => concept.category === "basics")
                    .map((concept) => (
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

                {/* Symmetric vs Asymmetric */}
                <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <h4 className="font-bold mb-3 flex items-center gap-2">
                    <Key className="w-5 h-5 text-blue-600" />
                    Symmetric vs Asymmetric Comparison
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-3 bg-white dark:bg-gray-800 rounded">
                      <div className="font-bold mb-2">Symmetric Cryptography</div>
                      <div className="text-sm space-y-1">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Fast and efficient</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-600" />
                          <span>Key distribution challenge</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Good for bulk data</span>
                        </div>
                        <div className="text-xs text-gray-600 mt-2">
                          Examples: AES, ChaCha20, DES
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-white dark:bg-gray-800 rounded">
                      <div className="font-bold mb-2">Asymmetric Cryptography</div>
                      <div className="text-sm space-y-1">
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-600" />
                          <span>Slower computation</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>No key distribution issue</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Enables digital signatures</span>
                        </div>
                        <div className="text-xs text-gray-600 mt-2">
                          Examples: RSA, ECC, Diffie-Hellman
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === "algorithms" && (
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-6 h-6" />
                  Cryptographic Algorithms
                </CardTitle>
                <CardDescription>
                  Different types of cryptographic algorithms and their uses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Algorithm Cards */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {algorithms.map((algorithm, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                              {algorithm.icon}
                            </div>
                            <div>
                              <h4 className="font-bold">{algorithm.name}</h4>
                              <Badge variant="outline">{algorithm.type}</Badge>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setShowDetails({
                              ...showDetails,
                              [algorithm.name]: !showDetails[algorithm.name]
                            })}
                          >
                            {showDetails[algorithm.name] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                        
                        {showDetails[algorithm.name] && (
                          <div className="mb-3 space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Key Size:</span>
                              <span className="font-medium">{algorithm.keySize}</span>
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-600">Primary Use: </span>
                              {algorithm.useCase}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="text-sm">
                            <span className="text-gray-600">Security: </span>
                            <span className="font-medium">{algorithm.strength}</span>
                          </div>
                          <Badge variant={
                            algorithm.strength.includes("Very") ? "default" :
                            algorithm.strength.includes("Strong") ? "secondary" : "destructive"
                          }>
                            {algorithm.strength}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Theory Concepts */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {theoryConcepts
                      .filter(concept => ["symmetric", "asymmetric", "modern"].includes(concept.category))
                      .map((concept) => (
                      <div key={concept.id} className="border rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                            {concept.icon}
                          </div>
                          <div>
                            <h4 className="font-bold">{concept.title}</h4>
                            <p className="text-sm text-gray-600">{concept.description}</p>
                          </div>
                        </div>
                        <ul className="space-y-1 text-sm">
                          {concept.details.slice(0, 3).map((detail, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400"></div>
                              </div>
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Hybrid Cryptography */}
                  <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-900/20">
                    <h4 className="font-bold mb-3 flex items-center gap-2">
                      <Settings className="w-5 h-5 text-green-600" />
                      Hybrid Cryptosystems
                    </h4>
                    <div className="text-sm space-y-3">
                      <div className="p-3 bg-white dark:bg-gray-800 rounded">
                        <div className="font-medium mb-1">Best of Both Worlds</div>
                        <p>Combines symmetric encryption speed with asymmetric key distribution</p>
                      </div>
                      <div className="grid md:grid-cols-3 gap-2 text-xs">
                        <div className="p-2 bg-white dark:bg-gray-800 rounded text-center">
                          <div className="font-bold">1. Key Exchange</div>
                          <div>Asymmetric crypto establishes session key</div>
                        </div>
                        <div className="p-2 bg-white dark:bg-gray-800 rounded text-center">
                          <div className="font-bold">2. Bulk Encryption</div>
                          <div>Symmetric crypto encrypts actual data</div>
                        </div>
                        <div className="p-2 bg-white dark:bg-gray-800 rounded text-center">
                          <div className="font-bold">3. Authentication</div>
                          <div>Digital signatures verify integrity</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600">
                        Used in: SSL/TLS, PGP, Signal protocol, VPNs
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === "security" && (
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6" />
                  Security Properties & Protocols
                </CardTitle>
                <CardDescription>
                  What cryptography protects and how it achieves security
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Security Properties */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {securityProperties.map((property, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                            {property.icon}
                          </div>
                          <div>
                            <h4 className="font-bold">{property.name}</h4>
                            <p className="text-sm text-gray-600">{property.description}</p>
                          </div>
                        </div>
                        
                        <div className="mt-2">
                          <div className="text-xs font-medium mb-1">Examples:</div>
                          <div className="flex flex-wrap gap-1">
                            {property.examples.map((example, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {example}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Historical Milestones */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-lg">Historical Evolution</h4>
                    <div className="space-y-3">
                      {historicalMilestones.map((era, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold">{era.era}</h5>
                            <Badge variant="outline">Era {index + 1}</Badge>
                          </div>
                          <div className="mb-2">
                            <div className="text-xs font-medium mb-1">Key Innovations:</div>
                            <div className="flex flex-wrap gap-1">
                              {era.innovations.map((innovation, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {innovation}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">{era.impact}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Modern Protocols */}
                  <div className="p-4 border rounded-lg bg-purple-50 dark:bg-purple-900/20">
                    <h4 className="font-bold mb-3">Modern Cryptographic Protocols</h4>
                    <div className="grid md:grid-cols-2 gap-3 text-sm">
                      <div className="p-3 bg-white dark:bg-gray-800 rounded">
                        <div className="font-bold mb-1">TLS 1.3</div>
                        <p>Latest web security protocol with perfect forward secrecy</p>
                      </div>
                      <div className="p-3 bg-white dark:bg-gray-800 rounded">
                        <div className="font-bold mb-1">Signal Protocol</div>
                        <p>End-to-end encryption for messaging with double ratchet</p>
                      </div>
                      <div className="p-3 bg-white dark:bg-gray-800 rounded">
                        <div className="font-bold mb-1">WireGuard</div>
                        <p>Modern VPN protocol with minimal codebase and strong crypto</p>
                      </div>
                      <div className="p-3 bg-white dark:bg-gray-800 rounded">
                        <div className="font-bold mb-1">ZKP (Zero-Knowledge Proofs)</div>
                        <p>Prove knowledge without revealing the knowledge itself</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === "attacks" && (
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6" />
                  Cryptographic Attacks & Defenses
                </CardTitle>
                <CardDescription>
                  How cryptographic systems can be broken and how to protect them
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Attacks */}
                  <div className="space-y-4">
                    {cryptographicAttacks.map((attack, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          {attack.icon}
                          <div>
                            <h4 className="font-bold text-lg">{attack.attack}</h4>
                            <p className="text-sm text-gray-600">{attack.description}</p>
                          </div>
                        </div>
                        
                        <div className="mt-2">
                          <div className="text-xs font-medium mb-1">Defenses:</div>
                          <div className="flex flex-wrap gap-1">
                            {attack.defense.map((def, i) => (
                              <Badge key={i} variant="default" className="text-xs">
                                {def}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Quantum Threat */}
                  <div className="p-4 border rounded-lg bg-red-50 dark:bg-red-900/20">
                    <div className="flex items-center gap-3 mb-3">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <h4 className="font-bold text-lg">Quantum Computing Threat</h4>
                    </div>
                    <div className="text-sm space-y-2">
                      <div className="p-3 bg-white dark:bg-gray-800 rounded">
                        <div className="font-bold mb-1">Shor's Algorithm</div>
                        <p>Can break RSA, ECC, and other public-key cryptosystems in polynomial time</p>
                      </div>
                      <div className="p-3 bg-white dark:bg-gray-800 rounded">
                        <div className="font-bold mb-1">Grover's Algorithm</div>
                        <p>Reduces brute-force search time, weakening symmetric encryption</p>
                      </div>
                      <div className="mt-3">
                        <div className="text-xs font-medium mb-1">Post-Quantum Cryptography:</div>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="secondary">Lattice-based</Badge>
                          <Badge variant="secondary">Hash-based</Badge>
                          <Badge variant="secondary">Code-based</Badge>
                          <Badge variant="secondary">Multivariate</Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Best Practices */}
                  <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-900/20">
                    <h4 className="font-bold mb-3 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-green-600" />
                      Cryptographic Best Practices
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>Use proven, standardized algorithms (AES-256, SHA-256, RSA-2048+)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>Implement proper key management and rotation policies</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>Use cryptographically secure random number generators</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>Implement defense in depth with multiple security layers</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>Regular security audits and penetration testing</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>Stay updated with cryptographic advancements and vulnerabilities</span>
                      </div>
                    </div>
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
                  How cryptography secures our digital world
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Use Cases */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {useCases.map((app, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          {app.icon}
                          <div>
                            <h4 className="font-bold">{app.application}</h4>
                            <p className="text-sm text-gray-600">{app.description}</p>
                          </div>
                        </div>
                        
                        <div className="mt-2">
                          <div className="text-xs font-medium mb-1">Technologies Used:</div>
                          <div className="flex flex-wrap gap-1">
                            {app.technologies.map((tech, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Future Trends */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-lg">Future of Cryptography</h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="p-4 border rounded-lg">
                        <div className="font-bold mb-2">Homomorphic Encryption</div>
                        <p className="text-sm">Perform computations on encrypted data without decrypting</p>
                        <div className="text-xs text-gray-600 mt-2">Potential: Secure cloud computing</div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="font-bold mb-2">Zero-Knowledge Proofs</div>
                        <p className="text-sm">Prove statements without revealing underlying information</p>
                        <div className="text-xs text-gray-600 mt-2">Potential: Privacy-preserving authentication</div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="font-bold mb-2">Post-Quantum Cryptography</div>
                        <p className="text-sm">Algorithms resistant to quantum computer attacks</p>
                        <div className="text-xs text-gray-600 mt-2">Potential: Future-proof security</div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="font-bold mb-2">Blockchain & DLT</div>
                        <p className="text-sm">Distributed ledger secured by cryptographic consensus</p>
                        <div className="text-xs text-gray-600 mt-2">Potential: Trustless systems</div>
                      </div>
                    </div>
                  </div>

                  {/* Impact Statement */}
                  <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <h4 className="font-bold mb-3">The Role of Cryptography in Society</h4>
                    <div className="text-sm space-y-2">
                      <div className="p-3 bg-white dark:bg-gray-800 rounded">
                        <div className="font-medium mb-1">Digital Economy</div>
                        <p>Enables secure e-commerce, online banking, and digital contracts</p>
                      </div>
                      <div className="p-3 bg-white dark:bg-gray-800 rounded">
                        <div className="font-medium mb-1">Privacy Rights</div>
                        <p>Protects personal communications, medical records, and sensitive data</p>
                      </div>
                      <div className="p-3 bg-white dark:bg-gray-800 rounded">
                        <div className="font-medium mb-1">National Security</div>
                        <p>Safeguards government communications, military operations, and critical infrastructure</p>
                      </div>
                    </div>
                  </div>
                </div>
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
            Cryptography Theory Summary
          </CardTitle>
          <CardDescription>
            Essential knowledge about secure communication systems
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-bold flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-600" />
                Core Concepts
              </h4>
              <ul className="space-y-1 text-sm">
                <li>• Symmetric (same key) vs Asymmetric (key pairs)</li>
                <li>• Confidentiality, Integrity, Authentication</li>
                <li>• Hash functions: SHA-256, SHA-3</li>
                <li>• Hybrid systems combine best of both</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-bold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                Key Algorithms
              </h4>
              <ul className="space-y-1 text-sm">
                <li>• AES: Symmetric encryption standard</li>
                <li>• RSA: Public-key encryption & signatures</li>
                <li>• ECC: Efficient public-key crypto</li>
                <li>• SHA-256: Secure hash function</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-bold flex items-center gap-2">
                <Globe className="w-4 h-4 text-purple-600" />
                Applications
              </h4>
              <ul className="space-y-1 text-sm">
                <li>• HTTPS/SSL: Secure web traffic</li>
                <li>• Digital signatures: Document authenticity</li>
                <li>• Blockchain: Cryptocurrency security</li>
                <li>• Secure messaging: End-to-end encryption</li>
              </ul>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <Alert>
            <Zap className="w-4 h-4" />
            <AlertDescription>
              <strong>Fundamental Truth:</strong> Cryptography is the foundation of all digital security. 
              Without it, there would be no secure communication, no online banking, no e-commerce, 
              and no privacy in the digital age. It transforms the internet from an open playground 
              into a secure global infrastructure.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}