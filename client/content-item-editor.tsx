'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/client/department-ui/ui/button'
import { Input } from '@/client/department-ui/ui/input'
import { Label } from '@/client/department-ui/ui/label'
import { Badge } from '@/client/department-ui/ui/badge'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/client/department-ui/ui/card'
import { EnumLocationCategory } from '@/shared/types/supabase.schema'
import { useContentFilterStore } from '@/client/department-feature/store/use-content-filter-store'
import { useConsoleSystemStore } from '@/client/department-feature/store/use-console-system-store'
import { useContentEditorStore } from '@/client/department-feature/store/use-content-editor-store'

export function EditPanel({ id }: { id: string }) {
  const { locations, stations, fetchData } = useContentFilterStore()
  const { addPublicLog, addAdminLog } = useConsoleSystemStore()
  const { closePanel } = useContentEditorStore()
  const location = locations.find(l => l.id === id)
  const [showConfirm, setShowConfirm] = useState(false)
  
  const [formData, setFormData] = useState<{
    location_name: string
    title: string
    location_lat: string | number
    location_lng: string | number
    category: EnumLocationCategory[]
    related_station: string[]
  }>({
    location_name: location?.location_name || '',
    title: location?.title || '',
    location_lat: location?.location_lat || '',
    location_lng: location?.location_lng || '',
    category: location?.category || [],
    related_station: location?.related_station || []
  })

  const handleSave = async () => {
    try {
      addAdminLog('INFO', `[API] PUT REQUEST: /api/locations (Edit)`)
      const res = await fetch('/api/locations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...formData })
      })
      if (!res.ok) throw new Error('Failed to update')
      addPublicLog('SUCCESS', '수정이 완료되었습니다.')
      fetchData(true)
      setShowConfirm(false)
      closePanel()
    } catch (error) {
      addPublicLog('FAILED', '수정 중 오류가 발생했습니다.')
      addAdminLog('FAILED', `[API] PUT ERROR: ${error}`)
    }
  }

  return (
    <div className="w-[400px] border-l border-border bg-background shadow-xl h-full flex flex-col animate-in slide-in-from-right duration-300 relative">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="font-semibold text-lg">Edit Location</h2>
        <Button variant="ghost" size="icon" onClick={closePanel}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="p-4 flex-1 overflow-auto space-y-4">
        {location ? (
          <div className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground block mb-1">Location Name</Label>
              <Input 
                value={formData.location_name} 
                onChange={(e) => setFormData({...formData, location_name: e.target.value})} 
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground block mb-1">Title</Label>
              <Input 
                value={formData.title} 
                onChange={(e) => setFormData({...formData, title: e.target.value})} 
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-muted-foreground block mb-1">Coordinates (Lat)</Label>
                <Input 
                  type="number" step="any" 
                  value={formData.location_lat} 
                  onChange={(e) => setFormData({...formData, location_lat: e.target.value})} 
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground block mb-1">Coordinates (Lng)</Label>
                <Input 
                  type="number" step="any" 
                  value={formData.location_lng} 
                  onChange={(e) => setFormData({...formData, location_lng: e.target.value})} 
                />
              </div>
            </div>
            
            <div className="space-y-2 pt-2">
              <Label className="text-xs text-muted-foreground block">Related Stations</Label>
              <div className="flex flex-wrap gap-1.5">
                {stations.map(station => {
                  const isSelected = formData.related_station.includes(station.station_name_kr) || formData.related_station.includes(station.id)
                  return (
                    <Badge
                      key={station.id}
                      variant={isSelected ? "default" : "outline"}
                      className="cursor-pointer text-[10px] h-6 px-2 transition-all"
                      onClick={() => {
                        if (isSelected) {
                          setFormData({ 
                            ...formData, 
                            related_station: formData.related_station.filter(id => id !== station.station_name_kr && id !== station.id) 
                          })
                        } else {
                          setFormData({ ...formData, related_station: [...formData.related_station, station.station_name_kr] })
                        }
                      }}
                    >
                      {station.station_name_kr}
                    </Badge>
                  )
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-muted-foreground text-sm flex h-32 items-center justify-center">
            {id ? 'Loading...' : 'Not found'}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-border">
        <Button className="w-full" onClick={() => setShowConfirm(true)}>Save Changes</Button>
      </div>

      {showConfirm && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <Card className="w-[300px] shadow-lg animate-in zoom-in-95">
            <CardHeader>
              <CardTitle>Save Confirmation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Are you sure you want to save these changes?</p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowConfirm(false)}>Cancel</Button>
              <Button onClick={handleSave}>Confirm</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}

export function CreatePanel() {
  const { fetchData, stations } = useContentFilterStore()
  const { addPublicLog, addAdminLog } = useConsoleSystemStore()
  const { closePanel } = useContentEditorStore()
  const [showConfirm, setShowConfirm] = useState(false)
  const [formData, setFormData] = useState<{
    location_name: string
    title: string
    location_lat: string | number
    location_lng: string | number
    category: EnumLocationCategory[]
    related_station: string[]
  }>({
    location_name: '',
    title: '',
    location_lat: '',
    location_lng: '',
    category: [],
    related_station: []
  })

  const handleCreate = async () => {
    try {
      addAdminLog('INFO', `[API] POST REQUEST: /api/locations (Create)`)
      const res = await fetch('/api/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (!res.ok) throw new Error('Failed to create')
      addPublicLog('SUCCESS', '생성이 완료되었습니다.')
      fetchData(true)
      setShowConfirm(false)
      closePanel()
    } catch (error) {
      addPublicLog('FAILED', '생성 중 오류가 발생했습니다.')
      addAdminLog('FAILED', `[API] POST ERROR: ${error}`)
    }
  }

  return (
    <div className="w-[400px] border-l border-border bg-background shadow-xl h-full flex flex-col animate-in slide-in-from-right duration-300 relative">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="font-semibold text-lg">Create Location</h2>
        <Button variant="ghost" size="icon" onClick={closePanel}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="p-4 flex-1 overflow-auto space-y-4">
        <div className="space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground block mb-1">Location Name</Label>
            <Input 
              placeholder="Enter Location Name..." 
              value={formData.location_name}
              onChange={(e) => setFormData({...formData, location_name: e.target.value})}
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground block mb-1">Title</Label>
            <Input 
              placeholder="Enter Title..." 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-muted-foreground block mb-1">Coordinates (Lat)</Label>
              <Input 
                type="number" step="any" placeholder="Latitude" 
                value={formData.location_lat}
                onChange={(e) => setFormData({...formData, location_lat: e.target.value})}
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground block mb-1">Coordinates (Lng)</Label>
              <Input 
                type="number" step="any" placeholder="Longitude" 
                value={formData.location_lng}
                onChange={(e) => setFormData({...formData, location_lng: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <Label className="text-xs text-muted-foreground block">Related Stations</Label>
            <div className="flex flex-wrap gap-1.5">
              {stations.map(station => {
                const isSelected = formData.related_station.includes(station.station_name_kr) || formData.related_station.includes(station.id)
                return (
                  <Badge
                    key={station.id}
                    variant={isSelected ? "default" : "outline"}
                    className="cursor-pointer text-[10px] h-6 px-2 transition-all"
                    onClick={() => {
                      if (isSelected) {
                        setFormData({ 
                          ...formData, 
                          related_station: formData.related_station.filter(id => id !== station.station_name_kr && id !== station.id) 
                        })
                      } else {
                        setFormData({ ...formData, related_station: [...formData.related_station, station.station_name_kr] })
                      }
                    }}
                  >
                    {station.station_name_kr}
                  </Badge>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-border">
        <Button className="w-full" onClick={() => setShowConfirm(true)}>Create Location</Button>
      </div>

      {showConfirm && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <Card className="w-[300px] shadow-lg animate-in zoom-in-95">
            <CardHeader>
              <CardTitle>Create Confirmation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Are you sure you want to create this location?</p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowConfirm(false)}>Cancel</Button>
              <Button onClick={handleCreate}>Confirm</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}

const ContentItemEditor = {
    Edit : EditPanel,
    Create : CreatePanel 
}

export default ContentItemEditor
