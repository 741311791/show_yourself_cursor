"use client"

import { useState } from "react"
import { Project } from "@/types/project"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronDown, ChevronUp, GripVertical, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { AIRichTextEditor } from "@/components/shared/AIRichTextEditor"
import { CustomFieldsSection } from "@/components/resume/shared/CustomFieldsSection"

interface ProjectCardProps {
  data: Project
  onUpdate: (data: Partial<Project>) => void
  onDelete: () => void
}

export function ProjectCard({ data, onUpdate, onDelete }: ProjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="relative">
      <CardHeader className="flex flex-row items-center gap-2 space-y-0 p-4">
        <Button
          variant="ghost"
          size="icon"
          className="cursor-grab"
        >
          <GripVertical className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h4 className="text-sm font-medium">
            {data.name || "未填写项目名称"}
          </h4>
          <p className="text-sm text-muted-foreground">
            {data.role || "未填写担任角色"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete()}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className={cn("grid gap-4 px-4 pb-4", !isExpanded && "hidden")}>
        {/* 项目信息 */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>项目名称</Label>
            <Input
              value={data.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              placeholder="输入项目名称"
            />
          </div>
          <div className="space-y-2">
            <Label>担任角色</Label>
            <Input
              value={data.role}
              onChange={(e) => onUpdate({ role: e.target.value })}
              placeholder="输入担任角色"
            />
          </div>
        </div>

        {/* 时间 */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>开始时间</Label>
            <Input
              type="date"
              value={data.startDate}
              onChange={(e) => onUpdate({ startDate: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>结束时间</Label>
            <Input
              type="date"
              value={data.endDate}
              onChange={(e) => onUpdate({ endDate: e.target.value })}
            />
          </div>
        </div>

        {/* 自定义字段 */}
        <CustomFieldsSection
          fields={data.customFields ?? []}
          onChange={(fields) => onUpdate({ customFields: fields })}
        />

        {/* 项目描述 */}
        <div className="space-y-2">
          <Label>项目描述</Label>
          <AIRichTextEditor
            content={data.summary ?? ""}
            onChange={(content) => onUpdate({ summary: content })}
            className="min-h-[200px]"
          />
        </div>
      </CardContent>
    </Card>
  )
} 