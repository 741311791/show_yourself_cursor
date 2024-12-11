"use client"

import React, { useState } from "react"
import { motion } from "motion/react"
import { 
  Plus, Trash2, Edit2, Save,
  Trophy, Calendar, Medal,
  FileText, Camera, Building,
  Users, Crown
} from "lucide-react"
import { Award } from "@/types/award"
import { AIRichTextEditor } from "@/components/shared/AIRichTextEditor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ImageUpload } from "@/components/shared/ImageUpload"
import { Alert } from "@/components/shared/Alert"

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

interface AwardFormDetailProps {
  award: Award
  onSave: (award: Award) => void
  onCancel: () => void
}

export function AwardFormDetail({ 
  award,
  onSave,
  onCancel 
}: AwardFormDetailProps) {
  const [formData, setFormData] = useState<Award>(award)
  const [isEditing, setIsEditing] = useState(true)
  const [preview, setPreview] = useState<string | null>(award.photo)
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

  const handleInputChange = (field: keyof Award, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
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

  const addCustomField = () => {
    const newField = {
      id: Math.random().toString(),
      title: '',
      content: ''
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

  const updateCustomField = (id: string, field: 'title' | 'content', value: string) => {
    setFormData(prev => ({
      ...prev,
      customFields: prev.customFields.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }))
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
            <Trophy className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">基本信息</h2>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-6">
            <div className="col-span-2 space-y-2">
              <Label className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-muted-foreground" />
                奖项名称
              </Label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={!isEditing}
                placeholder="请输入奖项名称"
              />
            </div>
            <div>
              <Label className="flex items-center gap-2">
                <Medal className="h-4 w-4 text-muted-foreground" />
                获奖级别
              </Label>
              <Input
                value={formData.level}
                onChange={(e) => handleInputChange('level', e.target.value)}
                disabled={!isEditing}
                placeholder="请输入获奖级别"
              />
            </div>
            <div>
              <Label className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-muted-foreground" />
                获奖名次
              </Label>
              <Input
                value={formData.ranking}
                onChange={(e) => handleInputChange('ranking', e.target.value)}
                disabled={!isEditing}
                placeholder="请输入获奖名次"
              />
            </div>
            <div>
              <Label className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                颁发机构
              </Label>
              <Input
                value={formData.issuer}
                onChange={(e) => handleInputChange('issuer', e.target.value)}
                disabled={!isEditing}
                placeholder="请输入颁发机构"
              />
            </div>
            <div>
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                获奖时间
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
                <Users className="h-4 w-4 text-muted-foreground" />
                参与人数
              </Label>
              <Input
                value={formData.participants}
                onChange={(e) => handleInputChange('participants', e.target.value)}
                disabled={!isEditing}
                placeholder="请输入参与人数"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 自定义字段 */}
      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">自定义信息</h2>
            </div>
            {isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={addCustomField}
                className={cn(
                  "gap-2",
                  "text-muted-foreground hover:text-foreground",
                  "border-dashed border-muted-foreground/50"
                )}
              >
                <Plus className="h-4 w-4" />
                添加自定义字段
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.customFields.map(field => (
              <div key={field.id} className="flex items-start gap-3 group">
                <div className="w-[25%]">
                  <Input
                    value={field.title}
                    onChange={(e) => updateCustomField(field.id, 'title', e.target.value)}
                    placeholder="标题"
                    disabled={!isEditing}
                  />
                </div>
                <div className="flex-1">
                  <Input
                    value={field.content}
                    onChange={(e) => updateCustomField(field.id, 'content', e.target.value)}
                    placeholder="内容"
                    disabled={!isEditing}
                  />
                </div>
                {isEditing && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeCustomField(field.id)}
                    className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            {formData.customFields.length === 0 && isEditing && (
              <div className="text-center py-8 text-muted-foreground">
                <p>点击上方按钮添加自定义信息</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* 获奖总结 */}
      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex-row items-center gap-2 pb-2">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">获奖总结</h2>
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

      {/* 证书图片 */}
      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex-row items-center gap-2 pb-2">
            <Camera className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">证书图片</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              上传获奖证书图片，该图片将展示在获奖记录封面和Web简历中。
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