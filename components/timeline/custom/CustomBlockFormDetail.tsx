"use client"

import React, { useState } from "react"
import { motion, Variants } from "framer-motion"
import { Save, Edit2, FileText, Camera } from "lucide-react"
import { CustomBlockItem, CustomBlock } from "@/types/custom"
import { AIRichTextEditor } from "@/components/shared/AIRichTextEditor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { CustomFieldsSection } from "@/components/shared/CustomFieldsSection"
import { PhotoWall } from "@/components/shared/PhotoWall"
import { Alert } from "@/components/shared/Alert"

interface CustomBlockFormDetailProps {
  item: CustomBlockItem
  block: CustomBlock
  onSave: (item: CustomBlockItem) => void
  onCancel: () => void
}

// 修改动画变体定义的类型
const container: Variants = {
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

export function CustomBlockFormDetail({
  item: blockItem,
  block,
  onSave,
  onCancel
}: CustomBlockFormDetailProps) {
  const [formData, setFormData] = useState<CustomBlockItem>(blockItem)
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

  const handleFieldChange = (id: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      fields: {
        ...prev.fields,
        [id]: value
      }
    }))
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      // TODO: 调用保存API
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

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlertState({ show: true, type, message })
    setTimeout(() => {
      setAlertState(prev => ({ ...prev, show: false }))
    }, 3000)
  }

  // ... 其他辅助函数

  return (
    <motion.div 
      className="max-w-3xl mx-auto space-y-8"
      initial="hidden"
      animate="show"
      variants={container}
    >
      {/* 只在时间线模式下显示返回按钮 */}
      {block.type === 'timeline' && (
        <motion.div variants={item}>
          <Button
            variant="ghost"
            onClick={onCancel}
            className="text-muted-foreground hover:text-foreground"
          >
            ← 返回列表
          </Button>
        </motion.div>
      )}

      {/* 自定义字段 */}
      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex-row items-center gap-2 pb-2">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">基本信息</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            {block.fields.map(field => (
              <div key={field.id} className="space-y-2">
                <Label>{field.label}</Label>
                {field.type === 'textarea' ? (
                  <Textarea
                    value={formData.fields[field.id] || ''}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    disabled={!isEditing}
                    placeholder={`请输入${field.label}`}
                  />
                ) : field.type === 'date' ? (
                  <Input
                    type="date"
                    value={formData.fields[field.id] || ''}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    disabled={!isEditing}
                  />
                ) : (
                  <Input
                    value={formData.fields[field.id] || ''}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    disabled={!isEditing}
                    placeholder={`请输入${field.label}`}
                  />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* 自定义信息 */}
      <motion.div variants={item}>
        <CustomFieldsSection
          fields={formData.customFields}
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

      {/* 总结 */}
      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex-row items-center gap-2 pb-2">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">总结</h2>
          </CardHeader>
          <CardContent>
            <AIRichTextEditor
              content={formData.summary}
              onChange={(html) => setFormData(prev => ({ ...prev, summary: html }))}
              isEditing={isEditing}
              onAIGenerate={async () => {
                // TODO: 实现AI生成功能
                console.log('AI生成总结')
              }}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* 照片墙 */}
      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex-row items-center gap-2 pb-2">
            <Camera className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">照片墙</h2>
          </CardHeader>
          <CardContent>
            <PhotoWall
              photos={formData.photos}
              onChange={(photos) => setFormData(prev => ({ ...prev, photos }))}
              disabled={!isEditing}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* 保存/编辑按钮 */}
      <motion.div 
        variants={item}
        className="fixed bottom-8 right-8 z-10"
      >
        <Button
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
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
              <span>{isSaving ? '保存中...' : '保存'}</span>
            </>
          ) : (
            <>
              <Edit2 className="h-5 w-5" />
              <span>编辑</span>
            </>
          )}
        </Button>
      </motion.div>

      <Alert
        show={alertState.show}
        type={alertState.type}
        message={alertState.message}
      />
    </motion.div>
  )
} 