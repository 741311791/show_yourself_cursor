"use client"

import { formatDistanceToNow } from "date-fns"
import { zhCN } from "date-fns/locale"
import { Resume } from "@/types/resume"

interface ResumeCardContentProps {
  title: string
  resume?: Resume
}

export function ResumeCardContent({
  title,
  resume,
}: ResumeCardContentProps) {
  return (
    <div className="relative h-[25%] shrink-0 bg-gradient-to-t from-muted/90 to-muted/70 p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-grow min-w-0">
          <h6 className="text-sm font-medium text-foreground truncate">{title}</h6>
        </div>
      </div>

      {resume?.createdAt && (
        <p className="text-xs text-muted-foreground mt-1">
          {formatDistanceToNow(new Date(resume.createdAt), {
            addSuffix: true,
            locale: zhCN
          })}
        </p>
      )}
    </div>
  )
} 