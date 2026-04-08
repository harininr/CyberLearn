import { Layout } from "@/components/layout/Layout";
import { ModuleCard } from "@/components/ui/module-card";
import { useAuth } from "@/hooks/use-auth";
import {
  Key,
  Hash,
  Bug,
  ShieldCheck,
  Lock,
  Users,
  FileSignature,
  Code
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();

  const modules = [
    {
      title: "Authentication",
      description: "Password hashing, multi-factor authentication, and secure login systems.",
      icon: Lock,
      href: "/authentication",
      color: "text-blue-500"
    },
    {
      title: "Access Control",
      description: "RBAC, permissions, and security policies in organizational systems.",
      icon: Users,
      href: "/accesscontrol",
      color: "text-green-500"
    },
    {
      title: "Cryptography",
      description: "AES symmetric encryption and RSA public-key cryptography.",
      icon: Key,
      href: "/crypto",
      color: "text-purple-500"
    },
    {
      title: "Hashing",
      description: "SHA-256, MD5, collision resistance and secure password storage.",
      icon: Hash,
      href: "/hashing",
      color: "text-orange-500"
    },
    {
      title: "Digital Signatures",
      description: "Digital signatures for message authenticity and non-repudiation.",
      icon: FileSignature,
      href: "/digitalsignature",
      color: "text-red-500"
    },
    {
      title: "Encoding",
      description: "Base64, Hexadecimal, and URL encoding/decoding techniques.",
      icon: Code,
      href: "/encoding",
      color: "text-cyan-500"
    },
    {
      title: "Attack Simulator",
      description: "Brute-force, rainbow table, and dictionary attack simulations.",
      icon: Bug,
      href: "/attack",
      color: "text-yellow-500"
    }
  ];

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.username}. Select a module to begin.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {modules.map((module) => (
          <ModuleCard
            key={module.title}
            title={module.title}
            description={module.description}
            icon={module.icon}
            href={module.href}
            color={module.color}
          />
        ))}
      </div>
    </Layout>
  );
}