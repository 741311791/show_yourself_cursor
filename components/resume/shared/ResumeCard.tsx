"use client"

import { LucideIcon } from "lucide-react"
import { Resume } from "@/types/resume"
import { ResumeAction } from "@/components/resume/traditional/ResumeDropdownMenu"
import { cn } from "@/lib/utils"
import { ResumeCardMedia } from "./ResumeCardMedia"
import { ResumeCardContent } from "./ResumeCardContent"
import { ResumeContextMenu } from "../traditional/ResumeContextMenu"

interface ResumeCardProps {
  variant: "action" | "resume"
  title: string
  description?: string
  icon?: LucideIcon
  thumbnailUrl?: string
  resume?: Resume
  onAction?: (action: ResumeAction) => void
}

export function ResumeCard({
  variant,
  title,
  description,
  icon,
  thumbnailUrl,
  resume,
  onAction
}: ResumeCardProps) {
  const card = (
    <div className={cn(
      "group relative bg-muted/50 hover:bg-muted",
      "aspect-[21/30] flex flex-col"
    )}>
      <ResumeCardMedia 
        variant={variant}
        icon={icon}
        thumbnailUrl={thumbnailUrl}
        resume={resume}
      />
      <ResumeCardContent 
        title={title}
        description={description}
        resume={resume}
      />
    </div>
  )

  if (variant === 'resume' && resume && onAction) {
    return (
      <ResumeContextMenu resume={resume} onAction={onAction}>
        {card}
      </ResumeContextMenu>
    )
  }

  return card
} 