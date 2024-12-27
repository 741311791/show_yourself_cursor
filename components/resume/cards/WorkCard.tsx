"use client"

import { useState } from "react"
import { Work } from "@/types/work"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronDown, ChevronUp, GripVertical, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { AIRichTextEditor } from "@/components/shared/AIRichTextEditor"
import { CustomFieldsSection } from "@/components/resume/shared/CustomFieldsSection"

interface WorkCardProps {
  data: Work
  onUpdate: (data: Partial<Work>) => void
  onDelete: () => void
}

export function WorkCard({ data, onUpdate, onDelete }: WorkCardProps) {
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
            {data.company || "未填写公司"}
          </h4>
          <p className="text-sm text-muted-foreground">
            {data.position || "未填写职位"}
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
        {/* 公司信息 */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>公司名称</Label>
            <Input
              value={data.company}
              onChange={(e) => onUpdate({ company: e.target.value })}
              placeholder="输入公司名称"
            />
          </div>
          <div className="space-y-2">
            <Label>职位</Label>
            <Input
              value={data.position}
              onChange={(e) => onUpdate({ position: e.target.value })}
              placeholder="输入职位名称"
            />
          </div>
        </div>

        {/* 时间和地点 */}
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

        <div className="space-y-2">
          <Label>工作地点</Label>
          <Input
            value={data.location}
            onChange={(e) => onUpdate({ location: e.target.value })}
            placeholder="输入工作地点"
          />
        </div>

        {/* 自定义字段 */}
        <CustomFieldsSection
          fields={data.customFields ?? []}
          onChange={(fields) => onUpdate({ customFields: fields })}
        />

        {/* 工作内容 */}
        <div className="space-y-2">
          <Label>工作内容</Label>
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