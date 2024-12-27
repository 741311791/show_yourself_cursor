"use client"

import { useState } from "react"
import { Education } from "@/types/education"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronDown, ChevronUp, GripVertical, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { AIRichTextEditor } from "@/components/shared/AIRichTextEditor"
import { CustomFieldsSection } from "@/components/resume/shared/CustomFieldsSection"

interface EducationCardProps {
  data: Education
  onUpdate: (data: Partial<Education>) => void
  onDelete: () => void
}

export function EducationCard({ data, onUpdate, onDelete }: EducationCardProps) {
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
            {data.school || "未填写学校"}
          </h4>
          <p className="text-sm text-muted-foreground">
            {data.major || "未填写专业"}
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

      <CardContent
        className={cn(
          "grid gap-4 px-4 pb-4",
          !isExpanded && "hidden"
        )}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>学校</Label>
            <Input
              value={data.school}
              onChange={(e) => onUpdate({ school: e.target.value })}
              placeholder="输入学校名称"
            />
          </div>
          <div className="space-y-2">
            <Label>专业</Label>
            <Input
              value={data.major}
              onChange={(e) => onUpdate({ major: e.target.value })}
              placeholder="输入专业名称"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>学位</Label>
            <Input
              value={data.degree}
              onChange={(e) => onUpdate({ degree: e.target.value })}
              placeholder="输入学位"
            />
          </div>
          <div className="space-y-2">
            <Label>GPA</Label>
            <Input
              value={data.gpa}
              onChange={(e) => onUpdate({ gpa: e.target.value })}
              placeholder="输入GPA"
            />
          </div>
        </div>

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
          <Label>课程</Label>
          <Input
            value={data.courses}
            onChange={(e) => onUpdate({ courses: e.target.value })}
            placeholder="输入主要课程"
          />
        </div>

        <CustomFieldsSection
          fields={data.customFields ?? []}
          onChange={(fields) => onUpdate({ customFields: fields })}
        />

        <div className="space-y-2">
          <Label>总结</Label>
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