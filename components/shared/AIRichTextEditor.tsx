"use client"

import { useState } from "react"
import { Wand2 } from "lucide-react"
import { RichTextEditor } from "@/components/timeline/shared/RichTextEditor"
import { cn } from "@/lib/utils"

interface AIRichTextEditorProps {
  content: string
  onChange: (content: string) => void
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

  const handleAIGenerate = async () => {
    if (!onAIGenerate) return
    setIsGenerating(true)
    try {
      await onAIGenerate()
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
      />
      {isEditing && (
        <div className="absolute bottom-4 right-4">
          <button
            onClick={handleAIGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-[#7F3FFF] to-[#FF3FFF] text-white rounded-full hover:opacity-90 transition-all shadow-md hover:shadow-lg disabled:opacity-50 text-sm font-medium"
          >
            <Wand2 size={16} className={isGenerating ? "animate-spin" : ""} />
            <span>{isGenerating ? "生成中..." : "AI 生成"}</span>
          </button>
        </div>
      )}
    </div>
  )
} 