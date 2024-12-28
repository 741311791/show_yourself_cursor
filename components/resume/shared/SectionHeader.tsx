"use client"

import { Switch } from "@/components/ui/switch"
import { ConfigActions } from "./ConfigActions"
import { EditableLabel } from "./EditableLabel"
import { cn } from "@/lib/utils"

interface SectionHeaderProps {
  title: string
  isShow: boolean
  section: string
  onTitleChange: (title: string) => void
  onVisibilityChange: (isShow: boolean) => void
  onLoad: () => Promise<void>
  onSave: () => Promise<void>
}

export function SectionHeader({
  title,
  isShow,
  section,
  onTitleChange,
  onVisibilityChange,
  onLoad,
  onSave
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <EditableLabel
        label={title}
        variant="title"
        onSave={onTitleChange}
        className={cn(
          "transition-colors flex-1",
          !isShow && "text-muted-foreground"
        )}
      />
      <div className="flex items-center gap-4">
        <Switch
          checked={isShow}
          onCheckedChange={(checked) => onVisibilityChange(checked)}
          className="data-[state=unchecked]:bg-muted"
        />
        <ConfigActions
          section={section}
          onLoad={onLoad}
          onSave={onSave}
        />
      </div>
    </div>
  )
} 