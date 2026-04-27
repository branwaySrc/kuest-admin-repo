'use client'

import React, { useEffect } from 'react'
import { Badge } from '@/client/department-ui/ui/badge'
import { Button } from '@/client/department-ui/ui/button'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/client/department-ui/ui/table'
import { 
  Pencil, 
  Trash2, 
  Clock,
  Loader2,
  Plus
} from 'lucide-react'

import { StationSearchField } from '@/client/features/station-search-field'
import { formatKSTDate } from '@/client/lib/formaters'
import { useDatabaseFilterStore } from '@/client/department-feature/store/use-database-filter-store'
import { useRouter } from 'next/navigation'

export function DatabaseItemTable() {
  const { subwayLines, stations, isLoading, error, fetchData, selectedLineIds, searchQuery } = useDatabaseFilterStore()

  // 최초 로드 시 데이터 패칭
  useEffect(() => {
    fetchData()
  }, [fetchData])

  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    return formatKSTDate(dateString)
  }

  const router = useRouter()

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center text-destructive">
        <p className="font-bold">Failed to load data</p>
        <p className="text-sm">{error}</p>
      </div>
    )
  }

  const filteredStations = stations.filter(station => {
    // 1. 선택된 노선 필터링
    const stationLineIds = station.line_ids?.map(lineId => {
      const line = subwayLines.find(l => l.name_en === lineId || l.id === lineId)
      return line?.id
    }).filter(Boolean) || []

    const matchesLines = stationLineIds.some(id => selectedLineIds.includes(id as string))

    // 2. 검색어 필터링 (역 이름 기준)
    const matchesSearch = !searchQuery || 
      station.station_name_kr?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      station.station_name_en?.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesLines && matchesSearch
  })

  return (
    <div className="space-y-4">
      <section className='flex items-center justify-between'>
        <div className='flex flex-col item-start gap-2 w-full'>
        <StationSearchField />
          <p className="text-[11px] text-muted-foreground font-medium ml-1">
          Showing <span className="text-foreground">{filteredStations.length}</span> stations
          </p>
        </div>
        <Button
          variant="outline"
          size="lg"
          onClick={() => router.push('/database/add-station')}
        >
          <Plus size={12} />
          Add Station
        </Button>
      </section>
      <div className="border border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent border-border/50">
              <TableHead className="w-[200px]">Station Name</TableHead>
              <TableHead>Lines</TableHead>
              <TableHead>Coordinates (Lat/Lng)</TableHead>
              <TableHead>CreatedAt</TableHead>
              <TableHead>UpdatedAt</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStations.map((station) => {
              return (
                <TableRow key={station.id} className="group border-border/40 hover:bg-muted/20 transition-colors">
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-sm text-foreground/90 group-hover:text-primary transition-colors">
                        {station.station_name_kr}
                      </span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        {station.station_name_en || '-'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {station.line_ids?.map((lineId) => {
                        const line = subwayLines.find(l => l.name_en === lineId || l.id === lineId)
                        if (!line) return null
                        
                        return (
                          <Badge 
                            key={line.id}
                            variant="outline"
                            className="text-[10px] h-5 px-1.5 font-bold border-transparent"
                            style={{ 
                              color: line.hex_color, 
                              backgroundColor: `${line.hex_color}15`,
                              borderColor: `${line.hex_color}30`
                            }}
                          >
                            {line.name_kr}
                          </Badge>
                        )
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-mono"><span className="font-bold text-muted-foreground">Lat:</span> {station.station_lat?.toFixed(4) || '-'}</span>
                      <span className="text-xs font-mono"><span className="font-bold text-muted-foreground">Lng:</span> {station.station_lng?.toFixed(4) || '-'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock size={12} />
                      <span className="text-[11px] font-mono">{formatDate(station.created_at)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock size={12} />
                      <span className="text-[11px] font-mono">{formatDate(station.updated_at)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button onClick={() => router.push(`/database/${station.id}`)} variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10">
                        <Pencil size={14} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-between px-2 py-1">
        <div className="flex gap-2">
           <Button variant="outline" size="sm" className="h-8 text-[11px] font-bold border-border/50">Previous</Button>
           <Button variant="outline" size="sm" className="h-8 text-[11px] font-bold border-border/50">Next</Button>
        </div>
      </div>
    </div>
  )
}
