'use client'

import { useDatabaseFilterStore } from '@/client/department-feature/store/use-database-filter-store'
import { ScrollArea } from '@/client/department-ui/ui/scroll-area'
import { SubwayFilter } from "@/client/features/subway-line-filter"

export function DatabaseSideBar() {
  const subwayLines = useDatabaseFilterStore((s) => s.subwayLines)

  return (
    <div className="flex h-full w-58 flex-col border-r bg-card/50 backdrop-blur-sm">
      <SubwayFilter.ReservedControl />
      <SubwayFilter.Counter />
      <ScrollArea className="flex-1 h-full">
        <div className="p-4">
          <div className="space-y-1">
            {subwayLines.map((line) => (
             <SubwayFilter.Item key={line.id} line={line}/>
            ))}
          </div>
        </div>
        <UI.PaddingBottomBlock/>
      </ScrollArea>
    </div>
  )
}



function PaddingBottomBlock() {
  return (
    <div className="h-[250px]" />
  )
}

function SelectedLine(props:{children:React.ReactNode}) {
    return (
        <div className="border-b px-4 py-2 bg-muted/20">
        <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground">
          <span>Selected Lines</span>
            {props.children}
        </div>
      </div>
    )
}

const UI = {
    PaddingBottomBlock, SelectedLine
}