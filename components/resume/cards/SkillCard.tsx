"use client"

import { SkillSection } from "@/types/section"
import { Skill, defaultSkill } from "@/types/skill"
import { AIRichTextEditor } from "@/components/shared/AIRichTextEditor"
import { CustomFieldsSection } from "@/components/resume/shared/CustomFieldsSection"
import { LabelInput } from "@/components/resume/shared/LabelInput"
import { DraggableCardList } from "@/components/resume/shared/DraggableCardList"
import { SkillCategory, SkillLevel } from "@/types/skill"
import { v4 as uuidv4 } from 'uuid'
import { Code, Star, Folder, Gauge, Calendar, FileText, Building2 } from "lucide-react"

interface SkillCardProps {
  section: SkillSection
  onUpdate: (updates: Partial<SkillSection>) => void
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

export function SkillCard({ section, onUpdate }: SkillCardProps) {
  const handleAddSkill = () => {
    onUpdate({
      items: [
        ...section.items,
        {
          ...defaultSkill,
          id: uuidv4()
        }
      ]
    })
  }

  const renderCollapsedContent = (item: Skill) => (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <Code className="h-4 w-4 text-rose-500" />
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
        <Folder className="h-4 w-4 text-rose-500" />
        <span className="text-sm text-muted-foreground">
          {item.category || ''}
        </span>
      </div>
    </div>
  )

  const renderExpandedContent = (item: Skill) => (
    <div className="space-y-6">
      <SectionTitle>基本信息</SectionTitle>
      <div className="grid grid-cols-2 gap-4">
        <LabelInput
          label={section.labelConfig.find(label => label.key === 'name')?.label ?? '技能名称'}
          value={item.name || ''}
          icon={<Code className="h-4 w-4" />}
          onChange={(value) => {
            const newItems = section.items.map(i => 
              i.id === item.id ? { ...i, name: value } : i
            )
            onUpdate({ items: newItems })
          }}
          placeholder="请输入技能名称"
        />
        <LabelInput
          label={section.labelConfig.find(label => label.key === 'category')?.label ?? '技能分类'}
          value={item.category || ''}
          icon={<Folder className="h-4 w-4" />}
          onChange={(value) => {
            const newItems = section.items.map(i => 
              i.id === item.id ? { ...i, category: value as SkillCategory } : i
            )
            onUpdate({ items: newItems })
          }}
          placeholder="请输入技能分类"
        />
        <LabelInput
          label={section.labelConfig.find(label => label.key === 'level')?.label ?? '掌握程度'}
          value={item.level || 'BEGINNER'}
          icon={<Gauge className="h-4 w-4" />}
          onChange={(value) => {
            const newItems = section.items.map(i => 
              i.id === item.id ? { ...i, level: value as SkillLevel } : i
            )
            onUpdate({ items: newItems })
          }}
          placeholder="请输入掌握程度"
        />
        <LabelInput
          label={section.labelConfig.find(label => label.key === 'certDate')?.label ?? '证书日期'}
          value={item.certDate || ''}
          icon={<Calendar className="h-4 w-4" />}
          onChange={(value) => {
            const newItems = section.items.map(i => 
              i.id === item.id ? { ...i, certDate: value } : i
            )
            onUpdate({ items: newItems })
          }}
          placeholder="请输入证书日期"
        />
        <LabelInput
          label={section.labelConfig.find(label => label.key === 'certName')?.label ?? '证书名称'}
          value={item.certName || ''}
          icon={<FileText className="h-4 w-4" />}
          onChange={(value) => {
            const newItems = section.items.map(i => 
              i.id === item.id ? { ...i, certName: value } : i
            )
            onUpdate({ items: newItems })
          }}
          placeholder="请输入证书名称"
        />
        <LabelInput
          label={section.labelConfig.find(label => label.key === 'certOrg')?.label ?? '证书颁发机构'}
          value={item.certOrg || ''}
          icon={<Building2 className="h-4 w-4" />}
          onChange={(value) => {
            const newItems = section.items.map(i => 
              i.id === item.id ? { ...i, certOrg: value } : i
            )
            onUpdate({ items: newItems })
          }}
          placeholder="请输入证书颁发机构"
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
        onAddItem={handleAddSkill}
        renderCollapsedContent={renderCollapsedContent}
        renderExpandedContent={renderExpandedContent}
        addButtonText="添加技能"
      />
    </div>
  )
} 