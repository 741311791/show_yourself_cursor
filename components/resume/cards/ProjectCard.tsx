"use client"

import { ProjectSection } from "@/types/section"
import { Project, defaultProject } from "@/types/project"
import { AIRichTextEditor } from "@/components/shared/AIRichTextEditor"
import { CustomFieldsSection } from "@/components/resume/shared/CustomFieldsSection"
import { LabelInput } from "@/components/resume/shared/LabelInput"
import { DraggableCardList } from "@/components/resume/shared/DraggableCardList"
import { v4 as uuidv4 } from 'uuid'
import { Briefcase, Calendar, Code, User2, Folder } from "lucide-react"

interface ProjectCardProps {
  section: ProjectSection
  onUpdate: (updates: Partial<ProjectSection>) => void
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

export function ProjectCard({ section, onUpdate }: ProjectCardProps) {
  const handleAddProject = () => {
    onUpdate({
      items: [
        ...section.items,
        {
          ...defaultProject,
          id: uuidv4()
        }
      ]
    })
  }

  const renderCollapsedContent = (item: Project) => (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <Folder className="h-4 w-4 text-rose-500" />
        <span className="text-sm">
          {item.name || ''}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-rose-500" />
        <span className="text-sm text-muted-foreground">
          {item.startDate && item.endDate 
            ? `${item.startDate} - ${item.endDate}`
            : item.startDate || item.endDate || ''
          }
        </span>
      </div>

      <div className="flex items-center gap-2">
        <User2 className="h-4 w-4 text-rose-500" />
        <span className="text-sm text-muted-foreground">
          {[item.role, item.company].filter(Boolean).join(' · ') || ''}
        </span>
      </div>
    </div>
  )

  const renderExpandedContent = (item: Project) => (
    <div className="space-y-6">
      <SectionTitle>基本信息</SectionTitle>
      <div className="grid grid-cols-2 gap-4">
        <LabelInput
          label={section.labelConfig.find(label => label.key === 'name')?.label ?? '项目名称'}
          value={item.name}
          icon={<Folder className="h-4 w-4" />}
          onChange={(value) => {
            const newItems = section.items.map(i => 
              i.id === item.id ? { ...i, name: value } : i
            )
            onUpdate({ items: newItems })
          }}
          placeholder="请输入项目名称"
        />
        <LabelInput
          label={section.labelConfig.find(label => label.key === 'role')?.label ?? '担任角色'}
          value={item.role || ''}
          icon={<User2 className="h-4 w-4" />}
          onChange={(value) => {
            const newItems = section.items.map(i => 
              i.id === item.id ? { ...i, role: value } : i
            )
            onUpdate({ items: newItems })
          }}
          placeholder="请输入担任角色"
        />
        <LabelInput
          label={section.labelConfig.find(label => label.key === 'company')?.label ?? '所属组织'}
          value={item.company || ''}
          icon={<Briefcase className="h-4 w-4" />}
          onChange={(value) => {
            const newItems = section.items.map(i => 
              i.id === item.id ? { ...i, company: value } : i
            )
            onUpdate({ items: newItems })
          }}
          placeholder="请输入所属组织"
        />
        <LabelInput
          label={section.labelConfig.find(label => label.key === 'techStack')?.label ?? '技术栈'}
          value={item.techStack || ''}
          icon={<Code className="h-4 w-4" />}
          onChange={(value) => {
            const newItems = section.items.map(i => 
              i.id === item.id ? { ...i, techStack: value } : i
            )
            onUpdate({ items: newItems })
          }}
          placeholder="请输入技术栈"
        />
        <LabelInput
          label={section.labelConfig.find(label => label.key === 'startDate')?.label ?? '开始日期'}
          value={item.startDate || ''}
          icon={<Calendar className="h-4 w-4" />}
          onChange={(value) => {
            const newItems = section.items.map(i => 
              i.id === item.id ? { ...i, startDate: value } : i
            )
            onUpdate({ items: newItems })
          }}
          type="date"
        />
        <LabelInput
          label={section.labelConfig.find(label => label.key === 'endDate')?.label ?? '结束日期'}
          value={item.endDate || ''}
          icon={<Calendar className="h-4 w-4" />}
          onChange={(value) => {
            const newItems = section.items.map(i => 
              i.id === item.id ? { ...i, endDate: value } : i
            )
            onUpdate({ items: newItems })
          }}
          type="date"
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
        <SectionTitle>项目描述</SectionTitle>
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
        onAddItem={handleAddProject}
        renderCollapsedContent={renderCollapsedContent}
        renderExpandedContent={renderExpandedContent}
        addButtonText="添加项目经历"
      />
    </div>
  )
}
