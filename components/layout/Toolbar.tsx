"use client"

import { LayoutGrid, List, Plus, Wand2 } from "lucide-react"
import { useViewMode } from "@/hooks/useViewMode"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function Toolbar() {
  const { viewMode, setViewMode } = useViewMode()

  return (
    <div className="h-16 border-b bg-background flex items-center justify-between px-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setViewMode('grid')}
          className={cn(
            "hover:bg-accent hover:text-accent-foreground",
            viewMode === 'grid' && "bg-accent text-accent-foreground"
          )}
        >
          <LayoutGrid className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setViewMode('list')}
          className={cn(
            "hover:bg-accent hover:text-accent-foreground",
            viewMode === 'list' && "bg-accent text-accent-foreground"
          )}
        >
          <List className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="flex items-center gap-3">
        <Button
          className={cn(
            "relative group overflow-hidden",
            // 渐变背景
            "bg-gradient-to-r from-[#8B3DFF] to-[#B44DFF]",
            "hover:from-[#7B2FEF] hover:to-[#A43DEF]",
            "dark:from-[#9B4DFF] dark:to-[#C45DFF]",
            "dark:hover:from-[#8B3DFF] dark:hover:to-[#B44DFF]",
            // 光效动画
            "before:absolute before:inset-0",
            "before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
            "before:translate-x-[-200%] before:animate-[shimmer_2s_infinite]",
            // 阴影效果
            "shadow-lg shadow-primary/20",
            "dark:shadow-primary/30"
          )}
        >
          <Wand2 className="mr-2 h-4 w-4" />
          AI 生成
        </Button>

        <Button
          className={cn(
            "bg-[#00B96B] hover:bg-[#00A85D]",
            "dark:bg-[#00CC77] dark:hover:bg-[#00B96B]",
            "text-white shadow-lg shadow-[#00B96B]/20",
            "dark:shadow-[#00CC77]/30"
          )}
        >
          <Plus className="mr-2 h-4 w-4" />
          新建简历
        </Button>
      </div>
    </div>
  )
} 