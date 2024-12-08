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
  Plus, Edit2, Save,
  Briefcase, MapPin, Calendar,
  FileText, Upload, Camera
} from "lucide-react"
import { Work, Project } from "@/types/work"
import { AIRichTextEditor } from "@/components/shared/AIRichTextEditor"
import { ProjectItem } from "./ProjectItem"
import Image from "next/image"

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
  const [preview, setPreview] = useState<string | null>(work.photo)
  const [isSaving, setIsSaving] = useState(false)

  const handleInputChange = (field: keyof Work, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setPreview(result)
        setFormData(prev => ({ ...prev, photo: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      // TODO: 调用更新工作经历 API
      await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟 API 调用
      
      onSave(formData)
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

  return (
    <motion.div 
      className="max-w-3xl mx-auto space-y-8"
      initial="hidden"
      animate="show"
      variants={container}
    >
      <motion.button
        variants={item}
        onClick={onCancel}
        className="mb-4 text-gray-500 hover:text-gray-700 transition-colors"
      >
        ← 返回列表
      </motion.button>

      {/* 照片上传 */}
      <motion.div 
        variants={item}
        className="space-y-4 bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
      >
        <div className="flex items-center gap-2 text-gray-900 mb-6">
          <Camera size={20} className="text-[#FF4D4F]" />
          <h2 className="text-xl font-semibold">公司照片</h2>
        </div>
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm text-gray-500">
            上传一张与该公司相关的照片，可以是公司logo或办公环境等。该照片将展示在工作经历封面和Web简历中。
          </p>
          <div className="relative group">
            <div className="relative w-64 h-40 rounded-lg overflow-hidden bg-gray-100 ring-4 ring-white shadow-lg">
              {preview ? (
                <Image
                  src={preview}
                  alt="Company photo preview"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                  <Upload size={32} />
                  <span className="text-sm">点击上传照片</span>
                </div>
              )}
            </div>
            {isEditing && (
              <label
                htmlFor="company-photo"
                className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-lg"
              >
                <Upload size={24} />
                <span className="text-sm">更换照片</span>
                <input
                  type="file"
                  id="company-photo"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={!isEditing}
                />
              </label>
            )}
          </div>
        </div>
      </motion.div>

      {/* 基本信息 */}
      <motion.div 
        variants={item}
        className="space-y-4 bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
      >
        <div className="flex items-center gap-2 text-gray-900 mb-6">
          <Briefcase size={20} className="text-[#FF4D4F]" />
          <h2 className="text-xl font-semibold">公司信息</h2>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Briefcase size={16} className="text-gray-400" />
              公司名称
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2  focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              disabled={!isEditing}
              placeholder="请输入公司名称"
            />
          </div>
          <div className="col-span-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <MapPin size={16} className="text-gray-400" />
              公司地址
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2  focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              disabled={!isEditing}
              placeholder="请输入公司地址"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Calendar size={16} className="text-gray-400" />
              开始时间
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2  focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              disabled={!isEditing}
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Calendar size={16} className="text-gray-400" />
              结束时间
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2  focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              disabled={!isEditing}
            />
          </div>
        </div>
      </motion.div>

      {/* 项目经历 */}
      <motion.div 
        variants={item}
        className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-gray-900">
            <FileText size={20} className="text-[#FF4D4F]" />
            <h3 className="text-xl font-semibold">项目经历</h3>
          </div>
          {isEditing && (
            <button
              onClick={addProject}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#FF4D4F] hover:bg-red-50 rounded-lg transition-colors"
            >
              <Plus size={16} />
              <span>添加项目</span>
            </button>
          )}
        </div>
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
      </motion.div>

      {/* 自定义信息和总结部分 */}
      <motion.div 
        variants={item}
        className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
      >
        <div className="flex items-center gap-2 text-gray-900 mb-4">
          <FileText size={20} className="text-[#FF4D4F]" />
          <h3 className="text-xl font-semibold">工作总结</h3>
        </div>
        <AIRichTextEditor 
          content={formData.summary}
          onChange={(html) => handleInputChange('summary', html)}
          isEditing={isEditing}
          onAIGenerate={async () => {
            // TODO: 实现 AI 生成功能
            console.log('AI 生成工作总结')
          }}
        />
      </motion.div>

      {/* 保存/编辑按钮 */}
      <motion.div 
        variants={item}
        className="fixed bottom-8 right-8 z-10"
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <button
          onClick={isEditing ? handleSave : handleEdit}
          disabled={isSaving}
          className={`
            flex items-center gap-2 px-8 py-3 rounded-xl text-white 
            transition-all duration-200 transform hover:scale-105
            shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)]
            ${isEditing
              ? 'bg-gradient-to-r from-[#FF4D4F] to-[#FF7875]'
              : 'bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]'
            }
            ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {isEditing ? (
            <>
              <Save size={20} className={isSaving ? 'animate-spin' : ''} />
              <span className="font-medium">{isSaving ? '保存中...' : '保存'}</span>
            </>
          ) : (
            <>
              <Edit2 size={20} />
              <span className="font-medium">编辑</span>
            </>
          )}
        </button>
      </motion.div>
    </motion.div>
  )
} 