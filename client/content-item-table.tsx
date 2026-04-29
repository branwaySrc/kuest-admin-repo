'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/client/department-ui/ui/badge'
import { Button } from '@/client/department-ui/ui/button'
import { Input } from '@/client/department-ui/ui/input'
import { Search } from 'lucide-react'
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

import { formatKSTDate } from '@/client/lib/formaters'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/client/department-ui/ui/card'
import { useConsoleSystemStore } from '@/client/department-feature/store/use-console-system-store'
import { useContentEditorStore } from '@/client/department-feature/store/use-content-editor-store'
import { useContentFilterStore } from '@/client/department-feature/store/use-content-filter-store'

function LocationSearchField() {
  const searchQuery = useContentFilterStore((s) => s.searchQuery)
  const setSearchQuery = useContentFilterStore((s) => s.setSearchQuery)

  return (
    <div className="relative max-w-sm w-full">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search locations..."
        className="pl-8 bg-background shadow-none"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  )
}

export function ContentItemTable() {
  const { stations, locations, isLoading, error, fetchData, selectedStationIds, searchQuery } = useContentFilterStore()
  const { addPublicLog, addAdminLog } = useConsoleSystemStore()
  const { openCreate, openEdit } = useContentEditorStore()
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [displayCount, setDisplayCount] = useState(20)

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const [prevFilters, setPrevFilters] = useState({ searchQuery, selectedStationIds })
  
  if (
    prevFilters.searchQuery !== searchQuery || 
    prevFilters.selectedStationIds !== selectedStationIds
  ) {
    setPrevFilters({ searchQuery, selectedStationIds })
    setDisplayCount(20)
  }

  const handleDelete = async (id: string) => {
    try {
      addAdminLog('INFO', `[API] DELETE REQUEST: /api/locations?id=${id}`)
      const res = await fetch(`/api/locations?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      addPublicLog('SUCCESS', '삭제가 완료되었습니다.')
      fetchData(true)
    } catch (err) {
      addPublicLog('FAILED', '삭제 중 오류가 발생했습니다.')
      addAdminLog('FAILED', `[API] DELETE ERROR: ${err}`)
    } finally {
      setDeleteConfirmId(null)
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    return formatKSTDate(dateString)
  }

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

  const filteredLocations = locations.filter(location => {
    const locationStations = location.related_station || []
    
    // Check if the location is related to any of the selected stations
    // Try matching station ID, English name or Korean name.
    const matchesStations = locationStations.length === 0 || locationStations.some(rs => {
      if (selectedStationIds.includes(rs)) return true;
      const matchedStation = stations.find(s => s.id === rs || s.station_name_en === rs || s.station_name_kr === rs);
      return matchedStation && selectedStationIds.includes(matchedStation.id);
    })

    const matchesSearch = !searchQuery || 
      location.location_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      location.title?.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesStations && matchesSearch
  })

  const displayedLocations = filteredLocations.slice(0, displayCount)

  return (
    <div className="space-y-4">
      <section className='flex items-center justify-between'>
        <div className='flex flex-col item-start gap-2 w-full'>
          <LocationSearchField />
          <p className="text-[11px] text-muted-foreground font-medium ml-1">
            Showing <span className="text-foreground">{displayedLocations.length}</span> of <span className="text-foreground">{filteredLocations.length}</span> locations
          </p>
        </div>
        <Button variant="outline" size="lg" onClick={openCreate}>
          <Plus size={12} className="mr-2" />
          Add Location
        </Button>
      </section>
      <div className="border border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent border-border/50">
              <TableHead className="w-[200px]">Location Name</TableHead>
              <TableHead>Categories</TableHead>
              <TableHead>Related Stations</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedLocations.map((location) => {
              return (
                <TableRow key={location.id} className="group border-border/40 hover:bg-muted/20 transition-colors">
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-sm text-foreground/90 group-hover:text-primary transition-colors">
                        {location.location_name}
                      </span>
                      <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
                        {location.title || '-'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className='flex flex-col gap-1.5 item-center'>
                    <div className="flex flex-wrap gap-1">
                      {location.category?.map((cat, idx) => (
                        <Badge key={idx} variant="outline" className="text-[10px] h-5 px-1.5 font-bold">
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {location.related_station?.map((st, idx) => (
                        <span key={idx} className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">{st}</span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock size={12} />
                      <span className="text-[11px] font-mono">{formatDate(location.created_at)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock size={12} />
                      <span className="text-[11px] font-mono">{formatDate(location.updated_at)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button onClick={() => openEdit(location.id)} variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10">
                        <Pencil size={14} />
                      </Button>
                      <Button onClick={() => setDeleteConfirmId(location.id)} variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
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
      
      {filteredLocations.length > displayCount && (
        <div className="flex justify-center pt-2 pb-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setDisplayCount(prev => prev + 50)}
            className="w-[200px]"
          >
            Show More
          </Button>
        </div>
      )}

      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <Card className="w-[350px] shadow-lg animate-in zoom-in-95">
            <CardHeader>
              <CardTitle>Delete Confirmation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Are you sure you want to delete this location? This action cannot be undone.</p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
              <Button variant="destructive" onClick={() => handleDelete(deleteConfirmId)}>Delete</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}
