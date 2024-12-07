"use client"

import { LayoutGrid, List, Plus, Wand2 } from "lucide-react"
import { useViewMode } from "@/hooks/useViewMode"

export function Toolbar() {
  const { viewMode, setViewMode } = useViewMode()

  return (
    <div className="h-16 border-b bg-white flex items-center justify-between px-6">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setViewMode('grid')}
          className={`p-2 rounded-lg ${
            viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'
          }`}
        >
          <LayoutGrid size={20} />
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`p-2 rounded-lg ${
            viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'
          }`}
        >
          <List size={20} />
        </button>
      </div>
      
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 px-4 py-2 text-white bg-[#8B3DFF] rounded-lg hover:bg-[#7B2FEF]">
          <Wand2 size={18} />
          <span>AI 生成</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-white bg-[#00B96B] rounded-lg hover:bg-[#00A85D]">
          <Plus size={18} />
          <span>新建简历</span>
        </button>
      </div>
    </div>
  )
} 