"use client"

import React, { useState, useEffect } from "react"
import { motion } from "motion/react"
import { 
  FileText, MapPin, Calendar, Code,
  Save, Edit2, Briefcase
} from "lucide-react"
import { Project } from "@/types/project"
import { Work } from "@/types/work"
import { AIRichTextEditor } from "@/components/shared/AIRichTextEditor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Alert } from "@/components/shared/Alert"
import { CustomFieldsSection } from "@/components/shared/CustomFieldsSection"
import { PhotoUploader } from "@/components/timeline/shared/PhotoUploader"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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

interface ProjectFormDetailProps {
  project: Project
  onSave: (project: Project) => void
  onCancel: () => void
}

export function ProjectFormDetail({
  project,
  onSave,
  onCancel
}: ProjectFormDetailProps) {
  const [formData, setFormData] = useState<Project>(project)
  const [isEditing, setIsEditing] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [works, setWorks] = useState<Work[]>([])
  const [alertState, setAlertState] = useState<{
    show: boolean
    type: 'success' | 'error'
    message: string
  }>({
    show: false,
    type: 'success',
    message: ''
  })

  // 获取工作经历列表
  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const response = await fetch('/api/work')
        if (!response.ok) {
          throw new Error('获取工作经历失败')
        }
        const data = await response.json()
        setWorks(data)
      } catch (error) {
        console.error('获取工作经历失败:', error)
        showAlert('error', '获取工作经历失败')
      }
    }

    fetchWorks()
  }, [])

  const handleInputChange = (field: keyof Project, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      
      const response = await fetch(`/api/project/${formData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        cache: 'no-store'
      })

      if (!response.ok) {
        throw new Error('更新项目经历失败')
      }

      const savedProject = await response.json()
      onSave(savedProject)
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
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">基本信息</h2>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-6">
            <div className="col-span-2 space-y-2">
              <Label className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                项目名称
              </Label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={!isEditing}
                placeholder="请输入项目名称"
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                关联工作经历
              </Label>
              <Select
                value={formData.workId ?? ""}
                onValueChange={(value) => {
                  const work = works.find(w => w.id === value)
                  handleInputChange('workId', value)
                  handleInputChange('company', work?.company ?? '')
                }}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择关联的工作经历" />
                </SelectTrigger>
                <SelectContent>
                  {works.map((work) => (
                    <SelectItem key={work.id} value={work.id ?? ""}>
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <div className="font-medium">{work.company}</div>
                          <div className="text-xs text-muted-foreground">
                            {work.position} | {work.startDate} - {work.endDate}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
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

            <div>
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                结束时间
              </Label>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label className="flex items-center gap-2">
                <Code className="h-4 w-4 text-muted-foreground" />
                技术栈
              </Label>
              <Input
                value={formData.techStack}
                onChange={(e) => handleInputChange('techStack', e.target.value)}
                disabled={!isEditing}
                placeholder="请输入使用的技术栈"
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                项目描述
              </Label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                disabled={!isEditing}
                placeholder="请输入项目描述"
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 自定义信息 */}
      <motion.div variants={item}>
        <CustomFieldsSection 
          fields={formData.customFields ?? []}
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
              customFields: [...(prev.customFields ?? []), newField]
            }))
          }}
          onRemove={(id) => {
            setFormData(prev => ({
              ...prev,
              customFields: prev.customFields?.filter(field => field.id !== id) ?? []
            }))
          }}
          onUpdate={(id, field, value) => {
            setFormData(prev => ({
              ...prev,
              customFields: prev.customFields?.map(item => 
                item.id === id ? { ...item, [field]: value } : item
              ) ?? []
            }))
          }}
        />
      </motion.div>

      {/* 项目总结 */}
      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex-row items-center gap-2 pb-2">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">项目总结</h2>
          </CardHeader>
          <CardContent>
            <AIRichTextEditor
              content={formData.summary}
              onChange={(html) => handleInputChange('summary', html)}
              isEditing={isEditing}
              onAIGenerate={async () => {
                console.log('AI 生成项目总结')
              }}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* 项目图片 */}
      <motion.div variants={item}>
        <PhotoUploader
          title="项目图片"
          description="上传与该项目相关的照片，可以是项目截图或效果图等。第一张照片将作为封面展示。"
          photos={formData.photos ?? []}
          onChange={(photos) => handleInputChange('photos', photos)}
          isEditing={isEditing}
          maxPhotos={5}
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