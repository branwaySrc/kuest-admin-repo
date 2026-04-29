import { create } from 'zustand'

interface ContentEditorStore {
  isOpen: boolean
  mode: 'create' | 'edit' | null
  selectedId: string | null
  openCreate: () => void
  openEdit: (id: string) => void
  closePanel: () => void
}

export const useContentEditorStore = create<ContentEditorStore>((set) => ({
  isOpen: false,
  mode: null,
  selectedId: null,
  openCreate: () => set({ isOpen: true, mode: 'create', selectedId: null }),
  openEdit: (id) => set({ isOpen: true, mode: 'edit', selectedId: id }),
  closePanel: () => set({ isOpen: false, mode: null, selectedId: null }),
}))
