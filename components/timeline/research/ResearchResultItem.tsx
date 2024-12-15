"use client"

import React, { useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { 
  ChevronDown, ChevronUp, Trash2, 
  Calendar, BookOpen, FileText,
  GripVertical, User
} from "lucide-react"
import { ResearchResult, ResearchResultType } from "@/types/research"
import { AIRichTextEditor } from "@/components/shared/AIRichTextEditor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { CustomFieldsSection } from "@/components/shared/CustomFieldsSection"

const resultTypeOptions = [
  { value: 'paper', label: '论文' },
  { value: 'patent', label: '专利' },
  { value: 'conference', label: '会议' },
  { value: 'other', label: '其他' }
]

interface ResearchResultItemProps {
  result: ResearchResult
  isEditing: boolean
  onUpdate: (result: ResearchResult) => void
  onRemove: () => void
}

export function ResearchResultItem({
  result,
  isEditing,
  onUpdate,
  onRemove
}: ResearchResultItemProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: result.id,
    disabled: !isEditing
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  const handleInputChange = (field: keyof ResearchResult, value: string) => {
    onUpdate({ ...result, [field]: value })
  }

  const addCustomField = () => {
    const newField = {
      id: Math.random().toString(),
      title: '',
      content: ''
    }
    onUpdate({
      ...result,
      customFields: [...result.customFields, newField]
    })
  }

  const removeCustomField = (id: string) => {
    onUpdate({
      ...result,
      customFields: result.customFields.filter(field => field.id !== id)
    })
  }

  const updateCustomField = (id: string, field: 'title' | 'content', value: string) => {
    onUpdate({
      ...result,
      customFields: result.customFields.map(item => 
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
              {result.name?.trim() ? result.name : '新研究成果'}
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
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">基本信息</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  成果类型
                </Label>
                <Select
                  value={result.type}
                  onValueChange={(value) => handleInputChange('type', value as ResearchResultType)}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {resultTypeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  获得时间
                </Label>
                <Input
                  value={result.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  disabled={!isEditing}
                  type="month"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  成果名称
                </Label>
                <Input
                  value={result.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={!isEditing}
                  placeholder="请输入成果名称"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  担任角色
                </Label>
                <Input
                  value={result.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  disabled={!isEditing}
                  placeholder="请输入担任角色"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <CustomFieldsSection
              fields={result.customFields}
              isEditing={isEditing}
              onAdd={addCustomField}
              onRemove={removeCustomField}
              onUpdate={updateCustomField}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">成果总结</h2>
            </div>
            <AIRichTextEditor
              content={result.summary}
              onChange={(html) => handleInputChange('summary', html)}
              isEditing={isEditing}
              onAIGenerate={async () => {
                console.log('AI 生成成果总结')
              }}
            />
          </div>
        </CardContent>
      )}
    </Card>
  )
}