"use client";

import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

export default function GlobalHeader() {
  const pathname = usePathname();
  
  // Map path to display name
  const getPageTitle = (path: string) => {
    if (path === "/") return "Dashboard Overview";
    if (path.startsWith("/database")) return "Database Management";
    if (path.startsWith("/logs")) return "System Logs";
    if (path.startsWith("/api-docs")) return "API Documentation";
    return path.split("/").filter(Boolean).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" / ");
  };

  return (
    <header className="sticky top-0 z-40 flex h-[64px] w-full items-center border-b border-border bg-background/80 px-6 backdrop-blur-md">
      <div className="flex items-center gap-2 text-sm font-medium">
        <span className="text-muted-foreground">Kuest</span>
        <ChevronRight size={14} className="text-muted-foreground/50" />
        <h1 className="text-foreground">{getPageTitle(pathname)}</h1>
      </div>

      <div className="ml-auto flex items-center gap-4">
        {/* Placeholder for header actions if needed */}
      </div>
    </header>
  );
}
