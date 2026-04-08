// File: accesscontrol-module-theory.tsx
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
  Shield,
  Lock,
  Unlock,
  Users,
  User,
  Key,
  Database,
  File,
  Folder,
  Server,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Info,
  BookOpen,
  Globe,
  AlertTriangle,
  Clock,
  Zap,
  ArrowRight,
  Bell,
  BarChart,
  Settings,
  ShieldCheck,
  Fingerprint,
  UserCheck,
  FileText,
  ListChecks
} from "lucide-react";

type TheoryConcept = {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  details: string[];
  category: "models" | "principles" | "implementation";
};

type AccessControlModel = {
  name: string;
  acronym: string;
  description: string;
  useCase: string;
  strength: string;
  icon: React.ReactNode;
  example: string;
};

type SecurityPrinciple = {
  name: string;
  description: string;
  icon: React.ReactNode;
  importance: "critical" | "high" | "medium";
};

export default function AccessControlModuleTheory() {
  const [activeSection, setActiveSection] = useState<string>("models");
  const [showExamples, setShowExamples] = useState<Record<string, boolean>>({});

  const theoryConcepts: TheoryConcept[] = [
    {
      id: 1,
      title: "What is Access Control?",
      description: "Security technique regulating who can view or use resources",
      icon: <Lock className="w-6 h-6" />,
      details: [
        "Process of granting or denying specific requests to access system resources",
        "Determines what authenticated users are authorized to do",
        "Essential component of information security and privacy",
        "Protects confidentiality, integrity, and availability of resources"
      ],
      category: "principles"
    },
    {
      id: 2,
      title: "Core Components",
      description: "Key elements of access control systems",
      icon: <ShieldCheck className="w-6 h-6" />,
      details: [
        "Subjects: Users, processes, or devices requesting access",
        "Objects: Resources being accessed (files, databases, services)",
        "Operations: Actions subjects want to perform (read, write, execute)",
        "Policy: Rules defining which subjects can perform which operations on which objects",
        "Mechanism: Technical implementation of the policy"
      ],
      category: "principles"
    },
    {
      id: 3,
      title: "Authorization vs Authentication",
      description: "Understanding the crucial difference",
      icon: <UserCheck className="w-6 h-6" />,
      details: [
        "Authentication: Verifies WHO you are (identity verification)",
        "Authorization: Determines WHAT you can do (permissions)",
        "Authentication comes first, then authorization",
        "Example: Your ID card authenticates you, but different badges authorize different building access"
      ],
      category: "principles"
    },
    {
      id: 4,
      title: "Role-Based Access Control (RBAC)",
      description: "Permissions based on organizational roles",
      icon: <Users className="w-6 h-6" />,
      details: [
        "Access rights are assigned to roles rather than individuals",
        "Users are assigned to roles, inheriting their permissions",
        "Simplifies administration in large organizations",
        "Common in enterprise environments (HR, Finance, IT roles)"
      ],
      category: "models"
    },
    {
      id: 5,
      title: "Attribute-Based Access Control (ABAC)",
      description: "Dynamic access based on multiple attributes",
      icon: <ListChecks className="w-6 h-6" />,
      details: [
        "Uses policies that evaluate multiple attributes",
        "Attributes can be user, resource, environment, or action characteristics",
        "Allows for fine-grained, context-aware access control",
        "Used in cloud environments and complex systems"
      ],
      category: "models"
    },
    {
      id: 6,
      title: "Implementation Best Practices",
      description: "Guidelines for effective access control",
      icon: <Settings className="w-6 h-6" />,
      details: [
        "Least Privilege Principle: Grant minimum permissions necessary",
        "Separation of Duties: Critical operations require multiple people",
        "Regular Access Reviews: Periodically review and update permissions",
        "Audit Logging: Record all access attempts and changes",
        "Defense in Depth: Multiple layers of security controls"
      ],
      category: "implementation"
    }
  ];

  const accessControlModels: AccessControlModel[] = [
    {
      name: "Discretionary Access Control",
      acronym: "DAC",
      description: "Resource owners decide access permissions",
      useCase: "Personal computers, small teams",
      strength: "Flexible but less secure",
      icon: <User className="w-5 h-5" />,
      example: "File permissions in Windows/Mac/Linux"
    },
    {
      name: "Mandatory Access Control",
      acronym: "MAC",
      description: "System-enforced policies based on security labels",
      useCase: "Military, government, high-security",
      strength: "Very secure but rigid",
      icon: <Shield className="w-5 h-5" />,
      example: "SELinux, military classification systems"
    },
    {
      name: "Role-Based Access Control",
      acronym: "RBAC",
      description: "Permissions based on organizational roles",
      useCase: "Enterprises, large organizations",
      strength: "Scalable and manageable",
      icon: <Users className="w-5 h-5" />,
      example: "Employee access based on job titles"
    },
    {
      name: "Attribute-Based Access Control",
      acronym: "ABAC",
      description: "Dynamic access based on multiple attributes",
      useCase: "Cloud, complex environments",
      strength: "Flexible and context-aware",
      icon: <ListChecks className="w-5 h-5" />,
      example: "Time-based access, location restrictions"
    },
    
  ];

  const securityPrinciples: SecurityPrinciple[] = [
    {
      name: "Least Privilege",
      description: "Users get only the permissions they need to perform their tasks",
      icon: <Lock className="w-5 h-5" />,
      importance: "critical"
    },
    {
      name: "Need to Know",
      description: "Access only to information necessary for specific tasks",
      icon: <Eye className="w-5 h-5" />,
      importance: "critical"
    },
    {
      name: "Separation of Duties",
      description: "Critical operations require multiple people to complete",
      icon: <Users className="w-5 h-5" />,
      importance: "high"
    },
    {
      name: "Defense in Depth",
      description: "Multiple layers of security controls",
      icon: <ShieldCheck className="w-5 h-5" />,
      importance: "high"
    },
    {
      name: "Fail-Safe Defaults",
      description: "Default to denying access unless explicitly permitted",
      icon: <XCircle className="w-5 h-5" />,
      importance: "medium"
    },
    {
      name: "Complete Mediation",
      description: "Every access must be checked against authorization rules",
      icon: <CheckCircle className="w-5 h-5" />,
      importance: "medium"
    }
  ];

  const implementationComponents = [
    {
      component: "Access Control Lists (ACLs)",
      description: "Lists specifying which users have which permissions",
      type: "Technical",
      example: "File system permissions, network ACLs"
    },
    {
      component: "Access Control Matrix",
      description: "Table showing subject-object permissions",
      type: "Conceptual",
      example: "Spreadsheet of user-file permissions"
    },
    {
      component: "Capability Lists",
      description: "Lists of objects subjects can access",
      type: "Technical",
      example: "Token-based access systems"
    },
    {
      component: "Policy Decision Point",
      description: "Evaluates access requests against policies",
      type: "Architectural",
      example: "Authorization server"
    },
    {
      component: "Policy Enforcement Point",
      description: "Enforces access decisions",
      type: "Architectural",
      example: "API gateway, firewall"
    },
    {
      component: "Policy Administration Point",
      description: "Manages authorization policies",
      type: "Administrative",
      example: "Admin console for permissions"
    }
  ];

  const accessControlLayers = [
    {
      layer: "Physical",
      description: "Controls physical access to facilities and hardware",
      examples: ["Locks", "Biometric scanners", "Security guards"],
      icon: <Fingerprint className="w-4 h-4" />
    },
    {
      layer: "Network",
      description: "Controls access to network resources",
      examples: ["Firewalls", "VPNs", "Network segmentation"],
      icon: <Globe className="w-4 h-4" />
    },
    {
      layer: "Operating System",
      description: "Controls access to OS resources and files",
      examples: ["File permissions", "User accounts", "Process isolation"],
      icon: <Server className="w-4 h-4" />
    },
    {
      layer: "Application",
      description: "Controls access within applications",
      examples: ["Role-based menus", "Feature flags", "Data filtering"],
      icon: <Settings className="w-4 h-4" />
    },
    {
      layer: "Data",
      description: "Controls access to specific data elements",
      examples: ["Row-level security", "Data masking", "Encryption"],
      icon: <Database className="w-4 h-4" />
    }
  ];

  const commonPitfalls = [
    {
      pitfall: "Permission Creep",
      description: "Users accumulate unnecessary permissions over time",
      solution: "Regular access reviews and cleanup"
    },
    {
      pitfall: "Over-privileged Accounts",
      description: "Default admin accounts with excessive permissions",
      solution: "Implement least privilege and separate admin accounts"
    },
    {
      pitfall: "Weak Delegation Controls",
      description: "Poor management of delegated permissions",
      solution: "Strict delegation policies with time limits"
    },
    {
      pitfall: "Inadequate Monitoring",
      description: "Failure to log and review access attempts",
      solution: "Comprehensive audit logging and regular reviews"
    },
    {
      pitfall: "Complex Policies",
      description: "Overly complicated rules that are hard to manage",
      solution: "Simplify policies and use role-based approaches"
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
              <h1 className="text-2xl font-bold">Access Control: Complete Theory Guide</h1>
            </div>
            <p className="text-purple-200">
              Understanding how systems control and manage resource access
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
                variant={activeSection === "models" ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setActiveSection("models")}
              >
                <Shield className="w-4 h-4 mr-2" />
                Models & Frameworks
              </Button>
              <Button 
                variant={activeSection === "principles" ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setActiveSection("principles")}
              >
                <ShieldCheck className="w-4 h-4 mr-2" />
                Security Principles
              </Button>
              <Button 
                variant={activeSection === "implementation" ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setActiveSection("implementation")}
              >
                <Settings className="w-4 h-4 mr-2" />
                Implementation
              </Button>
              <Button 
                variant={activeSection === "layers" ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setActiveSection("layers")}
              >
                <Server className="w-4 h-4 mr-2" />
                Security Layers
              </Button>
              <Button 
                variant={activeSection === "pitfalls" ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setActiveSection("pitfalls")}
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Common Pitfalls
              </Button>
            </CardContent>
          </Card>

          {/* Quick Reference */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Info className="w-4 h-4" />
                Quick Reference
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-2 border rounded">
                  <div className="text-xs text-gray-600">Authentication</div>
                  <div className="font-medium text-sm">Who are you?</div>
                </div>
                <div className="p-2 border rounded">
                  <div className="text-xs text-gray-600">Authorization</div>
                  <div className="font-medium text-sm">What can you do?</div>
                </div>
                <div className="p-2 border rounded">
                  <div className="text-xs text-gray-600">Access Control</div>
                  <div className="font-medium text-sm">How is access managed?</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CIA Triad */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                CIA Triad & Access Control
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                  <span className="text-sm font-medium">Confidentiality</span>
                  <Badge variant="default">Access Control</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  <span className="text-sm font-medium">Integrity</span>
                  <Badge variant="secondary">Write Controls</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                  <span className="text-sm font-medium">Availability</span>
                  <Badge variant="outline">Access Management</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle Column: Content */}
        <div className="lg:col-span-2">
          {activeSection === "models" && (
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-6 h-6" />
                  Access Control Models & Frameworks
                </CardTitle>
                <CardDescription>
                  Different approaches to controlling access to resources
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
                      <div className="font-bold">Subject</div>
                      <div className="text-xs">Requests Access</div>
                    </div>
                    
                    <ArrowRight className="w-6 h-6" />
                    
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center mx-auto mb-2">
                        <Shield className="w-6 h-6 text-white" />
                      </div>
                      <div className="font-bold">Access Control</div>
                      <div className="text-xs">Evaluates Request</div>
                    </div>
                    
                    <ArrowRight className="w-6 h-6" />
                    
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-2">
                        <Database className="w-6 h-6 text-white" />
                      </div>
                      <div className="font-bold">Object</div>
                      <div className="text-xs">Resource Accessed</div>
                    </div>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg bg-white dark:bg-gray-800">
                    <div className="text-sm font-mono">
                      Access_Check(Subject, Object, Operation) → Allow/Deny
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      Fundamental access control decision function
                    </div>
                  </div>
                </div>

                {/* Access Control Models */}
                <div className="space-y-4">
                  <h3 className="font-bold text-lg">Access Control Models</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {accessControlModels.map((model, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                              {model.icon}
                            </div>
                            <div>
                              <h4 className="font-bold">{model.name}</h4>
                              <Badge variant="outline">{model.acronym}</Badge>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setShowExamples({
                              ...showExamples,
                              [model.acronym]: !showExamples[model.acronym]
                            })}
                          >
                            {showExamples[model.acronym] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">{model.description}</p>
                        
                        {showExamples[model.acronym] && (
                          <div className="mb-3 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                            <div className="text-xs font-medium mb-1">Example:</div>
                            <div className="text-xs">{model.example}</div>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between text-sm">
                          <div>
                            <span className="text-gray-600">Use Case: </span>
                            <span className="font-medium">{model.useCase}</span>
                          </div>
                          <Badge variant={
                            model.strength.includes("secure") ? "default" :
                            model.strength.includes("Flexible") ? "secondary" : "outline"
                          }>
                            {model.strength}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Theory Concepts */}
                <div className="space-y-4">
                  {theoryConcepts
                    .filter(concept => concept.category === "models")
                    .map((concept) => (
                    <div key={concept.id} className="border rounded-lg overflow-hidden">
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
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
                              <div className="w-4 h-4 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <div className="w-2 h-2 rounded-full bg-purple-600 dark:bg-purple-400"></div>
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

          {activeSection === "principles" && (
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6" />
                  Security Principles
                </CardTitle>
                <CardDescription>
                  Fundamental principles guiding access control design and implementation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Security Principles */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {securityPrinciples.map((principle, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`p-2 rounded-lg ${
                            principle.importance === "critical" ? "bg-red-100 dark:bg-red-900/20" :
                            principle.importance === "high" ? "bg-amber-100 dark:bg-amber-900/20" :
                            "bg-blue-100 dark:bg-blue-900/20"
                          }`}>
                            {principle.icon}
                          </div>
                          <div>
                            <h4 className="font-bold">{principle.name}</h4>
                            <Badge variant={
                              principle.importance === "critical" ? "destructive" :
                              principle.importance === "high" ? "secondary" : "outline"
                            }>
                              {principle.importance}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm">{principle.description}</p>
                      </div>
                    ))}
                  </div>

                  {/* Theory Concepts */}
                  <div className="space-y-4">
                    {theoryConcepts
                      .filter(concept => concept.category === "principles")
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

                  {/* Least Privilege Example */}
                  <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-900/20">
                    <div className="flex items-center gap-3 mb-3">
                      <Lock className="w-5 h-5 text-green-600" />
                      <h4 className="font-bold text-lg">Least Privilege in Practice</h4>
                    </div>
                    <div className="grid md:grid-cols-3 gap-3 text-sm">
                      <div className="p-3 bg-white dark:bg-gray-800 rounded">
                        <div className="font-medium mb-1">Database Administrator</div>
                        <p>Full access to databases, but no access to HR files</p>
                      </div>
                      <div className="p-3 bg-white dark:bg-gray-800 rounded">
                        <div className="font-medium mb-1">Customer Support</div>
                        <p>Read-only access to customer data, no financial access</p>
                      </div>
                      <div className="p-3 bg-white dark:bg-gray-800 rounded">
                        <div className="font-medium mb-1">Marketing Team</div>
                        <p>Access to marketing assets, no production system access</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === "implementation" && (
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-6 h-6" />
                  Implementation Components
                </CardTitle>
                <CardDescription>
                  Technical components and implementation approaches
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Implementation Components */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {implementationComponents.map((component, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold">{component.component}</h4>
                          <Badge variant="outline">{component.type}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{component.description}</p>
                        <div className="text-xs bg-gray-50 dark:bg-gray-800 p-2 rounded">
                          Example: {component.example}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Theory Concepts */}
                  <div className="space-y-4">
                    {theoryConcepts
                      .filter(concept => concept.category === "implementation")
                      .map((concept) => (
                      <div key={concept.id} className="border rounded-lg overflow-hidden">
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
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
                                <div className="w-4 h-4 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <div className="w-2 h-2 rounded-full bg-amber-600 dark:bg-amber-400"></div>
                                </div>
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Implementation Checklist */}
                  <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <h4 className="font-bold mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                      Implementation Checklist
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>Define clear access control policies and requirements</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>Choose appropriate access control model for your needs</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>Implement least privilege principle for all users</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>Set up comprehensive audit logging and monitoring</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>Establish regular access review processes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>Test and validate access controls regularly</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === "layers" && (
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="w-6 h-6" />
                  Security Layers
                </CardTitle>
                <CardDescription>
                  Multiple layers of access control in defense-in-depth strategy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Security Layers */}
                  <div className="space-y-4">
                    {accessControlLayers.map((layer, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                            {layer.icon}
                          </div>
                          <div>
                            <h4 className="font-bold text-lg">{layer.layer} Layer</h4>
                            <p className="text-sm text-gray-600">{layer.description}</p>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <div className="text-xs font-medium mb-1">Examples:</div>
                          <div className="flex flex-wrap gap-1">
                            {layer.examples.map((example, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {example}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-600">
                          This layer prevents unauthorized access at the {layer.layer.toLowerCase()} level
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Defense in Depth Visualization */}
                  <div className="p-6 border-2 border-primary rounded-lg bg-primary/5">
                    <div className="text-center mb-4">
                      <h4 className="font-bold text-lg mb-2">Defense in Depth Strategy</h4>
                      <p className="text-sm text-gray-600">
                        Multiple layers of security controls protecting resources
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      {[...accessControlLayers].reverse().map((layer, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                            {accessControlLayers.length - index}
                          </div>
                          <div className="flex-1 p-3 border rounded-lg bg-white dark:bg-gray-800">
                            <div className="font-medium">{layer.layer} Controls</div>
                            <div className="text-xs text-gray-600">{layer.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                      <div className="text-sm">
                        Each layer adds protection. Attackers must bypass ALL layers to succeed.
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === "pitfalls" && (
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6" />
                  Common Pitfalls & Solutions
                </CardTitle>
                <CardDescription>
                  Mistakes to avoid and how to address common challenges
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Common Pitfalls */}
                  <div className="space-y-4">
                    {commonPitfalls.map((pitfall, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <XCircle className="w-5 h-5 text-red-600" />
                          <div>
                            <h4 className="font-bold text-lg">{pitfall.pitfall}</h4>
                            <p className="text-sm text-gray-600">{pitfall.description}</p>
                          </div>
                        </div>
                        
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded">
                          <div className="text-sm font-medium text-green-700 dark:text-green-400">
                            Solution: {pitfall.solution}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Best Practices Summary */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                      <AlertTitle>Proactive Measures</AlertTitle>
                      <AlertDescription className="text-sm">
                        • Regular access reviews<br/>
                        • Automated permission management<br/>
                        • Continuous monitoring<br/>
                        • Security awareness training<br/>
                        • Incident response planning
                      </AlertDescription>
                    </Alert>
                    
                    <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <AlertTitle>Positive Outcomes</AlertTitle>
                      <AlertDescription className="text-sm">
                        • Reduced security incidents<br/>
                        • Improved compliance<br/>
                        • Better audit trails<br/>
                        • Increased user accountability<br/>
                        • Enhanced data protection
                      </AlertDescription>
                    </Alert>
                  </div>

                  {/* Risk Management */}
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-bold mb-3">Risk-Based Access Control</h4>
                    <div className="space-y-3 text-sm">
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                        <div className="font-medium mb-1">Assess Risk Factors</div>
                        <p>User role, resource sensitivity, location, time, device security</p>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                        <div className="font-medium mb-1">Dynamic Controls</div>
                        <p>Adjust access requirements based on current risk assessment</p>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                        <div className="font-medium mb-1">Continuous Monitoring</div>
                        <p>Real-time evaluation of access patterns and anomalies</p>
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
            Access Control Theory Summary
          </CardTitle>
          <CardDescription>
            Essential knowledge about controlling resource access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-bold flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600" />
                Key Models
              </h4>
              <ul className="space-y-1 text-sm">
                <li>• DAC: Owner-controlled permissions</li>
                <li>• MAC: System-enforced security</li>
                <li>• RBAC: Role-based permissions</li>
                <li>• ABAC: Attribute-based controls</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-bold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                Core Principles
              </h4>
              <ul className="space-y-1 text-sm">
                <li>• Least privilege</li>
                <li>• Need to know</li>
                <li>• Separation of duties</li>
                <li>• Defense in depth</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-bold flex items-center gap-2">
                <Settings className="w-4 h-4 text-purple-600" />
                Implementation
              </h4>
              <ul className="space-y-1 text-sm">
                <li>• Access control lists (ACLs)</li>
                <li>• Multi-layer security</li>
                <li>• Regular audits</li>
                <li>• Risk-based controls</li>
              </ul>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <Alert>
            <Zap className="w-4 h-4" />
            <AlertDescription>
              <strong>Critical Insight:</strong> Effective access control is not about saying "no" to everything, 
              but about intelligently saying "yes" to the right things. It balances security needs with 
              business requirements, enabling productivity while protecting resources.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}