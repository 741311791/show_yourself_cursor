"use client"

import React, { useState } from "react"
import { motion } from "motion/react"
import { FileText, Calendar, Camera, Plus, Save, Edit2, Trash2 } from "lucide-react"
import { Hobby, HobbyAward } from "@/types/hobby"
import { AIRichTextEditor } from "@/components/shared/AIRichTextEditor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import Image from "next/image"
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

interface HobbyFormDetailProps {
  hobby: Hobby
  onSave: (hobby: Hobby) => void
  onCancel: () => void
}

export function HobbyFormDetail({
  hobby,
  onSave,
  onCancel
}: HobbyFormDetailProps) {
  const [formData, setFormData] = useState<Hobby>(hobby)
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
    field: keyof Hobby, 
    value: string | boolean | string[] | HobbyAward[]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // 自定义字段相关处理函数
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    
    const urls = files.map(file => URL.createObjectURL(file))
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...urls],
      cover: prev.cover || urls[0]
    }))
  }

  const handleRemovePhoto = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, index) => index !== indexToRemove),
      cover: prev.cover === prev.photos[indexToRemove] 
        ? prev.photos.filter((_, index) => index !== indexToRemove)[0] || null
        : prev.cover
    }))
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
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2 space-y-2">
                <Label>兴趣名称</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={!isEditing}
                  placeholder="请输入兴趣名称"
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
            </div>

            {/* 所获荣誉 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>所获荣誉</Label>
                {isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newAward: HobbyAward = {
                        id: Math.random().toString(),
                        title: "",
                        date: ""
                      }
                      setFormData(prev => ({
                        ...prev,
                        awards: [...prev.awards, newAward]
                      }))
                    }}
                    className={cn(
                      "gap-2",
                      "text-muted-foreground hover:text-foreground",
                      "border-dashed border-muted-foreground/50"
                    )}
                  >
                    <Plus className="h-4 w-4" />
                    添加荣誉
                  </Button>
                )}
              </div>
              
              <div className="space-y-3">
                {formData.awards.map((award, index) => (
                  <div 
                    key={award.id}
                    className="flex items-center gap-4"
                  >
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      <Input
                        value={award.title}
                        onChange={(e) => {
                          const newAwards = [...formData.awards]
                          newAwards[index] = {
                            ...award,
                            title: e.target.value
                          }
                          handleInputChange('awards', newAwards)
                        }}
                        disabled={!isEditing}
                        placeholder="荣誉名称"
                      />
                      <Input
                        type="date"
                        value={award.date}
                        onChange={(e) => {
                          const newAwards = [...formData.awards]
                          newAwards[index] = {
                            ...award,
                            date: e.target.value
                          }
                          handleInputChange('awards', newAwards)
                        }}
                        disabled={!isEditing}
                      />
                    </div>
                    {isEditing && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const newAwards = formData.awards.filter((_, i) => i !== index)
                          handleInputChange('awards', newAwards)
                        }}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 自定义信息 */}
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

      {/* 我和它的故事 */}
      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex-row items-center gap-2 pb-2">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">我和它的故事</h2>
          </CardHeader>
          <CardContent>
            <AIRichTextEditor
              content={formData.description}
              onChange={(html) => handleInputChange('description', html)}
              isEditing={isEditing}
              onAIGenerate={async () => {
                // TODO: 实现 AI 生成功能
                console.log('AI 生成故事')
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
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              上传与该兴趣爱好相关的照片，这些照片将展示在兴趣爱好列表和Web简历中。
            </p>
            
            {/* 上传按钮 */}
            {isEditing && (
              <div className="flex justify-center">
                <label className={cn(
                  "flex flex-col items-center justify-center w-full h-32",
                  "border-2 border-dashed rounded-lg cursor-pointer",
                  "hover:bg-muted/50 transition-colors"
                )}>
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Camera className="w-8 h-8 mb-3 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">点击上传照片</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            )}

            {/* 图片网格 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {formData.photos.map((photo, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-lg overflow-hidden group"
                >
                  <Image
                    src={photo}
                    alt={`照片 ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  {isEditing && (
                    <div className={cn(
                      "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100",
                      "flex items-center justify-center transition-opacity"
                    )}>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemovePhoto(index)
                        }}
                        className="text-white hover:text-destructive hover:bg-white"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
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