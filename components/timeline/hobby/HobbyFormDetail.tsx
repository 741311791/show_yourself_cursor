"use client"

import React, { useState } from "react"
import { motion } from "motion/react"
import { ArrowLeft, FileText, Image as ImageIcon, Trash2, Calendar, Plus, Edit2, Save, } from "lucide-react"
import { Hobby, HobbyAward } from "@/types/hobby"
import { AIRichTextEditor } from "@/components/shared/AIRichTextEditor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { Alert } from "@/components/shared/Alert"

interface HobbyFormDetailProps {
  hobby: Hobby
  onSave: (hobby: Hobby) => void
  onCancel: () => void
}

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // TODO: 实现多文件上传
    const urls = files.map(file => URL.createObjectURL(file))
    
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...urls],
      cover: prev.cover || urls[0]
    }))
  }

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlertState({ show: true, type, message })
    setTimeout(() => {
      setAlertState(prev => ({ ...prev, show: false }))
    }, 3000)  // 3秒后自动隐藏
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onSave({...formData})
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

  const handleRemovePhoto = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, index) => index !== indexToRemove),
      // 如果删除的是封面图片，则更新封面为剩余图片中的第一张或 null
      cover: prev.cover === prev.photos[indexToRemove] 
        ? prev.photos.filter((_, index) => index !== indexToRemove)[0] || null
        : prev.cover
    }))
  }

  return (
    <motion.div 
      className="max-w-3xl mx-auto space-y-8"
      initial="hidden"
      animate="show"
      variants={container}
    >
      {/* 返回按钮 */}
      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
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
      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
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
                    variant="ghost"
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
                    className="text-primary hover:text-primary"
                  >
                    <Plus className="h-4 w-4 mr-1" />
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

      {/* 图片上传 */}
      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-primary" />
              <CardTitle>照片墙</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 上传按钮 */}
            {isEditing && (
              <div className="flex justify-center">
                <label className={cn(
                  "flex flex-col items-center justify-center w-full h-32",
                  "border-2 border-dashed rounded-lg cursor-pointer",
                  "hover:bg-muted/50 transition-colors"
                )}>
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <ImageIcon className="w-8 h-8 mb-3 text-muted-foreground" />
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

      {/* 故事 */}
      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle>我和它的故事</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <AIRichTextEditor
              content={formData.description}
              onChange={(html) => handleInputChange('description', html)}
              isEditing={isEditing}
              onAIGenerate={async () => {
                console.log('AI 生成故事')
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