// File: authentication-module-theory.tsx
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
  User,
  Key,
  Fingerprint,
  Shield,
  Lock,
  Unlock,
  Smartphone,
  Mail,
  SmartphoneIcon,
  CheckCircle,
  XCircle,
  Info,
  BookOpen,
  Globe,
  Database,
  Server,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Users,
  Zap,
  MessageSquare,
  Hash,
  FileText,
  ArrowRight,
  KeyRound,
  Scan
} from "lucide-react";

type TheoryConcept = {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  details: string[];
  category: "basics" | "methods" | "security";
};

type Factor = {
  name: string;
  type: string;
  examples: string[];
  icon: React.ReactNode;
  strength: "weak" | "medium" | "strong";
};

export default function AuthenticationModuleTheory() {
  const [activeSection, setActiveSection] = useState<string>("basics");
  const [showPasswordExamples, setShowPasswordExamples] = useState(false);

  const theoryConcepts: TheoryConcept[] = [
    {
      id: 1,
      title: "What is Authentication?",
      description: "Verifying the identity of a user, device, or system",
      icon: <User className="w-6 h-6" />,
      details: [
        "Process of confirming that someone is who they claim to be",
        "Distinct from authorization (what you can do) and identification (who you are)",
        "Essential for protecting sensitive data and systems",
        "First line of defense in cybersecurity"
      ],
      category: "basics"
    },
    {
      id: 2,
      title: "Authentication Factors",
      description: "Different types of evidence used to prove identity",
      icon: <KeyRound className="w-6 h-6" />,
      details: [
        "Something You Know: Passwords, PINs, security questions",
        "Something You Have: Security tokens, smart cards, phones",
        "Something You Are: Biometrics (fingerprint, face, iris)",
        "Something You Do: Behavioral patterns (typing rhythm)"
      ],
      category: "basics"
    },
    {
      id: 3,
      title: "Single vs Multi-Factor",
      description: "Different levels of authentication security",
      icon: <ShieldCheck className="w-6 h-6" />,
      details: [
        "Single-Factor Authentication (SFA): Uses one factor only (e.g., password)",
        "Two-Factor Authentication (2FA): Combines two different factors",
        "Multi-Factor Authentication (MFA): Uses two or more factors",
        "Risk-based Authentication: Adjusts requirements based on context",
        "Adaptive Authentication: Uses AI to assess risk in real-time"
      ],
      category: "methods"
    },
    {
      id: 4,
      title: "Password Security",
      description: "Managing the most common authentication method",
      icon: <Lock className="w-6 h-6" />,
      details: [
        "Strong passwords: 12+ characters, mixed case, numbers, symbols",
        "Password hashing: Never store passwords in plain text",
        "Salt: Random data added to passwords before hashing",
        "Password managers: Generate and store complex passwords",
        "Password policies: Rules for creating and updating passwords"
      ],
      category: "security"
    },
    {
      id: 5,
      title: "Modern Methods",
      description: "Contemporary authentication technologies",
      icon: <Smartphone className="w-6 h-6" />,
      details: [
        "Biometric Authentication: Fingerprint, facial recognition, iris scan",
        "Hardware Tokens: YubiKey, RSA SecurID, smart cards",
        "Push Notifications: Approve login attempts via mobile app",
        "WebAuthn: Passwordless authentication standard",
        "Passkeys: Cross-platform FIDO2 credentials"
      ],
      category: "methods"
    },
    {
      id: 6,
      title: "Protocols & Standards",
      description: "Technical specifications for authentication",
      icon: <Server className="w-6 h-6" />,
      details: [
        "OAuth 2.0: Authorization framework (used by Google, Facebook)",
        "OpenID Connect: Identity layer on top of OAuth 2.0",
        "SAML: XML-based standard for exchanging authentication data",
        "LDAP: Protocol for accessing directory services",
        "Kerberos: Network authentication protocol using tickets"
      ],
      category: "security"
    }
  ];

  const authenticationFactors: Factor[] = [
    {
      name: "Knowledge Factor",
      type: "Something You Know",
      examples: ["Password", "PIN", "Security Questions", "Pattern"],
      icon: <Key className="w-5 h-5" />,
      strength: "weak"
    },
    {
      name: "Possession Factor",
      type: "Something You Have",
      examples: ["Security Token", "Smart Card", "Phone", "Email"],
      icon: <SmartphoneIcon className="w-5 h-5" />,
      strength: "medium"
    },
    {
      name: "Inherence Factor",
      type: "Something You Are",
      examples: ["Fingerprint", "Face", "Iris", "Voice"],
      icon: <Fingerprint className="w-5 h-5" />,
      strength: "strong"
    },
    {
      name: "Location Factor",
      type: "Somewhere You Are",
      examples: ["GPS Location", "IP Address", "Wi-Fi Network"],
      icon: <Globe className="w-5 h-5" />,
      strength: "medium"
    },
    {
      name: "Behavioral Factor",
      type: "Something You Do",
      examples: ["Typing Rhythm", "Mouse Movements", "Voice Patterns"],
      icon: <MessageSquare className="w-5 h-5" />,
      strength: "medium"
    }
  ];

  const securityThreats = [
    {
      threat: "Phishing",
      description: "Tricking users into revealing credentials",
      mitigation: ["MFA", "Security Awareness Training", "Email Filters"],
      icon: <Mail className="w-4 h-4" />
    },
    {
      threat: "Brute Force",
      description: "Trying all possible password combinations",
      mitigation: ["Rate Limiting", "Account Lockout", "Strong Passwords"],
      icon: <Hash className="w-4 h-4" />
    },
    {
      threat: "Credential Stuffing",
      description: "Using leaked credentials from other sites",
      mitigation: ["Password Rotation", "Credential Monitoring", "MFA"],
      icon: <Database className="w-4 h-4" />
    },
    {
      threat: "Man-in-the-Middle",
      description: "Intercepting authentication data",
      mitigation: ["HTTPS", "Certificate Pinning", "End-to-End Encryption"],
      icon: <Server className="w-4 h-4" />
    },
    {
      threat: "Session Hijacking",
      description: "Stealing active session tokens",
      mitigation: ["Short Session Timeouts", "Token Rotation", "HTTPS Only"],
      icon: <Clock className="w-4 h-4" />
    }
  ];

  const bestPractices = [
    {
      practice: "Use Multi-Factor Authentication",
      impact: "Reduces account takeover by 99.9%",
      icon: <ShieldCheck className="w-4 h-4 text-green-600" />
    },
    {
      practice: "Implement Strong Password Policies",
      impact: "Prevents brute force and guessing attacks",
      icon: <Lock className="w-4 h-4 text-blue-600" />
    },
    {
      practice: "Regular Security Audits",
      impact: "Identifies vulnerabilities before attackers",
      icon: <Eye className="w-4 h-4 text-purple-600" />
    },
    {
      practice: "Educate Users",
      impact: "First line of defense against social engineering",
      icon: <Users className="w-4 h-4 text-amber-600" />
    },
    {
      practice: "Monitor Authentication Logs",
      impact: "Early detection of suspicious activity",
      icon: <AlertTriangle className="w-4 h-4 text-red-600" />
    }
  ];

  const authenticationTypes = [
    {
      name: "Password-based",
      description: "Traditional username/password",
      security: "Low",
      convenience: "High",
      useCase: "General websites, legacy systems"
    },
    {
      name: "2FA/MFA",
      description: "Password + additional factor(s)",
      security: "High",
      convenience: "Medium",
      useCase: "Email, banking, sensitive accounts"
    },
    {
      name: "Biometric",
      description: "Fingerprint, face, iris recognition",
      security: "High",
      convenience: "High",
      useCase: "Mobile devices, secure facilities"
    },
    {
      name: "Passwordless",
      description: "Magic links, push notifications",
      security: "Medium",
      convenience: "Very High",
      useCase: "Modern web apps, internal tools"
    },
    {
      name: "Certificate-based",
      description: "Digital certificates, smart cards",
      security: "Very High",
      convenience: "Low",
      useCase: "Government, military, enterprise"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-8 h-8" />
              <h1 className="text-2xl font-bold">Authentication: Complete Theory Guide</h1>
            </div>
            <p className="text-purple-200">
              Understanding how systems verify identities and protect access
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
                Basics & Concepts
              </Button>
              <Button 
                variant={activeSection === "factors" ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setActiveSection("factors")}
              >
                <KeyRound className="w-4 h-4 mr-2" />
                Authentication Factors
              </Button>
              <Button 
                variant={activeSection === "methods" ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setActiveSection("methods")}
              >
                <ShieldCheck className="w-4 h-4 mr-2" />
                Methods & Types
              </Button>
              <Button 
                variant={activeSection === "security" ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setActiveSection("security")}
              >
                <Shield className="w-4 h-4 mr-2" />
                Security & Threats
              </Button>
              <Button 
                variant={activeSection === "bestpractices" ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setActiveSection("bestpractices")}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Best Practices
              </Button>
            </CardContent>
          </Card>

          {/* Key Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Key Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <div className="text-xs text-gray-600">81% of breaches</div>
                  <div className="font-bold">Involve stolen credentials</div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="text-xs text-gray-600">With MFA</div>
                  <div className="font-bold">99.9% attack prevention</div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="text-xs text-gray-600">Average user has</div>
                  <div className="font-bold">100+ passwords</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Authentication Pyramid */}
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
                  <span className="text-sm font-medium">Multi-Factor</span>
                  <Badge variant="default">Strongest</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                  <span className="text-sm font-medium">Two-Factor</span>
                  <Badge variant="secondary">Strong</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                  <span className="text-sm font-medium">Single-Factor</span>
                  <Badge variant="outline">Weak</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded">
                  <span className="text-sm font-medium">No Authentication</span>
                  <Badge variant="destructive">Risky</Badge>
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
                  <User className="w-6 h-6" />
                  Authentication Fundamentals
                </CardTitle>
                <CardDescription>
                  Core concepts and principles of identity verification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Visual Concept */}
                <div className="p-6 border-2 border-primary rounded-lg bg-primary/5">
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center mx-auto mb-2">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div className="font-bold">User</div>
                      <div className="text-xs">Claims Identity</div>
                    </div>
                    
                    <ArrowRight className="w-6 h-6" />
                    
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center mx-auto mb-2">
                        <Shield className="w-6 h-6 text-white" />
                      </div>
                      <div className="font-bold">Authentication</div>
                      <div className="text-xs">Verifies Identity</div>
                    </div>
                    
                    <ArrowRight className="w-6 h-6" />
                    
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-2">
                        <Unlock className="w-6 h-6 text-white" />
                      </div>
                      <div className="font-bold">Access</div>
                      <div className="text-xs">Granted or Denied</div>
                    </div>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg bg-white dark:bg-gray-800">
                    <div className="text-sm">
                      Authentication ≠ Authorization
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      Authentication verifies WHO you are. Authorization determines WHAT you can do.
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
              </CardContent>
            </Card>
          )}

          {activeSection === "factors" && (
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <KeyRound className="w-6 h-6" />
                  Authentication Factors
                </CardTitle>
                <CardDescription>
                  Different types of evidence used to prove identity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Factor Cards */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {authenticationFactors.map((factor, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`p-2 rounded-lg ${
                            factor.strength === "weak" ? "bg-red-100 dark:bg-red-900/20" :
                            factor.strength === "medium" ? "bg-yellow-100 dark:bg-yellow-900/20" :
                            "bg-green-100 dark:bg-green-900/20"
                          }`}>
                            {factor.icon}
                          </div>
                          <div>
                            <h4 className="font-bold">{factor.name}</h4>
                            <p className="text-sm text-gray-600">{factor.type}</p>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <div className="text-xs font-medium mb-1">Examples:</div>
                          <div className="flex flex-wrap gap-1">
                            {factor.examples.map((example, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {example}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Security:</span>
                          <Badge variant={
                            factor.strength === "weak" ? "destructive" :
                            factor.strength === "medium" ? "secondary" : "default"
                          }>
                            {factor.strength === "weak" ? "Low" :
                             factor.strength === "medium" ? "Medium" : "High"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Multi-Factor Explanation */}
                  <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <div className="flex items-center gap-3 mb-3">
                      <ShieldCheck className="w-5 h-5 text-blue-600" />
                      <h4 className="font-bold text-lg">Why Multi-Factor Matters</h4>
                    </div>
                    <div className="grid md:grid-cols-3 gap-3 text-sm">
                      <div className="p-3 bg-white dark:bg-gray-800 rounded">
                        <div className="font-medium mb-1">Defense in Depth</div>
                        <p>Multiple layers of security reduce attack success</p>
                      </div>
                      <div className="p-3 bg-white dark:bg-gray-800 rounded">
                        <div className="font-medium mb-1">Compensating Controls</div>
                        <p>Weaknesses in one factor covered by another</p>
                      </div>
                      <div className="p-3 bg-white dark:bg-gray-800 rounded">
                        <div className="font-medium mb-1">Attack Resistance</div>
                        <p>Requires compromising multiple independent factors</p>
                      </div>
                    </div>
                  </div>

                  {/* Password Examples */}
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Lock className="w-5 h-5" />
                        <h4 className="font-bold">Password Strength Examples</h4>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowPasswordExamples(!showPasswordExamples)}
                      >
                        {showPasswordExamples ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        {showPasswordExamples ? "Hide" : "Show"}
                      </Button>
                    </div>
                    
                    {showPasswordExamples && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-600" />
                          <span className="text-sm">
                            <span className="font-mono">password123</span> - Very weak (common dictionary word)
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-yellow-600" />
                          <span className="text-sm">
                            <span className="font-mono">P@ssw0rd!</span> - Weak (common pattern)
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">
                            <span className="font-mono">Tr0ub4dor&3</span> - Medium (12 chars, mixed)
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">
                            <span className="font-mono">correct horse battery staple</span> - Strong (passphrase)
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">
                            <span className="font-mono">xqA7$gT9*Lm2#R</span> - Very strong (random, 14+ chars)
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === "methods" && (
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6" />
                  Authentication Methods & Types
                </CardTitle>
                <CardDescription>
                  Different approaches to verifying identity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Methods Comparison */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-4 font-semibold">Method</th>
                          <th className="text-left p-4 font-semibold">Description</th>
                          <th className="text-left p-4 font-semibold">Security</th>
                          <th className="text-left p-4 font-semibold">Convenience</th>
                        </tr>
                      </thead>
                      <tbody>
                        {authenticationTypes.map((type, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="p-4 font-medium">{type.name}</td>
                            <td className="p-4 text-sm">{type.description}</td>
                            <td className="p-4">
                              <Badge variant={
                                type.security === "Low" ? "destructive" :
                                type.security === "Medium" ? "secondary" :
                                type.security === "High" ? "default" : "default"
                              }>
                                {type.security}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <Badge variant="outline">
                                {type.convenience}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Modern Methods */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {theoryConcepts
                      .filter(concept => concept.category === "methods")
                      .map((concept) => (
                      <div key={concept.id} className="p-4 border rounded-lg">
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

                  {/* Protocol Standards */}
                  <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                    <h4 className="font-bold mb-3 flex items-center gap-2">
                      <Server className="w-5 h-5" />
                      Authentication Protocols
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="p-3 bg-white dark:bg-gray-900 rounded text-center">
                        <div className="font-bold text-sm">OAuth 2.0</div>
                        <div className="text-xs text-gray-600">Authorization</div>
                      </div>
                      <div className="p-3 bg-white dark:bg-gray-900 rounded text-center">
                        <div className="font-bold text-sm">OpenID Connect</div>
                        <div className="text-xs text-gray-600">Identity Layer</div>
                      </div>
                      <div className="p-3 bg-white dark:bg-gray-900 rounded text-center">
                        <div className="font-bold text-sm">SAML 2.0</div>
                        <div className="text-xs text-gray-600">Enterprise SSO</div>
                      </div>
                      <div className="p-3 bg-white dark:bg-gray-900 rounded text-center">
                        <div className="font-bold text-sm">FIDO2/WebAuthn</div>
                        <div className="text-xs text-gray-600">Passwordless</div>
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
                  <Shield className="w-6 h-6" />
                  Security Threats & Countermeasures
                </CardTitle>
                <CardDescription>
                  Common attacks and how to defend against them
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Security Concepts */}
                  {theoryConcepts
                    .filter(concept => concept.category === "security")
                    .map((concept) => (
                    <div key={concept.id} className="border rounded-lg overflow-hidden">
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
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
                              <div className="w-4 h-4 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <div className="w-2 h-2 rounded-full bg-red-600 dark:bg-red-400"></div>
                              </div>
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}

                  {/* Threat Matrix */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-lg">Common Authentication Threats</h4>
                    <div className="space-y-3">
                      {securityThreats.map((threat, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex items-center gap-3 mb-2">
                            {threat.icon}
                            <div>
                              <h5 className="font-bold">{threat.threat}</h5>
                              <p className="text-sm text-gray-600">{threat.description}</p>
                            </div>
                          </div>
                          <div className="mt-2">
                            <div className="text-xs font-medium mb-1">Countermeasures:</div>
                            <div className="flex flex-wrap gap-1">
                              {threat.mitigation.map((mit, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {mit}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === "bestpractices" && (
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-6 h-6" />
                  Best Practices & Implementation
                </CardTitle>
                <CardDescription>
                  Guidelines for secure authentication systems
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Best Practices */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {bestPractices.map((practice, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          {practice.icon}
                          <h5 className="font-bold">{practice.practice}</h5>
                        </div>
                        <p className="text-sm">{practice.impact}</p>
                      </div>
                    ))}
                  </div>

                  {/* Implementation Guidelines */}
                  <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-900/20">
                    <h4 className="font-bold mb-3 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-green-600" />
                      Implementation Checklist
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>Implement MFA for all privileged accounts</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>Use strong password hashing (Argon2, bcrypt, scrypt)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>Enforce HTTPS for all authentication endpoints</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>Implement account lockout after failed attempts</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>Regularly audit and rotate credentials</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>Monitor authentication logs for anomalies</span>
                      </div>
                    </div>
                  </div>

                  {/* Future Trends */}
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-bold mb-3">Emerging Trends</h4>
                    <div className="grid md:grid-cols-2 gap-3 text-sm">
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                        <div className="font-medium mb-1">Passwordless Authentication</div>
                        <p>Eliminating passwords with biometrics and devices</p>
                      </div>
                      <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded">
                        <div className="font-medium mb-1">Zero Trust Architecture</div>
                        <p>Never trust, always verify approach</p>
                      </div>
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded">
                        <div className="font-medium mb-1">AI-Powered Security</div>
                        <p>Machine learning for threat detection</p>
                      </div>
                      <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded">
                        <div className="font-medium mb-1">Decentralized Identity</div>
                        <p>Self-sovereign identity using blockchain</p>
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
            Authentication Theory Summary
          </CardTitle>
          <CardDescription>
            Essential knowledge about identity verification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-bold flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                Core Principles
              </h4>
              <ul className="space-y-1 text-sm">
                <li>• Verify identity before granting access</li>
                <li>• Use multiple factors for stronger security</li>
                <li>• Balance security with usability</li>
                <li>• Implement defense in depth</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-bold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                Best Methods
              </h4>
              <ul className="space-y-1 text-sm">
                <li>• Multi-factor authentication (MFA)</li>
                <li>• Strong password policies</li>
                <li>• Biometric verification</li>
                <li>• Passwordless options</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Key Considerations
              </h4>
              <ul className="space-y-1 text-sm">
                <li>• Protect against credential theft</li>
                <li>• Monitor for suspicious activity</li>
                <li>• Regular security updates</li>
                <li>• User education and awareness</li>
              </ul>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <Alert>
            <Zap className="w-4 h-4" />
            <AlertDescription>
              <strong>Fundamental Truth:</strong> Authentication is the foundation of cybersecurity. 
              Strong authentication protects against 81% of data breaches, making it the single 
              most important security control for any organization.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}