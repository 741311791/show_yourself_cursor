"use client"

import React, { useState } from "react"
import { motion } from "motion/react"
import { 
  Award, Calendar, Star, Building,
  FileText, Save, Edit2, Camera,
  Plus, Code
} from "lucide-react"
import { Skill, SkillWork, SkillLevel, SkillCategory } from "@/types/skill"
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
import { PhotoWall } from "@/components/shared/PhotoWall"
import { Alert } from "@/components/shared/Alert"
import { CustomFieldsSection } from "@/components/shared/CustomFieldsSection"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { SkillWorkItem } from './SkillWorkItem'

const skillLevels = [
  { value: 'beginner', label: '初级' },
  { value: 'intermediate', label: '中级' },
  { value: 'advanced', label: '高级' },
  { value: 'expert', label: '专家' }
]

const skillCategories = [
  { value: 'language', label: '语言' },
  { value: 'programming', label: '编程' },
  { value: 'design', label: '设计' },
  { value: 'business', label: '商业' },
  { value: 'other', label: '其他' }
]

interface SkillFormDetailProps {
  skill: Skill
  onSave: (skill: Skill) => void
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

export function SkillFormDetail({
  skill,
  onSave,
  onCancel
}: SkillFormDetailProps) {
  const [formData, setFormData] = useState<Skill>(skill)
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
    field: keyof Skill, 
    value: string | string[] | SkillLevel | SkillCategory | SkillWork[]
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

  const handleAddWork = () => {
    const newWork: SkillWork = {
      id: Math.random().toString(),
      name: '',
      date: '',
      description: '',
      photos: [],
      customFields: [],
      summary: ''
    }
    setFormData(prev => ({
      ...prev,
      works: [...prev.works, newWork]
    }))
  }

  const handleUpdateWork = (index: number, updatedWork: SkillWork) => {
    setFormData(prev => ({
      ...prev,
      works: prev.works.map((work, i) => 
        i === index ? updatedWork : work
      )
    }))
  }

  const handleRemoveWork = (index: number) => {
    setFormData(prev => ({
      ...prev,
      works: prev.works.filter((_, i) => i !== index)
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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      setFormData((prev) => {
        const oldIndex = prev.works.findIndex((w) => w.id === active.id)
        const newIndex = prev.works.findIndex((w) => w.id === over?.id)
        const newWorks = [...prev.works]
        const [removed] = newWorks.splice(oldIndex, 1)
        newWorks.splice(newIndex, 0, removed)
        return { ...prev, works: newWorks }
      })
    }
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
            <Code className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">基本信息</h2>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-muted-foreground" />
                  技能名称
                </Label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={!isEditing}
                  placeholder="请输入技能名称"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  技能类别
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleInputChange('category', value as SkillCategory)}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {skillCategories.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  最高等级
                </Label>
                <Select
                  value={formData.level}
                  onValueChange={(value) => handleInputChange('level', value as SkillLevel)}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {skillLevels.map(option => (
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
                  认证时间
                </Label>
                <Input
                  type="month"
                  value={formData.certDate}
                  onChange={(e) => handleInputChange('certDate', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  认证名称
                </Label>
                <Input
                  value={formData.certName}
                  onChange={(e) => handleInputChange('certName', e.target.value)}
                  disabled={!isEditing}
                  placeholder="请输入认证名称"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  认证机构
                </Label>
                <Input
                  value={formData.certOrg}
                  onChange={(e) => handleInputChange('certOrg', e.target.value)}
                  disabled={!isEditing}
                  placeholder="请输入认证机构"
                />
              </div>
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

      {/* 作品集 */}
      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">作品集</h2>
            </div>
            {isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddWork}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                添加作品
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={formData.works.map(w => w.id)}
                strategy={verticalListSortingStrategy}
              >
                {formData.works.map((work, index) => (
                  <SkillWorkItem
                    key={work.id}
                    work={work}
                    isEditing={isEditing}
                    onUpdate={(updatedWork) => handleUpdateWork(index, updatedWork)}
                    onRemove={() => handleRemoveWork(index)}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </CardContent>
        </Card>
      </motion.div>

      {/* 技能总结 */}
      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex-row items-center gap-2 pb-2">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">技能总结</h2>
          </CardHeader>
          <CardContent>
            <AIRichTextEditor
              content={formData.summary}
              onChange={(html) => handleInputChange('summary', html)}
              isEditing={isEditing}
              onAIGenerate={async () => {
                console.log('AI 生成技能总结')
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
              上传与该技能相关的照片，可以是证书、作品、学习过程等。这些照片将展示在技能列表和Web简历中。
            </p>
            <PhotoWall
              photos={formData.photos}
              onChange={(photos) => handleInputChange('photos', photos)}
              disabled={!isEditing}
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