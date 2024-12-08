"use client"

import React, { useState } from "react"
import { motion } from "motion/react"
import { 
  Plus, Trash2, Edit2,Save,
  GraduationCap, MapPin, Calendar,
  Book, Library, Award, FileText,
  Upload, Camera
} from "lucide-react"
import { Education } from "@/types/education"
import { AIRichTextEditor } from "@/components/shared/AIRichTextEditor"
import Image from "next/image"

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

interface EducationFormDetailProps {
  education: Education
  onSave: (education: Education) => void
  onCancel: () => void
}

export function EducationFormDetail({ 
  education,
  onSave,
  onCancel 
}: EducationFormDetailProps) {
  const [formData, setFormData] = useState<Education>(education)
  const [isEditing, setIsEditing] = useState(true)
  const [preview, setPreview] = useState<string | null>(education.photo)
  const [isSaving, setIsSaving] = useState(false)

  const handleInputChange = (field: keyof Education, value: string) => {
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
      // TODO: 调用更新教育经历 API
      // const response = await updateEducation(formData)
      await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟 API 调用
      
      onSave(formData)  // 只更新数据
      setIsEditing(false)  // 切换到不可编辑状态
    } catch (error) {
      console.error('保存失败:', error)
      // TODO: 显示错误提示
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)  // 切换到可编辑状态
  }

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
          <h2 className="text-xl font-semibold">相关照片</h2>
        </div>
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm text-gray-500">
            上传一张与该教育经历相关的照片，可以是学校照片或毕业照等。该照片将展示在教育经历封面和Web简历中。
          </p>
          <div className="relative group">
            <div className="relative w-64 h-40 rounded-lg overflow-hidden bg-gray-100 ring-4 ring-white shadow-lg">
              {preview ? (
                <Image
                  src={preview}
                  alt="Education photo preview"
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
                htmlFor="education-photo"
                className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-lg"
              >
                <Upload size={24} />
                <span className="text-sm">更换照片</span>
                <input
                  type="file"
                  id="education-photo"
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

      {/* 学校信息 */}
      <motion.div 
        variants={item}
        className="space-y-4 bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
      >
        <div className="flex items-center gap-2 text-gray-900 mb-6">
          <GraduationCap size={20} className="text-[#FF4D4F]" />
          <h2 className="text-xl font-semibold">学校信息</h2>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <GraduationCap size={16} className="text-gray-400" />
              学校名称
            </label>
            <input
              type="text"
              value={formData.school}
              onChange={(e) => handleInputChange('school', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2  focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              disabled={!isEditing}
              placeholder="请输入学校名称"
            />
          </div>
          <div className="col-span-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <MapPin size={16} className="text-gray-400" />
              学校地址
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2  focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              disabled={!isEditing}
              placeholder="请输入学校地址"
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

      {/* 学习信息 */}
      <motion.div 
        variants={item}
        className="space-y-4 bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
      >
        <div className="flex items-center gap-2 text-gray-900 mb-6">
          <Book size={20} className="text-[#FF4D4F]" />
          <h2 className="text-xl font-semibold">学习信息</h2>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Book size={16} className="text-gray-400" />
              专业
            </label>
            <input
              type="text"
              value={formData.major}
              onChange={(e) => handleInputChange('major', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2  focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              disabled={!isEditing}
              placeholder="请输入所学专业"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Award size={16} className="text-gray-400" />
              学位
            </label>
            <input
              type="text"
              value={formData.degree}
              onChange={(e) => handleInputChange('degree', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2  focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              disabled={!isEditing}
              placeholder="请输入获得学位"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Award size={16} className="text-gray-400" />
              成绩
            </label>
            <input
              type="text"
              value={formData.gpa}
              onChange={(e) => handleInputChange('gpa', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2  focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              disabled={!isEditing}
              placeholder="请输入GPA或其他成绩"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Library size={16} className="text-gray-400" />
              主修课程
            </label>
            <input
              type="text"
              value={formData.courses}
              onChange={(e) => handleInputChange('courses', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2  focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              disabled={!isEditing}
              placeholder="请输入主要课程"
            />
          </div>
        </div>
      </motion.div>

      {/* 自定义字段 */}
      <motion.div 
        variants={item}
        className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-gray-900">
            <FileText size={20} className="text-[#FF4D4F]" />
            <h3 className="text-xl font-semibold">自定义信息</h3>
          </div>
          {isEditing && (
            <button
              onClick={addCustomField}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#FF4D4F] hover:bg-red-50 rounded-lg transition-colors"
            >
              <Plus size={16} />
              <span>添加信息</span>
            </button>
          )}
        </div>
        <div className="space-y-4">
          {formData.customFields.map(field => (
            <div key={field.id} className="flex items-start gap-3 group">
              <div className="flex-1">
                <input
                  type="text"
                  value={field.title}
                  onChange={(e) => updateCustomField(field.id, 'title', e.target.value)}
                  placeholder="标题"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2  focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  disabled={!isEditing}
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={field.content}
                  onChange={(e) => updateCustomField(field.id, 'content', e.target.value)}
                  placeholder="内容"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2  focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  disabled={!isEditing}
                />
              </div>
              {isEditing && (
                <button
                  onClick={() => removeCustomField(field.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          ))}
          {formData.customFields.length === 0 && isEditing && (
            <div className="text-center py-8 text-gray-500">
              <p>点击上方按钮添加自定义信息</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* 学习总结 */}
      <motion.div 
        variants={item}
        className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
      >
        <div className="flex items-center gap-2 text-gray-900 mb-4">
          <FileText size={20} className="text-[#FF4D4F]" />
          <h3 className="text-xl font-semibold">总结</h3>
        </div>
        <AIRichTextEditor 
          content={formData.summary}
          onChange={(html) => handleInputChange('summary', html)}
          isEditing={isEditing}
          onAIGenerate={async () => {
            // TODO: 实现 AI 生成功能
            console.log('AI 生成总结')
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