// File: chat-cryptography-simulation.tsx
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  MessageSquare,
  Lock,
  Unlock,
  Key,
  Hash,
  User,
  Send,
  CheckCircle,
  ArrowRight,
  Smartphone,
  Server,
  FileLock,
  Shield,
  Zap,
  ChevronRight,
  Fingerprint,
  Mail
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";


type Step = {
  id: number;
  title: string;
  description: string;
  senderAction: string;
  receiverAction: string;
  visual: string;
  icon: React.ReactNode;
};

export default function ChatCryptographySimulation() {
  const [message, setMessage] = useState("Hi Bob, let's meet at 3 PM");
  const [currentStep, setCurrentStep] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  const [showEncrypted, setShowEncrypted] = useState(false);

  const { toast } = useToast();

  const activityMutation = useMutation({
    mutationFn: async (action: string) => {
      await apiRequest("POST", "/api/simulation/activity/log", {
        module: "crypto",
        timestamp: new Date().toISOString(),
        action,
        details: `Message: "${message.substring(0, 20)}..." - ${action}`
      });
    }
  });


  const steps: Step[] = [
    {
      id: 1,
      title: "Alice Types Message",
      description: "Alice composes a plaintext message",
      senderAction: "Type: 'Hi Bob, let's meet at 3 PM'",
      receiverAction: "Waiting...",
      visual: "📝",
      icon: <MessageSquare className="w-5 h-5" />
    },
    {
      id: 2,
      title: "Generate Session Key",
      description: "Alice's device creates random AES-256 key",
      senderAction: "Generate: AES-256 Key",
      receiverAction: "Waiting...",
      visual: "🔑",
      icon: <Key className="w-5 h-5" />
    },
    {
      id: 3,
      title: "Encrypt Session Key",
      description: "Encrypt AES key with Bob's public key",
      senderAction: "RSA(Bob's Public Key, Session Key)",
      receiverAction: "Waiting...",
      visual: "🔐",
      icon: <Lock className="w-5 h-5" />
    },
    {
      id: 4,
      title: "Encrypt Message",
      description: "Encrypt message with AES session key",
      senderAction: "AES(Session Key, Message)",
      receiverAction: "Waiting...",
      visual: "📨",
      icon: <FileLock className="w-5 h-5" />
    },
    {
      id: 5,
      title: "Generate Hash",
      description: "Create SHA-256 hash for integrity check",
      senderAction: "SHA256(Message) → Hash",
      receiverAction: "Waiting...",
      visual: "🔢",
      icon: <Hash className="w-5 h-5" />
    },
    {
      id: 6,
      title: "Send to Server",
      description: "Send encrypted data through server",
      senderAction: "Send encrypted package",
      receiverAction: "Receiving from server",
      visual: "📡",
      icon: <Send className="w-5 h-5" />
    },
    {
      id: 7,
      title: "Decrypt Session Key",
      description: "Bob decrypts session key with private key",
      senderAction: "Complete",
      receiverAction: "RSA(Bob's Private Key, Encrypted Key)",
      visual: "🔓",
      icon: <Unlock className="w-5 h-5" />
    },
    {
      id: 8,
      title: "Decrypt Message",
      description: "Bob decrypts message with AES key",
      senderAction: "Complete",
      receiverAction: "AES(Decrypted Key, Encrypted Message)",
      visual: "📖",
      icon: <Unlock className="w-5 h-5" />
    },
    {
      id: 9,
      title: "Verify Integrity",
      description: "Check hash matches original",
      senderAction: "Complete",
      receiverAction: "SHA256(Decrypted) == Received Hash",
      visual: "✅",
      icon: <CheckCircle className="w-5 h-5" />
    },
    {
      id: 10,
      title: "Message Received",
      description: "Bob reads the decrypted message",
      senderAction: "Complete",
      receiverAction: "Read: 'Hi Bob, let's meet at 3 PM'",
      visual: "👁️",
      icon: <User className="w-5 h-5" />
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);

      // Show message after step 4
      if (currentStep + 1 === 4) {
        setShowEncrypted(true);
      }

      // Show message after step 9
      if (currentStep + 1 === 9) {
        setShowMessage(true);
        activityMutation.mutate("Decrypted Message");
        toast({
          title: "✅ Message Decrypted!",
          description: "Bob can now read the message",
        });
      }

    } else {
      toast({
        title: "Process Complete!",
        description: "Message successfully delivered and decrypted",
      });
    }
  };

  const resetSimulation = () => {
    setCurrentStep(0);
    setShowMessage(false);
    setShowEncrypted(false);
    setMessage("Hi Bob, let's meet at 3 PM");

    toast({
      title: "Simulation Reset",
      description: "Start from the beginning",
    });
  };

  const sendNewMessage = () => {
    if (!message.trim()) {
      toast({
        title: "Enter a message",
        description: "Type something to send",
        variant: "destructive"
      });
      return;
    }

    resetSimulation();
    nextStep(); // Start at step 1
    activityMutation.mutate("Sent New Message");

    toast({
      title: "Message Sent",
      description: "Click Next Step to follow encryption",
    });
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <MessageSquare className="w-8 h-8" />
              <h1 className="text-2xl font-bold">Secure Chat: Step-by-Step Cryptography</h1>
            </div>
            <p className="text-purple-200">
              Manual mode: Click Next Step to see each cryptographic operation
            </p>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            Step {currentStep + 1}/{steps.length}
          </Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left Column: Alice */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <span>Alice</span>
              </CardTitle>
              <CardDescription>Sender</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label>Type Message</Label>
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                />
                <Button
                  onClick={sendNewMessage}
                  className="w-full"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Status</span>
                  <Badge variant={
                    currentStep === 0 ? "outline" :
                      currentStep < 6 ? "default" : "secondary"
                  }>
                    {currentStep === 0 ? "Ready" :
                      currentStep < 6 ? "Encrypting" : "Complete"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Step</span>
                  <Badge variant="outline">
                    {currentStep + 1}/10
                  </Badge>
                </div>
              </div>

              <Alert className="bg-blue-500/10 border-blue-500/20">
                <Fingerprint className="w-4 h-4" />
                <AlertDescription className="text-sm">
                  Alice's private key never leaves her device.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>

        {/* Middle Column: Cryptography Steps */}
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
                    <Smartphone className="w-6 h-6 text-white" />
                  </div>
                  <div className="font-bold">Alice</div>
                  <div className="text-xs text-muted-foreground">Encrypts</div>
                </div>

                <ArrowRight className="w-6 h-6" />

                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center mx-auto mb-2">
                    <Server className="w-6 h-6 text-white" />
                  </div>
                  <div className="font-bold">Server</div>
                  <div className="text-xs text-muted-foreground">Relay</div>
                </div>

                <ArrowRight className="w-6 h-6" />

                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-2">
                    <Smartphone className="w-6 h-6 text-white" />
                  </div>
                  <div className="font-bold">Bob</div>
                  <div className="text-xs text-muted-foreground">Decrypts</div>
                </div>
              </div>

              {/* Current Step Visualization */}
              <div className="p-6 border-2 border-primary rounded-lg bg-primary/5 mb-6">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">{steps[currentStep]?.visual}</div>
                  <div className="text-lg font-bold">{steps[currentStep]?.title}</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg bg-blue-500/5">
                    <div className="text-sm font-bold mb-2">Alice's Device</div>
                    <div className="text-sm">{steps[currentStep]?.senderAction}</div>
                  </div>
                  <div className="p-4 border rounded-lg bg-green-500/5">
                    <div className="text-sm font-bold mb-2">Bob's Device</div>
                    <div className="text-sm">{steps[currentStep]?.receiverAction}</div>
                  </div>
                </div>

                {/* Step-specific details */}
                {currentStep === 0 && (
                  <div className="mt-4 p-3 bg-blue-500/10 rounded-lg">
                    <div className="text-sm">
                      <strong>Plaintext:</strong> "{message}"
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="mt-4 p-3 bg-purple-500/10 rounded-lg">
                    <div className="text-sm">
                      <strong>Session Key:</strong> AES-256: 7f1c3a9b5d8e2f4a
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="mt-4 p-3 bg-red-500/10 rounded-lg">
                    <div className="text-sm">
                      <strong>Encrypted Key:</strong> RSA-OAEP: KJ8H7G6F5D4S3A2
                    </div>
                  </div>
                )}

                {showEncrypted && currentStep >= 4 && (
                  <div className="mt-4 p-3 bg-gray-500/10 rounded-lg">
                    <div className="text-sm font-bold mb-1">Encrypted Message:</div>
                    <div className="text-xs font-mono">
                      U2FsdGVkX1/6t3vJQy7VjW8eL5Z4aXcP9oM2nBhCtRm=
                    </div>
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="mt-4 p-3 bg-yellow-500/10 rounded-lg">
                    <div className="text-sm">
                      <strong>SHA-256 Hash:</strong> a3f4b8c9d2e1f0a9b8c7d6e5f4a3b2c1
                    </div>
                  </div>
                )}

                {showMessage && currentStep >= 9 && (
                  <div className="mt-4 p-3 bg-green-500/10 rounded-lg">
                    <div className="text-sm">
                      <strong>Decrypted Message:</strong> "{message}"
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
                    <div>
                      <div className="font-medium">Step {step.id}: {step.title}</div>
                      <div className="text-xs text-muted-foreground">{step.description}</div>
                    </div>
                    {index < currentStep && (
                      <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Bob */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <span>Bob</span>
              </CardTitle>
              <CardDescription>Receiver</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <Badge variant={
                    currentStep < 6 ? "outline" :
                      currentStep < 9 ? "secondary" : "default"
                  }>
                    {currentStep < 6 ? "Waiting" :
                      currentStep < 9 ? "Decrypting" : "Received"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Step</span>
                  <span className="text-sm">
                    {currentStep < 6 ? "Receiving..." : `Step ${currentStep + 1}/10`}
                  </span>
                </div>
              </div>

              <Separator />

              {/* Bob's View */}
              <div className="space-y-3">
                <div className="text-sm font-medium">What Bob Sees:</div>

                {currentStep < 6 ? (
                  <div className="p-4 border rounded-lg bg-gray-100 dark:bg-gray-800 text-center">
                    <div className="text-muted-foreground">
                      Waiting for message...
                    </div>
                  </div>
                ) : currentStep < 9 ? (
                  <div className="p-4 border rounded-lg bg-yellow-500/10">
                    <div className="text-sm font-bold mb-1">🔒 Encrypted Message</div>
                    <div className="text-xs font-mono">
                      U2FsdGVkX1/6t3vJQy7VjW8eL5Z4aXcP9oM2nBhCtRm=
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      Decrypting with private key...
                    </div>
                  </div>
                ) : (
                  <div className="p-4 border rounded-lg bg-green-500/10">
                    <div className="text-sm font-bold mb-1">✅ Decrypted Message</div>
                    <div className="text-lg">"{message}"</div>
                    <div className="text-xs text-muted-foreground mt-2">
                      Hash verified ✓
                    </div>
                  </div>
                )}
              </div>

              <Alert className="bg-green-500/10 border-green-500/20">
                <Shield className="w-4 h-4" />
                <AlertDescription className="text-sm">
                  Only Bob's private key can decrypt messages.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Cryptography Explanation */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Key className="w-4 h-4" />
              Step 1-2: Setup
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-1">
              <div>• Alice & Bob have RSA key pairs</div>
              <div>• Public keys are exchanged</div>
              <div>• Alice generates session key</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Step 3-5: Encryption
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-1">
              <div>• Session key encrypted with RSA</div>
              <div>• Message encrypted with AES</div>
              <div>• Hash generated for integrity</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Send className="w-4 h-4" />
              Step 6: Transmission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-1">
              <div>• Server sees only ciphertext</div>
              <div>• Cannot decrypt messages</div>
              <div>• TLS secures transmission</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Unlock className="w-4 h-4" />
              Step 7-10: Decryption
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-1">
              <div>• Bob decrypts with private key</div>
              <div>• AES decrypts the message</div>
              <div>• Hash verifies integrity</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Final Alert */}
      {currentStep >= steps.length - 1 ? (
        <Alert className="bg-green-500/10 border-green-500/20">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <AlertDescription>
            <strong>Message Successfully Delivered!</strong> The message was encrypted,
            transmitted securely, and decrypted by Bob. End-to-end encryption protects
            the message from being read by anyone else.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert>
          <Zap className="w-4 h-4" />
          <AlertDescription>
            <strong>Click "Next Step" to continue</strong> through the cryptographic
            process. Watch how the message transforms from plaintext to encrypted
            and back to plaintext.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}