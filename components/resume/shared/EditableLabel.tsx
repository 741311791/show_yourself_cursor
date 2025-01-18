"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Edit2, Check, X } from "lucide-react"

interface EditableLabelProps {
  label: string
  onSave: (newLabel: string) => void
  onConfirm?: () => void
  className?: string
}

export function EditableLabel({ 
  label, 
  onSave, 
  onConfirm,
  className 
}: EditableLabelProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(label)

  const handleSave = () => {
    if (value.trim() !== label) {
      onSave(value.trim())
      onConfirm?.()
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setValue(label)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="h-7 px-2"
          autoFocus
        />
        <Button size="icon" variant="ghost" onClick={handleSave}>
          <Check className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" onClick={handleCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="group flex items-center gap-2">
      <span className={className}>
        {label}
      </span>
      <Button
        size="icon"
        variant="ghost"
        className="opacity-0 group-hover:opacity-100 h-6 w-6"
        onClick={() => setIsEditing(true)}
      >
        <Edit2 className="h-3 w-3" />
      </Button>
    </div>
  )
} 