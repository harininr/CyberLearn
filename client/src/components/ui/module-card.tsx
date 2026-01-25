import { LucideIcon, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

interface ModuleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  color?: string;
}

export function ModuleCard({ title, description, icon: Icon, href, color = "text-primary" }: ModuleCardProps) {
  return (
    <Link href={href} className="block group">
      <div className="h-full bg-card hover:bg-accent/50 border border-border rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500" />
        
        <div className="relative z-10">
          <div className={cn("w-12 h-12 rounded-xl bg-background border border-border shadow-sm flex items-center justify-center mb-4 group-hover:border-primary/50 transition-colors", color)}>
            <Icon className="w-6 h-6" />
          </div>
          
          <h3 className="text-xl font-display font-bold mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          
          <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
            {description}
          </p>
          
          <div className="flex items-center text-sm font-medium text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            Launch Module <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}
