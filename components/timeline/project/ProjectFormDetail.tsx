"use client"

import React, { useState } from "react"
import { motion } from "motion/react"
import { Save, Edit2, FileText } from "lucide-react"
import { Project } from "@/types/project"
import { ProjectFormFields } from "./ProjectFormFields"

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

  const handleInputChange = (field: keyof Project, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      // TODO: 调用更新项目 API
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

      {/* 项目信息 */}
      <motion.div 
        variants={item}
        className="space-y-4 bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
      >
        <div className="flex items-center gap-2 text-gray-900 mb-6">
          <FileText size={20} className="text-[#FF4D4F]" />
          <h2 className="text-xl font-semibold">项目信息</h2>
        </div>
        <ProjectFormFields
          project={formData}
          isEditing={isEditing}
          onUpdate={handleInputChange}
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