"use client"

import { LanguageSection } from "@/types/section"
import { Language, defaultLanguage } from "@/types/language"
import { AIRichTextEditor } from "@/components/shared/AIRichTextEditor"
import { CustomFieldsSection } from "@/components/resume/shared/CustomFieldsSection"
import { LabelInput } from "@/components/resume/shared/LabelInput"
import { DraggableCardList } from "@/components/resume/shared/DraggableCardList"
import { v4 as uuidv4 } from 'uuid'
import { Languages, Star, Calendar, FileText, Building2, Award } from "lucide-react"

interface LanguageCardProps {
  section: LanguageSection
  onUpdate: (updates: Partial<LanguageSection>) => void
}

interface SectionTitleProps {
  children: React.ReactNode
}

function SectionTitle({ children }: SectionTitleProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-1 h-6 bg-[#FF7875] rounded-full" />
      <h3 className="text-base font-semibold text-gray-800">{children}</h3>
    </div>
  )
}

export function LanguageCard({ section, onUpdate }: LanguageCardProps) {
  const handleAddLanguage = () => {
    onUpdate({
      items: [
        ...section.items,
        {
          ...defaultLanguage,
          id: uuidv4()
        }
      ]
    })
  }

  const renderCollapsedContent = (item: Language) => (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <Languages className="h-4 w-4 text-rose-500" />
        <span className="text-sm">
          {item.name || ''}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Star className="h-4 w-4 text-rose-500" />
        <span className="text-sm text-muted-foreground">
          {item.level || ''}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Award className="h-4 w-4 text-rose-500" />
        <span className="text-sm text-muted-foreground">
          {[item.certificate, item.validPeriod].filter(Boolean).join(' · ') || ''}
        </span>
      </div>
    </div>
  )

  const renderExpandedContent = (item: Language) => (
    <div className="space-y-6">
      <SectionTitle>基本信息</SectionTitle>
      <div className="grid grid-cols-2 gap-4">
        <LabelInput
          label={section.labelConfig.find(label => label.key === 'name')?.label ?? '语言名称'}
          value={item.name || ''}
          icon={<Languages className="h-4 w-4" />}
          onChange={(value) => {
            const newItems = section.items.map(i => 
              i.id === item.id ? { ...i, name: value } : i
            )
            onUpdate({ items: newItems })
          }}
          placeholder="请输入语言名称"
        />
        <LabelInput
          label={section.labelConfig.find(label => label.key === 'level')?.label ?? '掌握程度'}
          value={item.level || 'BEGINNER'}
          icon={<Star className="h-4 w-4" />}
          onChange={(value) => {
            const newItems = section.items.map(i => 
              i.id === item.id ? { ...i, level: value } : i
            )
            onUpdate({ items: newItems })
          }}
          placeholder="请输入掌握程度"
        />
        <LabelInput
          label={section.labelConfig.find(label => label.key === 'acquireDate')?.label ?? '证书日期'}
          value={item.acquireDate || ''}
          icon={<Calendar className="h-4 w-4" />}
          onChange={(value) => {
            const newItems = section.items.map(i => 
              i.id === item.id ? { ...i, acquireDate: value } : i
            )
            onUpdate({ items: newItems })
          }}
          placeholder="请输入证书日期"
        />
        <LabelInput
          label={section.labelConfig.find(label => label.key === 'certificate')?.label ?? '证书名称'}
          value={item.certificate || ''}
          icon={<FileText className="h-4 w-4" />}
          onChange={(value) => {
            const newItems = section.items.map(i => 
              i.id === item.id ? { ...i, certificate: value } : i
            )
            onUpdate({ items: newItems })
          }}
          placeholder="请输入证书名称"
        />
        <LabelInput
          label={section.labelConfig.find(label => label.key === 'validPeriod')?.label ?? '证书有效期'}
          value={item.validPeriod || ''}
          icon={<Building2 className="h-4 w-4" />}
          onChange={(value) => {
            const newItems = section.items.map(i => 
              i.id === item.id ? { ...i, validPeriod: value } : i
            )
            onUpdate({ items: newItems })
          }}
          placeholder="请输入证书有效期"
        />
        <LabelInput
          label={section.labelConfig.find(label => label.key === 'score')?.label ?? '考试分数'}
          value={item.score || ''}
          icon={<Award className="h-4 w-4" />}
          onChange={(value) => {
            const newItems = section.items.map(i => 
              i.id === item.id ? { ...i, score: value } : i
            )
            onUpdate({ items: newItems })
          }}
          placeholder="请输入考试分数"
        />
      </div>

      <div className="space-y-4">
        <SectionTitle>自定义字段</SectionTitle>
        <CustomFieldsSection
          fields={item.customFields}
          onChange={(fields) => {
            const newItems = section.items.map(i => 
              i.id === item.id ? { ...i, customFields: fields } : i
            )
            onUpdate({ items: newItems })
          }}
        />
      </div>

      <div className="space-y-4">
        <SectionTitle>总结</SectionTitle>
        <AIRichTextEditor
          content={item.summary || ""}
          onChange={(content) => {
            const newItems = section.items.map(i => 
              i.id === item.id ? { ...i, summary: content } : i
            )
            onUpdate({ items: newItems })
          }}
          className="min-h-[200px]"
        />
      </div>
    </div>
  )

  return (
    <div className="space-y-8">
      <DraggableCardList
        items={section.items.map(item => ({ ...item, id: item.id || crypto.randomUUID() }))}
        onChange={(items) => onUpdate({ items })}
        onAddItem={handleAddLanguage}
        renderCollapsedContent={renderCollapsedContent}
        renderExpandedContent={renderExpandedContent}
        addButtonText="添加语言"
      />
    </div>
  )
} 