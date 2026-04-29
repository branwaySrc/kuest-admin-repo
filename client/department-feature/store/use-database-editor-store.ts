import { create } from 'zustand'

interface DatabaseEditorStore {
  isOpen: boolean
  mode: 'create' | 'edit' | null
  selectedId: string | null
  openCreate: () => void
  openEdit: (id: string) => void
  closePanel: () => void
}

export const useDatabaseEditorStore = create<DatabaseEditorStore>((set) => ({
  isOpen: false,
  mode: null,
  selectedId: null,
  openCreate: () => set({ isOpen: true, mode: 'create', selectedId: null }),
  openEdit: (id) => set({ isOpen: true, mode: 'edit', selectedId: id }),
  closePanel: () => set({ isOpen: false, mode: null, selectedId: null }),
}))
