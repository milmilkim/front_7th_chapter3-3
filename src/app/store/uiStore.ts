import { create } from 'zustand'

interface UIStore {
  openModals: Set<string>
  openModal: (modalId: string) => void
  closeModal: (modalId: string) => void
  isModalOpen: (modalId: string) => boolean
}

export const useUIStore = create<UIStore>((set, get) => ({
  openModals: new Set(),

  openModal: (modalId) => set((state) => ({
    openModals: new Set(state.openModals).add(modalId)
  })),

  closeModal: (modalId) => set((state) => {
    const newSet = new Set(state.openModals)
    newSet.delete(modalId)
    return { openModals: newSet }
  }),

  isModalOpen: (modalId) => get().openModals.has(modalId),
}))
