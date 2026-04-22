'use client'

import * as React from 'react'
import { type LucideIcon } from 'lucide-react'
import { cn } from '@/client/lib/utils'

interface IconLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon
  iconSize?: number
  iconClassName?: string
  showDot?: boolean
  isActive?: boolean
}

export function IconLabel({
  icon: Icon,
  iconSize = 10,
  iconClassName,
  showDot = false,
  isActive = false,
  className,
  children,
  ...props
}: IconLabelProps) {
  return (
    <div className={cn('flex items-center gap-1.5', className)} {...props}>
      {showDot && (
        <div
          className={cn(
            'h-1.5 w-1.5 rounded-full transition-colors',
            isActive ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]' : 'bg-destructive',
          )}
        />
      )}
      {Icon && (
        <Icon
          size={iconSize}
          className={cn(
            showDot
              ? isActive
                ? 'text-emerald-500'
                : 'text-destructive'
              : 'text-muted-foreground/70',
            iconClassName,
          )}
        />
      )}
      {children}
    </div>
  )
}
