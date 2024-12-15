"use client"

import React, { useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { 
  ChevronDown, ChevronUp, Trash2, 
  Calendar, FileText, Camera,
  GripVertical
} from "lucide-react"
import { SkillWork } from "@/types/skill"
import { AIRichTextEditor } from "@/components/shared/AIRichTextEditor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { CustomFieldsSection } from "@/components/shared/CustomFieldsSection"
import { PhotoWall } from "@/components/shared/PhotoWall"

interface SkillWorkItemProps {
  work: SkillWork
  isEditing: boolean
  onUpdate: (work: SkillWork) => void
  onRemove: () => void
}

export function SkillWorkItem({
  work,
  isEditing,
  onUpdate,
  onRemove
}: SkillWorkItemProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: work.id,
    disabled: !isEditing
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  const handleInputChange = (field: keyof SkillWork, value: string | string[]) => {
    onUpdate({ ...work, [field]: value })
  }

  const addCustomField = () => {
    const newField = {
      id: Math.random().toString(),
      title: '',
      content: ''
    }
    onUpdate({
      ...work,
      customFields: [...work.customFields, newField]
    })
  }

  const removeCustomField = (id: string) => {
    onUpdate({
      ...work,
      customFields: work.customFields.filter(field => field.id !== id)
    })
  }

  const updateCustomField = (id: string, field: 'title' | 'content', value: string) => {
    onUpdate({
      ...work,
      customFields: work.customFields.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    })
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative",
        isDragging && "z-50"
      )}
    >
      <CardHeader className="p-4 space-y-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isEditing && (
              <Button
                variant="ghost"
                size="icon"
                {...attributes}
                {...listeners}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
              >
                <GripVertical className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            <h4 className="font-medium">
              {work.name?.trim() ? work.name : '新作品'}
            </h4>
          </div>
          {isEditing && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onRemove}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6">
          {/* 基本信息 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">基本信息</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  作品名称
                </Label>
                <Input
                  value={work.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={!isEditing}
                  placeholder="请输入作品名称"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  完成时间
                </Label>
                <Input
                  type="month"
                  value={work.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  作品描述
                </Label>
                <Input
                  value={work.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  disabled={!isEditing}
                  placeholder="请输入作品描述"
                />
              </div>
            </div>
          </div>

          {/* 自定义信息 */}
          <CustomFieldsSection
            fields={work.customFields}
            isEditing={isEditing}
            onAdd={addCustomField}
            onRemove={removeCustomField}
            onUpdate={updateCustomField}
          />

          {/* 作品总结 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">作品总结</h2>
            </div>
            <AIRichTextEditor
              content={work.summary}
              onChange={(html) => handleInputChange('summary', html)}
              isEditing={isEditing}
              onAIGenerate={async () => {
                console.log('AI 生成作品总结')
              }}
            />
          </div>

          {/* 作品图片 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">作品图片</h2>
            </div>
            <PhotoWall
              photos={work.photos}
              onChange={(photos) => handleInputChange('photos', photos)}
              disabled={!isEditing}
            />
          </div>
        </CardContent>
      )}
    </Card>
  )
} 