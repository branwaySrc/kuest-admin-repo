'use client'

import { useState, useEffect } from 'react'
import { ChevronUp, ChevronDown, Monitor, Database } from 'lucide-react'
import { cn } from '@/client/lib/utils'
import { useResizable } from '@/client/lib/use-resizable'
import { ConsoleSystemEvent} from '@/client/features/console-system-event'
import { useSystemInitialLogs } from '@/client/department-feature/use-system-initial-log'

export default function SystemConsole() {
  // 전체 너비 추적 (퍼센트 계산용)
  const [containerWidth, setContainerWidth] = useState(1000)

  // 상하 크기 조절 (높이)
  const {
    size: height,
    setSize: setHeight,
    startResizing: startVerticalResize,
    isResizing: isVerticalResizing,
  } = useResizable({
    initialSize: 200,
    direction: 'vertical',
    minSize: 32,
    maxSize: 600,
  })

  // 좌우 분할 조절 (Splitter)
  const { size: splitPos, startResizing: startHorizontalResize } = useResizable({
    initialSize: 50, // %
    direction: 'horizontal',
    minSize: 20,
    maxSize: 80,
    totalSize: containerWidth,
  })

  // 부팅 시퀀스 로그 실행
  useSystemInitialLogs()

  const isCollapsed = height <= 32

  const toggleExpand = () => {
    if (isCollapsed) setHeight(180)
    else setHeight(32)
  }

  useEffect(() => {
    const updateWidth = () => setContainerWidth(window.innerWidth - 240)
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  return (
    <div
      style={{ height: isCollapsed ? 32 : height }}
      className={cn(
        'border-border bg-background text-foreground fixed right-0 bottom-[32px] left-[240px] z-30 overflow-hidden border-t transition-[height] duration-200 ease-in-out select-none',
        isCollapsed ? 'hover:bg-accent cursor-pointer' : 'cursor-default',
        isVerticalResizing && 'transition-none',
      )}
      onClick={() => isCollapsed && toggleExpand()}
    >


      {/* 바닥 드래그 핸들 (상하 조절) */}
      {!isCollapsed && (
        <div
          onMouseDown={startVerticalResize}
          className="hover:bg-primary/40 absolute top-0 right-0 left-0 z-50 h-1 cursor-ns-resize transition-colors"
        />
      )}


      {/* 터미널 헤더 */}
      <UI.Header
      
        title='System Console'
        onClick={(e) => {
              e.stopPropagation()
              toggleExpand()
            }}


      >
   {isCollapsed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}

      </UI.Header>
     

      {/* 피드 패널 (좌우 분할) */}
      {!isCollapsed && (
        <div className="relative flex h-[calc(100%-32px)] w-full">
          
          <UI.Panel
            splitPos={splitPos}
            header="PUBLIC SCHEMA EVENT FEED"
            route="SUPABASE\Kuest\Public{'>'} System Startup"
          >
            <ConsoleSystemEvent.Public />
          </UI.Panel>

          {/* 좌우 드래그 핸들 */}
          <div
            onMouseDown={startHorizontalResize}
            className="hover:bg-primary/30 absolute top-0 bottom-0 z-40 w-1.5 cursor-ew-resize transition-colors"
            style={{ left: `${100 - splitPos}%`, transform: 'translateX(-50%)' }}
          />

          <UI.Panel
            splitPos={splitPos}
            header="ADMIN SCHEMA EVENT FEED"
            route="SUPABASE\Kuest\Admin{'>'} Authenticating Core"
          >
            <ConsoleSystemEvent.Admin />
          </UI.Panel>
          
        </div>
      )}
    </div>
  )
}

const UI = {
Header: ConsoleHeaderUI,
  Panel:ConsolePanelUI
}

interface ConsoleHeaderUI {
  title:string;
  onClick : React.MouseEventHandler<HTMLButtonElement>;
  children:React.ReactNode;
}

function ConsoleHeaderUI (props:ConsoleHeaderUI) {

  return(
      <div className="bg-muted/40 border-border flex h-8 shrink-0 items-center justify-between border-b px-4">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-[10px] font-bold tracking-widest uppercase opacity-80">
            {props.title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={props.onClick}
            className="hover:bg-accent rounded-md p-1.5 transition-all active:scale-90"
          >
            {props.children}
          </button>
        </div>
      </div>

  )

}

interface ConsolePanelProps {
  splitPos: number
  header:string
  route:string
  children: React.ReactNode
}

function ConsolePanelUI (props:ConsolePanelProps) {
  return (
    <div
            style={{ width: `${100 - props.splitPos}%` }}
            className="border-border scrollbar-thin scrollbar-thumb-border h-full overflow-y-auto border-r bg-black/20 p-4 font-mono text-[11px]"
          >
            <div className="text-foreground/60 border-border/40 mb-1 flex items-center gap-2 border-b pb-1.5">
              <Monitor size={12} />
              <span className="tracking-tight">{props.header}</span>
            </div>
            <div className="flex flex-col space-y-1.5">
              <p className="text-primary/60 mb-2 flex items-center gap-2">
                <Database size={13} className="shrink-0" />
               {props.route}
              </p>
              {props.children}
            </div>
          </div>
  )
}