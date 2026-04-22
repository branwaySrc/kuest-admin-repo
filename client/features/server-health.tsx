'use client'

import { ShieldCheck, Database, Zap, RefreshCcw } from 'lucide-react'
import { Button } from '@/client/department-ui/ui/button'
import { cn } from '@/client/lib/utils'
import { IconLabel } from '@/client/department-ui/ui/icon-label'
import { useServerHealthStore } from '@/client/department-feature/store/use-server-health-store'

function AdminSchemaStatus() {
  const adminActive = useServerHealthStore((state) => state.adminActive)
  return (
    <IconLabel showDot icon={ShieldCheck} isActive={adminActive}>
      <span>ADMIN_DB: [{adminActive ? '200' : '500'}]</span>
    </IconLabel>
  )
}

function PublicSchemaStatus() {
  const publicActive = useServerHealthStore((state) => state.publicActive)
  return (
    <IconLabel showDot icon={Database} isActive={publicActive}>
      <span>PUBLIC_DB: [{publicActive ? '200' : '500'}]</span>
    </IconLabel>
  )
}

function ClusterStatus() {
  const status = useServerHealthStore((state) => state.status)
  return (
    <IconLabel
      icon={Zap}
      iconSize={10}
      iconClassName={cn(
        status === 'online'
          ? 'text-amber-400 fill-amber-400/20'
          : status === 'checking'
            ? 'animate-pulse text-muted-foreground'
            : 'text-destructive',
      )}
      className="shrink-0"
    >
      <span className="tracking-tight uppercase">
        Cluster:
        <span
          className={cn(
            'ml-1',
            status === 'online'
              ? 'text-emerald-400'
              : status === 'checking'
                ? 'text-muted-foreground'
                : 'text-destructive',
          )}
        >
          {status === 'online' ? 'Healthy' : status === 'checking' ? 'Scanning...' : 'Degraded'}
        </span>
      </span>
    </IconLabel>
  )
}

function StatueSyncController() {
  const lastChecked = useServerHealthStore((state) => state.lastChecked)
  const handleSync = useServerHealthStore((state) => state.handleSync)
  const status = useServerHealthStore((state) => state.status)

  return (
    <div className="ml-auto flex shrink-0 items-center gap-3">
      <span className="text-[9px] font-bold opacity-50">마지막 동기화: </span>
      <span className="text-foreground/70">{lastChecked}</span>

      <Button
        variant="outline"
        size="xs"
        onClick={handleSync}
        disabled={status === 'checking'}
        className="group bg-secondary/30 px-2 font-bold"
      >
        <span className="text-[9px]">SYNC</span>
        <RefreshCcw
          size={9}
          className={cn(
            'transition-transform duration-500',
            status === 'checking' ? 'animate-spin' : 'group-hover:rotate-180',
          )}
        />
      </Button>

      <div className="bg-border h-4 w-px" />

      <IconLabel showDot isActive className="opacity-50">
        <span className="font-bold">UTF-8</span>
      </IconLabel>
    </div>
  )
}

export const ServerHealth = {
  Admin: AdminSchemaStatus,
  Public: PublicSchemaStatus,
  Cluster: ClusterStatus,
  SyncController: StatueSyncController,
}
