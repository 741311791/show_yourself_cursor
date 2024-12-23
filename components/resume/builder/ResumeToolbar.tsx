"use client"

import { Save, Download, FileImage, FileJson, Share } from "lucide-react"
import { Button } from "@/components/ui/button"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ExportFormat, ResumeTemplate } from "@/types/resume"

interface ResumeToolbarProps {
  onExport: (format: ExportFormat) => void
  onTemplateChange: (template: ResumeTemplate) => void
  isDirty?: boolean
}

export function ResumeToolbar({ 
  onExport, 
  onTemplateChange,
  isDirty 
}: ResumeToolbarProps) {
  return (
    <div className="h-16 border-b border-border px-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Select onValueChange={onTemplateChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="选择模板" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="modern">现代简约</SelectItem>
            <SelectItem value="classic">经典专业</SelectItem>
            <SelectItem value="minimal">极简风格</SelectItem>
            <SelectItem value="professional">商务正式</SelectItem>
          </SelectContent>
        </Select>

        <Button 
          variant={isDirty ? "default" : "ghost"}
          size="sm"
        >
          <Save className="w-4 h-4 mr-2" />
          保存
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onExport('pdf')}
        >
          <Download className="w-4 h-4 mr-2" />
          PDF
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onExport('image')}
        >
          <FileImage className="w-4 h-4 mr-2" />
          图片
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onExport('json')}
        >
          <FileJson className="w-4 h-4 mr-2" />
          数据
        </Button>

        <Button variant="ghost" size="sm">
          <Share className="w-4 h-4 mr-2" />
          分享
        </Button>
      </div>
    </div>
  )
} 