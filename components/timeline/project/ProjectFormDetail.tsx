"use client"

import React, { useState } from "react"
import { motion } from "motion/react"
import { 
  FileText, MapPin, Calendar, Code, Star,
  ArrowLeft, Save, Edit2
} from "lucide-react"
import { Project } from "@/types/project"
import { AIRichTextEditor } from "@/components/shared/AIRichTextEditor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Alert } from "@/components/shared/Alert"

// 动画配置
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

interface ProjectFormDetailProps {
  project: Project
  onSave: (project: Project) => void
  onCancel: () => void
}

export function ProjectFormDetail({
  project,
  onSave,
  onCancel
}: ProjectFormDetailProps) {
  const [formData, setFormData] = useState<Project>(project)
  const [isEditing, setIsEditing] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [alertState, setAlertState] = useState<{
    show: boolean
    type: 'success' | 'error'
    message: string
  }>({
    show: false,
    type: 'success',
    message: ''
  })

  const handleInputChange = (field: keyof Project, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      // TODO: 调用更新项目 API
      await new Promise(resolve => setTimeout(resolve, 1000))
      onSave(formData)
      setIsEditing(false)
      showAlert('success', '保存成功')
    } catch (error) {
      console.error('保存失败:', error)
      showAlert('error', '保存失败，请重试')
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlertState({ show: true, type, message })
    setTimeout(() => {
      setAlertState(prev => ({ ...prev, show: false }))
    }, 3000)
  }

  return (
    <motion.div 
      className="max-w-3xl mx-auto space-y-8"
      initial="hidden"
      animate="show"
      variants={container}
    >
      {/* 返回按钮 */}
      <motion.div variants={item}>
        <Button
          variant="ghost"
          onClick={onCancel}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          返回列表
        </Button>
      </motion.div>

      {/* 基本信息 */}
      <motion.div variants={item}>
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle>基本信息</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2 space-y-2">
                <Label className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  项目名称
                </Label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={!isEditing}
                  placeholder="请输入项目名称"
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  所属公司
                </Label>
                <Input
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  disabled={!isEditing}
                  placeholder="请输入所属公司"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  开始时间
                </Label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  结束时间
                </Label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  项目描述
                </Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  disabled={!isEditing}
                  placeholder="请输入项目描述"
                  className="min-h-[100px]"
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-muted-foreground" />
                  技术栈
                </Label>
                <Input
                  value={formData.techStack}
                  onChange={(e) => handleInputChange('techStack', e.target.value)}
                  disabled={!isEditing}
                  placeholder="请输入使用的技术栈"
                />
              </div>
            </div>

            {/* 核心项目标记 */}
            {formData.source === 'custom' && (
              <div className="flex items-center gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => handleInputChange('isCore', !formData.isCore)}
                  disabled={!isEditing}
                  className={cn(
                    "gap-2",
                    formData.isCore && "text-primary border-primary hover:text-primary hover:border-primary"
                  )}
                >
                  <Star className="h-4 w-4" />
                  {formData.isCore ? "取消核心项目" : "标记为核心项目"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* 项目成果 */}
      <motion.div variants={item}>
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              <CardTitle>项目成果</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <AIRichTextEditor
              content={formData.achievement}
              onChange={(html) => handleInputChange('achievement', html)}
              isEditing={isEditing}
              onAIGenerate={async () => {
                console.log('AI 生成项目成果')
              }}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* 保存/编辑按钮 */}
      <motion.div 
        variants={item}
        className="fixed bottom-8 right-8 z-10"
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          onClick={isEditing ? handleSave : handleEdit}
          disabled={isSaving}
          size="lg"
          className={cn(
            "gap-2",
            isEditing
              ? "bg-gradient-to-r from-primary to-primary/80"
              : "bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]",
            "hover:shadow-lg hover:shadow-primary/20",
            "transform hover:-translate-y-0.5 transition-all",
            isSaving && "opacity-50 cursor-not-allowed"
          )}
        >
          {isEditing ? (
            <>
              <Save className={cn("h-5 w-5", isSaving && "animate-spin")} />
              <span className="font-medium">{isSaving ? '保存中...' : '保存'}</span>
            </>
          ) : (
            <>
              <Edit2 className="h-5 w-5" />
              <span className="font-medium">编辑</span>
            </>
          )}
        </Button>
      </motion.div>

      {/* Alert 组件 */}
      <Alert
        show={alertState.show}
        type={alertState.type}
        message={alertState.message}
      />
    </motion.div>
  )
} 