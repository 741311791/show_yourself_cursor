import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CustomBlock } from '@/types/custom'

interface CustomBlockStore {
  blocks: CustomBlock[]
  addBlock: (block: CustomBlock) => void
  updateBlock: (id: string, block: Partial<CustomBlock>) => void
  removeBlock: (id: string) => void
}

export const useCustomBlockStore = create<CustomBlockStore>()(
  persist(
    (set) => ({
      blocks: [],
      addBlock: (block) => set((state) => ({ 
        blocks: [...state.blocks, block] 
      })),
      updateBlock: (id, block) => set((state) => ({
        blocks: state.blocks.map(b => 
          b.id === id ? { ...b, ...block } : b
        )
      })),
      removeBlock: (id) => set((state) => ({
        blocks: state.blocks.filter(b => b.id !== id)
      }))
    }),
    {
      name: 'custom-blocks'
    }
  )
) 