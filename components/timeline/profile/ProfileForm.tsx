"use client"

import React, { useState, useEffect } from "react"
import { motion } from "motion/react"
import { 
  User, Mail, Phone, MapPin, Globe, 
  Calendar, FileText, Save, Edit2,
  Plus, Trash2
} from "lucide-react"
import { AIRichTextEditor } from "@/components/shared/AIRichTextEditor"
import { AvatarUpload } from "@/components/shared/AvatarUpload"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

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

interface CustomField {
  id: string
  title: string
  content: string
}

export function ProfileForm() {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [customFields, setCustomFields] = useState<CustomField[]>([])
  const [avatar, setAvatar] = useState("")

  useEffect(() => {
    setIsEditing(true)
  }, [])

  const handleSave = async () => {
    try {
      setIsSaving(true)
      // TODO: 调用保存 API
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsEditing(false)
    } catch (error) {
      console.error('保存失败:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleAddCustomField = () => {
    setCustomFields(prev => [
      ...prev,
      {
        id: Math.random().toString(),
        title: "",
        content: ""
      }
    ])
  }

  const handleUpdateCustomField = (id: string, field: keyof CustomField, value: string) => {
    setCustomFields(prev => 
      prev.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    )
  }

  const handleRemoveCustomField = (id: string) => {
    setCustomFields(prev => prev.filter(item => item.id !== id))
  }

  return (
    <motion.div 
      className="max-w-3xl mx-auto space-y-8"
      initial="hidden"
      animate="show"
      variants={container}
    >
      {/* 基本信息 */}
      <motion.div variants={item}>
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <User size={20} className="text-primary" />
              <CardTitle>基本信息</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 头像上传 */}
            <div className="flex justify-center">
              <AvatarUpload
                value={avatar}
                onChange={setAvatar}
                disabled={!isEditing}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <User size={14} className="text-muted-foreground" />
                  姓名
                </Label>
                <Input
                  type="text"
                  disabled={!isEditing}
                  placeholder="请输入姓名"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Mail size={14} className="text-muted-foreground" />
                  邮箱
                </Label>
                <Input
                  type="email"
                  disabled={!isEditing}
                  placeholder="请输入邮箱"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Phone size={14} className="text-muted-foreground" />
                  电话
                </Label>
                <Input
                  type="tel"
                  disabled={!isEditing}
                  placeholder="请输入电话"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar size={14} className="text-muted-foreground" />
                  生日
                </Label>
                <Input
                  type="date"
                  disabled={!isEditing}
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin size={14} className="text-muted-foreground" />
                  地址
                </Label>
                <Input
                  type="text"
                  disabled={!isEditing}
                  placeholder="请输入地址"
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label className="flex items-center gap-2">
                  <Globe size={14} className="text-muted-foreground" />
                  个人网站
                </Label>
                <Input
                  type="url"
                  disabled={!isEditing}
                  placeholder="请输入个人网站"
                />
              </div>
            </div>

            {/* 自定义字段部分 */}
            {customFields.length > 0 && (
              <div className="border-t pt-6 space-y-4">
                {customFields.map(field => (
                  <div key={field.id} className="relative group">
                    <div className="flex items-center gap-4">
                      <Input
                        value={field.title}
                        onChange={(e) => handleUpdateCustomField(field.id, 'title', e.target.value)}
                        disabled={!isEditing}
                        placeholder="字段名称"
                        className="w-[25%]"
                      />
                      <Input
                        value={field.content}
                        onChange={(e) => handleUpdateCustomField(field.id, 'content', e.target.value)}
                        disabled={!isEditing}
                        placeholder="字段内容"
                      />
                      {isEditing && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveCustomField(field.id)}
                          className="w-8 h-8 p-0 opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 添加自定义字段按钮 */}
            {isEditing && (
              <motion.div variants={item} className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={handleAddCustomField}
                  className="group"
                >
                  <Plus className="mr-2 h-4 w-4 text-primary group-hover:text-primary" />
                  添加自定义字段
                </Button>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* 个人简介 */}
      <motion.div variants={item}>
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <FileText size={20} className="text-primary" />
              <CardTitle>个人简介</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <AIRichTextEditor
              content=""
              onChange={() => {}}
              isEditing={isEditing}
              onAIGenerate={async () => {
                console.log('AI 生成个人简介')
              }}
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
          size="lg"
          onClick={isEditing ? handleSave : handleEdit}
          disabled={isSaving}
          className={cn(
            "shadow-lg",
            isEditing ? "bg-primary hover:bg-primary/90" : "bg-secondary hover:bg-secondary/90"
          )}
        >
          {isEditing ? (
            <>
              <Save className={cn("mr-2 h-4 w-4", isSaving && "animate-spin")} />
              {isSaving ? '保存中...' : '保存'}
            </>
          ) : (
            <>
              <Edit2 className="mr-2 h-4 w-4" />
              编辑
            </>
          )}
        </Button>
      </motion.div>
    </motion.div>
  )
} 