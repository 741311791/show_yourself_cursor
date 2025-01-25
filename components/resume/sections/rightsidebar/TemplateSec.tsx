"use client"

import { useResumeStore } from "@/store/useResumeStore"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import Image from "next/image"
import ResumePlaceholder from "@/public/CVPreview.png"

// 模拟一些模板数据
const templates = [
  { id: 'modern', name: '现代简约', thumbnail: ResumePlaceholder.src },
  { id: 'professional', name: '专业商务', thumbnail: ResumePlaceholder.src },
  { id: 'creative', name: '创意设计', thumbnail: ResumePlaceholder.src },
  { id: 'academic', name: '学术研究', thumbnail: ResumePlaceholder.src },
  { id: 'minimal', name: '极简风格', thumbnail: ResumePlaceholder.src },
  { id: 'elegant', name: '优雅格调', thumbnail: ResumePlaceholder.src },
] as const

interface TemplateCardProps {
  name: string
  thumbnail: string
  isActive: boolean
  onClick: () => void
}

function TemplateCard({ name, thumbnail, isActive, onClick }: TemplateCardProps) {
  return (
    <button
      className={cn(
        "group relative w-full overflow-hidden rounded-lg border bg-card transition-colors hover:border-primary",
        isActive && "border-primary"
      )}
      onClick={onClick}
    >
      {/* 缩略图 */}
      <div className="relative aspect-[210/297] w-full overflow-hidden rounded-t-lg bg-muted">
        <Image
          src={thumbnail}
          alt={name}
          className="absolute inset-0 h-full w-full object-cover"
          width={210}
          height={297}
        />
        {isActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-primary/20">
            <Check className="h-8 w-8 text-primary" />
          </div>
        )}
      </div>
      
      {/* 模板名称 */}
      <div className="p-3">
        <h3 className="text-sm font-medium">{name}</h3>
      </div>
    </button>
  )
}

export function TemplateSec() {
  const currentTemplate = useResumeStore(state => state.resumeData?.metadata.template)
  const updateMetadata = useResumeStore(state => state.updateMetadata)

  const handleTemplateChange = (templateId: string) => {
    updateMetadata('template', templateId)
  }

  return (
    <section id="template" className="space-y-4">
      <h2 className="text-lg font-semibold">模板</h2>
      <div className="grid grid-cols-2 gap-4">
        {templates.map(template => (
          <TemplateCard
            key={template.id}
            {...template}
            isActive={currentTemplate === template.id}
            onClick={() => handleTemplateChange(template.id)}
          />
        ))}
      </div>
    </section>
  )
} 