import { Link, useLocation } from "wouter";
import {
  Shield,
  Key,
  Hash,
  Bug,
  LayoutDashboard,
  LogOut,
  UserCircle,
  FileSignature,
  Users,
  Code,
  Github
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: UserCircle, label: "Authentication", href: "/authentication" },
  { icon: Users, label: "Access Control", href: "/accesscontrol" },
  { icon: Key, label: "Cryptography", href: "/crypto" },
  { icon: Hash, label: "Hashing", href: "/hashing" },
  { icon: FileSignature, label: "Digital Signatures", href: "/digitalsignature" },
  { icon: Code, label: "Encoding", href: "/encoding" },
  { icon: Bug, label: "Attack Simulator", href: "/attack" },
];

export function Sidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="h-screen w-64 bg-card border-r border-border hidden md:flex flex-col sticky top-0">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg tracking-tight">CyberLearn</h1>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 py-4">
        {menuItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href} className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
              isActive
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            )}>
              <item.icon className={cn(
                "w-5 h-5 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
              )} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-border">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-bold text-xs">
            {user?.username.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.username}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.role}</p>
          </div>
        </div>
        <a 
          href="https://github.com/harininr/CyberLearn" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block mb-2"
        >
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted/50"
          >
            <Github className="w-4 h-4 mr-2" />
            GitHub Repository
          </Button>
        </a>
        <Button
          variant="outline"
          className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/20"
          onClick={() => logout.mutate()}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Log Out
        </Button>
      </div>
    </div>
  );
}
