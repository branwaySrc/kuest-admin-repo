'use client'
import { useEffect } from 'react'
import { ServerHealth } from '@/client/features/server-health'
import { ServerStorage } from '@/client/features/server-storage'
import { useServerHealthStore } from '@/client/department-feature/store/use-server-health-store'

export default function ServerStatusBar() {
  const fetchStatus = useServerHealthStore((state) => state.fetchStatus)

  useEffect(() => {
    fetchStatus()
  }, [fetchStatus])

  return (
    <footer className="border-border bg-card text-muted-foreground fixed right-0 bottom-0 left-[240px] z-40 flex h-[32px] items-center overflow-hidden border-t px-4 font-mono text-[10px] select-none">
      {/* LEFT: Connection Clusters */}
      <div className="flex shrink-0 items-center gap-3">
        <ServerHealth.Admin />
        <ServerHealth.Public />
      </div>
      <div className="bg-border mx-3 h-3 w-px shrink-0" />
      {/* CENTER: Capacity & Trend */}
      <div className="flex shrink-0 items-center gap-3">
        <ServerStorage.Usage />
        <ServerStorage.Trend />
        <ServerStorage.Updated />
      </div>
      <div className="bg-border mx-3 h-3 w-px shrink-0" />
      <ServerHealth.Cluster />
      <ServerHealth.SyncController />
    </footer>
  )
}
