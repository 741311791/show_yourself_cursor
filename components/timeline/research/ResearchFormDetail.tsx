"use client"

import React, { useState } from "react"
import { motion } from "motion/react"
import { 
  BookMarked, MapPin, Calendar, User,
  FileText, Save, Edit2, Camera,
  Plus, BookOpen
} from "lucide-react"
import { Research, ResearchResult } from "@/types/research"
import { AIRichTextEditor } from "@/components/shared/AIRichTextEditor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ImageUpload } from "@/components/shared/ImageUpload"
import { Alert } from "@/components/shared/Alert"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { ResearchResultItem } from './ResearchResultItem'
import { CustomFieldsSection } from "@/components/shared/CustomFieldsSection"

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

interface ResearchFormDetailProps {
  research: Research
  onSave: (research: Research) => void
  onCancel: () => void
}

export function ResearchFormDetail({
  research,
  onSave,
  onCancel
}: ResearchFormDetailProps) {
  const [formData, setFormData] = useState<Research>(research)
  const [isEditing, setIsEditing] = useState(true)
  const [preview, setPreview] = useState<string | null>(research.photo)
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
    field: keyof Research, 
    value: string | ResearchResult[]
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

  const handleAddResult = () => {
    const newResult: ResearchResult = {
      id: Math.random().toString(),
      type: 'paper',
      name: '',
      role: '',
      date: '',
      customFields: [],
      summary: ''
    }
    setFormData(prev => ({
      ...prev,
      results: [...prev.results, newResult]
    }))
  }

  const handleUpdateResult = (index: number, updatedResult: ResearchResult) => {
    setFormData(prev => ({
      ...prev,
      results: prev.results.map((result, i) => 
        i === index ? updatedResult : result
      )
    }))
  }

  const handleRemoveResult = (index: number) => {
    setFormData(prev => ({
      ...prev,
      results: prev.results.filter((_, i) => i !== index)
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
        const oldIndex = prev.results.findIndex((r) => r.id === active.id)
        const newIndex = prev.results.findIndex((r) => r.id === over?.id)
        const newResults = [...prev.results]
        const [removed] = newResults.splice(oldIndex, 1)
        newResults.splice(newIndex, 0, removed)
        return { ...prev, results: newResults }
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
            <BookMarked className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">基本信息</h2>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <Label>研究方向</Label>
                </div>
                <Input
                  value={formData.direction}
                  onChange={(e) => handleInputChange('direction', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <Label>研究机构</Label>
                </div>
                <Input
                  value={formData.institution}
                  onChange={(e) => handleInputChange('institution', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <Label>担任角色</Label>
                </div>
                <Input
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <Label>开始时间</Label>
                </div>
                <Input
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  disabled={!isEditing}
                  type="month"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <Label>结束时间</Label>
                </div>
                <Input
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  disabled={!isEditing}
                  type="month"
                />
              </div>
              {/* ... 其他基本信息字段 */}
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

      {/* 研究成果 */}
      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">研究成果</h2>
            </div>
            {isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddResult}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                添加研究成果
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 研究成果列表 */}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={formData.results.map(r => r.id)}
                strategy={verticalListSortingStrategy}
              >
                {formData.results.map((result, index) => (
                  <ResearchResultItem
                    key={result.id}
                    result={result}
                    isEditing={isEditing}
                    onUpdate={(updatedResult) => handleUpdateResult(index, updatedResult)}
                    onRemove={() => handleRemoveResult(index)}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </CardContent>
        </Card>
      </motion.div>

      {/* 科研总结 */}
      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex-row items-center gap-2 pb-2">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">科研总结</h2>
          </CardHeader>
          <CardContent>
            <AIRichTextEditor
              content={formData.summary}
              onChange={(html) => handleInputChange('summary', html)}
              isEditing={isEditing}
              onAIGenerate={async () => {
                console.log('AI 生成科研总结')
              }}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* 相关图片 */}
      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex-row items-center gap-2 pb-2">
            <Camera className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">相关图片</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              上传一张与该科研经历相关的照片，可以是实验室、研究成果或队合作等。该图片将展示在科研经历列表Web简历中。
            </p>
            <div className="flex justify-center">
              <ImageUpload
                value={preview}
                onChange={(url) => {
                  setPreview(url)
                  handleInputChange('photo', url)
                }}
                disabled={!isEditing}
                tip="点击上传图片"
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