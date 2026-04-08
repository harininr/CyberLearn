// File: access-control-module-simulation.tsx
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  User,
  GraduationCap,
  FileText,
  Database,
  Lock,
  Shield,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Upload,
  Award,
  Settings,
  BookOpen,
  ChevronRight,
  RefreshCw,
  Zap,
  BarChart,
  Key,
  Fingerprint,
  Plus,
  Trash2,
  ArrowRight,
  History
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { AccessControlPolicy, AccessControlLog } from "@shared/schema";

type UserRole = "student" | "faculty" | "admin" | "guest";
type Resource = "course_materials" | "assignments" | "grades" | "user_database" | "system_settings" | "security_logs";
type Permission = "read" | "write" | "submit" | "grade" | "delete" | "manage";

const ROLES: UserRole[] = ["student", "faculty", "admin", "guest"];
const RESOURCES: Resource[] = ["course_materials", "assignments", "grades", "user_database", "system_settings", "security_logs"];
const PERMISSIONS: Permission[] = ["read", "write", "submit", "grade", "delete", "manage"];

interface Step {
  id: number;
  title: string;
  description: string;
  userAction: string;
  systemAction: string;
  visual: string;
  icon: React.ReactNode;
}

export default function AccessControlSimulation() {
  const [activeRole, setActiveRole] = useState<UserRole>("student");
  const [currentStep, setCurrentStep] = useState(0);
  const [newPolicy, setNewPolicy] = useState<{ role: string, resource: string, permission: string }>({
    role: "student",
    resource: "course_materials",
    permission: "read"
  });

  const { toast } = useToast();

  const { data: policies, isLoading: isLoadingPolicies } = useQuery<AccessControlPolicy[]>({
    queryKey: ["/api/simulation/acm"],
  });

  const { data: serverLogs } = useQuery<AccessControlLog[]>({
    queryKey: ["/api/simulation/acm/logs"],
    refetchInterval: 3000,
  });

  const logMutation = useMutation({
    mutationFn: async (log: Omit<AccessControlLog, "id">) => {
      await apiRequest("POST", "/api/simulation/acm/log", log);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/simulation/acm/logs"] });
    },
  });

  const createPolicyMutation = useMutation({
    mutationFn: async (policy: Omit<AccessControlPolicy, "id">) => {
      await apiRequest("POST", "/api/simulation/acm", policy);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/simulation/acm"] });
      toast({ title: "Policy Added", description: "The new access rule has been stored in SQLite." });
    }
  });


  const deletePolicyMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/simulation/acm/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/simulation/acm"] });
      toast({ title: "Policy Removed", description: "The rule has been deleted from the database." });
    }
  });

  if (isLoadingPolicies) {
    return <div className="p-8 text-center text-muted-foreground">Loading ACM Data...</div>;
  }

  const steps: Step[] = [
    {
      id: 1,
      title: "Authentication",
      description: `User identifies as '${activeRole}' role`,
      userAction: `Login as ${activeRole}`,
      systemAction: "Identity Verified",
      visual: "👤",
      icon: <User className="w-5 h-5" />
    },
    {
      id: 2,
      title: "ACM Lookup",
      description: "Load permissions for this role from SQLite ACM",
      userAction: "Select Resource",
      systemAction: "Scanning matrix...",
      visual: "📋",
      icon: <FileText className="w-5 h-5" />
    },
    {
      id: 3,
      title: "Access Decision",
      description: "Evaluate if role has permission for resource",
      userAction: "Request Access",
      systemAction: "Evaluating Rule...",
      visual: "⚖️",
      icon: <Shield className="w-5 h-5" />
    },
    {
      id: 4,
      title: "Audit Recording",
      description: "Final decision is recorded in persistent logs",
      userAction: "Complete",
      systemAction: "Log Saved to SQLite",
      visual: "📝",
      icon: <History className="w-5 h-5" />
    }
  ];

  const checkPermission = (role: string, resource: string, permission: string) => {
    return policies?.some(p => p.role === role && p.resource === resource && p.permission === permission && p.allowed);
  };

  const attemptAction = (action: Permission, resource: Resource) => {
    const isAllowed = checkPermission(activeRole, resource, action);

    logMutation.mutate({
      timestamp: new Date().toISOString(),
      actor: activeRole,
      action: action,
      resource: resource,
      outcome: isAllowed ? "GRANTED" : "DENIED",
      details: `Interactive attempt: ${activeRole} trying to ${action} ${resource}`
    });

    toast({
      title: isAllowed ? "✅ Access Granted" : "❌ Access Denied",
      description: isAllowed
        ? `Policy allows ${activeRole} to ${action} ${resource}`
        : `No policy found allowing ${activeRole} to ${action} ${resource}`,
      variant: isAllowed ? "default" : "destructive"
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Database className="w-32 h-32" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-500/20 rounded-lg backdrop-blur-sm border border-blue-400/30">
              <Shield className="w-8 h-8 text-blue-300" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Access Control Matrix (ACM)</h1>
              <p className="text-blue-200">Interactive Simulation with Real-time SQLite Persistence</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Badge variant="secondary" className="bg-blue-800/50 text-blue-100 border-blue-700">RBAC Enabled</Badge>
            <Badge variant="secondary" className="bg-emerald-800/50 text-emerald-100 border-emerald-700">SQLite Optimized</Badge>
            <Badge variant="secondary" className="bg-purple-800/50 text-purple-100 border-purple-700">Audit Logging Active</Badge>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ACM Visualization - The Core Matrix */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-2 border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden">
            <CardHeader className="bg-slate-50 dark:bg-slate-900/50 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Table className="w-5 h-5 text-blue-600" />
                    Conceptual Access Control Matrix
                  </CardTitle>
                  <CardDescription>Live matrix representation stored in SQLite</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="bg-white dark:bg-slate-950">
                    Row = Subject (Role)
                  </Badge>
                  <Badge variant="outline" className="bg-white dark:bg-slate-950">
                    Column = Object (Resource)
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-100 dark:bg-slate-900">
                      <TableHead className="w-[150px] font-bold text-slate-900 dark:text-slate-100">Subjects \ Objects</TableHead>
                      {RESOURCES.map(res => (
                        <TableHead key={res} className="text-center font-semibold capitalize min-w-[120px]">
                          {res.replace('_', ' ')}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ROLES.map(role => (
                      <TableRow key={role} className={activeRole === role ? "bg-blue-50/50 dark:bg-blue-900/10" : ""}>
                        <TableCell className="font-bold flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${role === 'admin' ? 'bg-purple-500' :
                            role === 'faculty' ? 'bg-green-500' :
                              role === 'student' ? 'bg-blue-500' : 'bg-slate-400'
                            }`} />
                          <span className="capitalize">{role}</span>
                        </TableCell>
                        {RESOURCES.map(res => {
                          const rolePolicies = policies?.filter(p => p.role === role && p.resource === res && p.allowed);
                          return (
                            <TableCell key={res} className="text-center">
                              {rolePolicies && rolePolicies.length > 0 ? (
                                <div className="flex flex-wrap gap-1 justify-center">
                                  {rolePolicies.map(p => (
                                    <Badge
                                      key={p.id}
                                      variant="secondary"
                                      className="text-[10px] px-1 group relative cursor-help"
                                    >
                                      {p.permission}
                                      <button
                                        onClick={() => deletePolicyMutation.mutate(p.id)}
                                        className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-red-500"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </Badge>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-muted-foreground text-xs italic">none</span>
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50 dark:bg-slate-900/50 border-t p-4">
              <div className="flex flex-wrap gap-4 items-end w-full">
                <div className="flex-1 space-y-1">
                  <label className="text-xs font-medium">Add Policy: Role</label>
                  <Select value={newPolicy.role} onValueChange={(v) => setNewPolicy({ ...newPolicy, role: v })}>
                    <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {ROLES.map(r => <SelectItem key={r} value={r} className="capitalize">{r}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-xs font-medium">Resource</label>
                  <Select value={newPolicy.resource} onValueChange={(v) => setNewPolicy({ ...newPolicy, resource: v })}>
                    <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {RESOURCES.map(r => <SelectItem key={r} value={r} className="capitalize">{r.replace('_', ' ')}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-xs font-medium">Permission</label>
                  <Select value={newPolicy.permission} onValueChange={(v) => setNewPolicy({ ...newPolicy, permission: v })}>
                    <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {PERMISSIONS.map(p => <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => createPolicyMutation.mutate({ ...newPolicy, allowed: true })}
                  disabled={createPolicyMutation.isPending}
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Rule
                </Button>
              </div>
            </CardFooter>
          </Card>

          {/* Interactive Simulation Flow */}
          <Card className="border-2 border-slate-200 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Decision Flow Simulation</CardTitle>
                <CardDescription>Tracing a real request through the system</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setCurrentStep(0)}>Reset Flow</Button>
                <Button size="sm" onClick={() => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))}>
                  Next Step <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative pt-4 pb-8">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-800 -translate-y-1/2" />
                <div className="relative flex justify-between items-center z-10">
                  {steps.map((step, idx) => (
                    <div key={step.id} className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${idx === currentStep ? "bg-blue-600 border-blue-400 text-white scale-125 shadow-lg" :
                        idx < currentStep ? "bg-emerald-500 border-emerald-400 text-white" :
                          "bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-slate-400"
                        }`}>
                        {idx < currentStep ? <CheckCircle className="w-6 h-6" /> : step.icon}
                      </div>
                      <span className={`text-[10px] mt-2 font-bold uppercase transition-colors ${idx === currentStep ? "text-blue-600" : "text-slate-500"}`}>
                        {step.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900 border rounded-xl p-6 mt-4">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{steps[currentStep].visual}</div>
                      <div>
                        <h3 className="font-bold text-lg">{steps[currentStep].title}</h3>
                        <p className="text-sm text-muted-foreground">{steps[currentStep].description}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="p-3 bg-white dark:bg-slate-950 border rounded-lg">
                        <span className="text-xs text-slate-500 block mb-1">User Action:</span>
                        <p className="text-sm font-medium">{steps[currentStep].userAction}</p>
                      </div>
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg">
                        <span className="text-xs text-blue-500 block mb-1">System Action:</span>
                        <p className="text-sm font-medium">{steps[currentStep].systemAction}</p>
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:flex justify-center">
                    <div className="relative">
                      <Shield className={`w-32 h-32 transition-colors duration-500 ${currentStep >= 2 ? "text-emerald-500" : "text-slate-200"}`} />
                      <Lock className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 transition-all duration-500 ${currentStep >= 2 ? "opacity-0 scale-50" : "opacity-100"}`} />
                      <CheckCircle className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 transition-all duration-500 ${currentStep >= 3 ? "opacity-100 scale-100" : "opacity-0 scale-50 text-emerald-500"}`} />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Control Panel & Logs */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Role Selection</CardTitle>
              <CardDescription>Act as a different Subject</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              {ROLES.map(role => (
                <Button
                  key={role}
                  variant={activeRole === role ? "default" : "outline"}
                  onClick={() => {
                    setActiveRole(role);
                    setCurrentStep(0);
                    toast({ title: "Switched Role", description: `You are now operating as ${role.toUpperCase()}` });
                  }}
                  className="capitalize"
                >
                  {role}
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-slate-900 text-slate-100 border-none shadow-xl">
            <CardHeader className="border-b border-slate-800">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Subject Operations</span>
                <Badge className="bg-emerald-500">Live DB</Badge>
              </CardTitle>
              <CardDescription className="text-slate-400">Force an access check</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <p className="text-xs text-slate-400 italic">Try accessing these objects with your current subject ({activeRole}):</p>
              <div className="grid gap-2">
                <Button variant="secondary" size="sm" className="w-full justify-start gap-2" onClick={() => attemptAction("read", "course_materials")}>
                  <BookOpen className="w-4 h-4" /> Read Course Materials
                </Button>
                <Button variant="secondary" size="sm" className="w-full justify-start gap-2" onClick={() => attemptAction("write", "assignments")}>
                  <Edit className="w-4 h-4" /> Submit Assignments
                </Button>
                <Button variant="secondary" size="sm" className="w-full justify-start gap-2" onClick={() => attemptAction("manage", "user_database")}>
                  <Database className="w-4 h-4" /> Manage User DB
                </Button>
                <Button variant="destructive" size="sm" className="w-full justify-start gap-2" onClick={() => attemptAction("delete", "security_logs")}>
                  <Trash2 className="w-4 h-4" /> Purge Security Logs
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="h-[400px] flex flex-col">
            <CardHeader className="flex-shrink-0">
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="w-4 h-4 text-blue-600" />
                Audit Log (SQLite)
              </CardTitle>
              <CardDescription>Immutable record of all attempts</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow overflow-y-auto pb-6">
              <div className="space-y-3">
                {serverLogs && serverLogs.length > 0 ? (
                  serverLogs.map((log) => (
                    <div key={log.id} className="p-3 bg-slate-50 dark:bg-slate-900 border rounded-lg text-xs">
                      <div className="flex justify-between mb-1">
                        <span className="font-bold uppercase text-[10px] text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                        <Badge variant={log.outcome === "GRANTED" ? "default" : "destructive"} className="h-4 text-[9px]">
                          {log.outcome}
                        </Badge>
                      </div>
                      <p>Subject: <span className="font-semibold">{log.actor}</span></p>
                      <p>Action: <span className="font-semibold capitalize text-blue-600 dark:text-blue-400">{log.action}</span> on <span className="font-semibold">{log.resource.replace('_', ' ')}</span></p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-muted-foreground text-sm">No activity recorded yet</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}