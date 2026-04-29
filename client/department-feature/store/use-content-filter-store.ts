import { create } from 'zustand'
import { SubwayLine, SubwayStation, Location, EnumSubwayLineCategory,EnumSubwayLines } from '@/shared/types/supabase.schema'
import { fetchDatabaseData } from '@/client/department-feature/api/fetch-database'
import { useConsoleSystemStore } from '@/client/department-feature/store/use-console-system-store'

interface ContentFilterState {
  subwayLines: SubwayLine[]
  stations: SubwayStation[]
  locations: Location[]
  
  isLoading: boolean
  error: string | null
  
  selectedStationIds: string[]
  searchQuery: string
  
  fetchData: (force?: boolean) => Promise<void>
  toggleStation: (id: string) => void
  setSearchQuery: (query: string) => void
  selectAll: () => void
  selectNone: () => void
  isAllSelected: () => boolean
  isCategorySelected: (category: EnumSubwayLineCategory) => boolean
  toggleCategory: (category: EnumSubwayLineCategory) => void
}

export const useContentFilterStore = create<ContentFilterState>((set, get) => ({
  subwayLines: [],
  stations: [],
  locations: [],
  isLoading: false,
  error: null,
  selectedStationIds: [],
  searchQuery: '',

  setSearchQuery: (query) => set({ searchQuery: query }),

  fetchData: async (force = false) => {
    const state = get()
    if (state.isLoading || (!force && state.locations.length > 0)) return

    set({ isLoading: true, error: null })
    const { addAdminLog } = useConsoleSystemStore.getState()
    
    addAdminLog('INFO', 'Fetching Content records from Supabase...')
    
    try {
      const [dbData, locationsRes] = await Promise.all([
        fetchDatabaseData(),
        fetch('/api/locations').then(res => res.json())
      ])
      
      if (locationsRes.error) throw new Error(locationsRes.error)

      set({ 
        subwayLines: dbData.lines,
        stations: dbData.stations,
        locations: locationsRes.data as Location[],
        // Default to all stations selected initially
        selectedStationIds: dbData.stations.map(station => station.id),
        isLoading: false 
      })
      
      addAdminLog('SUCCESS', `Successfully fetched ${locationsRes.data.length} locations.`)
    } catch (error) {
      console.error('Failed to fetch data from APIs:', error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      set({ error: errorMessage, isLoading: false })
      addAdminLog('FAILED', `Content fetch failed: ${errorMessage}`)
    }
  },

  toggleStation: (id) => set((state) => {
    const isSelected = state.selectedStationIds.includes(id)
    if (isSelected) {
      return { selectedStationIds: state.selectedStationIds.filter(stationId => stationId !== id) }
    } else {
      return { selectedStationIds: [...state.selectedStationIds, id] }
    }
  }),
  
  selectAll: () => set((state) => ({ selectedStationIds: state.stations.map(station => station.id) })),
  
  selectNone: () => set({ selectedStationIds: [] }),
  
  isAllSelected: () => {
    const state = get()
    if (state.stations.length === 0) return false
    return state.selectedStationIds.length === state.stations.length
  },
  
  isCategorySelected: (category) => {
    const state = get()
    const categoryLineIds = state.subwayLines.filter(l => l.line_category === category).map(l => l.name_en)
    const categoryStations = state.stations.filter(s => s.line_ids && s.line_ids.some(id => categoryLineIds.includes(id as EnumSubwayLines)))
    
    if (categoryStations.length === 0) return false
    return categoryStations.every(s => state.selectedStationIds.includes(s.id))
  },

  toggleCategory: (category) => {
    const state = get()
    const categoryLineIds = state.subwayLines.filter(l => l.line_category === category).map(l => l.name_en)
    const categoryStationIds = state.stations
      .filter(s => s.line_ids && s.line_ids.some(id => categoryLineIds.includes(id as EnumSubwayLines)))
      .map(s => s.id)
      
    const isAlreadySelected = get().isCategorySelected(category)

    set((state) => {
      if (isAlreadySelected) {
        return { selectedStationIds: state.selectedStationIds.filter(id => !categoryStationIds.includes(id)) }
      } else {
        const newIds = Array.from(new Set([...state.selectedStationIds, ...categoryStationIds]))
        return { selectedStationIds: newIds }
      }
    })
  }
}))
