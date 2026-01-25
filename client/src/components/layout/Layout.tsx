import { ReactNode, useState } from "react";
import { Sidebar } from "./Sidebar";
import { AITutor } from "./AITutor";
import { Button } from "@/components/ui/button";
import { Bot, Menu } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Layout({ children }: { children: ReactNode }) {
  const [isAiOpen, setIsAiOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="h-16 border-b border-border flex items-center justify-between px-4 md:px-8 bg-background/80 backdrop-blur-sm sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <Sidebar />
              </SheetContent>
            </Sheet>
            <h2 className="font-display font-semibold text-lg hidden md:block">
              Cyber Security Simulation Platform
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button 
              onClick={() => setIsAiOpen(!isAiOpen)}
              className={isAiOpen ? "bg-primary/20 text-primary hover:bg-primary/30" : ""}
              variant="outline"
            >
              <Bot className="w-4 h-4 mr-2" />
              AI Tutor
            </Button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>

      <AITutor isOpen={isAiOpen} onToggle={() => setIsAiOpen(!isAiOpen)} />
    </div>
  );
}
