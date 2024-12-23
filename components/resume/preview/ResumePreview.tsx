"use client"

import { useEffect, useRef, useState } from "react"
import { ResumePreviewProps } from "@/types/resume"
import { cn } from "@/lib/utils"
import { ModernTemplate } from "../templates/ModernTemplate"
import { ClassicTemplate } from "../templates/ClassicTemplate"

const templates = {
  modern: ModernTemplate,
  classic: ClassicTemplate,
} as const

export function ResumePreview({ 
  data,
  template,
  scale = 1,
  isPrinting = false
}: ResumePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState("100%")

  useEffect(() => {
    if (!containerRef.current) return
    
    const updateHeight = () => {
      const width = containerRef.current?.clientWidth ?? 0
      // A4 比例 (210mm x 297mm)
      setHeight(`${width * 1.4142}px`)
    }

    updateHeight()
    window.addEventListener("resize", updateHeight)
    return () => window.removeEventListener("resize", updateHeight)
  }, [])

  if (!data) return null

  const Template = templates[template]

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative mx-auto w-full max-w-[1000px] overflow-hidden bg-white shadow-lg",
        isPrinting && "shadow-none"
      )}
      style={{ 
        height,
        transform: `scale(${scale})`,
        transformOrigin: "top center"
      }}
    >
      <Template 
        data={data}
        metadata={{
          template,
          fontSize: 14,
          spacing: 1.5,
          showIcons: true,
          showDates: true
        }}
      />
    </div>
  )
} 