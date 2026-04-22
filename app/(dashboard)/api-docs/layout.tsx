'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FileJson } from 'lucide-react'
import { apiDocuments } from './(content)'

export default function ApiDocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="text-foreground flex h-[calc(100vh-140px)] w-full gap-6">
      {/* Left Sidebar Menu */}
      <div className="flex w-[280px] shrink-0 flex-col gap-4 border-r border-neutral-800 py-4 pr-4">
        <div className="px-2">
          <p className="text-xs leading-relaxed font-medium text-neutral-500">
            백엔드 Route 스펙 문서 리스트
          </p>
        </div>

        <div className="scrollbar-thin w-full flex-1 overflow-y-auto">
          <div className="space-y-1.5 px-1">
            {apiDocuments.map((doc) => {
              const isActive = pathname === `/api-docs/${doc.id}`
              return (
                <Link
                  key={doc.id}
                  href={`/api-docs/${doc.id}`}
                  className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'border border-neutral-800 bg-neutral-900 text-neutral-100 shadow-sm'
                      : 'border border-transparent text-neutral-500 hover:bg-neutral-900/50 hover:text-neutral-200'
                  }`}
                >
                  <FileJson
                    size={16}
                    className={isActive ? 'text-neutral-100' : 'text-neutral-500'}
                  />
                  <span className="truncate">{doc.title}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">{children}</div>
    </div>
  )
}
