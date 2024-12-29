"use client"

import React, { useState } from "react"
import { motion } from "motion/react"
import { 
  Save, Edit2,
  Award, Calendar, FileText,
  Camera, Building
} from "lucide-react"
import { Certificate } from "@/types/certificate"
import { AIRichTextEditor } from "@/components/shared/AIRichTextEditor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
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

interface CertificateFormDetailProps {
  certificate: Certificate
  onSave: (certificate: Certificate) => void
  onCancel: () => void
}

export function CertificateFormDetail({ 
  certificate,
  onSave,
  onCancel 
}: CertificateFormDetailProps) {
  const [formData, setFormData] = useState<Certificate>(certificate)
  const [isEditing, setIsEditing] = useState(true)
  const [preview, setPreview] = useState<string | null>(certificate.photos[0])
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
    field: keyof Certificate, 
    value: string | Array<{ id: string; title: string; content: string }>
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      // TODO: 调用更新证书 API
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

  
  const addCustomField = () => {
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
  }

  const removeCustomField = (id: string) => {
    setFormData(prev => ({
      ...prev,
      customFields: prev.customFields.filter(field => field.id !== id)
    }))
  }

  const updateCustomField = (id: string, field: 'title' | 'content' | 'icon', value: string) => {
    setFormData(prev => ({
      ...prev,
      customFields: prev.customFields.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }))
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
            <Award className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">基本信息</h2>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-6">
            <div className="col-span-2 space-y-2">
              <Label className="flex items-center gap-2">
                <Award className="h-4 w-4 text-muted-foreground" />
                证书名称
              </Label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={!isEditing}
                placeholder="请输入证书名称"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                发证机构
              </Label>
              <Input
                value={formData.issuer}
                onChange={(e) => handleInputChange('issuer', e.target.value)}
                disabled={!isEditing}
                placeholder="请输入发证机构"
              />
            </div>
            <div>
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                获取时间
              </Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label className="flex items-center gap-2">
                <Award className="h-4 w-4 text-muted-foreground" />
                证书级别
              </Label>
              <Input
                value={formData.level}
                onChange={(e) => handleInputChange('level', e.target.value)}
                disabled={!isEditing}
                placeholder="请输入证书级别"
              />
            </div>
            <div className="col-span-2">
              <Label className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                证书编号
              </Label>
              <Input
                value={formData.number}
                onChange={(e) => handleInputChange('number', e.target.value)}
                disabled={!isEditing}
                placeholder="请输入证书编号"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 自定义信息 */}
      <motion.div variants={item}>
        <CustomFieldsSection
          fields={formData.customFields}
          isEditing={isEditing}
          onAdd={addCustomField}
          onRemove={removeCustomField}
          onUpdate={updateCustomField}
        />
      </motion.div>
      {/* 证书图片 */}
      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex-row items-center gap-2 pb-2">
            <Camera className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">证书图片</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              上传证书图片，该图片将展示在证书列表和Web简历中。
            </p>
            <div className="flex justify-center">
              <ImageUpload
                value={preview}
                onChange={(url) => {
                  setPreview(url)
                  handleInputChange('photo', url)
                }}
                disabled={!isEditing}
                tip="点击上传证书图片"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 证书总结 */}
      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex-row items-center gap-2 pb-2">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">总结</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <AIRichTextEditor 
              content={formData.summary}
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