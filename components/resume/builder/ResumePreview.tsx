"use client"

import { useEffect, useRef } from "react"
import { ResumeDetail, ResumeTemplate } from "@/types/resume"
import { ModernTemplate } from "@/components/resume/templates/ModernTemplate"
// import { ClassicTemplate } from "@/components/resume/templates/ClassicTemplate"
import { cn } from "@/lib/utils"
import { useDebounce } from "@/hooks/useDebounce"

interface ResumePreviewProps {
  data: ResumeDetail | null
  template: ResumeTemplate
  scale?: number
}

const templates = {
  modern: ModernTemplate,
  classic: ModernTemplate,
  minimal: ModernTemplate,
  professional: ModernTemplate
} as const

export function ResumePreview({ data, template, scale = 1 }: ResumePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const debouncedData = useDebounce(data, 300)
  const Template = templates[template]

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.transform = `scale(${scale})`
    }
  }, [scale])

  if (!debouncedData) return null

  return (
    <div className="flex items-center justify-center min-h-full p-6">
      <div 
        ref={containerRef}
        className={cn(
          "w-[210mm] min-h-[297mm]", // A4 尺寸
          "bg-white shadow-lg",
          "origin-top transition-transform duration-200",
          "print:shadow-none print:transform-none"
        )}
      >
        <Template data={debouncedData} />
      </div>
    </div>
  )
} 