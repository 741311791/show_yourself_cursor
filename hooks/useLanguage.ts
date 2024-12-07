"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Language = 'zh' | 'en'

interface LanguageStore {
  language: Language
  setLanguage: (language: Language) => void
}

export const useLanguage = create<LanguageStore>()(
  persist(
    (set) => ({
      language: 'zh',
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'language-storage',
    }
  )
) 