'use client'

import { HardDrive, Clock } from 'lucide-react'
import { cn } from '@/client/lib/utils'
import { formatDataSize, formatRelativeTime, formatKSTDate } from '@/client/lib/formaters'
import { IconLabel } from '@/client/department-ui/ui/icon-label'
import { useServerHealthStore } from '@/client/department-feature/store/use-server-health-store'
import { getServerStorageMeta } from '@/client/department-feature/get-server-storage-meta'

function StorageUsageStatus() {
  const usage = useServerHealthStore((state) => state.usage)
  return (
    <IconLabel icon={HardDrive} iconSize={11}>
      <span
        className={cn(
          'font-bold',
          usage.current > 0 ? 'text-foreground/90' : 'text-muted-foreground',
        )}
      >
        {usage.current > 0 ? formatDataSize(usage.current) : '—'}
      </span>
    </IconLabel>
  )
}

function StorageTrendStatus() {
  const usage = useServerHealthStore((state) => state.usage)
  const { DiffIcon, diffColor } = getServerStorageMeta(usage)

  if (usage.current <= 0) return null

  return (
    <IconLabel
      icon={DiffIcon}
      iconSize={9}
      className={cn('rounded-sm px-1.5 py-px text-[9px] font-bold', diffColor)}
      iconClassName="text-current"
    >
      {usage.diff !== 0 ? (
        <span>
          {usage.diff > 0 ? '+' : ''}
          {formatDataSize(Math.abs(usage.diff))}({usage.rate > 0 ? '+' : ''}
          {usage.rate.toFixed(2)}%)
        </span>
      ) : (
        <span>변화 없음</span>
      )}
      {usage.baselineDate && (
        <span className="ml-0.5 opacity-60">vs {formatKSTDate(usage.baselineDate)}</span>
      )}
    </IconLabel>
  )
}

function StorageLastUpdated() {
  const usage = useServerHealthStore((state) => state.usage)
  if (!usage.lastUpdated) return null
  return (
    <IconLabel icon={Clock} iconSize={9} className="text-muted-foreground/60">
      <span>{formatRelativeTime(usage.lastUpdated)}</span>
    </IconLabel>
  )
}

export const ServerStorage = {
  Usage: StorageUsageStatus,
  Trend: StorageTrendStatus,
  Updated: StorageLastUpdated,
}
