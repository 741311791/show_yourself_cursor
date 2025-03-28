"use client"

import React, { useState, useEffect } from "react"
import { motion } from "motion/react"
import { 
  User, Mail, Phone, MapPin, Globe, 
  Calendar, FileText, Save, Edit2,
  Loader2
} from "lucide-react"
import { AIRichTextEditor } from "@/components/shared/AIRichTextEditor"
import { AvatarUpload } from "@/components/shared/AvatarUpload"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Alert } from "@/components/shared/Alert"
import { Profile, defaultProfile } from "@/types/profile"
import { CustomFieldsSection } from "@/components/shared/CustomFieldsSection"
import { v4 as uuidv4 } from 'uuid'

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

export function ProfileForm() {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [alertState, setAlertState] = useState<{
    show: boolean
    type: 'success' | 'error' | 'info'
    message: string
  }>({
    show: false,
    type: 'success',
    message: ''
  })
  
  // 表单数据状态
  const [profile, setProfile] = useState<Profile>(defaultProfile)

  // 获取个人信息
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const response = await fetch('/api/profile')
        if (!response.ok) {
          throw new Error('获取个人信息失败')
        }
        
        const data = await response.json()
        setProfile(data || defaultProfile)

        // 根据不同情况显示不同提示
        if (data) {
          showAlert('success', '成功获取用户信息')
        } else {
          showAlert('info', '当前用户基本信息为空，快来添加吧~')
          setIsEditing(true) // 自动进入编辑模式
        }
      } catch (error) {
        console.error('获取个人信息失败:', error)
        setError('获取个人信息失败，请刷新页面重试')
        showAlert('error', '获取个人信息失败，请刷新页面重试')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleSave = async () => {
    try {
      setIsSaving(true)
      
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      })

      if (!response.ok) {
        throw new Error('保存失败')
      }

      const updatedProfile = await response.json()
      setProfile(updatedProfile)
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

  const handleAddCustomField = () => {
    setProfile(prev => ({
      ...prev,
      customFields: [
        ...prev.customFields,
        {
          id: uuidv4(),
          title: "",
          content: "",
          icon: 'FileText'
        }
      ]
    }))
  }

  const handleUpdateCustomField = (id: string, field: 'title' | 'content' | 'icon', value: string) => {
    setProfile(prev => ({
      ...prev,
      customFields: prev.customFields.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }))
  }

  const handleRemoveCustomField = (id: string) => {
    setProfile(prev => ({
      ...prev,
      customFields: prev.customFields.filter(item => item.id !== id)
    }))
  }

  const showAlert = (type: 'success' | 'error' | 'info', message: string) => {
    setAlertState({ show: true, type, message })
    setTimeout(() => {
      setAlertState(prev => ({ ...prev, show: false }))
    }, 3000)
  }

  // 如果正在加载，显示加载状态
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">加载个人信息...</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div 
      className="max-w-3xl mx-auto space-y-8"
      initial="hidden"
      animate="show"
      variants={container}
    >
      {/* Alert 组件 */}
      <Alert
        show={alertState.show}
        type={alertState.type}
        message={alertState.message}
      />

      {/* 如果有错误，显示错误提示 */}
      {error && (
        <motion.div variants={item}>
          <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        </motion.div>
      )}

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
                value={profile.avatar}
                onChange={(url) => setProfile(prev => ({ ...prev, avatar: url }))}
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
                  value={profile.name}
                  onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
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
                  value={profile.email}
                  onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
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
                  value={profile.phone}
                  onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
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
                  value={profile.birthday}
                  onChange={(e) => setProfile(prev => ({ ...prev, birthday: e.target.value }))}
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
                  value={profile.location}
                  onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
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
                  value={profile.website}
                  onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                  disabled={!isEditing}
                  placeholder="请输入个人网站"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 自定义字段 */}
      <motion.div variants={item}>
        <CustomFieldsSection 
          fields={profile.customFields}
          onFieldsChange={(fields) => setProfile(prev => ({ ...prev, customFields: fields }))}
          disabled={!isEditing}
          isEditing={isEditing}
          onAdd={handleAddCustomField}
          onRemove={handleRemoveCustomField}
          onUpdate={handleUpdateCustomField}
        />
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
              content={profile.summary}
              onChange={(content) => setProfile(prev => ({ ...prev, summary: content }))}
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
            isEditing ? "bg-primary hover:bg-primary/90" : "bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]"
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