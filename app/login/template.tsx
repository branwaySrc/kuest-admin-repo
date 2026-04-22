export default function LoginTemplate({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-in fade-in zoom-in-95 duration-700">
      {/* Terminal Window Frame */}
      <div className="border-border bg-background/80 overflow-hidden rounded-xl border shadow-2xl shadow-black/50 backdrop-blur-xl">
        {/* Title Bar */}
        <div className="bg-secondary border-border flex items-center gap-2 border-b px-4 py-2.5">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500/80" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <div className="h-3 w-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-foreground ml-3 font-mono text-xs font-medium tracking-wide select-none">
            kuest-admin — auth@secure-gateway
          </span>
        </div>

        {/* Terminal Body (Content) */}
        <div className="max-h-[420px] min-h-[420px] overflow-y-auto p-5 font-mono text-sm leading-relaxed">
          {children}
        </div>

        {/* Status Bar */}
        <div className="bg-secondary border-border flex items-center justify-between border-t px-4 py-1.5 select-none">
          <span className="text-muted-foreground font-mono text-[10px]">TLS 1.3 · AES-256-GCM</span>
          <div className="text-muted-foreground flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            <span>Operational</span>
          </div>
        </div>
      </div>

      <p className="text-muted-foreground mt-4 text-center font-mono text-[10px] tracking-wider uppercase opacity-50">
        KUEST SECURE GATEWAY · © 2026 · INTERNAL ACCESS ONLY
      </p>
    </div>
  )
}
