"use client"

import Image from "next/image"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ResumeTemplate } from "@/types/resume"

const templates: { id: ResumeTemplate; name: string; image: string }[] = [
  {
    id: "modern",
    name: "现代简约",
    image: "/templates/modern.png"
  },
  {
    id: "classic",
    name: "经典专业",
    image: "/templates/classic.png"
  },
  {
    id: "minimal",
    name: "极简风格",
    image: "/templates/minimal.png"
  },
  {
    id: "professional",
    name: "商务正式",
    image: "/templates/professional.png"
  }
]

interface TemplatesPanelProps {
  value?: ResumeTemplate
  onChange?: (template: ResumeTemplate) => void
}

export function TemplatesPanel({ value, onChange }: TemplatesPanelProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {templates.map((template) => (
        <Card
          key={template.id}
          className={cn(
            "group relative cursor-pointer overflow-hidden transition-all hover:shadow-md",
            value === template.id && "ring-2 ring-primary"
          )}
          onClick={() => onChange?.(template.id)}
        >
          <div className="aspect-[210/297] overflow-hidden">
            <Image
              src={template.image}
              alt={template.name}
              width={210}
              height={297}
              className="object-cover transition-transform group-hover:scale-105"
            />
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <h3 className="text-sm font-medium text-white">{template.name}</h3>
          </div>
        </Card>
      ))}
    </div>
  )
} 