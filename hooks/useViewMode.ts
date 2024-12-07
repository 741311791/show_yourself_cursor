"use client"

import { create } from 'zustand'

type ViewMode = 'grid' | 'list'

interface ViewModeStore {
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
}

export const useViewMode = create<ViewModeStore>((set) => ({
  viewMode: 'grid',
  setViewMode: (mode) => set({ viewMode: mode }),
})) 