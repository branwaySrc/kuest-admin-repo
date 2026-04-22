'use client'

import { useSyncExternalStore, useState, useEffect } from 'react'
import { useAppViewerStore } from '@/client/department-feature/store/use-app-viewer-store'
import { useResizable } from '@/client/lib/use-resizable'
import { cn } from '@/client/lib/utils'
import { RotateCcw, Wifi, Battery, Signal, Terminal, Activity } from 'lucide-react'

const emptySubscribe = () => () => {}

export default function GlobalAppViewer() {
  const { isOpen, setIsOpen } = useAppViewerStore()
  const [currentUrl] = useState('https://shop.wisely.store/')
  const [refreshKey, setRefreshKey] = useState(0)

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  )

  const { size, setSize, startResizing } = useResizable({
    initialSize: 420,
    direction: 'horizontal',
    minSize: 150,
    maxSize: mounted ? window.innerWidth * 0.5 : 800,
  })

  const handleRefresh = () => setRefreshKey((prev) => prev + 1)

  // 200px 이하로 드래그 시 자동으로 접히는 로직
  useEffect(() => {
    if (isOpen && size < 200) {
      setIsOpen(false)
      setTimeout(() => setSize(420), 300)
    }
  }, [size, isOpen, setIsOpen, setSize])

  if (!mounted) return null

  return (
    <aside
      className={cn(
        'border-border fixed top-0 right-0 z-[100] flex h-screen flex-col overflow-hidden border-l bg-[#0a0a0a] shadow-2xl transition-transform duration-100 ease-in-out',
        !isOpen && 'translate-x-full',
      )}
      style={{
        width: `${size}px`,
        visibility: isOpen ? 'visible' : 'hidden',
      }}
    >
      {/* Resize Handle */}
      <div
        onMouseDown={startResizing}
        className="hover:bg-primary/50 active:bg-primary absolute top-0 left-0 z-50 h-full w-1 cursor-ew-resize transition-colors"
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Device Viewer Area */}
        <div className="flex flex-1 flex-col items-center justify-center overflow-hidden bg-[#0d0d0d] p-6">
          {/* Smartphone Mockup */}
          <div className="relative mx-auto h-[780px] w-[380px] shrink-0 rounded-[3.5rem] border-[12px] border-zinc-800 bg-zinc-900 shadow-[0_0_50px_rgba(0,0,0,0.5)] outline outline-1 outline-zinc-700/50">
            {/* Status Bar UI */}
            <div className="absolute top-0 left-0 z-20 flex h-[50px] w-full items-center justify-between px-7 text-sm font-bold text-black">
              <div>09:00</div>
              <div className="flex items-center gap-1">
                <Signal size={18} />
                <Wifi size={18} />
                <Battery size={18} />
              </div>
            </div>

            {/* Notch / Dynamic Island */}
            <div className="absolute top-4 left-1/2 z-30 flex h-7 w-28 -translate-x-1/2 items-center justify-end rounded-full bg-black px-4">
              <div className="h-2 w-2 rounded-full bg-zinc-800" />
            </div>

            {/* Content Window (WebView) */}
            <div className="h-full w-full overflow-hidden rounded-[2.6rem] border border-zinc-800 bg-white">
              <object
                key={refreshKey}
                className="pt-[50px]"
                data={currentUrl}
                width="100%"
                height="100%"
              />
            </div>

            {/* Side Buttons (Volume/Power) */}
            <div className="absolute top-32 -left-[14px] h-10 w-[3px] rounded-l-sm bg-zinc-700" />
            <div className="absolute top-48 -left-[14px] h-16 w-[3px] rounded-l-sm bg-zinc-700" />
            <div className="absolute top-[260px] -left-[14px] h-16 w-[3px] rounded-l-sm bg-zinc-700" />
            <div className="absolute top-40 -right-[14px] h-24 w-[3px] rounded-r-sm bg-zinc-700" />
          </div>

          {/* Inspector Panel */}
          <div className="mx-auto mt-8 w-[380px] shrink-0 space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                <Terminal size={12} className="text-primary" />
                <span>Instance Inspector</span>
              </div>
              <button
                onClick={handleRefresh}
                className="hover:text-foreground flex items-center gap-1.5 rounded-full bg-zinc-900 px-3 py-1 text-[10px] font-bold text-zinc-400 ring-1 ring-zinc-800 transition-all hover:bg-zinc-800 active:scale-95"
              >
                <RotateCcw size={10} />
                REFRESH
              </button>
            </div>

            <div className="rounded-xl border border-zinc-800/50 bg-[#111111] p-3 shadow-inner">
              <div className="mb-2 flex items-center gap-3 border-b border-zinc-800/30 pb-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                <span className="font-mono text-[11px] break-all text-zinc-300">{currentUrl}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[9px] font-bold tracking-tight text-zinc-600 uppercase">
                    Latency
                  </p>
                  <div className="flex items-center gap-2">
                    <Activity size={10} className="text-zinc-500" />
                    <span className="font-mono text-[10px] text-zinc-400">12ms</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-bold tracking-tight text-zinc-600 uppercase">
                    Status
                  </p>
                  <span className="font-mono text-[10px] text-green-500/80">LIVE_SYNC</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
