import { Layout } from "@/components/layout/Layout";
import { useState } from "react";
import AccessControlModuleTheory from "./access-control-module-theory";
import AccessControlModuleSimulation from "./access-control-module-simulation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { BackButton } from "@/components/ui/back-button";

type Mode = "select" | "theory" | "simulation";

export default function AccessControlModule() {
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
                Access Control Module
              </h1>

              <p className="text-muted-foreground">
                Learn Access Control through theory or interactive encryption simulations.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <Button onClick={() => setMode("theory")}>
                  Explore Theory
                </Button>

                <Button
                  variant="secondary"
                  onClick={() => setMode("simulation")}
                >
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
          <AccessControlModuleTheory />
        </>
      )}

      {mode === "simulation" && (
        <>
          <BackButton onClick={() => setMode("select")} label="Back to Module" />
          <AccessControlModuleSimulation />
        </>
      )}
    </Layout>
  );
}
