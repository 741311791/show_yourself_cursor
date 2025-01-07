"use client"

import React, { useState } from "react"
import { motion } from "motion/react"
import { 
  Edit2, Save,
  Languages, Calendar, 
  FileText, Globe,
  GraduationCap, Clock, Medal,
  Star
} from "lucide-react"
import { Language } from "@/types/language"
import { AIRichTextEditor } from "@/components/shared/AIRichTextEditor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Alert } from "@/components/shared/Alert"
import { CustomFieldsSection } from "@/components/shared/CustomFieldsSection"
import { PhotoUploader } from "@/components/timeline/shared/PhotoUploader"

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

interface LanguageFormDetailProps {
  data: Language
  onSave: (language: Language) => Promise<void>
  onCancel: () => void
}

export function LanguageFormDetail({ 
  data,
  onSave,
  onCancel 
}: LanguageFormDetailProps) {
  const [formData, setFormData] = useState<Language>(data)
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

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlertState({ show: true, type, message })
    setTimeout(() => {
      setAlertState(prev => ({ ...prev, show: false }))
    }, 3000)
  }

  const handleInputChange = (field: keyof Language, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)

      const response = await fetch(`/api/language/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('保存失败')
      }

      const updatedLanguage = await response.json()
      await onSave(updatedLanguage)
      showAlert('success', '保存成功')
      setIsEditing(false)
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
          className="text-muted-foreground hover:text-foreground"
        >
          ← 返回列表
        </Button>
      </motion.div>

      {/* 基本信息 */}
      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex-row items-center gap-2 pb-2">
            <Languages className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">基本信息</h2>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-6">
            <div className="col-span-2 space-y-2">
              <Label className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                语种
              </Label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={!isEditing}
                placeholder="请输入语种名称"
              />
            </div>
            <div>
              <Label className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                最高等级
              </Label>
              <Input
                value={formData.level}
                onChange={(e) => handleInputChange('level', e.target.value)}
                disabled={!isEditing}
                placeholder="请输入最高语言等级"
              />
            </div>
            <div>
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                获取时间
              </Label>
              <Input
                type="date"
                value={formData.acquireDate}
                onChange={(e) => handleInputChange('acquireDate', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label className="flex items-center gap-2">
                <Medal className="h-4 w-4 text-muted-foreground" />
                证书名称
              </Label>
              <Input
                value={formData.certificate}
                onChange={(e) => handleInputChange('certificate', e.target.value)}
                disabled={!isEditing}
                placeholder="请输入证书名称"
              />
            </div>
            <div>
              <Label className="flex items-center gap-2">
                <Star className="h-4 w-4 text-muted-foreground" />
                分数
              </Label>
              <Input
                value={formData.score}
                onChange={(e) => handleInputChange('score', e.target.value)}
                disabled={!isEditing}
                placeholder="请输入考试分数"
              />
            </div>
            <div>
              <Label className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                有效期
              </Label>
              <Input
                value={formData.validPeriod}
                onChange={(e) => handleInputChange('validPeriod', e.target.value)}
                disabled={!isEditing}
                placeholder="请输入证书有效期"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 自定义字段 */}
      <motion.div variants={item}>
        <CustomFieldsSection 
          fields={formData.customFields || []}
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
              customFields: [...(prev.customFields || []), newField]
            }))
          }}
          onRemove={(id) => {
            setFormData(prev => ({
              ...prev,
              customFields: (prev.customFields || []).filter(field => field.id !== id)
            }))
          }}
          onUpdate={(id, field, value) => {
            setFormData(prev => ({
              ...prev,
              customFields: (prev.customFields || []).map(item => 
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
            <h2 className="text-xl font-semibold">语言学习总结</h2>
          </CardHeader>
          <CardContent>
            <AIRichTextEditor 
              content={formData.summary || ''}
              onChange={(html) => handleInputChange('summary', html)}
              isEditing={isEditing}
              onAIGenerate={async () => {
                // AI 生成功能待实现
              }}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* 证书图片 */}
      <motion.div variants={item}>
        <PhotoUploader
          photos={formData.photos || []}
          onChange={(photos) => handleInputChange('photos', photos)}
          isEditing={isEditing}
          maxPhotos={5}
          title="证书图片"
          description="上传语言证书图片，该图片将展示在语言记录封面和Web简历中。"
        />
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