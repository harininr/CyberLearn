// File: digitalsignature-module-simulation.tsx
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
import { Progress } from "@/components/ui/progress";
import {
  FileSignature,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  Shield,
  ShieldAlert,
  Key,
  UserCheck,
  FileCheck,
  Hash,
  Download,
  Upload,
  Server,
  Smartphone,
  Laptop,
  Apple,
  Monitor,
  Terminal,
  Cpu,
  AlertTriangle,
  Info,
  ChevronRight,
  RefreshCw,
  Clock,
  Globe,
  ShieldCheck,
  FileCode,
  Package,
  Wifi,
  Database,
  ArrowRight,
  Zap,
  User
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";


type SimulationStep = {
  id: number;
  title: string;
  description: string;
  vendorAction: string;
  deviceAction: string;
  icon: React.ReactNode;
};

type Platform = "windows" | "android" | "macos";

export default function DigitalSignatureSimulation() {
  const [activePlatform, setActivePlatform] = useState<Platform>("windows");
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isUpdateTampered, setIsUpdateTampered] = useState<boolean>(false);
  const [showEncrypted, setShowEncrypted] = useState<boolean>(false);
  const [updateProgress, setUpdateProgress] = useState<number>(0);

  const { toast } = useToast();

  const activityMutation = useMutation({
    mutationFn: async (action: string) => {
      await apiRequest("POST", "/api/simulation/activity/log", {
        module: "digital-signature",
        timestamp: new Date().toISOString(),
        action,
        details: `Platform: ${activePlatform} - ${action}`
      });
    }
  });


  const steps = [
    {
      id: 1,
      title: "Key Generation",
      description: "Vendor generates RSA key pair",
      //Vendor key generation and signing
      vendorAction: "openssl genrsa -out private.key 2048",
      deviceAction: "Waiting...",
      icon: <Key className="w-5 h-5" />
    },
    {
      id: 2,
      title: "Public Key Distribution",
      description: "Embed public key in OS/firmware",
      //Hardware Security Module embedded in OS
      vendorAction: "Store in HSM, embed in OS",
      deviceAction: "Public key pre-installed",
      icon: <Unlock className="w-5 h-5" />
    },
    {
      id: 3,
      title: "Create Software Update",
      description: "Compile update binaries",
      vendorAction: "Build: update_v2.3.exe",
      deviceAction: "Waiting...",
      icon: <FileCode className="w-5 h-5" />
    },
    {
      id: 4,
      title: "Hash the Update",
      description: "Generate SHA-256 hash",
      //generate hash for the update
      vendorAction: "SHA256(update_file)",
      deviceAction: "Waiting...",
      icon: <Hash className="w-5 h-5" />
    },
    {
      id: 5,
      title: "Sign the Hash",
      description: "Encrypt hash with private key",
      //encrypt private key with hash
      vendorAction: "Encrypt(Hash, Private_Key)",
      deviceAction: "Waiting...",
      icon: <FileSignature className="w-5 h-5" />
    },
    {
      id: 6,
      title: "Distribute Update",
      description: "Upload to servers/CDN",
      vendorAction: "Upload update + signature",
      deviceAction: "Check for updates",
      icon: <Upload className="w-5 h-5" />
    },
    {
      id: 7,
      title: "User Downloads Update",
      description: "Download through internet",
      vendorAction: "Serve from CDN",
      deviceAction: "Download in progress...",
      icon: <Download className="w-5 h-5" />
    },
    {
      id: 8,
      title: "Extract & Decrypt Signature",
      //decrypt
      description: "Decrypt using public key",
      vendorAction: "Complete",
      deviceAction: "Decrypt(Signature, Public_Key)",
      icon: <Unlock className="w-5 h-5" />
    },
    {
      id: 9,
      title: "Compute New Hash",
      description: "Hash downloaded file",
      vendorAction: "Complete",
      deviceAction: "SHA256(downloaded_file)",
      icon: <Hash className="w-5 h-5" />
    },
    {
      id: 10,
      title: "Compare Hashes",
      description: "Verify signature authenticity",
      vendorAction: "Complete",
      deviceAction: "hash₁ == hash₂ ?",
      icon: <ShieldCheck className="w-5 h-5" />
    },
    {
      id: 11,
      title: "Security Decision",
      description: "Accept or reject update",
      vendorAction: "Complete",
      deviceAction: isUpdateTampered ? "REJECT" : "ACCEPT",
      icon: <CheckCircle className="w-5 h-5" />
    }
  ];

  const platforms = {
    windows: {
      name: "Windows",
      icon: <Monitor className="w-5 h-5" />,
      updateExtension: ".exe",
      signatureMethod: "Authenticode",
      color: "bg-blue-500"
    },
    android: {
      name: "Android",
      icon: <Smartphone className="w-5 h-5" />,
      updateExtension: ".apk",
      signatureMethod: "APK Signature Scheme",
      color: "bg-green-500"
    },
    macos: {
      name: "macOS",
      icon: <Apple className="w-5 h-5" />,
      updateExtension: ".pkg",
      signatureMethod: "Apple Code Signing",
      color: "bg-gray-500"
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);

      if (currentStep + 1 === 5) {
        setShowEncrypted(true);
        activityMutation.mutate("Created Digital Signature");
        toast({
          title: "🔐 Update Signed",
          description: "Digital signature created",
        });
      }


      if (currentStep + 1 === 7) {
        // Simulate download
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          setUpdateProgress(progress);
          if (progress >= 100) {
            clearInterval(interval);
            toast({
              title: "📥 Download Complete",
              description: "Update ready for verification",
            });
          }
        }, 100);
      }

      if (currentStep + 1 === 10) {
        if (isUpdateTampered) {
          activityMutation.mutate("Signature Verification Failed");
          toast({
            title: "⚠️ Verification Failed",
            description: "Update has been tampered with!",
            variant: "destructive"
          });
        } else {
          activityMutation.mutate("Signature Verified Successfully");
          toast({
            title: "✅ Verification Successful",
            description: "Signature is authentic",
          });
        }
      }


      if (currentStep + 1 === 11) {
        if (isUpdateTampered) {
          toast({
            title: "🚨 Update Blocked",
            description: "Security check failed",
            variant: "destructive"
          });
        } else {
          toast({
            title: "🎉 Update Installing",
            description: "Secure update verified",
          });
        }
      }
    }
  };

  const resetSimulation = () => {
    setCurrentStep(0);
    setIsUpdateTampered(false);
    setShowEncrypted(false);
    setUpdateProgress(0);

    toast({
      title: "Simulation Reset",
      description: "Ready to start secure update process",
    });
  };

  const simulateTampering = () => {
    setIsUpdateTampered(true);
    activityMutation.mutate("Malware Injection Simulation");
    toast({
      title: "⚠️ Malware Injected",
      description: "Update modified during download",
      variant: "destructive"
    });
  };


  const getCurrentPlatform = () => platforms[activePlatform];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="w-8 h-8" />
              <h1 className="text-2xl font-bold">Secure Software Updates</h1>
            </div>
            <p className="text-purple-200">
              How digital signatures protect OS updates from malware
            </p>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            Step {currentStep + 1}/{steps.length}
          </Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left Column: Vendor */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <Server className="w-5 h-5 text-white" />
                </div>
                <span>Vendor</span>
              </CardTitle>
              <CardDescription>Microsoft/Google/Apple</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Platform Selection */}
              <div className="space-y-3">
                <Label>Select Platform</Label>
                <div className="grid grid-cols-3 gap-2">
                  {(["windows", "android", "macos"] as Platform[]).map((platform) => (
                    <Button
                      key={platform}
                      variant={activePlatform === platform ? "default" : "outline"}
                      onClick={() => setActivePlatform(platform)}
                      className={`h-auto py-2 ${activePlatform === platform ? platforms[platform].color : ""}`}
                    >
                      {platforms[platform].icon}
                    </Button>
                  ))}
                </div>
                <div className="text-center text-sm font-medium">
                  {getCurrentPlatform().name}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Status</span>
                  <Badge variant={
                    currentStep <= 6 ? "default" : "secondary"
                  }>
                    {currentStep <= 6 ? "Signing" : "Complete"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Update</span>
                  <span className="text-sm font-mono">
                    v2.3{getCurrentPlatform().updateExtension}
                  </span>
                </div>
              </div>

              <Alert className="bg-blue-500/10 border-blue-500/20">
                <Lock className="w-4 h-4" />
                <AlertDescription className="text-sm">
                  Private key stays in secure HSM.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>

        {/* Middle Column: Steps */}
        <div className="lg:col-span-3">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {steps[currentStep]?.icon}
                  Step {currentStep + 1}: {steps[currentStep]?.title}
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={resetSimulation}
                  >
                    Reset
                  </Button>
                  <Button
                    onClick={nextStep}
                    disabled={currentStep >= steps.length - 1}
                  >
                    {currentStep >= steps.length - 1 ? "Complete" : "Next Step"}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
              <CardDescription>
                {steps[currentStep]?.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Visual Flow */}
              <div className="flex items-center justify-between mb-8">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center mx-auto mb-2">
                    <Server className="w-6 h-6 text-white" />
                  </div>
                  <div className="font-bold">Vendor</div>
                  <div className="text-xs text-muted-foreground">Signs</div>
                </div>

                <ArrowRight className="w-6 h-6" />

                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center mx-auto mb-2">
                    <Wifi className="w-6 h-6 text-white" />
                  </div>
                  <div className="font-bold">Internet</div>
                  <div className="text-xs text-muted-foreground">Transmission</div>
                </div>

                <ArrowRight className="w-6 h-6" />

                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-2">
                    {activePlatform === "windows" && <Monitor className="w-6 h-6 text-white" />}
                    {activePlatform === "android" && <Smartphone className="w-6 h-6 text-white" />}
                    {activePlatform === "macos" && <Apple className="w-6 h-6 text-white" />}
                  </div>
                  <div className="font-bold">Your Device</div>
                  <div className="text-xs text-muted-foreground">Verifies</div>
                </div>
              </div>

              {/* Current Step Visualization */}
              <div className="p-6 border-2 border-primary rounded-lg bg-primary/5 mb-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-4 border rounded-lg bg-blue-500/5">
                    <div className="text-sm font-bold mb-2">Vendor Action</div>
                    <div className="text-sm font-mono text-xs">
                      {steps[currentStep]?.vendorAction}
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg bg-green-500/5">
                    <div className="text-sm font-bold mb-2">Device Action</div>
                    <div className="text-sm font-mono text-xs">
                      {steps[currentStep]?.deviceAction}
                    </div>
                  </div>
                </div>

                {/* Step-specific visualizations */}
                {currentStep === 0 && (
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <div className="text-sm">
                      <strong>Private Key:</strong> RSA-2048 generated in HSM
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="p-3 bg-green-500/10 rounded-lg">
                    <div className="text-sm">
                      <strong>Public Key Embedded:</strong> In {getCurrentPlatform().name} firmware
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <div className="text-sm">
                      <strong>Update Package:</strong> update_v2.3{getCurrentPlatform().updateExtension}
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="p-3 bg-purple-500/10 rounded-lg">
                    <div className="text-sm">
                      <strong>SHA-256 Hash:</strong> 9f86d081884c7d659a2feaa0c55ad015...
                    </div>
                  </div>
                )}

                {showEncrypted && currentStep >= 4 && (
                  <div className="p-3 bg-red-500/10 rounded-lg">
                    <div className="text-sm font-bold mb-1">Digital Signature:</div>
                    <div className="text-xs font-mono">
                      3045022100d4b395d1b7c6e8f9a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5
                    </div>
                  </div>
                )}

                {currentStep === 6 && (
                  <div className="p-3 bg-yellow-500/10 rounded-lg">
                    <div className="text-sm">
                      <strong>Distribution:</strong> Uploaded to global CDN
                    </div>
                  </div>
                )}

                {currentStep === 6 && (
                  <div className="mt-4">
                    <div className="text-sm font-bold mb-2">CDN Distribution:</div>
                    <div className="flex items-center justify-center gap-6">
                      <div className="text-center">
                        <Server className="w-8 h-8 text-blue-500 mx-auto mb-1" />
                        <div className="text-xs">Origin</div>
                      </div>
                      <ArrowRight className="w-4 h-4" />
                      <div className="text-center">
                        <Globe className="w-8 h-8 text-green-500 mx-auto mb-1" />
                        <div className="text-xs">CDN</div>
                      </div>
                      <ArrowRight className="w-4 h-4" />
                      <div className="text-center">
                        <Wifi className="w-8 h-8 text-purple-500 mx-auto mb-1" />
                        <div className="text-xs">Internet</div>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 7 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Download Progress</span>
                      <span>{updateProgress}%</span>
                    </div>
                    <Progress value={updateProgress} className="h-2" />
                    {updateProgress < 100 && (
                      <p className="text-xs text-muted-foreground animate-pulse">
                        Downloading update...
                      </p>
                    )}
                  </div>
                )}

                {currentStep >= 8 && currentStep <= 10 && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 border rounded-lg">
                        <div className="text-xs font-bold mb-1">Original Hash (from signature):</div>
                        <div className="text-xs font-mono">
                          9f86d081884c7d659a2feaa0c55ad015...
                        </div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="text-xs font-bold mb-1">Computed Hash (downloaded file):</div>
                        <div className="text-xs font-mono">
                          {isUpdateTampered ? "a7f5c9d8e3b2a1f5c8d9e3b2a1f5c8d9..." : "9f86d081884c7d659a2feaa0c55ad015..."}
                        </div>
                      </div>
                    </div>

                    {currentStep === 10 && (
                      <div className={`p-3 rounded-lg ${isUpdateTampered ? 'bg-red-500/10' : 'bg-green-500/10'
                        }`}>
                        <div className="flex items-center gap-2">
                          {isUpdateTampered ? (
                            <XCircle className="w-5 h-5 text-red-600" />
                          ) : (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          )}
                          <span className={`font-bold ${isUpdateTampered ? 'text-red-600' : 'text-green-600'
                            }`}>
                            {isUpdateTampered ? "Hashes Don't Match ✗" : "Hashes Match ✓"}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {currentStep === 11 && (
                  <div className={`p-4 rounded-lg ${isUpdateTampered ? 'bg-red-500/10 border-red-500/20' : 'bg-green-500/10 border-green-500/20'
                    }`}>
                    <div className="flex items-center gap-3">
                      {isUpdateTampered ? (
                        <XCircle className="w-8 h-8 text-red-600" />
                      ) : (
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      )}
                      <div>
                        <h3 className="font-bold text-lg">
                          {isUpdateTampered ? "UPDATE REJECTED" : "UPDATE ACCEPTED"}
                        </h3>
                        <p>
                          {isUpdateTampered
                            ? "Security check failed! Update may be malware."
                            : "Secure update verified. Installing..."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* All Steps */}
              <div className="space-y-2">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`p-3 border rounded-lg flex items-center gap-3 ${index === currentStep ? 'border-primary bg-primary/5' : ''
                      } ${index < currentStep ? 'border-green-500/30 bg-green-500/5' : ''}`}
                  >
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center
                      ${index === currentStep ? 'bg-primary text-primary-foreground' : ''}
                      ${index < currentStep ? 'bg-green-500 text-white' : 'bg-muted'}
                    `}>
                      {step.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">Step {step.id}: {step.title}</div>
                      <div className="text-xs text-muted-foreground">{step.description}</div>
                    </div>
                    {index < currentStep && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Device */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full ${getCurrentPlatform().color} flex items-center justify-center`}>
                  {getCurrentPlatform().icon}
                </div>
                <span>Your Device</span>
              </CardTitle>
              <CardDescription>{getCurrentPlatform().name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <Badge variant={
                    currentStep < 7 ? "outline" :
                      currentStep < 10 ? "secondary" : "default"
                  }>
                    {currentStep < 7 ? "Waiting" :
                      currentStep < 10 ? "Verifying" : "Complete"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Security</span>
                  <span className="text-sm">
                    {currentStep < 7 ? "Pending" :
                      isUpdateTampered ? "Failed" : "Verified"}
                  </span>
                </div>
              </div>

              <Separator />

              {/* Device View */}
              <div className="space-y-3">
                <div className="text-sm font-medium">What Your Device Sees:</div>

                {currentStep < 7 ? (
                  <div className="p-4 border rounded-lg bg-gray-100 dark:bg-gray-800 text-center">
                    <div className="text-muted-foreground">
                      Checking for updates...
                    </div>
                  </div>
                ) : currentStep === 7 ? (
                  <div className="p-4 border rounded-lg bg-blue-500/10">
                    <div className="text-sm font-bold mb-1">📥 Downloading Update</div>
                    <Progress value={updateProgress} className="h-2 mb-2" />
                    <div className="text-xs text-muted-foreground">
                      {updateProgress}% complete
                    </div>
                  </div>
                ) : currentStep < 10 ? (
                  <div className="p-4 border rounded-lg bg-yellow-500/10">
                    <div className="text-sm font-bold mb-1">🔍 Verifying Signature</div>
                    <div className="text-xs font-mono">
                      Checking digital signature...
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      Using {getCurrentPlatform().signatureMethod}
                    </div>
                  </div>
                ) : (
                  <div className={`p-4 border rounded-lg ${isUpdateTampered ? 'bg-red-500/10' : 'bg-green-500/10'
                    }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {isUpdateTampered ? (
                        <ShieldAlert className="w-5 h-5 text-red-600" />
                      ) : (
                        <ShieldCheck className="w-5 h-5 text-green-600" />
                      )}
                      <div className="text-sm font-bold">
                        {isUpdateTampered ? "Security Alert" : "Update Verified"}
                      </div>
                    </div>
                    <p className="text-sm">
                      {isUpdateTampered
                        ? "❌ Update blocked - Potential malware"
                        : "✅ Secure update ready to install"}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsUpdateTampered(false)}
                  className="w-full"
                  disabled={currentStep < 7}
                >
                  Simulate Clean Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={simulateTampering}
                  className="w-full border-red-300 text-red-600 hover:bg-red-50"
                  disabled={currentStep < 7}
                >
                  Simulate Tampered Download
                </Button>
              </div>

              <Alert className="bg-green-500/10 border-green-500/20">
                <Shield className="w-4 h-4" />
                <AlertDescription className="text-sm">
                  Only verified updates can install.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Security Properties */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              Authentication
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-1">
              <div>• Update is from real vendor</div>
              <div>• Uses vendor's private key</div>
              <div>• Verified by public key</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileCheck className="w-4 h-4" />
              Integrity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-1">
              <div>• Hash detects any changes</div>
              <div>• Tampering breaks signature</div>
              <div>• Ensures complete file</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              Non-repudiation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-1">
              <div>• Vendor cannot deny update</div>
              <div>• Mathematical proof</div>
              <div>• Creates audit trail</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              Platform Specific
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-1">
              <div>• Windows: Authenticode</div>
              <div>• Android: APK Signing</div>
              <div>• macOS: Code Signing</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Final Alert */}
      {currentStep >= steps.length - 1 ? (
        <Alert className={
          isUpdateTampered
            ? "bg-red-500/10 border-red-500/20"
            : "bg-green-500/10 border-green-500/20"
        }>
          {isUpdateTampered ? (
            <XCircle className="w-4 h-4 text-red-600" />
          ) : (
            <CheckCircle className="w-4 h-4 text-green-600" />
          )}
          <AlertTitle>
            {isUpdateTampered ? "Security Alert!" : "Update Verified!"}
          </AlertTitle>
          <AlertDescription>
            {isUpdateTampered
              ? "Digital signature verification failed. The update may be malware and has been blocked from installing."
              : "Digital signature verified successfully! The update is authentic from the vendor and can be safely installed."}
          </AlertDescription>
        </Alert>
      ) : (
        <Alert>
          <Zap className="w-4 h-4" />
          <AlertDescription>
            <strong>Click "Next Step" to continue</strong> through the digital signature process.
            Watch how updates are signed by vendors and verified by your device.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}