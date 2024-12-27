"use client"

import React, { useState } from "react"
import { motion } from "motion/react"
import { 
  FileText, MapPin, Calendar, Code, Star,
  Save, Edit2, Camera
} from "lucide-react"
import { Project } from "@/types/project"
import { AIRichTextEditor } from "@/components/shared/AIRichTextEditor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { ImageUpload } from "@/components/shared/ImageUpload"
import { Alert } from "@/components/shared/Alert"
import { CustomFieldsSection } from "@/components/shared/CustomFieldsSection"

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
  const [preview, setPreview] = useState<string | null>(project.photo ?? null)
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
      <motion.div variants={item}>
        <Button
          variant="ghost"
          onClick={onCancel}
          className="text-muted-foreground hover:text-foreground"
        >
          ← 返回列表
        </Button>
      </motion.div>

      {/* 基本信息 */}
      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex-row items-center gap-2 pb-2">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">基本信息</h2>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-6">
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

            <div>
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

            <div>
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

            {/* 核心项目标记 */}
            {formData.source === 'custom' && (
              <div className="col-span-2 flex items-center gap-2">
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

      {/* 自定义信息 */}
      <motion.div variants={item}>
        <CustomFieldsSection 
          fields={formData.customFields}
          onFieldsChange={(fields) => setFormData(prev => ({ ...prev, customFields: fields }))}
          disabled={!isEditing}
          isEditing={isEditing}
          onAdd={() => {
            const newField = {
              id: Math.random().toString(),
              title: '',
              content: '',
              icon: 'FileText'
            }
            setFormData(prev => ({
              ...prev,
              customFields: [...prev.customFields, newField]
            }))
          }}
          onRemove={(id) => {
            setFormData(prev => ({
              ...prev,
              customFields: prev.customFields.filter(field => field.id !== id)
            }))
          }}
          onUpdate={(id, field, value) => {
            setFormData(prev => ({
              ...prev,
              customFields: prev.customFields.map(item => 
                item.id === id ? { ...item, [field]: value } : item
              )
            }))
          }}
        />
      </motion.div>

      {/* 项目成果 */}
      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex-row items-center gap-2 pb-2">
            <Star className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">项目成果</h2>
          </CardHeader>
          <CardContent>
            <AIRichTextEditor
              content={formData.achievement}
              onChange={(html) => handleInputChange('achievement', html)}
              isEditing={isEditing}
              onAIGenerate={async () => {
                // TODO: 实现 AI 生成��能
                console.log('AI 生成项目成果')
              }}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* 项目总结 */}
      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex-row items-center gap-2 pb-2">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">项目总结</h2>
          </CardHeader>
          <CardContent>
            <AIRichTextEditor
              content={formData.summary}
              onChange={(html) => handleInputChange('summary', html)}
              isEditing={isEditing}
              onAIGenerate={async () => {
                // TODO: 实现 AI 生成功能
                console.log('AI 生成项目总结')
              }}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* 项目图片 */}
      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex-row items-center gap-2 pb-2">
            <Camera className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">项目图片</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              上传一张与���项目相关的照片，可以是项目截图或效果图等。该照片将展示在项目列表和Web简历中。
            </p>
            <div className="flex justify-center">
              <ImageUpload
                value={preview}
                onChange={(url) => {
                  setPreview(url)
                  handleInputChange('photo', url)
                }}
                disabled={!isEditing}
                tip="点击上传项目图片"
              />
            </div>
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