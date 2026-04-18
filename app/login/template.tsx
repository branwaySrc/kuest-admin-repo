"use client";

import { useIsLoggedIn } from "@/middleware/useIsLoggedIn";

export default function LoginTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  // 이미 로그인된 경우 대시보드로 이동 (중앙화된 훅 사용)
  useIsLoggedIn("/");

  return (
    <div className="animate-in fade-in zoom-in-95 duration-700">
      {/* Terminal Window Frame */}
      <div className="rounded-xl border border-border overflow-hidden shadow-2xl shadow-black/50 bg-background/80 backdrop-blur-xl">
        {/* Title Bar */}
        <div className="flex items-center gap-2 bg-secondary px-4 py-2.5 border-b border-border">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500/80" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <div className="h-3 w-3 rounded-full bg-green-500/80" />
          </div>
          <span className="ml-3 text-xs font-mono font-medium text-foreground tracking-wide select-none">
            kuest-admin — auth@secure-gateway
          </span>
        </div>

        {/* Terminal Body (Content) */}
        <div className="p-5 font-mono text-sm leading-relaxed min-h-[420px] max-h-[420px] overflow-y-auto">
          {children}
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between bg-secondary px-4 py-1.5 border-t border-border select-none">
          <span className="text-[10px] font-mono text-muted-foreground">
            TLS 1.3 · AES-256-GCM
          </span>
          <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Operational</span>
          </div>
        </div>
      </div>

      <p className="text-center text-[10px] text-muted-foreground font-mono mt-4 tracking-wider uppercase opacity-50">
        KUEST SECURE GATEWAY · © 2026 · INTERNAL ACCESS ONLY
      </p>
    </div>
  );
}
