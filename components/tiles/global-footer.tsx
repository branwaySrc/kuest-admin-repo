"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Zap, RefreshCcw, Database, ShieldCheck,
  TrendingUp, TrendingDown, Minus, HardDrive, Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTerminalStore } from "@/hooks/zustand/use-terminal-store";
import { HealthStatus, UsageData, HealthResponse } from "@/app/api/systemlogs/shared";

// ─── 순수 유틸리티 함수 (컴포넌트 외부) ────────────────────
// 컴포넌트 상태에 의존하지 않으므로 모듈 스코프에 배치합니다.

const KST_OFFSET = 9 * 60 * 60 * 1000;

const formatSize = (bytes: number) => {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/** UTC → KST 기준 상대 시간 */
const formatRelativeTime = (isoString: string | null) => {
  if (!isoString) return "-";
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "방금";
  if (mins < 60) return `${mins}분 전`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}시간 전`;
  return `${Math.floor(hours / 24)}일 전`;
};

/** UTC ISO → KST 날짜 문자열 (MM/DD) */
const formatKSTDate = (isoString: string | null) => {
  if (!isoString) return null;
  const kst = new Date(new Date(isoString).getTime() + KST_OFFSET);
  const month = String(kst.getUTCMonth() + 1).padStart(2, "0");
  const day = String(kst.getUTCDate()).padStart(2, "0");
  return `${month}/${day}`;
};

export default function GlobalFooter() {
  const { addAdminLog } = useTerminalStore();
  const [lastChecked, setLastChecked] = useState<string>("-");
  const [status, setStatus] = useState<HealthStatus>("checking");
  const [adminActive, setAdminActive] = useState<boolean>(false);
  const [publicActive, setPublicActive] = useState<boolean>(false);
  const [usage, setUsage] = useState<UsageData>({ current: 0, diff: 0, rate: 0, lastUpdated: null, baselineDate: null });

  // ─── API 공통 파서 ────────────────────────────
  const applyResponse = (data: HealthResponse) => {
    setAdminActive(data.admin);
    setPublicActive(data.public);
    setUsage(data.usage ?? { current: 0, diff: 0, rate: 0, lastUpdated: null });
    setStatus(data.admin && data.public ? "online" : "offline");
  };

  // ─── 초기 로드 (GET – 읽기 전용) ─────────────
  const fetchStatus = useCallback(async () => {
    setStatus("checking");
    try {
      const res = await fetch("/api/systemlogs", { method: "GET" });
      const data = await res.json();
      if (res.ok) applyResponse(data);
      else setStatus("error");
      setLastChecked(new Date().toLocaleString("ko-KR", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }));
    } catch (err) {
      console.error("[GlobalFooter] 상태 조회 실패:", err);
      setStatus("error");
      setLastChecked(new Date().toLocaleString("ko-KR", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }));
    }
  }, []);

  // ─── SYNC 버튼 (POST – 용량 갱신 + 로그) ─────
  const handleSync = useCallback(async () => {
    setStatus("checking");
    addAdminLog("INFO", "Action[INSERT]: Requesting Supabase update...");
    try {
      const res = await fetch("/api/systemlogs", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        applyResponse(data);
        if (data.admin) {
           addAdminLog("SUCCESS", "Action[INSERT]: SYS_UPDATE_SUCCESS. Usage logs synchronized.");
        } else {
           addAdminLog("WARNING", "Action[INSERT]: Sync completed, but ADMIN DB is degraded.");
        }
      } else {
        setStatus("error");
        addAdminLog("FAILED", "Action[INSERT]: API responded with non-ok status.");
      }
      setLastChecked(new Date().toLocaleString("ko-KR", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }));
    } catch (err: unknown) {
      console.error("[GlobalFooter] SYNC 실패:", err);
      setStatus("error");
      setLastChecked(new Date().toLocaleString("ko-KR", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }));
      const errorMessage = err instanceof Error ? err.message : "Network failure.";
      addAdminLog("FAILED", `Action[INSERT]: Exception - ${errorMessage}`);
    }
  }, [addAdminLog]);

  useEffect(() => {
    const timer = setTimeout(() => fetchStatus(), 0);
    return () => clearTimeout(timer);
  }, [fetchStatus]);

  // ─── 증감 방향 ────────────────────────────────
  const DiffIcon = usage.diff > 0 ? TrendingUp : usage.diff < 0 ? TrendingDown : Minus;
  const diffColor = usage.diff > 0
    ? "text-emerald-500 bg-emerald-500/10"
    : usage.diff < 0
    ? "text-rose-500 bg-rose-500/10"
    : "text-muted-foreground bg-muted/30";

  return (
    <footer className="fixed bottom-0 left-[64px] right-0 z-40 flex h-[32px] items-center border-t border-border bg-card px-4 text-[10px] font-mono text-muted-foreground select-none overflow-hidden">
      {/* LEFT: Connection Clusters */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Admin DB */}
        <div className="flex items-center gap-1.5">
          <div className={cn("h-1.5 w-1.5 rounded-full transition-colors",
            adminActive ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]" : "bg-destructive"
          )} />
          <ShieldCheck size={10} className={adminActive ? "text-emerald-500" : "text-destructive"} />
          <span>ADMIN_DB: [{adminActive ? "200" : "500"}]</span>
        </div>

        {/* Public DB */}
        <div className="flex items-center gap-1.5">
          <div className={cn("h-1.5 w-1.5 rounded-full transition-colors",
            publicActive ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]" : "bg-destructive"
          )} />
          <Database size={10} className={publicActive ? "text-emerald-500" : "text-destructive"} />
          <span>PUBLIC_DB: [{publicActive ? "200" : "500"}]</span>
        </div>
      </div>

      <div className="h-3 w-px bg-border mx-3 shrink-0" />

      {/* CENTER: Capacity & Trend */}
      <div className="flex items-center gap-3 shrink-0">
        {/* 현재 용량 */}
        <div className="flex items-center gap-1.5">
          <HardDrive size={11} className="text-muted-foreground/70" />
          <span className={cn("font-bold", usage.current > 0 ? "text-foreground/90" : "text-muted-foreground")}>
            {usage.current > 0 ? formatSize(usage.current) : "—"}
          </span>
        </div>

        {/* 증감량 배지 - KST 기준 전일 대비 */}
        {usage.current > 0 && (
          <div className={cn("flex items-center gap-1 px-1.5 py-px rounded-sm text-[9px] font-bold", diffColor)}>
            <DiffIcon size={9} />
            {usage.diff !== 0 ? (
              <span>
                {usage.diff > 0 ? "+" : ""}{formatSize(Math.abs(usage.diff))}
                ({usage.rate > 0 ? "+" : ""}{usage.rate.toFixed(2)}%)
              </span>
            ) : (
              <span>변화 없음</span>
            )}
            {usage.baselineDate && (
              <span className="opacity-60 ml-0.5">vs {formatKSTDate(usage.baselineDate)}</span>
            )}
          </div>
        )}

        {/* 마지막 갱신 시간 */}
        {usage.lastUpdated && (
          <div className="flex items-center gap-1 text-muted-foreground/60">
            <Clock size={9} />
            <span>{formatRelativeTime(usage.lastUpdated)}</span>
          </div>
        )}
      </div>

      <div className="h-3 w-px bg-border mx-3 shrink-0" />

      {/* Cluster Status */}
      <div className="flex items-center gap-1.5 shrink-0">
        <Zap size={10} className={cn(
          status === "online" ? "text-amber-400 fill-amber-400/20" :
          status === "checking" ? "animate-pulse text-muted-foreground" : "text-destructive"
        )} />
        <span className="uppercase tracking-tight">
          Cluster:
          <span className={cn("ml-1",
            status === "online" ? "text-emerald-400" :
            status === "checking" ? "text-muted-foreground" : "text-destructive"
          )}>
            {status === "online" ? "Healthy" : status === "checking" ? "Scanning..." : "Degraded"}
          </span>
        </span>
      </div>

      {/* RIGHT: Sync Controls */}
      <div className="ml-auto flex items-center gap-3 shrink-0">
        <span className="opacity-50 text-[9px] font-bold">마지막 동기화: </span>
        <span className="text-foreground/70">{lastChecked}</span>

        <button
          onClick={handleSync}
          disabled={status === "checking"}
          className="group flex items-center gap-1.5 rounded bg-secondary/30 px-2 py-0.5 border border-border hover:bg-secondary hover:text-foreground active:scale-95 disabled:opacity-50 transition-all font-bold"
        >
          <span className="text-[9px]">SYNC</span>
          <RefreshCcw size={9} className={cn(
            "transition-transform duration-500",
            status === "checking" ? "animate-spin" : "group-hover:rotate-180"
          )} />
        </button>

        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-1.5 opacity-50">
          <div className="h-1 w-1 rounded-full bg-emerald-500" />
          <span className="font-bold">UTF-8</span>
        </div>
      </div>
    </footer>
  );
}
