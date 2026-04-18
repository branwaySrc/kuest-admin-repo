"use client";

import { useResizable } from "@/hooks/use-resizable";
import { ChevronUp, ChevronDown, Monitor, Check, AlertTriangle, XCircle, Server,Database } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState,useEffect } from "react";
import { useTerminalStore, SystemLog } from "@/lib/store/use-terminal-store";

/**
 * [LOGGING SYSTEM GUIDELINE FOR AI AGENTS/DEVELOPERS]
 * 
 * 1. Data Structure:
 *    Recommended log object: { timestamp: string, level: 'SUCCESS' | 'WARNING' | 'FAILED' | 'INFO', message: string }
 * 
 * 2. Color Mapping:
 *    - SUCCESS (Green): text-emerald-500 / bg-emerald-500/10
 *    - WARNING (Yellow): text-amber-500 / bg-amber-500/10
 *    - FAILED (Red): text-destructive / bg-destructive/10
 *    - INFO (Blue/Default): text-blue-400 or text-foreground/70
 * 
 * 3. Theme:
 *    Aligned with globals.css dark mode variables. Uses 'bg-background' and 'border-border'.
 */

export default function GlobalTerminal() {
  // Vertical Resizing (Overall Height)
  const { 
    size: height, 
    setSize: setHeight, 
    startResizing: startVerticalResize, 
    isResizing: isVerticalResizing 
  } = useResizable({
    initialSize: 200,
    direction: "vertical",
    minSize: 32, 
    maxSize: 600,
  });

  // 전체 너비 추적 (퍼센트 계산용)
  const [containerWidth, setContainerWidth] = useState(1000);
  const { publicLogs, adminLogs, addPublicLog, addAdminLog, clearLogs } = useTerminalStore();

  useEffect(() => {
    const updateWidth = () => setContainerWidth(window.innerWidth - 240);
    updateWidth();
    window.addEventListener("resize", updateWidth);
    
    // System Booting Sequence
    let mounted = true;
    clearLogs();
    addPublicLog("INFO", "Initializing listener...");
    addAdminLog("INFO", "Authenticating session...");
    
    const checkSystemHealth = async () => {
      try {
        const res = await fetch("/api/systemlogs");
        const data = await res.json();
        
        if (!mounted) return;

        if (data.public) {
          addPublicLog("SUCCESS", "Supabase Health Check: SUCCESS. Public Gateway is Online.");
        } else {
          addPublicLog("FAILED", "Connection timeout on Public Gateway.");
        }

        if (data.admin) {
          addAdminLog("SUCCESS", "Supabase Health Check: SUCCESS. Workspace Clean & Connected.");
        } else {
          addAdminLog("FAILED", "Admin DB connection failed or degraded.");
        }
      } catch (err: unknown) {
        if (mounted) {
          const errorMessage = err instanceof Error ? err.message : "Network error occurred.";
          addPublicLog("FAILED", errorMessage);
          addAdminLog("FAILED", errorMessage);
        }
      }
    };

    // Delay for a dramatic system-booting vibe
    const timerId = setTimeout(() => {
      checkSystemHealth();
    }, 1200);

    return () => {
      window.removeEventListener("resize", updateWidth);
      mounted = false;
      clearTimeout(timerId);
    };
  }, [clearLogs, addPublicLog, addAdminLog]);

  // 좌우 분할 조절 (Horizontal)
  const {
    size: splitPos,
    startResizing: startHorizontalResize,
  } = useResizable({
    initialSize: 50, // % 
    direction: "horizontal",
    minSize: 20,
    maxSize: 80,
    totalSize: containerWidth, // 픽셀을 %로 환산하기 위해 전체 너비 전달
  });

  const isCollapsed = height <= 80;

  const toggleExpand = () => {
    if (isCollapsed) setHeight(160);
    else setHeight(32);
  };

  const renderLog = (log: SystemLog) => {
    switch (log.level) {
      case "SUCCESS":
        return (
          <div key={log.id} className="flex items-start gap-1.5 text-emerald-500 bg-emerald-500/5 px-1 py-0.5 rounded-sm w-fit font-bold">
            <Check size={13} className="shrink-0 mt-[1px]" />
            <p className="leading-snug">{log.timestamp} [SUCCESS] {log.message}</p>
          </div>
        );
      case "WARNING":
        return (
          <div key={log.id} className="flex items-start gap-1.5 text-amber-500 bg-amber-500/5 px-1 py-0.5 rounded-sm w-fit">
            <AlertTriangle size={13} className="shrink-0 mt-[1px]" />
            <p className="leading-snug">{log.timestamp} [WARNING] {log.message}</p>
          </div>
        );
      case "FAILED":
        return (
          <div key={log.id} className="flex items-start gap-1.5 text-destructive bg-destructive/10 px-1 py-0.5 rounded-sm w-fit font-bold underline decoration-destructive/30 underline-offset-2">
            <XCircle size={13} className="shrink-0 mt-[1px]" />
            <p className="leading-snug">{log.timestamp} [FAILED] {log.message}</p>
          </div>
        );
      case "INFO":
      default:
        return (
          <div key={log.id} className="flex items-start gap-1.5 text-foreground/60 px-1 py-0.5 w-fit">
            <Server size={12} className="shrink-0 mt-[1px]" />
            <p className="leading-snug">{log.timestamp} [INFO] {log.message}</p>
          </div>
        );
    }
  };

  return (
    <div 
      style={{ height: isCollapsed ? 32 : height }}
      className={cn(
        "fixed bottom-[32px] left-[240px] right-0 z-30 transition-[height] duration-200 ease-in-out border-t border-border bg-background text-foreground select-none overflow-hidden",
        isCollapsed ? "cursor-pointer hover:bg-accent" : "cursor-default",
        isVerticalResizing && "transition-none"
      )}
      onClick={() => isCollapsed && toggleExpand()}
    >
      {/* 
         DRAG HANDLE: Vertical Resize 
         Only active when not collapsed.
      */}
      {!isCollapsed && (
        <div 
          onMouseDown={startVerticalResize}
          className="absolute top-0 left-0 right-0 h-1 cursor-ns-resize hover:bg-primary/40 z-50 transition-colors"
        />
      )}

      {/* 
         TERMINAL HEADER 
         Displays current system status and window controls.
      */}
      <div className="flex items-center justify-between px-4 h-8 bg-muted/40 border-b border-border shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="text-[10px] font-mono font-bold tracking-widest opacity-80 uppercase">
           System Console
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); toggleExpand(); }}
            className="hover:bg-accent p-1.5 rounded-md transition-all active:scale-90"
          >
            {isCollapsed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* 
         TERMINAL DUAL PANELS 
         Left: Public DB logs, Right: Admin DB logs
      */}
      {!isCollapsed && (
        <div className="flex h-[calc(100%-32px)] w-full relative group/terminal">
          
          {/* LEFT PANEL: Public Schema Stream */}
          <div 
            style={{ width: `${100 - splitPos}%` }}
            className="h-full border-r border-border p-4 font-mono text-[11px] overflow-y-auto bg-black/20 scrollbar-thin scrollbar-thumb-border"
          >
            <div className="flex items-center gap-2 mb-3 text-foreground/60 border-b border-border/40 pb-1.5">
              <Monitor size={12} />
              <span className="tracking-tight">PUBLIC SCHEMA EVENT FEED</span>
            </div>
            <div className="space-y-1.5 leading-relaxed flex flex-col justify-end">
              <p className="text-primary/60 mb-2 flex items-center gap-2"><Database size={13} className="shrink-0 mt-[1px]" />SUPABASE\Kuest\Public{">"} System Startup</p>
              {publicLogs.map(renderLog)}
            </div>
          </div>

          {/* 
             DRAG HANDLE: Horizontal Resize (Splitter) 
             Positioned between the two panels.
          */}
          <div 
            onMouseDown={startHorizontalResize}
            className="absolute top-0 bottom-0 w-1.5 cursor-ew-resize hover:bg-primary/30 z-40 transition-colors"
            style={{ left: `${100 - splitPos}%`, transform: 'translateX(-50%)' }}
          />

          {/* RIGHT PANEL: Admin Schema Stream */}
          <div 
            style={{ width: `${splitPos}%` }}
            className="h-full p-4 font-mono text-[11px] overflow-y-auto bg-black/5"
          >
            <div className="flex items-center gap-2 mb-3 text-foreground/60 border-b border-border/40 pb-1.5">
              <ShieldCheckIcon />
              <span className="tracking-tight">ADMIN SCHEMA EVENT FEED</span>
            </div>
            <div className="space-y-1.5 leading-relaxed opacity-90 flex flex-col justify-end">
              <p className="text-primary/60 mb-2 flex items-center gap-2"> <Database size={13} className="shrink-0 mt-[1px]" />SUPABASE\Kuest\Admin{">"} Authenticating Core</p>
              {adminLogs.map(renderLog)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Minimal icons used in the console
function ShieldCheckIcon() {
  return (
    <svg 
      width="12" height="12" viewBox="0 0 24 24" fill="none" 
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
      className="text-foreground"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
