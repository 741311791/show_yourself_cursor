"use client"

import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { ResumeCardMedia } from "./ResumeCardMedia"
import { ResumeCardContent } from "./ResumeCardContent"

interface ResumeActionCardProps {
  title: string
  description?: string
  icon?: LucideIcon
  clickFunc?: () => void
}

export function ResumeActionCard({
  title,
  description,
  icon,
  clickFunc
}: ResumeActionCardProps) {
  return (
    <div className={cn(
      "group relative bg-muted/50 hover:bg-muted",
      "aspect-[21/30] flex flex-col"
    )}>
      <ResumeCardMedia 
        variant="action"
        icon={icon}
      />
      <ResumeCardContent 
        title={title}
        description={description}
      />
    </div>
  )
} 