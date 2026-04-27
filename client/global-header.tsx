'use client'

import { usePathname } from 'next/navigation'
import { ChevronRight, Smartphone } from 'lucide-react'
import { useAppViewerStore } from '@/client/department-feature/store/use-app-viewer-store'
import { cn } from '@/client/lib/utils'

export default function GlobalHeader() {
  const pathname = usePathname()
  const { isOpen, toggle } = useAppViewerStore()

  // Map path to display name
  const getPageTitle = (path: string) => {
    if (path === '/') return 'Dashboard Overview'
    if (path.startsWith('/database')) return 'Database Management'
    if (path.startsWith('/logs')) return 'System Logs'
    if (path.startsWith('/api-docs')) return 'API Documentation'
    if (path.startsWith('/advertisement')) return 'Advertisement Management'
    if (path.startsWith('/statics')) return 'Statics Management'
    if (path.startsWith('/settings')) return 'Settings'
    if (path.startsWith('/profile')) return 'Profile'
    
    return path
      .split('/')
      .filter(Boolean)
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(' / ')
  }

  return (
    <header className="border-border bg-background/80 sticky top-0 z-50 flex h-[48px] w-full items-center border-b px-4 backdrop-blur-md">
      <div className="flex items-center gap-2 text-sm font-medium">
        <span className="text-muted-foreground">Kuest</span>
        <ChevronRight size={14} className="text-muted-foreground/50" />
        <h1 className="text-foreground">{getPageTitle(pathname)}</h1>
      </div>

      <div className="ml-auto flex items-center gap-4">
        <button
          onClick={toggle}
          className={cn(
            'hover:bg-accent hover:text-accent-foreground flex h-9 w-9 items-center justify-center rounded-md transition-colors',
            isOpen && 'bg-accent text-accent-foreground',
          )}
          title="App Viewer"
        >
          <Smartphone size={20} />
        </button>
      </div>
    </header>
  )
}
