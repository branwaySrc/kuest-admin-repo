'use client'

import { Check, AlertTriangle, XCircle, Server } from 'lucide-react'
import { IconLabel } from '@/client/department-ui/ui/icon-label'
import { cn } from '@/client/lib/utils'

interface ConsoleSyntaxProps {
  timestamp: string
  message: string
  className?: string
}

function Success({ timestamp, message, className }: ConsoleSyntaxProps) {
  return (
    <IconLabel
      icon={Check}
      iconSize={13}
      iconClassName="mt-[3px] shrink-0 text-emerald-500" 
      className={cn(
        'w-fit rounded-sm bg-emerald-500/5 px-1 py-0.5 font-bold text-emerald-500 items-start',
        className,
      )}
    >
      <p className="leading-snug">
        {timestamp} [SUCCESS] {message}
      </p>
    </IconLabel>
  )
}

function Warning({ timestamp, message, className }: ConsoleSyntaxProps) {
  return (
    <IconLabel
      icon={AlertTriangle}
      iconSize={13}
      iconClassName="mt-[3px] shrink-0 text-amber-500"
      className={cn('w-fit rounded-sm bg-amber-500/5 px-1 py-0.5 text-amber-500 items-start', className)}
    >
      <p className="leading-snug">
        {timestamp} [WARNING] {message}
      </p>
    </IconLabel>
  )
}

function Failed({ timestamp, message, className }: ConsoleSyntaxProps) {
  return (
    <IconLabel
      icon={XCircle}
      iconSize={13}
      iconClassName="mt-[3px] shrink-0 text-destructive"
      className={cn(
        'text-destructive bg-destructive/10 decoration-destructive/30 w-fit rounded-sm px-1 py-0.5 font-bold underline underline-offset-2 items-start',
        className,
      )}
    >
      <p className="leading-snug">
        {timestamp} [FAILED] {message}
      </p>
    </IconLabel>
  )
}

function Info({ timestamp, message, className }: ConsoleSyntaxProps) {
  return (
    <IconLabel
      icon={Server}
      iconSize={12}
      iconClassName="mt-[3px] shrink-0 text-foreground/60"
      className={cn('text-foreground/60 w-fit px-1 py-0.5 items-start', className)}
    >
      <p className="leading-snug">
        {timestamp} [INFO] {message}
      </p>
    </IconLabel>
  )
}


export const ConsoleSyntax = {
    Success,
    Warning,
    Failed,
    Info,
}