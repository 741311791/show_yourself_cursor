"use client"

import { Education } from "@/types/education"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { School, Calendar, GraduationCap, BookOpen, Trash2, MapPin, Star, ListChecks, Medal } from "lucide-react"
import { AIRichTextEditor } from "@/components/shared/AIRichTextEditor"
import { DialogHeader, DialogFooter } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface EducationFormProps {
  data: Education
  onSave: (data: Education) => void
  onDelete: () => void
  onCancel: () => void
}

export function EducationForm({ 
  data,
  onSave,
  onDelete,
  onCancel
}: EducationFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(data)
  }

  const handleChange = (field: keyof Education) => (
    e: React.ChangeEvent<HTMLInputElement> | string
  ) => {
    onSave({
      ...data,
      [field]: typeof e === 'string' ? e : e.target.value
    })
  }

  const handleArrayChange = (field: 'courses' | 'highlights') => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onSave({
      ...data,
      [field]: e.target.value.split(',').map(item => item.trim())
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <DialogHeader>
        <h2 className="text-lg font-semibold">
          {data.school ? '编辑教育经历' : '添加教育经历'}
        </h2>
      </DialogHeader>

      <div className="grid gap-4">
        {/* 学校名称和地点并排显示 */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label>学校名称</Label>
            <div className="flex items-center gap-2">
              <School className="h-4 w-4 shrink-0 text-muted-foreground" />
              <Input
                value={data.school}
                onChange={handleChange("school")}
                placeholder="输入学校名称"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>所在地</Label>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
              <Input
                value={data.location}
                onChange={handleChange("location")}
                placeholder="输入所在地"
              />
            </div>
          </div>
        </div>

        {/* 学位和专业并排显示 */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label>学位</Label>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 shrink-0 text-muted-foreground" />
              <Input
                value={data.degree}
                onChange={handleChange("degree")}
                placeholder="输入学位"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>专业</Label>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 shrink-0 text-muted-foreground" />
              <Input
                value={data.field}
                onChange={handleChange("field")}
                placeholder="输入专业"
              />
            </div>
          </div>
        </div>

        {/* 起止时间和GPA并排显示 */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="grid gap-2">
            <Label>开始时间</Label>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
              <Input
                type="month"
                value={data.startDate}
                onChange={handleChange("startDate")}
                placeholder="选择开始时间"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>结束时间</Label>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
              <Input
                type="month"
                value={data.endDate}
                onChange={handleChange("endDate")}
                placeholder="选择结束时间"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>GPA</Label>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 shrink-0 text-muted-foreground" />
              <Input
                value={data.gpa}
                onChange={handleChange("gpa")}
                placeholder="输入GPA"
              />
            </div>
          </div>
        </div>

        {/* 主修课程 */}
        <div className="grid gap-2">
          <Label>主修课程</Label>
          <div className="flex items-center gap-2">
            <ListChecks className="h-4 w-4 shrink-0 text-muted-foreground" />
            <Input
              value={data.courses?.join(', ')}
              onChange={handleArrayChange("courses")}
              placeholder="输入主修课程，用逗号分隔"
            />
          </div>
        </div>

        {/* 在校荣誉 */}
        <div className="grid gap-2">
          <Label>在校荣誉</Label>
          <div className="flex items-center gap-2">
            <Medal className="h-4 w-4 shrink-0 text-muted-foreground" />
            <Input
              value={data.highlights?.join(', ')}
              onChange={handleArrayChange("highlights")}
              placeholder="输入在校荣誉，用逗号分隔"
            />
          </div>
        </div>

        {/* 在校经历 */}
        <div className="grid gap-2">
          <Label>在校经历</Label>
          <AIRichTextEditor
            content={data.description}
            onChange={handleChange("description")}
            className="min-h-[200px]"
          />
        </div>
      </div>

      <DialogFooter className="gap-2 sm:gap-0">
        <div className="flex w-full gap-2 sm:w-auto">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1 sm:flex-none"
          >
            取消
          </Button>
          <Button
            type="submit"
            className="flex-1 sm:flex-none"
          >
            保存
          </Button>
        </div>
        {data.school && (
          <Button
            type="button"
            variant="ghost"
            onClick={onDelete}
            className={cn(
              "gap-2 text-muted-foreground hover:text-red-600",
              "hover:bg-red-50 dark:hover:bg-red-950"
            )}
          >
            <Trash2 className="h-4 w-4" />
            删除
          </Button>
        )}
      </DialogFooter>
    </form>
  )
} 