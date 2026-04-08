import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import Dashboard from "@/pages/dashboard";
import AuthenticationModule from "@/pages/authentication-module";
import AccessControlModule from "@/pages/access-control-module";
import CryptoModule from "@/pages/crypto-module";
import HashingModule from "@/pages/hashing-module";
import DigitalSignatureModule from "@/pages/digitalsignature-module";
import AttackModule from "@/pages/attack-module";
import EncodingModule from "@/pages/encoding-module";
import { ProtectedRoute } from "@/lib/protected-route";
import DigitalSignatureSimulation from "@/pages/digitalsignature-module-simulation";
import DigitalSignatureTheory from "@/pages/digitalsignature-module-theory";
import LandingPage from "@/pages/landing-page";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/dashboard" component={() => <ProtectedRoute component={Dashboard} />} />
      <Route path="/authentication" component={() => <ProtectedRoute component={AuthenticationModule} />} />
      <Route path="/accesscontrol" component={() => <ProtectedRoute component={AccessControlModule} />} />
      <Route path="/crypto" component={() => <ProtectedRoute component={CryptoModule} />} />
      <Route path="/hashing" component={() => <ProtectedRoute component={HashingModule} />} />
      <Route path="/digitalsignature" component={() => <ProtectedRoute component={DigitalSignatureModule} />} />
      <Route path="/digitalsignature/theory" component={() => <ProtectedRoute component={DigitalSignatureTheory} />} />
      <Route path="/digitalsignature/simulation" component={() => <ProtectedRoute component={DigitalSignatureSimulation} />} />
      <Route path="/attack" component={() => <ProtectedRoute component={AttackModule} />} />
      <Route path="/encoding" component={() => <ProtectedRoute component={EncodingModule} />} />
      <Route component={NotFound} />
    </Switch>
  );
    }

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
