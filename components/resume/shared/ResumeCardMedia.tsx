"use client"

import { Resume } from "@/types/resume"
import { useRouter } from "next/navigation"
import ResumePlaceholder from "@/public/CVPreview.png"
import Image from "next/image"

interface ResumeCardMediaProps {
  thumbnailUrl?: string
  resume: Resume
}

export function ResumeCardMedia({
  thumbnailUrl,
  resume
}: ResumeCardMediaProps) {
  const router = useRouter()

  return (
    <div 
      className="relative flex-grow cursor-pointer"
      
    >
      
      <div className="absolute inset-0"
        onClick={() => router.push(`/resume/builder/${resume?.id}`)}
      >
        <Image
          src={thumbnailUrl || ResumePlaceholder.src}
              alt="简历预览"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
        </div>
    </div>
  )
} 