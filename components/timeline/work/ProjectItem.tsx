"use client"

import React, { useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { 
  ChevronDown, ChevronUp, Star, Trash2, 
  Calendar, Code, FileText,
  GripVertical
} from "lucide-react"
import { Project } from "@/types/project"
import { AIRichTextEditor } from "@/components/shared/AIRichTextEditor"
import { Tooltip } from "@/components/shared/Tooltip"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface ProjectItemProps {
  project: Project
  isEditing: boolean
  onUpdate: (id: string, field: keyof Project, value: string | boolean) => void
  onRemove: (id: string) => void
  onToggleCore: (id: string) => void
}

export function ProjectItem({
  project,
  isEditing: parentIsEditing,
  onUpdate,
  onRemove,
  onToggleCore
}: ProjectItemProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: project.id,
    disabled: !parentIsEditing
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
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
            {parentIsEditing && (
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
            <h4 className="font-medium">{project.name || '新项目'}</h4>
          </div>
          {parentIsEditing && (
            <div className="flex items-center gap-1">
              <Tooltip content={project.isCore ? "取消核心项目" : "标记为核心项目"}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onToggleCore(project.id)}
                  className={cn(
                    "h-8 w-8 p-0",
                    project.isCore ? "text-primary" : "text-muted-foreground hover:text-primary"
                  )}
                >
                  <Star className="h-4 w-4" />
                </Button>
              </Tooltip>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemove(project.id)}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6">
          {/* 项目名称 */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              项目名称
            </Label>
            <Input
              value={project.name}
              onChange={(e) => onUpdate(project.id, 'name', e.target.value)}
              disabled={!parentIsEditing}
              placeholder="请输入项目名称"
            />
          </div>

          {/* 项目时间 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                开始时间
              </Label>
              <Input
                type="date"
                value={project.startDate}
                onChange={(e) => onUpdate(project.id, 'startDate', e.target.value)}
                disabled={!parentIsEditing}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                结束时间
              </Label>
              <Input
                type="date"
                value={project.endDate}
                onChange={(e) => onUpdate(project.id, 'endDate', e.target.value)}
                disabled={!parentIsEditing}
              />
            </div>
          </div>

          {/* 项目描述 */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              项目描述
            </Label>
            <Textarea
              value={project.description}
              onChange={(e) => onUpdate(project.id, 'description', e.target.value)}
              disabled={!parentIsEditing}
              placeholder="请输入项目描述"
              className="min-h-[100px]"
            />
          </div>

          {/* 技术栈 */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Code className="h-4 w-4 text-muted-foreground" />
              技术栈
            </Label>
            <Input
              value={project.techStack}
              onChange={(e) => onUpdate(project.id, 'techStack', e.target.value)}
              disabled={!parentIsEditing}
              placeholder="请输入使用的技术栈（选填）"
            />
          </div>

          {/* 个人成绩 */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Star className="h-4 w-4 text-muted-foreground" />
              个人成绩
            </Label>
            <AIRichTextEditor
              content={project.achievement}
              onChange={(html) => onUpdate(project.id, 'achievement', html)}
              isEditing={parentIsEditing}
              onAIGenerate={async () => {
                console.log('AI 生成个人成绩')
              }}
            />
          </div>
        </CardContent>
      )}
    </Card>
  )
} 