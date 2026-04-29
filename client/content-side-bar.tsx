'use client'

import { useContentFilterStore } from '@/client/department-feature/store/use-content-filter-store'
import { ScrollArea } from '@/client/department-ui/ui/scroll-area'
import { Checkbox } from '@/client/department-ui/ui/checkbox'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/client/department-ui/ui/accordion'
import { cn } from '@/client/lib/utils'
import { SubwayStation } from '@/shared/types/supabase.schema'

function FilterControl() {
  const selectAll = useContentFilterStore((s) => s.selectAll)
  const selectNone = useContentFilterStore((s) => s.selectNone)
  const isAllSelected = useContentFilterStore((s) => s.isAllSelected())
  
  const toggleCategory = useContentFilterStore((s) => s.toggleCategory)
  
  const isMainSelected = useContentFilterStore((s) => s.isCategorySelected('Metro'))
  const isRegionalSelected = useContentFilterStore((s) => s.isCategorySelected('Regional'))
  const isLightRailSelected = useContentFilterStore((s) => s.isCategorySelected('LightRail'))

  return (
    <div className="flex items-center justify-between border-b">
      <Accordion type="multiple" className="w-full">
        <AccordionItem value="filters" className="border-b-0">
          <AccordionTrigger className="px-4 py-2 hover:no-underline hover:bg-accent/30 transition-colors">
            <span className="text-xs text-muted-foreground">Quick Filters</span>
          </AccordionTrigger>
          
          <AccordionContent className="pb-2">
            <FilterOption 
              label="전체 역" 
              checked={isAllSelected} 
              onCheckedChange={() => isAllSelected ? selectNone() : selectAll()} 
            />
            <FilterOption 
              label="서울 노선 역 (1-9호선)" 
              checked={isMainSelected} 
              onCheckedChange={() => toggleCategory('Metro')} 
            />
            <FilterOption 
              label="경기/광역 노선 역" 
              checked={isRegionalSelected} 
              onCheckedChange={() => toggleCategory('Regional')} 
            />
            <FilterOption 
              label="경전철 노선 역" 
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
    <label className="flex items-center gap-2 px-6 py-2 bg-muted/5 hover:bg-muted/20 transition-colors cursor-pointer">
      <Checkbox checked={checked} onCheckedChange={onCheckedChange} className="size-4" />
      <span className={`text-xs font-medium ${checked ? "text-foreground" : "text-foreground/30"}`}>{label}</span>
    </label>
  )
}

function FilterCounter() {
  const selectedCount = useContentFilterStore((s) => s.selectedStationIds.length)
  const totalCount = useContentFilterStore((s) => s.stations.length)

  return (
    <div className="border-b px-4 py-2 bg-muted/20">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Selected Stations</span>
        <span className="font-bold text-primary">
          {selectedCount} / {totalCount}
        </span>
      </div>
    </div>
  )
}

function FilterItem({ station }: { station: SubwayStation }) {
  const isChecked = useContentFilterStore((s) => s.selectedStationIds.includes(station.id))
  const toggleStation = useContentFilterStore((s) => s.toggleStation)

  return (
    <label className={cn(
      "group flex items-center gap-3 rounded-md px-2 py-1.5 transition-colors cursor-pointer",
      isChecked ? "bg-accent/50" : "hover:bg-accent/30"
    )}>
      <Checkbox checked={isChecked} onCheckedChange={() => toggleStation(station.id)} className="size-4" />
      <div className="flex flex-1 items-center justify-between">
        <span className={`text-xs font-medium ${isChecked ? "text-foreground" : "text-foreground/30"}`}>{station.station_name_kr}</span>
      </div>
    </label>
  )
}

export function ContentSideBar() {
  const stations = useContentFilterStore((s) => s.stations)

  return (
    <div className="flex h-full w-58 flex-col border-r bg-card/50 backdrop-blur-sm">
      <FilterControl />
      <FilterCounter />
      <ScrollArea className="flex-1 h-full">
        <div className="p-4">
          <div className="space-y-1">
            {stations.map((station) => (
              <FilterItem key={station.id} station={station} />
            ))}
          </div>
        </div>
        <div className="h-[250px]" />
      </ScrollArea>
    </div>
  )
}
