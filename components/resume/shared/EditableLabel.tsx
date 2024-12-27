"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Edit2, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface EditableLabelProps {
  label: string
  onSave: (newLabel: string) => void
  variant?: 'default' | 'title'
}

export function EditableLabel({ label, onSave, variant = 'default' }: EditableLabelProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editingLabel, setEditingLabel] = useState(label)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setEditingLabel(label)
  }, [label])

  const handleSave = () => {
    if (editingLabel.trim()) {
      onSave(editingLabel)
      setIsEditing(false)
    }
  }

  return (
    <div className={cn(
      "group relative flex items-center gap-2",
      variant === 'title' && "w-full justify-between"
    )}>
      <div className="relative flex-1">
        <Input
          ref={inputRef}
          value={editingLabel}
          onChange={(e) => setEditingLabel(e.target.value)}
          disabled={!isEditing}
          className={cn(
            "border-none bg-transparent p-0 focus-visible:ring-0",
            "disabled:opacity-100",
            variant === 'title' && "text-lg font-semibold",
            !isEditing && [
              "cursor-default",
              "text-foreground",
              "placeholder:text-foreground"
            ],
            isEditing && [
              "border-b-2 border-primary/50",
              "bg-muted/30",
              "px-2 rounded-sm",
              "cursor-text"
            ]
          )}
        />
        {isEditing && (
          <div className="absolute right-0 top-1/2 flex -translate-y-1/2 items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn(
                "h-6 w-6 hover:bg-green-50 hover:text-green-600",
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
                variant === 'title' && "h-8 w-8"
              )}
              onClick={() => {
                setEditingLabel(label)
                setIsEditing(false)
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      {!isEditing && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            "opacity-0 group-hover:opacity-100 transition-opacity",
            "hover:bg-accent/50",
            variant === 'title' ? "h-8 w-8" : "h-6 w-6"
          )}
          onClick={() => setIsEditing(true)}
        >
          <Edit2 className={cn(
            "h-4 w-4",
            variant === 'title' && "h-5 w-5"
          )} />
        </Button>
      )}
    </div>
  )
} 