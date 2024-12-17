"use client"

import React from "react"
import { FileText, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { CustomField } from "@/types/shared"

interface CustomFieldsSectionProps {
  fields: CustomField[]
  onFieldsChange?: (fields: CustomField[]) => void
  disabled?: boolean
  isEditing?: boolean
  onAdd?: () => void
  onRemove?: (id: string) => void
  onUpdate?: (id: string, field: 'title' | 'content', value: string) => void
}

export function CustomFieldsSection({
  fields,
  onFieldsChange,
  disabled,
  isEditing,
  onAdd,
  onRemove,
  onUpdate
}: CustomFieldsSectionProps) {
  const handleFieldsChange = (newFields: CustomField[]) => {
    if (onFieldsChange) {
      onFieldsChange(newFields)
    }
  }

  const isEditingMode = isEditing ?? !disabled

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">自定义信息</h2>
        </div>
        {isEditingMode && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (onAdd) {
                onAdd()
              } else if (onFieldsChange) {
                handleFieldsChange(fields.concat({ id: Math.random().toString(), title: '', content: '' }))
              }
            }}
            className={cn(
              "gap-2",
              "text-muted-foreground hover:text-foreground",
              "border-dashed border-muted-foreground/50"
            )}
          >
            <Plus className="h-4 w-4" />
            添加自定义字段
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map(field => (
          <div key={field.id} className="flex items-start gap-3 group">
            <div className="w-[25%]">
              <Input
                value={field.title}
                onChange={(e) => {
                  if (onUpdate) {
                    onUpdate(field.id, 'title', e.target.value)
                  } else if (onFieldsChange) {
                    handleFieldsChange(fields.map(f => 
                      f.id === field.id ? { ...f, title: e.target.value } : f
                    ))
                  }
                }}
                placeholder="标题"
                disabled={!isEditingMode}
              />
            </div>
            <div className="flex-1">
              <Input
                value={field.content}
                onChange={(e) => {
                  if (onUpdate) {
                    onUpdate(field.id, 'content', e.target.value)
                  } else if (onFieldsChange) {
                    handleFieldsChange(fields.map(f => 
                      f.id === field.id ? { ...f, content: e.target.value } : f
                    ))
                  }
                }}
                placeholder="内容"
                disabled={!isEditingMode}
              />
            </div>
            {isEditingMode && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (onRemove) {
                    onRemove(field.id)
                  } else if (onFieldsChange) {
                    handleFieldsChange(fields.filter(f => f.id !== field.id))
                  }
                }}
                className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        {fields.length === 0 && isEditingMode && (
          <div className="text-center py-8 text-muted-foreground">
            <p>点击上方按钮添加自定义信息</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 