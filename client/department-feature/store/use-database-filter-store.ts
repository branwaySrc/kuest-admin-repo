import { create } from 'zustand'
import { SubwayLine, SubwayStation, EnumSubwayLineCategory } from '@/shared/types/supabase.schema'
import { fetchDatabaseData } from '@/client/department-feature/api/fetch-database'
import { useConsoleSystemStore } from '@/client/department-feature/store/use-console-system-store'

interface DatabaseFilterState {
  subwayLines: SubwayLine[]
  stations: SubwayStation[]
  
  isLoading: boolean
  error: string | null
  
  selectedLineIds: string[]
  searchQuery: string
  
  fetchData: (force?: boolean) => Promise<void>
  toggleLine: (id: string) => void
  setLines: (ids: string[]) => void
  setSearchQuery: (query: string) => void
  selectAll: () => void
  selectNone: () => void
  isAllSelected: () => boolean
  isCategorySelected: (category: EnumSubwayLineCategory) => boolean
  toggleCategory: (category: EnumSubwayLineCategory) => void
}

export const useDatabaseFilterStore = create<DatabaseFilterState>((set, get) => ({
  subwayLines: [],
  stations: [],
  isLoading: false,
  error: null,
  selectedLineIds: [], // Default to empty until data loads
  searchQuery: '',

  setSearchQuery: (query) => set({ searchQuery: query }),

  fetchData: async (force = false) => {
    const state = get()
    // 이미 로딩 중이거나 (force가 아닐 때) 데이터가 존재하면 중복 호출 방지
    if (state.isLoading || (!force && state.subwayLines.length > 0)) return

    set({ isLoading: true, error: null })
    const { addAdminLog } = useConsoleSystemStore.getState()
    
    addAdminLog('INFO', 'Fetching Database records from Supabase...')
    
    try {
      const data = await fetchDatabaseData()
      
      set({ 
        subwayLines: data.lines,
        stations: data.stations,
        // Default to all lines selected initially
        selectedLineIds: data.lines.map(line => line.id),
        isLoading: false 
      })
      
      addAdminLog('SUCCESS', `Successfully fetched ${data.lines.length} lines and ${data.stations.length} stations.`)
    } catch (error) {
      console.error('Failed to fetch data from APIs:', error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      set({ error: errorMessage, isLoading: false })
      addAdminLog('FAILED', `Database fetch failed: ${errorMessage}`)
    }
  },

  toggleLine: (id) => set((state) => {
    const isSelected = state.selectedLineIds.includes(id)
    if (isSelected) {
      return { selectedLineIds: state.selectedLineIds.filter(lineId => lineId !== id) }
    } else {
      return { selectedLineIds: [...state.selectedLineIds, id] }
    }
  }),
  
  setLines: (ids) => set({ selectedLineIds: ids }),
  
  selectAll: () => set((state) => ({ selectedLineIds: state.subwayLines.map(line => line.id) })),
  
  selectNone: () => set({ selectedLineIds: [] }),
  
  isAllSelected: () => {
    const state = get()
    if (state.subwayLines.length === 0) return false
    return state.selectedLineIds.length === state.subwayLines.length
  },
  
  isCategorySelected: (category) => {
    const state = get()
    const categoryLines = state.subwayLines.filter(l => l.line_category === category)
    if (categoryLines.length === 0) return false
    return categoryLines.every(l => state.selectedLineIds.includes(l.id))
  },

  toggleCategory: (category) => {
    const state = get()
    const categoryLineIds = state.subwayLines
      .filter(l => l.line_category === category)
      .map(l => l.id)
      
    const isAlreadySelected = get().isCategorySelected(category)

    set((state) => {
      if (isAlreadySelected) {
        return { selectedLineIds: state.selectedLineIds.filter(id => !categoryLineIds.includes(id)) }
      } else {
        const newIds = Array.from(new Set([...state.selectedLineIds, ...categoryLineIds]))
        return { selectedLineIds: newIds }
      }
    })
  }
}))
