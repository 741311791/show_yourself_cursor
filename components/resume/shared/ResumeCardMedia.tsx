"use client"

import { LucideIcon } from "lucide-react"
import { Resume } from "@/types/resume"
import { useRouter } from "next/navigation"

import Image from "next/image"

interface ResumeCardMediaProps {
  variant: "action" | "resume"
  icon?: LucideIcon
  thumbnailUrl?: string
  resume?: Resume
  clickFunc?: () => void
}

export function ResumeCardMedia({
  variant,
  icon: Icon,
  thumbnailUrl,
  resume,
  clickFunc
}: ResumeCardMediaProps) {
  const isActionCard = variant === "action"
  const router = useRouter()

  return (
    <div 
      className="relative flex-grow cursor-pointer"
      
    >
      {isActionCard ? (

        <div className="absolute inset-0 flex items-center justify-center"
          onClick={clickFunc}
        >
          {Icon && (
            <div className="text-muted-foreground group-hover:text-foreground transition-colors">
              <Icon className="h-8 w-8" />
            </div>
          )}
        </div>
      ) : (
        thumbnailUrl && (
          <div className="absolute inset-0"
            onClick={() => router.push(`/resume/builder/${resume?.id}`)}
            >
            <Image
              src={thumbnailUrl}
              alt="简历预览"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )
      )}
    </div>
  )
} 