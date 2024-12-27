"use client"

import React, { useState } from "react"
import { motion } from "motion/react"
import { 
  Edit2, Save,
  GraduationCap, MapPin, Calendar,
  Book, Library, Award, FileText,
  Camera
} from "lucide-react"
import { Education } from "@/types/education"
import { AIRichTextEditor } from "@/components/shared/AIRichTextEditor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ImageUpload } from "@/components/shared/ImageUpload"
import { Alert } from "@/components/shared/Alert"
import { CustomFieldsSection } from "@/components/shared/CustomFieldsSection"

// 动画变体配置
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

interface EducationFormDetailProps {
  education: Education
  onSave: (education: Education) => void
  onCancel: () => void
}

export function EducationFormDetail({ 
  education,
  onSave,
  onCancel 
}: EducationFormDetailProps) {
  const [formData, setFormData] = useState<Education>(education)
  const [isEditing, setIsEditing] = useState(true)
  const [preview, setPreview] = useState<string | null>(education.photo ?? null)
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

  const handleInputChange = (field: keyof Education, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      // TODO: 调用更新教育经历 API
      // const response = await updateEducation(formData)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onSave(formData)  // 只更新数据
      setIsEditing(false)  // 切换到查看模式
      showAlert('success', '保存成功')
    } catch (error) {
      console.error('保存失败:', error)
      showAlert('error', '保存失败，请重试')
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)  // 切换到可编辑状态
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

      

      {/* 学校信息 */}
      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex-row items-center gap-2 pb-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">学校信息</h2>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-6">
            <div className="col-span-2 space-y-2">
              <Label className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                学校名称
              </Label>
              <Input
                value={formData.school}
                onChange={(e) => handleInputChange('school', e.target.value)}
                disabled={!isEditing}
                placeholder="请输入学校名称"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                学校地址
              </Label>
              <Input
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                disabled={!isEditing}
                placeholder="请输入学校地址"
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
          </CardContent>
        </Card>
      </motion.div>

      {/* 专业信息 */}
      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex-row items-center gap-2 pb-2">
            <Book className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">专业信息</h2>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-6">
            <div>
              <Label className="flex items-center gap-2">
                <Book className="h-4 w-4 text-muted-foreground" />
                专业
              </Label>
              <Input
                value={formData.major}
                onChange={(e) => handleInputChange('major', e.target.value)}
                disabled={!isEditing}
                placeholder="请输入所学专业"
              />
            </div>
            <div>
              <Label className="flex items-center gap-2">
                <Award className="h-4 w-4 text-muted-foreground" />
                学位
              </Label>
              <Input
                value={formData.degree}
                onChange={(e) => handleInputChange('degree', e.target.value)}
                disabled={!isEditing}
                placeholder="请输入获得学位"
              />
            </div>
            <div>
              <Label className="flex items-center gap-2">
                <Award className="h-4 w-4 text-muted-foreground" />
                成绩
              </Label>
              <Input
                value={formData.gpa}
                onChange={(e) => handleInputChange('gpa', e.target.value)}
                disabled={!isEditing}
                placeholder="请输入GPA或其他成绩"
              />
            </div>
            <div>
              <Label className="flex items-center gap-2">
                <Library className="h-4 w-4 text-muted-foreground" />
                主修课程
              </Label>
              <Input
                value={formData.courses}
                onChange={(e) => handleInputChange('courses', e.target.value)}
                disabled={!isEditing}
                placeholder="请输入主要课程"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 自定义字段 */}
      <motion.div variants={item}>
        <CustomFieldsSection 
          fields={formData.customFields ?? []}
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
              customFields: [...(prev.customFields ?? []), newField]
            }))
          }}
          onRemove={(id) => {
            setFormData(prev => ({
              ...prev,
              customFields: (prev.customFields ?? []).filter(field => field.id !== id)
            }))
          }}
          onUpdate={(id, field, value) => {
            setFormData(prev => ({
              ...prev,
              customFields: (prev.customFields ?? []).map(item => 
                item.id === id ? { ...item, [field]: value } : item
              )
            }))
          }}
        />
      </motion.div>

      {/* 学习总结 */}
      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex-row items-center gap-2 pb-2">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">总结</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <AIRichTextEditor 
              content={formData.summary ?? ''}
              onChange={(html) => handleInputChange('summary', html)}
              isEditing={isEditing}
              onAIGenerate={async () => {
                // TODO: 实现 AI 生成功能
                console.log('AI 生成总结')
              }}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* 照片上传 */}
      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex-row items-center gap-2 pb-2">
            <Camera className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">相关照片</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              上传一张与该教育经历相关的照片，可以是学校照片或毕业照等。该照片将展示在教育经历封面和Web简历中。
            </p>
            <div className="flex justify-center">
              <ImageUpload
                value={preview}
                onChange={(url) => {
                  setPreview(url)
                  handleInputChange('photo', url)
                }}
                disabled={!isEditing}
                tip="点击上传照片"
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