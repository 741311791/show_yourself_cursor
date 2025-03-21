"use client"

import { EducationSection } from "@/types/section"
import { Education, defaultEducation } from "@/types/education"
import { AIRichTextEditor } from "@/components/shared/AIRichTextEditor"
import { CustomFieldsSection } from "@/components/resume/shared/CustomFieldsSection"
import { LabelInput } from "@/components/resume/shared/LabelInput"
import { DraggableCardList } from "@/components/resume/shared/DraggableCardList"
import { v4 as uuidv4 } from 'uuid'
import { School, GraduationCap, BookOpen, Calendar, MapPin, Award, ListChecks } from "lucide-react"

interface EducationCardProps {
  section: EducationSection
  onUpdate: (updates: Partial<EducationSection>) => void
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

export function EducationCard({ section, onUpdate }: EducationCardProps) {
  const handleAddEducation = () => {
    onUpdate({
      items: [
        ...section.items,
        {
          ...defaultEducation,
          id: uuidv4()
        }
      ]
    })
  }

  const renderCollapsedContent = (item: Education) => (
    <div className="flex flex-col gap-1.5">
      {/* 第一行：学校 */}
      <div className="flex items-center gap-2">
        <GraduationCap className="h-4 w-4 text-rose-500" />
        <span className="text-sm">
          {item.school || ''}
        </span>
      </div>

      {/* 第二行：时间段 */}
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-rose-500" />
        <span className="text-sm text-muted-foreground">
          {item.startDate && item.endDate 
            ? `${item.startDate} - ${item.endDate}`
            : item.startDate || item.endDate || ''
          }
        </span>
      </div>

      {/* 第三行：专业和学位 */}
      <div className="flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-rose-500" />
        <span className="text-sm text-muted-foreground">
          {[item.major, item.degree].filter(Boolean).join(' · ') || ''}
        </span>
      </div>
    </div>
  )

  const renderExpandedContent = (item: Education) => (
    <div className="space-y-6">
      <SectionTitle>基本信息</SectionTitle>
      <div className="grid grid-cols-2 gap-4">
        <LabelInput
          label={section.labelConfig.find(label => label.key === 'school')?.label ?? '学校'}
          value={item.school}
          icon={<School className="h-4 w-4" />}
          onChange={(value) => {
            const newItems = section.items.map(i => 
              i.id === item.id ? { ...i, school: value } : i
            )
            onUpdate({ items: newItems })
          }}
          placeholder="请输入学校名称"
        />
        <LabelInput
          label={section.labelConfig.find(label => label.key === 'major')?.label ?? '专业'}
          value={item.major || ''}
          icon={<BookOpen className="h-4 w-4" />}
          onChange={(value) => {
            const newItems = section.items.map(i => 
              i.id === item.id ? { ...i, major: value } : i
            )
            onUpdate({ items: newItems })
          }}
          placeholder="请输入专业名称"
        />
        <LabelInput
          label={section.labelConfig.find(label => label.key === 'degree')?.label ?? '学位'}
          value={item.degree || ''}
          icon={<GraduationCap className="h-4 w-4" />}
          onChange={(value) => {
            const newItems = section.items.map(i => 
              i.id === item.id ? { ...i, degree: value } : i
            )
            onUpdate({ items: newItems })
          }}
          placeholder="请输入学位"
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
        <LabelInput
          label={section.labelConfig.find(label => label.key === 'location')?.label ?? '地点'}
          value={item.location || ''}
          icon={<MapPin className="h-4 w-4" />}
          onChange={(value) => {
            const newItems = section.items.map(i => 
              i.id === item.id ? { ...i, location: value } : i
            )
            onUpdate({ items: newItems })
          }}
          placeholder="请输入地点"
        />
        <LabelInput
          label={section.labelConfig.find(label => label.key === 'gpa')?.label ?? 'GPA'}
          value={item.gpa || ''}
          icon={<Award className="h-4 w-4" />}
          onChange={(value) => {
            const newItems = section.items.map(i => 
              i.id === item.id ? { ...i, gpa: value } : i
            )
            onUpdate({ items: newItems })
          }}
          placeholder="请输入GPA"
        />
        <LabelInput
          label={section.labelConfig.find(label => label.key === 'courses')?.label ?? '主修课程'}
          value={item.courses || ''}
          icon={<ListChecks className="h-4 w-4" />}
          onChange={(value) => {
            const newItems = section.items.map(i => 
              i.id === item.id ? { ...i, courses: value } : i
            )
            onUpdate({ items: newItems })
          }}
          placeholder="请输入主修课程"
        />
      </div>

      {/* 自定义字段 */}
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
        onAddItem={handleAddEducation}
        renderCollapsedContent={renderCollapsedContent}
        renderExpandedContent={renderExpandedContent}
        addButtonText="添加教育经历"
      />
    </div>
  )
}
