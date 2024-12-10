"use client"

import React, { useState } from "react"
import { motion } from "motion/react"
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from "@dnd-kit/sortable"
import { 
  Briefcase, MapPin, Calendar,
  FileText, ArrowLeft, Save, Edit2
} from "lucide-react"
import { Work, Project } from "@/types/work"
import { AIRichTextEditor } from "@/components/shared/AIRichTextEditor"
import { ProjectItem } from "./ProjectItem"
import { ImageUpload } from "@/components/shared/ImageUpload"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Alert } from "@/components/shared/Alert"

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

interface WorkFormDetailProps {
  work: Work
  onSave: (work: Work) => void
  onCancel: () => void
}

export function WorkFormDetail({ 
  work,
  onSave,
  onCancel 
}: WorkFormDetailProps) {
  const [formData, setFormData] = useState<Work>(work)
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

  const handleInputChange = (field: keyof Work, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      // TODO: 调用更新工作经历 API
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

  // 项目相关处理函数
  const addProject = () => {
    const newProject: Project = {
      id: Math.random().toString(),
      name: "",
      startDate: "",
      endDate: "",
      description: "",
      techStack: "",
      achievement: "",
      isCore: false,
      order: formData.projects.length
    }
    setFormData(prev => ({
      ...prev,
      projects: [...prev.projects, newProject]
    }))
  }

  const updateProject = (id: string, field: keyof Project, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map(project => 
        project.id === id ? { ...project, [field]: value } : project
      )
    }))
  }

  const removeProject = (id: string) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter(project => project.id !== id)
    }))
  }

  const toggleCoreProject = (id: string) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map(project => 
        project.id === id ? { ...project, isCore: !project.isCore } : project
      )
    }))
  }

  // 配置拖拽传感器
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // 处理拖拽结束
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    setFormData(prev => {
      const oldIndex = prev.projects.findIndex(p => p.id === active.id)
      const newIndex = prev.projects.findIndex(p => p.id === over.id)

      const newProjects = arrayMove(prev.projects, oldIndex, newIndex)
      
      // 更新所有项目的顺序
      return {
        ...prev,
        projects: newProjects.map((project, index) => ({
          ...project,
          order: index
        }))
      }
    })
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
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          返回列表
        </Button>
      </motion.div>

      {/* 公司照片 */}
      <motion.div variants={item}>
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle>公司照片</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              上传一张与该公司相关的照片，可以是公司logo或办公环境等。该照片将展示在工作经历封面和Web简历中。
            </p>
            <div className="flex justify-center">
              <ImageUpload
                value={formData.photo}
                onChange={(url) => handleInputChange('photo', url)}
                disabled={!isEditing}
                width={320}
                height={180}
                tip="点击上传公司照片"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 基本信息 */}
      <motion.div variants={item}>
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              <CardTitle>基本信息</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2 space-y-2">
                <Label className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  公司名称
                </Label>
                <Input
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  disabled={!isEditing}
                  placeholder="请输入公司名称"
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  公司地址
                </Label>
                <Input
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  disabled={!isEditing}
                  placeholder="请输入公司地址"
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

              <div className="space-y-2">
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
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  职位名称
                </Label>
                <Input
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  disabled={!isEditing}
                  placeholder="请输入职位名称"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 项目经历 */}
      <motion.div variants={item}>
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle>项目经历</CardTitle>
              </div>
              {isEditing && (
                <Button
                  variant="outline"
                  onClick={addProject}
                  className="gap-2"
                >
                  添加项目
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={formData.projects.map(p => p.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4">
                  {formData.projects
                    .sort((a, b) => a.order - b.order)
                    .map((project) => (
                      <ProjectItem
                        key={project.id}
                        project={project}
                        isEditing={isEditing}
                        onUpdate={updateProject}
                        onRemove={removeProject}
                        onToggleCore={toggleCoreProject}
                      />
                    ))}
                </div>
              </SortableContext>
            </DndContext>
          </CardContent>
        </Card>
      </motion.div>

      {/* 工作总结 */}
      <motion.div variants={item}>
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle>工作总结</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <AIRichTextEditor 
              content={formData.summary}
              onChange={(html) => handleInputChange('summary', html)}
              isEditing={isEditing}
              onAIGenerate={async () => {
                console.log('AI 生成工作总结')
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