'use client'

import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { UsageData } from '@/app/api/systemlogs/shared'

export function getServerStorageMeta(usage: UsageData) {
  const DiffIcon = usage.diff > 0 ? TrendingUp : usage.diff < 0 ? TrendingDown : Minus

  const diffColor =
    usage.diff > 0
      ? 'text-emerald-500 bg-emerald-500/10'
      : usage.diff < 0
        ? 'text-rose-500 bg-rose-500/10'
        : 'text-muted-foreground bg-muted/30'

  return {
    DiffIcon,
    diffColor,
    isPositive: usage.diff > 0,
    isNegative: usage.diff < 0,
  }
}
