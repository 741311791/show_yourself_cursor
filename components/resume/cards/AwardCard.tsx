"use client"

import { AwardSection } from "@/types/section"
import { Award, defaultAward } from "@/types/award"
import { AIRichTextEditor } from "@/components/shared/AIRichTextEditor"
import { CustomFieldsSection } from "@/components/resume/shared/CustomFieldsSection"
import { LabelInput } from "@/components/resume/shared/LabelInput"
import { DraggableCardList } from "@/components/resume/shared/DraggableCardList"
import { v4 as uuidv4 } from 'uuid'
import { Medal, Trophy, Calendar, Building2, Award as AwardIcon } from "lucide-react"

interface AwardCardProps {
  section: AwardSection
  onUpdate: (updates: Partial<AwardSection>) => void
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

export function AwardCard({ section, onUpdate }: AwardCardProps) {
  const handleAddAward = () => {
    onUpdate({
      items: [
        ...section.items,
        {
          ...defaultAward,
          id: uuidv4()
        }
      ]
    })
  }

  const renderCollapsedContent = (item: Award) => (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <Medal className="h-4 w-4 text-rose-500" />
        <span className="text-sm">
          {item.name || ''}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Trophy className="h-4 w-4 text-rose-500" />
        <span className="text-sm text-muted-foreground">
          {[item.level, item.ranking].filter(Boolean).join(' · ') || ''}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Building2 className="h-4 w-4 text-rose-500" />
        <span className="text-sm text-muted-foreground">
          {item.issuer || ''}
        </span>
      </div>
    </div>
  )

  const renderExpandedContent = (item: Award) => (
    <div className="space-y-6">
      <SectionTitle>基本信息</SectionTitle>
      <div className="grid grid-cols-2 gap-4">
        <LabelInput
          label={section.labelConfig.find(label => label.key === 'name')?.label ?? '奖项名称'}
          value={item.name || ''}
          icon={<Medal className="h-4 w-4" />}
          onChange={(value) => {
            const newItems = section.items.map(i => 
              i.id === item.id ? { ...i, name: value } : i
            )
            onUpdate({ items: newItems })
          }}
          placeholder="请输入奖项名称"
        />
        <LabelInput
          label={section.labelConfig.find(label => label.key === 'level')?.label ?? '奖项级别'}
          value={item.level || ''}
          icon={<Trophy className="h-4 w-4" />}
          onChange={(value) => {
            const newItems = section.items.map(i => 
              i.id === item.id ? { ...i, level: value } : i
            )
            onUpdate({ items: newItems })
          }}
          placeholder="请输入奖项级别"
        />
        <LabelInput
          label={section.labelConfig.find(label => label.key === 'issuer')?.label ?? '颁发机构'}
          value={item.issuer || ''}
          icon={<Building2 className="h-4 w-4" />}
          onChange={(value) => {
            const newItems = section.items.map(i => 
              i.id === item.id ? { ...i, issuer: value } : i
            )
            onUpdate({ items: newItems })
          }}
          placeholder="请输入颁发机构"
        />
        <LabelInput
          label={section.labelConfig.find(label => label.key === 'acquireDate')?.label ?? '获奖日期'}
          value={item.acquireDate || ''}
          icon={<Calendar className="h-4 w-4" />}
          onChange={(value) => {
            const newItems = section.items.map(i => 
              i.id === item.id ? { ...i, acquireDate: value } : i
            )
            onUpdate({ items: newItems })
          }}
          type="date"
          placeholder="请输入获奖日期"
        />
        <LabelInput
          label={section.labelConfig.find(label => label.key === 'ranking')?.label ?? '获奖等级'}
          value={item.ranking || ''}
          icon={<AwardIcon className="h-4 w-4" />}
          onChange={(value) => {
            const newItems = section.items.map(i => 
              i.id === item.id ? { ...i, ranking: value } : i
            )
            onUpdate({ items: newItems })
          }}
          placeholder="请输入获奖排名"
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
        <SectionTitle>获奖总结</SectionTitle>
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
        onAddItem={handleAddAward}
        renderCollapsedContent={renderCollapsedContent}
        renderExpandedContent={renderExpandedContent}
        addButtonText="添加获奖经历"
      />
    </div>
  )
} 