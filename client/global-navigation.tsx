'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname,useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Database,
  Settings,
  UserCircle,
  LogOut,
  Code,
  Copy,
  Check,
  Link2,
  Server,
} from 'lucide-react'


const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Database, label: 'Database', href: '/database' },
  { icon: Database, label: 'Advertisement', href: '/advertisement' },
  { icon: Database, label: 'Statics', href: '/statics' },
  { icon: Server, label: 'Logs', href: '/logs' },
]

const bottomNavItems = [
  { icon: Code, label: 'API', href: '/api-docs' },
  { icon: Settings, label: 'Settings', href: '/settings' },
  { icon: UserCircle, label: 'Profile', href: '/profile' },
]

export default function GlobalNavigation() {
  const router = useRouter()
  const pathname = usePathname()
  const [copied, setCopied] = useState(false)

  const handleCopyUrl = () => {
    navigator.clipboard.writeText('https://kuest-admin-repo.vercel.app/')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    router.push('/login')
  }

  return (
    <aside className="border-border bg-card fixed top-0 left-0 z-50 flex h-screen w-[240px] flex-col border-r py-6">
      {/* Logo/Home */}
      <div className="mb-6 flex items-center gap-3 px-6">
        <div className="bg-primary text-primary-foreground shadow-primary/20 flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-lg">
          <span className="text-md font-bold">K</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold tracking-tight">Kuest Admin</span>
          <span className="text-muted-foreground text-xs font-medium tracking-tight">@kuest</span>
        </div>
      </div>

      <div className="mb-8 flex flex-col gap-2 px-5">
        <Link
          href="https://github.com/branwaySrc/kuest-admin-repo"
          target="_blank"
          rel="noreferrer"
          className="text-muted-foreground hover:text-foreground flex items-center gap-2 rounded-xs border border-neutral-800 bg-[#0a0a0a] px-2.5 py-1.5 text-xs font-semibold shadow-sm transition-colors"
        >
          <Code size={14} />
          <span>GitHub Repository</span>
        </Link>

        <div className="flex items-center justify-between rounded-xs border border-neutral-800 bg-[#0a0a0a] px-2.5 py-1.5 shadow-sm">
          <div className="flex items-center gap-2 overflow-hidden">
            <Link2 size={13} className="shrink-0 text-neutral-500" />
            <span className="truncate text-xs text-neutral-400">deployed vercel link</span>
          </div>
          <button
            onClick={handleCopyUrl}
            className="ml-2 shrink-0 text-neutral-500 transition-colors hover:text-neutral-200 active:scale-90"
            title="Copy Domain"
          >
            {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
          </button>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex flex-1 flex-col gap-2 px-4">
        <div className="text-muted-foreground mb-2 px-2 text-xs font-semibold tracking-wider uppercase">
          Main Menu
        </div>
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex h-11 w-full items-center gap-3 rounded-md px-2 text-sm font-medium transition-all active:scale-95 ${
                isActive
                  ? 'text-foreground bg-white/10 shadow-sm'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom Items */}
      <div className="flex flex-col gap-2 px-4">
        <div className="text-muted-foreground mb-2 px-2 text-xs font-semibold tracking-wider uppercase">
          Preferences
        </div>

        {bottomNavItems.map((item) => {
          const isActive =
            pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex h-11 w-full items-center gap-3 rounded-md px-2 text-sm font-medium transition-all active:scale-95 ${
                isActive
                  ? 'text-forground bg-white/10 shadow-sm'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span>{item.label}</span>
            </Link>
          )
        })}

        <div
          onClick={handleLogout}
          className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive mt-2 flex h-11 w-full cursor-pointer items-center gap-3 rounded-md px-2 text-sm font-medium transition-all active:scale-95"
        >
          <LogOut size={20} strokeWidth={2} />
          <span>Logout</span>
        </div>
      </div>
    </aside>
  )
}
