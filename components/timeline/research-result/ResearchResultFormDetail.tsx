"use client"

import React, { useState } from "react"
import { motion } from "motion/react"
import { 
  BookOpen, Calendar, FileText, Save, Edit2
} from "lucide-react"
import { ResearchResult } from "@/types/research"
import { AIRichTextEditor } from "@/components/shared/AIRichTextEditor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Alert } from "@/components/shared/Alert"
import { CustomFieldsSection } from "@/components/shared/CustomFieldsSection"
import { PhotoUploader } from "@/components/timeline/shared/PhotoUploader"

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

interface ResearchResultFormDetailProps {
  result: ResearchResult
  onSave: (result: ResearchResult) => void
  onCancel: () => void
}

const resultTypes = [
  { value: 'PAPER', label: '论文' },
  { value: 'PATENT', label: '专利' },
  { value: 'SOFTWARE', label: '软件著作权' },
  { value: 'AWARD', label: '获奖' },
  { value: 'OTHER', label: '其他' }
]

export function ResearchResultFormDetail({
  result,
  onSave,
  onCancel
}: ResearchResultFormDetailProps) {
  const [formData, setFormData] = useState<ResearchResult>(result)
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

  const handleInputChange = (
    field: keyof ResearchResult, 
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
      customFields: prev.customFields?.filter(field => field.id !== id) || []
    }))
  }

  const updateCustomField = (id: string, field: 'title' | 'content' | 'icon', value: string) => {
    setFormData(prev => ({
      ...prev,
      customFields: prev.customFields?.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      ) || []
    }))
  }

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlertState({ show: true, type, message })
    setTimeout(() => {
      setAlertState(prev => ({ ...prev, show: false }))
    }, 3000)
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)

      const response = await fetch(`/api/research-result/${result.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('保存失败')
      }

      const updatedResult = await response.json()
      onSave(updatedResult)
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

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* 基本信息 */}
      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex-row items-center gap-2 pb-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">基本信息</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>成果名称</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={!isEditing}
                  placeholder="请输入成果名称"
                />
              </div>
              <div className="space-y-2">
                <Label>成果类型</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleInputChange('type', value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择成果类型" />
                  </SelectTrigger>
                  <SelectContent>
                    {resultTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>发表/获得日期</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label>本人角色</Label>
                <Input
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  disabled={!isEditing}
                  placeholder="如：第一作者、发明人等"
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

      {/* 成果描述 */}
      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex-row items-center gap-2 pb-2">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">成果描述</h2>
          </CardHeader>
          <CardContent>
            <AIRichTextEditor
              content={formData.summary}
              onChange={(html) => handleInputChange('summary', html)}
              isEditing={isEditing}
              onAIGenerate={async () => {
                console.log('AI 生成成果描述')
              }}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* 相关图片 */}
      <motion.div variants={item}>
        <PhotoUploader
          photos={formData.photos || []}
          onChange={(photos) => handleInputChange('photos', photos)}
          isEditing={isEditing}
          maxPhotos={5}
          title="相关图片"
          description="上传成果相关图片（最多5张）"
        />
      </motion.div>

      {/* 保存/编辑按钮 */}
      <motion.div variants={item} className="fixed bottom-8 right-8 z-10">
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