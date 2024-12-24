"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit2, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SectionConfigDialogProps {
  label: string
  onSave: (newLabel: string) => void
  variant?: 'default' | 'title'
}

export function SectionConfigDialog({ 
  label, 
  onSave,
  variant = 'default'
}: SectionConfigDialogProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editingLabel, setEditingLabel] = useState(label)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setEditingLabel(label)
  }, [label])

  const handleSave = () => {
    if (editingLabel.trim() !== '') {
      onSave(editingLabel)
      setIsEditing(false)
    }
  }

  // 当开始编辑时，调整输入框宽度
  useEffect(() => {
    if (isEditing && inputRef.current) {
      // 获取当前文本宽度
      const textWidth = inputRef.current.scrollWidth
      // 设置最小宽度为原标签宽度
      const minWidth = containerRef.current?.offsetWidth || 0
      // 设置最大宽度为父容器宽度
      const parentWidth = containerRef.current?.parentElement?.offsetWidth || 0
      
      // 计算合适的宽度
      const width = Math.min(Math.max(textWidth, minWidth), parentWidth)
      inputRef.current.style.width = `${width}px`
    }
  }, [isEditing, editingLabel])

  const handleCancel = () => {
    setEditingLabel(label)
    setIsEditing(false)
  }

  return (
    <div 
      ref={containerRef} 
      className={cn(
        "group relative flex items-center gap-2",
        variant === 'title' && "w-full justify-between"
      )}
    >
      {/* 标签容器 */}
      <div className="relative inline-flex items-center">
        {/* 原标签 */}
        <span className={cn(
          "transition-opacity duration-200",
          isEditing ? "opacity-0" : "opacity-100",
          variant === 'title' && "text-lg font-semibold"
        )}>
          {label}
        </span>

        {/* 编辑状态 */}
        {isEditing && (
          <div className="absolute left-0 flex items-center gap-1">
            <Input
              ref={inputRef}
              value={editingLabel}
              onChange={(e) => setEditingLabel(e.target.value)}
              className={cn(
                "h-6 min-w-[60px] py-1",
                variant === 'title' && "text-lg font-semibold h-8"
              )}
              autoFocus
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn(
                "h-6 w-6 hover:bg-green-50 hover:text-green-600",
                "dark:hover:bg-green-950",
                variant === 'title' && "h-8 w-8"
              )}
              onClick={handleSave}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn(
                "h-6 w-6 hover:bg-red-50 hover:text-red-600",
                "dark:hover:bg-red-950",
                variant === 'title' && "h-8 w-8"
              )}
              onClick={handleCancel}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* 编辑按钮 */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn(
          "opacity-0 group-hover:opacity-100 transition-opacity",
          "hover:bg-accent/50",
          isEditing && "hidden",
          variant === 'title' ? "h-8 w-8" : "h-6 w-6"
        )}
        onClick={() => setIsEditing(true)}
      >
        <Edit2 className={cn(
          "h-4 w-4",
          variant === 'title' && "h-5 w-5"
        )} />
      </Button>
    </div>
  )
} 