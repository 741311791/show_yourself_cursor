"use client"

import { useState } from "react"
import { RichTextEditor } from "@/components/timeline/shared/RichTextEditor"
import { Wand2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface AIRichTextEditorProps {
  content?: string
  onChange?: (content: string) => void
  className?: string
  isEditing?: boolean
  onAIGenerate?: () => Promise<void>
}

export function AIRichTextEditor({
  content,
  onChange,
  className,
  isEditing = true,
  onAIGenerate
}: AIRichTextEditorProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      if (onAIGenerate) {
        await onAIGenerate()
      }
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className={cn("relative", className)}>
      <RichTextEditor
        content={content}
        onChange={onChange}
        isEditing={isEditing}
        className="min-h-[120px]"
      />
      {isEditing && (
        <div className="absolute bottom-4 right-4">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className={cn(
              "flex items-center gap-2 px-4 py-1.5 rounded-full",
              "text-sm font-medium text-white",
              "transition-all shadow-md hover:shadow-lg",
              "disabled:opacity-50",
              // 亮色模式渐变
              "bg-gradient-to-r from-[#7F3FFF] to-[#FF3FFF]",
              "hover:opacity-90",
              // 暗色模式渐变
              "dark:from-[#9F5FFF] dark:to-[#FF5FFF]",
              "dark:hover:opacity-90",
              "dark:shadow-none dark:hover:shadow-none"
            )}
          >
            <Wand2 
              size={16} 
              className={isGenerating ? "animate-spin" : ""} 
            />
            <span>{isGenerating ? "生成中..." : "AI 生成"}</span>
          </button>
        </div>
      )}
    </div>
  )
} 