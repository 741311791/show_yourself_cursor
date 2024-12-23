"use client"

import { Edit2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TimelineItemProps {
  title: string
  subtitle?: string
  description?: string
  meta?: (string | null)[]
  date?: string
  onEdit?: () => void
  onDelete?: () => void
}

export function TimelineItem({
  title,
  subtitle,
  description,
  meta,
  date,
  onEdit,
  onDelete
}: TimelineItemProps) {
  return (
    <div className={cn(
      "relative pl-4 py-2 border-l",
      "before:absolute before:left-0 before:top-4",
      "before:w-2 before:h-2 before:-translate-x-1/2",
      "before:rounded-full before:bg-primary"
    )}>
      <div className="flex items-start justify-between group">
        <div className="space-y-1">
          <h4 className="font-medium">{title}</h4>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
          {meta && meta.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {meta.join(" · ")}
            </p>
          )}
          {date && (
            <p className="text-sm text-muted-foreground">{date}</p>
          )}
          {description && (
            <p className="text-sm mt-2">{description}</p>
          )}
        </div>

        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onEdit}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
} 