// File: hashing-module-theory.tsx
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
  Hash,
  Fingerprint,
  Lock,
  Shield,
  CheckCircle,
  XCircle,
  Info,
  BookOpen,
  Cpu,
  Database,
  File,
  Users,
  Zap,
  ArrowRight,
  FileText,
  Calculator,
  AlertTriangle,
  Clock,
  Globe,
  Key,
  Eye,
  EyeOff,
  ShieldCheck,
  Settings,
  Server,
  Smartphone,
  MessageSquare
} from "lucide-react";

type TheoryConcept = {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  details: string[];
  category: "basics" | "properties" | "algorithms" | "applications";
};

type HashProperty = {
  name: string;
  description: string;
  icon: React.ReactNode;
  importance: "critical" | "high" | "medium";
  example: string;
};

type HashAlgorithm = {
  name: string;
  outputSize: string;
  security: string;
  useCase: string;
  status: "secure" | "deprecated" | "obsolete";
  icon: React.ReactNode;
};

export default function HashingModuleTheory() {
  const [activeSection, setActiveSection] = useState<string>("basics");
  const [showExamples, setShowExamples] = useState<Record<string, boolean>>({});

  const theoryConcepts: TheoryConcept[] = [
    {
      id: 1,
      title: "What are Hash Functions?",
      description: "Mathematical functions that create digital fingerprints",
      icon: <Hash className="w-6 h-6" />,
      details: [
        "Take input data of any size and produce fixed-size output (hash/digest)",
        "Deterministic: Same input always produces same hash",
        "One-way function: Cannot reverse hash to get original input",
        "Used for data integrity, password storage, digital signatures, and more",
        "Essential component of modern cryptography and security"
      ],
      category: "basics"
    },
    {
      id: 2,
      title: "Key Properties of Hash Functions",
      description: "Essential characteristics that make hashing secure",
      icon: <ShieldCheck className="w-6 h-6" />,
      details: [
        "Pre-image Resistance: Given hash, can't find original input",
        "Second Pre-image Resistance: Given input, can't find different input with same hash",
        "Collision Resistance: Hard to find any two inputs with same hash",
        "Avalanche Effect: Small input change → completely different hash",
        "Deterministic: Same input always produces identical output"
      ],
      category: "properties"
    },
    {
      id: 3,
      title: "Cryptographic Hash Functions",
      description: "Secure hash functions for cryptography",
      icon: <Lock className="w-6 h-6" />,
      details: [
        "Designed to be computationally infeasible to reverse",
        "Resistant to collision attacks and pre-image attacks",
        "Used in digital signatures, password storage, and blockchain",
        "Examples: SHA-256, SHA-3, BLAKE2, Whirlpool",
        "Must withstand all known cryptanalytic attacks"
      ],
      category: "algorithms"
    },
    {
      id: 4,
      title: "Non-Cryptographic Hash Functions",
      description: "Fast hash functions for non-security purposes",
      icon: <Cpu className="w-6 h-6" />,
      details: [
        "Optimized for speed rather than cryptographic security",
        "Used in hash tables, checksums, and data structures",
        "Vulnerable to deliberate attacks but fast for computations",
        "Examples: MurmurHash, CityHash, xxHash, FNV",
        "Common in databases, compilers, and data processing"
      ],
      category: "algorithms"
    },
    {
      id: 5,
      title: "Password Hashing",
      description: "Specialized hashing for password storage",
      icon: <Key className="w-6 h-6" />,
      details: [
        "Slow hash functions designed to resist brute-force attacks",
        "Use salt: Random data added to password before hashing",
        "Use pepper: Secret value added to password before hashing",
        "Key derivation functions: PBKDF2, bcrypt, scrypt, Argon2",
        "Prevents rainbow table attacks and password cracking"
      ],
      category: "applications"
    },
    {
      id: 6,
      title: "Real-World Applications",
      description: "Where hashing is used in technology",
      icon: <Globe className="w-6 h-6" />,
      details: [
        "Data Integrity: Verify files haven't been modified",
        "Digital Signatures: Create unique fingerprints for documents",
        "Blockchain: Link blocks and create Merkle trees",
        "Password Storage: Store hashed passwords instead of plaintext",
        "Deduplication: Identify duplicate files or data"
      ],
      category: "applications"
    }
  ];

  const hashProperties: HashProperty[] = [
    {
      name: "Deterministic",
      description: "Same input always produces same output",
      icon: <CheckCircle className="w-5 h-5" />,
      importance: "critical",
      example: "File verification, password checking"
    },
    {
      name: "Fixed Output Size",
      description: "Any input produces hash of fixed length",
      icon: <File className="w-5 h-5" />,
      importance: "critical",
      example: "SHA-256 always produces 256-bit output"
    },
    {
      name: "Avalanche Effect",
      description: "Small input change → completely different hash",
      icon: <Zap className="w-5 h-5" />,
      importance: "high",
      example: "Changing one character changes entire hash"
    },
    {
      name: "Pre-image Resistance",
      description: "Can't find input from its hash",
      icon: <Lock className="w-5 h-5" />,
      importance: "critical",
      example: "Password hashing security"
    },
    {
      name: "Collision Resistance",
      description: "Hard to find two inputs with same hash",
      icon: <Users className="w-5 h-5" />,
      importance: "high",
      example: "Digital signature security"
    },
    {
      name: "Fast Computation",
      description: "Quick to compute for any input size",
      icon: <Cpu className="w-5 h-5" />,
      importance: "medium",
      example: "Real-time data verification"
    }
  ];

  const hashAlgorithms: HashAlgorithm[] = [
    {
      name: "SHA-256",
      outputSize: "256 bits (32 bytes)",
      security: "Very High",
      useCase: "Cryptography, blockchain, TLS/SSL",
      status: "secure",
      icon: <Shield className="w-5 h-5" />
    },
    {
      name: "SHA-3 (Keccak)",
      outputSize: "224-512 bits",
      security: "Very High",
      useCase: "Modern cryptography, post-quantum",
      status: "secure",
      icon: <ShieldCheck className="w-5 h-5" />
    },
    {
      name: "BLAKE2",
      outputSize: "256-512 bits",
      security: "Very High",
      useCase: "High-performance applications",
      status: "secure",
      icon: <Cpu className="w-5 h-5" />
    },
    {
      name: "MD5",
      outputSize: "128 bits",
      security: "Broken",
      useCase: "Checksums (not security)",
      status: "obsolete",
      icon: <AlertTriangle className="w-5 h-5" />
    },
    {
      name: "SHA-1",
      outputSize: "160 bits",
      security: "Broken",
      useCase: "Legacy systems (avoid)",
      status: "deprecated",
      icon: <XCircle className="w-5 h-5" />
    },
    {
      name: "Argon2",
      outputSize: "Variable",
      security: "Very High",
      useCase: "Password hashing",
      status: "secure",
      icon: <Key className="w-5 h-5" />
    }
  ];

  const hashAttacks = [
    {
      attack: "Brute Force",
      description: "Try all possible inputs until hash matches",
      defense: ["Long output size", "Slow hash functions", "Salt"],
      icon: <Cpu className="w-4 h-4" />
    },
    {
      attack: "Rainbow Tables",
      description: "Precomputed tables of hashes for common inputs",
      defense: ["Salt", "Unique salt per password", "Pepper"],
      icon: <Database className="w-4 h-4" />
    },
    {
      attack: "Collision Attack",
      description: "Find two different inputs with same hash",
      defense: ["Strong algorithms", "Larger hash size", "SHA-3"],
      icon: <Users className="w-4 h-4" />
    },
    {
      attack: "Length Extension",
      description: "Add data to hash without knowing original input",
      defense: ["HMAC", "SHA-3", "Proper implementation"],
      icon: <ArrowRight className="w-4 h-4" />
    },
    {
      attack: "Birthday Attack",
      description: "Find collision using probability theory",
      defense: ["256+ bit hashes", "Modern algorithms", "Regular updates"],
      icon: <Calculator className="w-4 h-4" />
    }
  ];

  const applications = [
    {
      application: "Password Storage",
      description: "Store hashed passwords instead of plaintext",
      algorithm: "Argon2, bcrypt, PBKDF2",
      keyFeature: "Salt and slow computation",
      icon: <Key className="w-4 h-4" />
    },
    {
      application: "Data Integrity",
      description: "Verify files haven't been modified",
      algorithm: "SHA-256, SHA-512",
      keyFeature: "Checksums and verification",
      icon: <FileText className="w-4 h-4" />
    },
    {
      application: "Digital Signatures",
      description: "Create unique fingerprint for documents",
      algorithm: "SHA-256 with RSA/ECC",
      keyFeature: "Hash then sign",
      icon: <Fingerprint className="w-4 h-4" />
    },
    {
      application: "Blockchain",
      description: "Link blocks and create Merkle trees",
      algorithm: "SHA-256 (Bitcoin), Keccak (Ethereum)",
      keyFeature: "Immutable ledger",
      icon: <Database className="w-4 h-4" />
    },
    {
      application: "Deduplication",
      description: "Identify and eliminate duplicate data",
      algorithm: "MD5, SHA-1 (non-crypto), xxHash",
      keyFeature: "Fast computation",
      icon: <Server className="w-4 h-4" />
    },
    {
      application: "Hash Tables",
      description: "Data structure for fast lookups",
      algorithm: "MurmurHash, CityHash, FNV",
      keyFeature: "Uniform distribution",
      icon: <Settings className="w-4 h-4" />
    }
  ];

  const comparisonExamples = [
    {
      input: "Hello",
      algorithm: "SHA-256",
      hash: "185f8db32271fe25f561a6fc938b2e264306ec304eda518007d1764826381969"
    },
    {
      input: "hello",
      algorithm: "SHA-256",
      hash: "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824"
    },
    {
      input: "Hello World",
      algorithm: "SHA-256",
      hash: "a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e"
    },
    {
      input: "hello world",
      algorithm: "SHA-256",
      hash: "309ecc489c12d6eb4cc40f50c902f2b4d0ed77ee511a7c7a9bcd3ca86d4cd86f"
    }
  ];

  const historicalEvolution = [
    {
      era: "1970s-1980s",
      algorithms: ["MD2", "MD4"],
      keyDevelopment: "First cryptographic hash functions",
      limitation: "Weak security by modern standards"
    },
    {
      era: "1990s",
      algorithms: ["MD5", "SHA-0", "SHA-1"],
      keyDevelopment: "Internet security adoption",
      limitation: "Collision vulnerabilities discovered"
    },
    {
      era: "2000s",
      algorithms: ["SHA-2 family", "SHA-256"],
      keyDevelopment: "Response to SHA-1 weaknesses",
      limitation: "Similar structure to SHA-1"
    },
    {
      era: "2010s-Present",
      algorithms: ["SHA-3", "BLAKE2", "Argon2"],
      keyDevelopment: "New designs, post-quantum considerations",
      limitation: "Adoption still ongoing"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Hash className="w-8 h-8" />
              <h1 className="text-2xl font-bold">Hashing: Complete Theory Guide</h1>
            </div>
            <p className="text-purple-200">
              Understanding digital fingerprints, data integrity, and secure storage
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
                Basics & Properties
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
                Applications
              </Button>
              <Button 
                variant={activeSection === "examples" ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setActiveSection("examples")}
              >
                <Calculator className="w-4 h-4 mr-2" />
                Examples & Comparisons
              </Button>
            </CardContent>
          </Card>

          {/* Key Concepts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Key Concepts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-2 border rounded">
                  <div className="text-xs text-gray-600">Hash Output</div>
                  <div className="font-medium text-sm">Fixed size, any input</div>
                </div>
                <div className="p-2 border rounded">
                  <div className="text-xs text-gray-600">Avalanche Effect</div>
                  <div className="font-medium text-sm">Small change → new hash</div>
                </div>
                <div className="p-2 border rounded">
                  <div className="text-xs text-gray-600">One-way Function</div>
                  <div className="font-medium text-sm">Cannot reverse hash</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Levels */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                Security Hierarchy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  <span className="text-xs font-medium">SHA-3, Argon2</span>
                  <Badge variant="default">Most Secure</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                  <span className="text-xs font-medium">SHA-256, BLAKE2</span>
                  <Badge variant="secondary">Secure</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                  <span className="text-xs font-medium">SHA-1</span>
                  <Badge variant="outline">Deprecated</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded">
                  <span className="text-xs font-medium">MD5</span>
                  <Badge variant="destructive">Broken</Badge>
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
                  <Hash className="w-6 h-6" />
                  Hashing Fundamentals
                </CardTitle>
                <CardDescription>
                  Core concepts and properties of hash functions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Visual Concept */}
                <div className="p-6 border-2 border-primary rounded-lg bg-primary/5">
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center mx-auto mb-2">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div className="font-bold">Input</div>
                      <div className="text-xs">Any Size Data</div>
                    </div>
                    
                    <ArrowRight className="w-6 h-6" />
                    
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center mx-auto mb-2">
                        <Hash className="w-6 h-6 text-white" />
                      </div>
                      <div className="font-bold">Hash Function</div>
                      <div className="text-xs">Mathematical Process</div>
                    </div>
                    
                    <ArrowRight className="w-6 h-6" />
                    
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-2">
                        <Fingerprint className="w-6 h-6 text-white" />
                      </div>
                      <div className="font-bold">Hash/Digest</div>
                      <div className="text-xs">Fixed Size Output</div>
                    </div>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg bg-white dark:bg-gray-800">
                    <div className="text-sm font-mono">
                      H("Hello") = "185f8db32271fe25f561a6fc938b2e264306ec304eda518007d1764826381969"
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      Example: SHA-256 hash of "Hello"
                    </div>
                  </div>
                </div>

                {/* Theory Concepts */}
                <div className="space-y-4">
                  {theoryConcepts
                    .filter(concept => ["basics", "properties"].includes(concept.category))
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

                {/* Hash Properties */}
                <div className="grid md:grid-cols-2 gap-4">
                  {hashProperties.map((property, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-lg ${
                          property.importance === "critical" ? "bg-red-100 dark:bg-red-900/20" :
                          property.importance === "high" ? "bg-amber-100 dark:bg-amber-900/20" :
                          "bg-blue-100 dark:bg-blue-900/20"
                        }`}>
                          {property.icon}
                        </div>
                        <div>
                          <h4 className="font-bold">{property.name}</h4>
                          <Badge variant={
                            property.importance === "critical" ? "destructive" :
                            property.importance === "high" ? "secondary" : "outline"
                          }>
                            {property.importance}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm mb-2">{property.description}</p>
                      <div className="text-xs bg-gray-50 dark:bg-gray-800 p-2 rounded">
                        Example: {property.example}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === "algorithms" && (
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-6 h-6" />
                  Hash Algorithms & Types
                </CardTitle>
                <CardDescription>
                  Different hash functions and their characteristics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Algorithm Cards */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {hashAlgorithms.map((algorithm, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${
                              algorithm.status === "secure" ? "bg-green-100 dark:bg-green-900/20" :
                              algorithm.status === "deprecated" ? "bg-yellow-100 dark:bg-yellow-900/20" :
                              "bg-red-100 dark:bg-red-900/20"
                            }`}>
                              {algorithm.icon}
                            </div>
                            <div>
                              <h4 className="font-bold">{algorithm.name}</h4>
                              <Badge variant={
                                algorithm.status === "secure" ? "default" :
                                algorithm.status === "deprecated" ? "secondary" : "destructive"
                              }>
                                {algorithm.status}
                              </Badge>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setShowExamples({
                              ...showExamples,
                              [algorithm.name]: !showExamples[algorithm.name]
                            })}
                          >
                            {showExamples[algorithm.name] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                        
                        {showExamples[algorithm.name] && (
                          <div className="mb-3 space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Output:</span>
                              <span className="font-medium">{algorithm.outputSize}</span>
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-600">Use: </span>
                              {algorithm.useCase}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="text-sm">
                            <span className="text-gray-600">Security: </span>
                            <span className="font-medium">{algorithm.security}</span>
                          </div>
                          <Badge variant={
                            algorithm.security.includes("Very") ? "default" :
                            algorithm.security.includes("High") ? "secondary" : "destructive"
                          }>
                            {algorithm.security}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Theory Concepts */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {theoryConcepts
                      .filter(concept => ["algorithms"].includes(concept.category))
                      .map((concept) => (
                      <div key={concept.id} className="border rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                            {concept.icon}
                          </div>
                          <div>
                            <h4 className="font-bold">{concept.title}</h4>
                            <p className="text-sm text-gray-600">{concept.description}</p>
                          </div>
                        </div>
                        <ul className="space-y-1 text-sm">
                          {concept.details.map((detail, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-4 h-4 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <div className="w-2 h-2 rounded-full bg-purple-600 dark:bg-purple-400"></div>
                              </div>
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Historical Evolution */}
                  <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <h4 className="font-bold mb-3">Evolution of Hash Functions</h4>
                    <div className="space-y-3">
                      {historicalEvolution.map((era, index) => (
                        <div key={index} className="p-3 bg-white dark:bg-gray-800 rounded">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold">{era.era}</h5>
                            <Badge variant="outline">Generation {index + 1}</Badge>
                          </div>
                          <div className="mb-2">
                            <div className="text-xs font-medium mb-1">Algorithms:</div>
                            <div className="flex flex-wrap gap-1">
                              {era.algorithms.map((algo, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {algo}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="text-sm">
                            <div className="font-medium">Key Development:</div>
                            <p className="text-gray-600">{era.keyDevelopment}</p>
                          </div>
                        </div>
                      ))}
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
                  Hash Attacks & Defenses
                </CardTitle>
                <CardDescription>
                  How hash functions can be attacked and how to protect against them
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Attacks */}
                  <div className="space-y-4">
                    {hashAttacks.map((attack, index) => (
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

                  {/* Salt and Pepper */}
                  <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-900/20">
                    <div className="flex items-center gap-3 mb-3">
                      <Key className="w-5 h-5 text-green-600" />
                      <h4 className="font-bold text-lg">Salt vs Pepper in Password Hashing</h4>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="p-3 bg-white dark:bg-gray-800 rounded">
                        <div className="font-bold mb-2">Salt</div>
                        <ul className="space-y-1">
                          <li>• Random value unique per user</li>
                          <li>• Stored with hash in database</li>
                          <li>• Prevents rainbow table attacks</li>
                          <li>• Ensures same passwords have different hashes</li>
                        </ul>
                        <div className="text-xs text-gray-600 mt-2">
                          Example: hash(password + salt)
                        </div>
                      </div>
                      <div className="p-3 bg-white dark:bg-gray-800 rounded">
                        <div className="font-bold mb-2">Pepper</div>
                        <ul className="space-y-1">
                          <li>• Secret value same for all users</li>
                          <li>• Not stored in database</li>
                          <li>• Adds another layer of security</li>
                          <li>• Must be kept secret (like encryption key)</li>
                        </ul>
                        <div className="text-xs text-gray-600 mt-2">
                          Example: hash(password + salt + pepper)
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Best Practices */}
                  <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <h4 className="font-bold mb-3 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-blue-600" />
                      Hashing Best Practices
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>Use SHA-256 or SHA-3 for cryptographic hashing</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>Use Argon2, bcrypt, or PBKDF2 for password hashing</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>Always use unique salt for each password</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>Consider adding pepper for extra security</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>Use appropriate work factors for password hashing</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>Never use MD5 or SHA-1 for security purposes</span>
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
                  How hashing is used in modern technology
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Applications */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {applications.map((app, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          {app.icon}
                          <div>
                            <h4 className="font-bold">{app.application}</h4>
                            <p className="text-sm text-gray-600">{app.description}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="text-sm">
                            <span className="text-gray-600">Algorithm: </span>
                            <span className="font-medium">{app.algorithm}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-600">Key Feature: </span>
                            <span className="font-medium">{app.keyFeature}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Merkle Trees */}
                  <div className="p-4 border rounded-lg bg-purple-50 dark:bg-purple-900/20">
                    <h4 className="font-bold mb-3">Merkle Trees in Blockchain</h4>
                    <div className="text-sm space-y-3">
                      <div className="p-3 bg-white dark:bg-gray-800 rounded">
                        <div className="font-medium mb-1">What are Merkle Trees?</div>
                        <p>Hash-based data structure where each leaf is hash of data, and each non-leaf is hash of children</p>
                      </div>
                      <div className="grid md:grid-cols-3 gap-2 text-xs">
                        <div className="p-2 bg-white dark:bg-gray-800 rounded text-center">
                          <div className="font-bold">1. Data Blocks</div>
                          <div>Transactions or files to be hashed</div>
                        </div>
                        <div className="p-2 bg-white dark:bg-gray-800 rounded text-center">
                          <div className="font-bold">2. Leaf Hashes</div>
                          <div>Each block hashed individually</div>
                        </div>
                        <div className="p-2 bg-white dark:bg-gray-800 rounded text-center">
                          <div className="font-bold">3. Root Hash</div>
                          <div>Single hash representing all data</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600">
                        Benefits: Efficient verification, tamper detection, compact proofs
                      </div>
                    </div>
                  </div>

                  {/* Hash Tables */}
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-bold mb-3">Hash Tables: Non-Cryptographic Use</h4>
                    <div className="text-sm space-y-2">
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                        <div className="font-medium mb-1">How Hash Tables Work</div>
                        <p>Map keys to values using hash function to compute index into array</p>
                      </div>
                      <div className="grid md:grid-cols-2 gap-2">
                        <div className="p-2 border rounded">
                          <div className="font-medium">Advantages</div>
                          <ul className="text-xs mt-1 space-y-1">
                            <li>• O(1) average case lookup</li>
                            <li>• Fast insertion and deletion</li>
                            <li>• Efficient memory usage</li>
                          </ul>
                        </div>
                        <div className="p-2 border rounded">
                          <div className="font-medium">Challenges</div>
                          <ul className="text-xs mt-1 space-y-1">
                            <li>• Hash collisions</li>
                            <li>• Poor hash function distribution</li>
                            <li>• Dynamic resizing needed</li>
                          </ul>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600">
                        Used in: Databases, caches, compilers, programming languages
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === "examples" && (
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-6 h-6" />
                  Hash Examples & Comparisons
                </CardTitle>
                <CardDescription>
                  Practical examples demonstrating hash properties
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Hash Comparison Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-4 font-semibold">Input</th>
                          <th className="text-left p-4 font-semibold">Algorithm</th>
                          <th className="text-left p-4 font-semibold">Hash Output (SHA-256)</th>
                          <th className="text-left p-4 font-semibold">Observation</th>
                        </tr>
                      </thead>
                      <tbody>
                        {comparisonExamples.map((example, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="p-4 font-mono font-medium">"{example.input}"</td>
                            <td className="p-4">
                              <Badge variant="secondary">{example.algorithm}</Badge>
                            </td>
                            <td className="p-4">
                              <div className="text-xs font-mono truncate max-w-xs">
                                {example.hash}
                              </div>
                            </td>
                            <td className="p-4">
                              {index === 0 && (
                                <Badge variant="outline">Original</Badge>
                              )}
                              {index === 1 && (
                                <Badge variant="default" className="bg-red-100 text-red-800">
                                  Capitalization changes everything
                                </Badge>
                              )}
                              {index === 2 && (
                                <Badge variant="outline">Different string</Badge>
                              )}
                              {index === 3 && (
                                <Badge variant="default" className="bg-red-100 text-red-800">
                                  Completely different hash
                                </Badge>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Avalanche Effect Demonstration */}
                  <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <div className="flex items-center gap-3 mb-3">
                      <Zap className="w-5 h-5 text-blue-600" />
                      <h4 className="font-bold text-lg">Avalanche Effect Demonstration</h4>
                    </div>
                    <div className="text-sm space-y-3">
                      <div className="p-3 bg-white dark:bg-gray-800 rounded">
                        <div className="font-medium mb-1">Original: "The quick brown fox jumps over the lazy dog"</div>
                        <div className="text-xs font-mono mt-1">
                          SHA-256: d7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592
                        </div>
                      </div>
                      <div className="p-3 bg-white dark:bg-gray-800 rounded">
                        <div className="font-medium mb-1">Changed: "The quick brown fox jumps over the lazy dog<strong>.</strong>"</div>
                        <div className="text-xs font-mono mt-1">
                          SHA-256: ef537f25c895bfa782526529a9b63d97aa631564d5d789c2b765448c8635fb6c
                        </div>
                      </div>
                      <div className="text-center p-2 bg-red-50 dark:bg-red-900/20 rounded">
                        <div className="text-sm">
                          Adding just one period (.) changed <strong>100%</strong> of the hash output!
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Collision Example */}
                  <div className="p-4 border rounded-lg bg-red-50 dark:bg-red-900/20">
                    <div className="flex items-center gap-3 mb-3">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <h4 className="font-bold text-lg">MD5 Collision Example</h4>
                    </div>
                    <div className="text-sm">
                      <div className="p-3 bg-white dark:bg-gray-800 rounded mb-3">
                        <div className="font-medium mb-2">These two different inputs produce the same MD5 hash:</div>
                        <div className="space-y-2">
                          <div>
                            <div className="text-xs font-medium">Input 1:</div>
                            <div className="text-xs font-mono">d131dd02c5e6eec4693d9a0698aff95c</div>
                          </div>
                          <div>
                            <div className="text-xs font-medium">Input 2:</div>
                            <div className="text-xs font-mono">d131dd02c5e6eec4693d9a0698aff95d</div>
                          </div>
                          <div className="mt-2">
                            <div className="text-xs font-medium">Both produce MD5:</div>
                            <div className="text-xs font-mono">79054025255fb1a26e4bc422aef54eb4</div>
                          </div>
                        </div>
                      </div>
                      <div className="text-red-700 dark:text-red-400">
                        <strong>Warning:</strong> This demonstrates why MD5 should never be used for security purposes!
                      </div>
                    </div>
                  </div>

                  {/* Hash Length Comparison */}
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-bold mb-3">Hash Output Sizes</h4>
                    <div className="space-y-2">
                      {[
                        { name: "MD5", size: "128 bits", hex: "32 characters" },
                        { name: "SHA-1", size: "160 bits", hex: "40 characters" },
                        { name: "SHA-256", size: "256 bits", hex: "64 characters" },
                        { name: "SHA-512", size: "512 bits", hex: "128 characters" }
                      ].map((hash, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <span className="font-medium">{hash.name}</span>
                          <div className="text-sm text-gray-600">
                            {hash.size} ({hash.hex} hex)
                          </div>
                        </div>
                      ))}
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
            Hashing Theory Summary
          </CardTitle>
          <CardDescription>
            Essential knowledge about hash functions and their applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-bold flex items-center gap-2">
                <Hash className="w-4 h-4 text-blue-600" />
                Core Properties
              </h4>
              <ul className="space-y-1 text-sm">
                <li>• Deterministic: Same input → same output</li>
                <li>• Fixed output size: Any input → fixed length</li>
                <li>• One-way: Cannot reverse hash</li>
                <li>• Avalanche effect: Small change → new hash</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-bold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                Secure Algorithms
              </h4>
              <ul className="space-y-1 text-sm">
                <li>• SHA-256: Current standard</li>
                <li>• SHA-3: Modern, quantum-resistant</li>
                <li>• Argon2: Best for passwords</li>
                <li>• BLAKE2: High performance</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-bold flex items-center gap-2">
                <Globe className="w-4 h-4 text-purple-600" />
                Key Applications
              </h4>
              <ul className="space-y-1 text-sm">
                <li>• Password storage (with salt)</li>
                <li>• Data integrity verification</li>
                <li>• Digital signatures</li>
                <li>• Blockchain and Merkle trees</li>
              </ul>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <Alert>
            <Zap className="w-4 h-4" />
            <AlertDescription>
              <strong>Critical Insight:</strong> Hash functions are the digital equivalent of fingerprints. 
              Just as no two people have identical fingerprints (with astronomically small probability), 
              no two different inputs should produce the same hash. This property enables everything 
              from secure password storage to blockchain technology to digital signatures.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}