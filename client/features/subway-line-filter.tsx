'use client'

import { useDatabaseFilterStore } from '@/client/department-feature/store/use-database-filter-store'
import { Checkbox } from '@/client/department-ui/ui/checkbox'
import { cn } from '@/client/lib/utils'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/client/department-ui/ui/accordion'
import { SubwayLine } from '@/shared/types/supabase.schema'

function FilterControl() {
  const selectAll = useDatabaseFilterStore((s) => s.selectAll)
  const selectNone = useDatabaseFilterStore((s) => s.selectNone)
  const isAllSelected = useDatabaseFilterStore((s) => s.isAllSelected())
  
  // 함수 자체를 가져옵니다 (액션용)
  const toggleCategory = useDatabaseFilterStore((s) => s.toggleCategory)
  
  // 상태값은 Zustand Selector 내부에서 실행하여 변화를 구독(Subscribe)하도록 합니다.
  const isMainSelected = useDatabaseFilterStore((s) => s.isCategorySelected('Metro'))
  const isRegionalSelected = useDatabaseFilterStore((s) => s.isCategorySelected('Regional'))
  const isLightRailSelected = useDatabaseFilterStore((s) => s.isCategorySelected('LightRail'))

  return (
    <div className="flex items-center justify-between border-b">
      <Accordion type="multiple" className="w-full">
        <AccordionItem value="filters" className="border-b-0">
          <AccordionTrigger className="px-4 py-2 hover:no-underline hover:bg-accent/30 transition-colors">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-tight">Quick Filters</span>
          </AccordionTrigger>
          
          <AccordionContent className="pb-2">
            {/* 전체 선택 */}
            <FilterOption 
              label="전체 노선" 
              checked={isAllSelected} 
              onCheckedChange={() => isAllSelected ? selectNone() : selectAll()} 
            />
            
            {/* 서울(Main) 노선 선택 */}
            <FilterOption 
              label="서울 노선 (1-9호선)" 
              checked={isMainSelected} 
              onCheckedChange={() => toggleCategory('Metro')} 
            />
            
            {/* 경기/광역(Regional) 노선 선택 */}
            <FilterOption 
              label="경기/광역 노선" 
              checked={isRegionalSelected} 
              onCheckedChange={() => toggleCategory('Regional')} 
            />

            {/* 경전철(Light Rail) 노선 선택 */}
            <FilterOption 
              label="경전철 노선" 
              checked={isLightRailSelected} 
              onCheckedChange={() => toggleCategory('LightRail')} 
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

function FilterOption({ label, checked, onCheckedChange }: { 
  label: string; 
  checked: boolean; 
  onCheckedChange: () => void; 
}) {
  return (
    <label 
      className="flex items-center gap-2 px-6 py-2 bg-muted/5 hover:bg-muted/20 transition-colors cursor-pointer"
    >
      <Checkbox 
        checked={checked} 
        onCheckedChange={onCheckedChange}
        className="size-4"
      />
      <span className={`text-xs font-medium ${checked? "text-foreground" : "text-foreground/30"}`}>{label}</span>
    </label>
  )
}

function FilterCounter() {
  // 선택된 배열 전체가 아니라 '길이'만 구독하여 최적화
  const selectedCount = useDatabaseFilterStore((s) => s.selectedLineIds.length)
  const totalCount = useDatabaseFilterStore((s) => s.subwayLines.length)

  return (
    <div className="border-b px-4 py-2 bg-muted/20">
      <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground">
        <span>Selected Lines</span>
        <span className="font-bold text-primary">
          {selectedCount} / {totalCount}
        </span>
      </div>
    </div>
  )
}

function FilterItem({ line }: { line: SubwayLine }) {
  // 특정 ID의 포함 여부(boolean)만 구독함 (매우 효율적)
  const isChecked = useDatabaseFilterStore((s) => s.selectedLineIds.includes(line.id))
  const toggleLine = useDatabaseFilterStore((s) => s.toggleLine)

  return (
    <label 
      className={cn(
        "group flex items-center gap-3 rounded-md px-2 py-1.5 transition-colors cursor-pointer",
        isChecked ? "bg-accent/50" : "hover:bg-accent/30"
      )}
    >
      <Checkbox 
        checked={isChecked}
        onCheckedChange={() => toggleLine(line.id)}
        className="size-4"
      />
      <div className="flex flex-1 items-center justify-between">
        <span className={`text-xs font-medium ${isChecked? "text-foreground" : "text-foreground/30"}`}>{line.name_kr}</span>
        <div 
          className="size-2 rounded-full" 
          style={{ backgroundColor: line.hex_color }} 
        />
      </div>
    </label>
  )
}


export const SubwayFilter = {
  ReservedControl : FilterControl,
  Counter : FilterCounter,
  Item : FilterItem
}