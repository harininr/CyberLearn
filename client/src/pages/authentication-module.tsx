import { Layout } from "@/components/layout/Layout";
import { useState } from "react";
import AuthModuleTheory from "./auth-module-theory";
import AuthModuleSimulation from "./auth-module-simulation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Building } from "lucide-react";
import { BackButton } from "@/components/ui/back-button";

type Mode = "select" | "theory" | "simulation";

export default function AuthenticationModule() {
  const [mode, setMode] = useState<Mode>("select");

  return (
    <Layout>
      {mode === "select" && (
        <>
          <BackButton to="/" label="Back to Dashboard" />
          <Card className="max-w-3xl mx-auto mt-10">
            <CardContent className="p-8 text-center space-y-6">
              <Shield className="w-12 h-12 mx-auto text-primary" />

              <h1 className="text-3xl font-bold">
                Authentication & Identity Management
              </h1>

              <p className="text-muted-foreground">
                Choose how you want to learn authentication concepts.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <Button onClick={() => setMode("theory")}>
                  Explore Theory
                </Button>

                <Button
                  variant="secondary"
                  onClick={() => setMode("simulation")}
                >
                  <Building className="w-4 h-4 mr-2" />
                  Start Simulation
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {mode === "theory" && (
        <>
          <BackButton onClick={() => setMode("select")} label="Back to Module" />
          <AuthModuleTheory />
        </>
      )}

      {mode === "simulation" && (
        <>
          <BackButton onClick={() => setMode("select")} label="Back to Module" />
          <AuthModuleSimulation />
        </>
      )}
    </Layout>
  );
}
