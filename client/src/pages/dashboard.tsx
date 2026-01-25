import { Layout } from "@/components/layout/Layout";
import { ModuleCard } from "@/components/ui/module-card";
import { useAuth } from "@/hooks/use-auth";
import { Key, Hash, Bug, ShieldCheck, Activity } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold mb-2">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.username}. Select a module to begin your simulation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ModuleCard 
          title="Cryptography"
          description="Explore AES symmetric encryption and RSA public-key cryptography. Encrypt, decrypt, and manage keys."
          icon={Key}
          href="/crypto"
          color="text-blue-500"
        />
        <ModuleCard 
          title="Hashing & Signatures"
          description="Understand data integrity with SHA-256 and MD5. Learn how digital signatures verify authenticity."
          icon={Hash}
          href="/hashing"
          color="text-purple-500"
        />
        <ModuleCard 
          title="Attack Simulator"
          description="Simulate brute-force attacks on hashed passwords to understand the importance of complexity and salts."
          icon={Bug}
          href="/attack"
          color="text-red-500"
        />
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6 border border-primary/20">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="w-6 h-6 text-primary" />
            <h3 className="font-bold text-lg">Your Progress</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Security Fundamentals</span>
              <span className="font-mono">0%</span>
            </div>
            <div className="h-2 w-full bg-background rounded-full overflow-hidden">
              <div className="h-full bg-primary w-1/3 rounded-full" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-6 h-6 text-orange-500" />
            <h3 className="font-bold text-lg">Recent Activity</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3 text-sm">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5" />
              <div>
                <p className="font-medium">Logged in successfully</p>
                <p className="text-muted-foreground text-xs">Just now</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
