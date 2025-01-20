"use client"

import { StudentSection } from "@/types/section"
import { Student, defaultStudent } from "@/types/student"
import { AIRichTextEditor } from "@/components/shared/AIRichTextEditor"
import { CustomFieldsSection } from "@/components/resume/shared/CustomFieldsSection"
import { LabelInput } from "@/components/resume/shared/LabelInput"
import { DraggableCardList } from "@/components/resume/shared/DraggableCardList"
import { v4 as uuidv4 } from 'uuid'
import { Users, Calendar, Building2, MapPin, User2 } from "lucide-react"

interface StudentCardProps {
  section: StudentSection
  onUpdate: (updates: Partial<StudentSection>) => void
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

export function StudentCard({ section, onUpdate }: StudentCardProps) {
  const handleAddStudent = () => {
    onUpdate({
      items: [
        ...section.items,
        {
          ...defaultStudent,
          id: uuidv4()
        }
      ]
    })
  }

  const renderCollapsedContent = (item: Student) => (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-rose-500" />
        <span className="text-sm">
          {item.organization || ''}
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
          {item.role || ''}
        </span>
      </div>
    </div>
  )

  const renderExpandedContent = (item: Student) => (
    <div className="space-y-6">
      <SectionTitle>基本信息</SectionTitle>
      <div className="grid grid-cols-2 gap-4">
        <LabelInput
          label={section.labelConfig.find(label => label.key === 'organization')?.label ?? '组织名称'}
          value={item.organization || ''}
          icon={<Building2 className="h-4 w-4" />}
          onChange={(value) => {
            const newItems = section.items.map(i => 
              i.id === item.id ? { ...i, organization: value } : i
            )
            onUpdate({ items: newItems })
          }}
          placeholder="请输入组织名称"
        />
        <LabelInput
          label={section.labelConfig.find(label => label.key === 'role')?.label ?? '担任职务'}
          value={item.role || ''}
          icon={<User2 className="h-4 w-4" />}
          onChange={(value) => {
            const newItems = section.items.map(i => 
              i.id === item.id ? { ...i, role: value } : i
            )
            onUpdate({ items: newItems })
          }}
          placeholder="请输入担任职务"
        />
        <LabelInput
          label={section.labelConfig.find(label => label.key === 'location')?.label ?? '所在地点'}
          value={item.location || ''}
          icon={<MapPin className="h-4 w-4" />}
          onChange={(value) => {
            const newItems = section.items.map(i => 
              i.id === item.id ? { ...i, location: value } : i
            )
            onUpdate({ items: newItems })
          }}
          placeholder="请输入所在地点"
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
        <SectionTitle>经历描述</SectionTitle>
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
        onAddItem={handleAddStudent}
        renderCollapsedContent={renderCollapsedContent}
        renderExpandedContent={renderExpandedContent}
        addButtonText="添加学生经历"
      />
    </div>
  )
} 