"use client"

import { Resume } from "@/types/resume"
import { ResumeCard } from "../shared/ResumeCard"
import { ResumeAction } from "@/types/resume"
import ResumePlaceholder from "@/public/CVPreview.png"

interface ResumeGridProps {
  resumes: Resume[]
  onAction: (action: ResumeAction) => void
}

export function ResumeGrid({ resumes, onAction }: ResumeGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
      {resumes.map(resume => (
        <ResumeCard
          key={resume.id}
          title={resume.name}
          thumbnailUrl={resume.thumbnailUrl || ResumePlaceholder.src}
          resume={resume}
          onAction={onAction}
        />
      ))}
    </div>
  )
} 