"use client"

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Database, Settings, UserCircle, LogOut, Code, Copy, Check, Link2,Server } from "lucide-react";
import { useRouter } from "next/navigation";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Database, label: "Database", href: "/database" },
  { icon: Database, label: "Advertisement", href: "/advertisement"},
  { icon: Database, label: "Statics", href: "/statics"},
  { icon: Server, label: "Logs", href: "/logs" },

];

//Change Bottom Item
const bottomNavItems = [
  { icon: Code, label: "API", href: "/api-docs" },
  { icon: Settings, label: "Settings", href: "/settings" },
  { icon: UserCircle, label: "Profile", href: "/profile" },
];

export default function GlobalNavigation() {
  const router = useRouter();

  const pathname = usePathname();
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = () => {
    // 여기에 기입할 URL을 지정하시면 됩니다.
    navigator.clipboard.writeText("https://kuest-admin-repo.vercel.app/");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    router.push("/login");
  };

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-[240px] flex-col border-r border-border bg-card py-6">
      {/* Logo/Home */}
      <div className="mb-6 px-6 flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20">
          <span className="text-md font-bold">K</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm font-bold tracking-tight">Kuest Admin</span>
          <span className="text-xs font-medium tracking-tight text-muted-foreground">@kuest</span>
        </div>
      </div>

      <div className="px-5 mb-8 flex flex-col gap-2">
        <Link
          href="https://github.com/branwaySrc/kuest-admin-repo"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 text-xs font-semibold rounded-xs border border-neutral-800 bg-[#0a0a0a] px-2.5 py-1.5 shadow-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <Code size={14} />
          <span>GitHub Repository</span>
        </Link>

        <div className="flex items-center justify-between rounded-xs border border-neutral-800 bg-[#0a0a0a] px-2.5 py-1.5 shadow-sm ">
          <div className="flex items-center gap-2 overflow-hidden ">
            <Link2 size={13} className="shrink-0 text-neutral-500" />
            <span className="truncate text-xs text-neutral-400">deployed vercel link</span>
          </div>
          <button 
            onClick={handleCopyUrl}
            className="shrink-0 text-neutral-500 hover:text-neutral-200 transition-colors ml-2 active:scale-90"
            title="Copy Domain"
          >
            {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
          </button>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex flex-1 flex-col gap-2 px-4">
        <div className="px-2 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Main Menu
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex h-11 w-full items-center gap-3 rounded-md px-2 text-sm font-medium transition-all active:scale-95 ${
                isActive 
                  ? "bg-white/10 text-foreground shadow-sm" 
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Items */}
      <div className="flex flex-col gap-2 px-4">
        <div className="px-2 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Preferences
        </div>
        
        {bottomNavItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex h-11 w-full items-center gap-3 rounded-md px-2 text-sm font-medium transition-all active:scale-95 ${
                isActive 
                  ? "bg-white/10 text-forground shadow-sm" 
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span>{item.label}</span>
            </Link>
          );
        })}
        
        <div 
          onClick={handleLogout}
          className="flex h-11 w-full cursor-pointer items-center gap-3 rounded-md px-2 text-sm font-medium text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive active:scale-95 mt-2"
        >
          <LogOut size={20} strokeWidth={2} />
          <span>Logout</span>
        </div>
      </div>
    </aside>
  );
}
