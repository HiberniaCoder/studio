"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Briefcase,
  BrainCircuit,
  CreditCard,
  LayoutDashboard,
  Settings,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { supabase } from "@/lib/supabase";
import { Button } from "./ui/button";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/projects", icon: Briefcase, label: "Projects" },
  { href: "/forensics", icon: BrainCircuit, label: "Forensics" },
  { href: "/billing", icon: CreditCard, label: "Billing" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <TooltipProvider delayDuration={0}>
      <aside className="hidden h-screen w-20 flex-col items-center border-r bg-background/80 backdrop-blur-sm sm:flex z-30">
        <div className="flex h-20 items-center justify-center border-b">
          <Link href="/dashboard" className="h-10 w-10 text-primary">
            <Icons.logo />
          </Link>
        </div>
        <nav className="flex flex-1 flex-col items-center gap-4 py-4">
          {navItems.map((item) => (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:text-foreground",
                    pathname === item.href
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="sr-only">{item.label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          ))}
        </nav>
        <div className="mt-auto flex flex-col items-center gap-4 p-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
              >
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Logout</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Logout</TooltipContent>
          </Tooltip>
          <Avatar className="h-10 w-10 border">
            <AvatarImage src="https://placehold.co/100x100.png" alt="User" data-ai-hint="person avatar"/>
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </aside>
    </TooltipProvider>
  );
}
