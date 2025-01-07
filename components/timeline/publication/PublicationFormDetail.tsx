"use client"

import React, { useState } from "react"
import { motion } from "motion/react"
import { 
  Globe, Calendar, BookOpen,
  FileText, Save, Edit2, Camera, Database
} from "lucide-react"
import { Publication, PublicationType } from "@/types/publication"
import { AIRichTextEditor } from "@/components/shared/AIRichTextEditor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Alert } from "@/components/shared/Alert"
import { CustomFieldsSection } from "@/components/shared/CustomFieldsSection"
import { PhotoUploader } from "@/components/timeline/shared/PhotoUploader"

const publicationTypes = [
  { value: 'PAPER', label: '期刊论文' },
  { value: 'CONFERENCE', label: '会议论文' },
  { value: 'BOOK', label: '专著' },
  { value: 'PATENT', label: '专利' },
  { value: 'OTHER', label: '其他' }
]

interface PublicationFormDetailProps {
  publication: Publication
  onSave: (publication: Publication) => Promise<void>
  onCancel: () => void
}

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

export function PublicationFormDetail({
  publication,
  onSave,
  onCancel
}: PublicationFormDetailProps) {
  const [formData, setFormData] = useState<Publication>(publication)
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

  const handleInputChange = (
    field: keyof Publication, 
    value: string | string[]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addCustomField = () => {
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
  }

  const removeCustomField = (id: string) => {
    setFormData(prev => ({
      ...prev,
      customFields: (prev.customFields || []).filter(field => field.id !== id)
    }))
  }

  const updateCustomField = (id: string, field: 'title' | 'content' | 'icon', value: string) => {
    setFormData(prev => ({
      ...prev,
      customFields: (prev.customFields || []).map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }))
  }

  const handleSave = async () => {
    try {

      setIsSaving(true)
      console.log('publication', publication)
      const response = await fetch(`/api/publication/${publication.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
        cache: 'no-store'
      })

      if (!response.ok) {
        throw new Error('保存失败')
      }

      

      const updatedPublication = await response.json()
      onSave(updatedPublication)
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
    setIsEditing(true)  // 切换到可编辑状态
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
            <Globe className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">基本信息</h2>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  作品名称
                </Label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={!isEditing}
                  placeholder="请输入作品名称"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  作品类别
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleInputChange('type', value as PublicationType)}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {publicationTypes.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  出版时间
                </Label>
                <Input
                  type="month"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  刊物名称
                </Label>
                <Input
                  value={formData.journal}
                  onChange={(e) => handleInputChange('journal', e.target.value)}
                  disabled={!isEditing}
                  placeholder="请输入刊物名称"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-muted-foreground" />
                  数据库收录
                </Label>
                <Input
                  value={formData.database}
                  onChange={(e) => handleInputChange('database', e.target.value)}
                  disabled={!isEditing}
                  placeholder="请输入数据库收录情况"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 自定义信息 */}
      <motion.div variants={item}>
        <CustomFieldsSection
          fields={formData.customFields || []}
          isEditing={isEditing}
          onAdd={addCustomField}
          onRemove={removeCustomField}
          onUpdate={updateCustomField}
        />
      </motion.div>

      {/* 作品总结 */}
      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex-row items-center gap-2 pb-2">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">作品总结</h2>
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

      {/* 刊物图片 */}
      <motion.div variants={item}>
        <PhotoUploader
          photos={formData.photos || []}
          onChange={(photos) => handleInputChange('photos', photos)}
          isEditing={isEditing}
          maxPhotos={5}
          title="相关照片"
          description="上传一张与该出版物相关的图片，可以是刊物封面、专利证书等。该图片将展示在出版物列表和Web简历中。"
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