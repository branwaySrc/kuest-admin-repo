"use client"

import Link from "next/link";
import { LayoutDashboard, Database, ScrollText, Settings, UserCircle, LogOut } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Database, label: "Database", href: "/database" },
  { icon: ScrollText, label: "Logs", href: "/logs" },
];

export default function GlobalNavigation() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    router.push("/login");
  };

  return (
    <TooltipProvider delayDuration={0}>
      <aside className="fixed left-0 top-0 z-50 flex h-screen w-[64px] flex-col items-center border-r border-border bg-card py-4">
        {/* Logo/Home */}
        <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
          <span className="text-xl font-bold">K</span>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-1 flex-col items-center gap-4">
          {navItems.map((item) => (
            <Tooltip key={item.label}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className="flex h-12 w-12 items-center justify-center rounded-xl text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground active:scale-95"
                >
                  <item.icon size={22} strokeWidth={2} />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={10}>
                <p className="font-medium">{item.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </nav>

        {/* Bottom Items */}
        <div className="flex flex-col items-center gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground">
                <Settings size={22} strokeWidth={2} />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={10}>
              <p className="font-medium">Settings</p>
            </TooltipContent>
          </Tooltip>
          
          <div className="h-0.5 w-6 bg-border" />
          
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-muted text-muted-foreground transition-all hover:ring-2 hover:ring-primary/50">
                <UserCircle size={24} />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={10}>
              <p className="font-medium">Profile</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <div 
                onClick={handleLogout}
                className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive active:scale-95"
              >
                <LogOut size={22} strokeWidth={2} />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={10}>
              <p className="font-medium text-destructive">Logout</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  );
}
