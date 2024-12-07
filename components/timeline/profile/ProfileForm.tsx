"use client"

import React, { useState } from "react"
import { motion } from "motion/react"
import { 
  User, Mail, Phone, MapPin, Globe, 
  Calendar, FileText, Save, Edit2,
  Plus, Trash2
} from "lucide-react"
import { AIRichTextEditor } from "@/components/shared/AIRichTextEditor"

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
  const [isEditing, setIsEditing] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [customFields, setCustomFields] = useState<CustomField[]>([])

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
      <motion.div 
        variants={item}
        className="space-y-4 bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
      >
        <div className="flex items-center gap-2 text-gray-900 mb-6">
          <User size={20} className="text-[#FF4D4F]" />
          <h2 className="text-xl font-semibold">基本信息</h2>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <User size={14} className="text-gray-400" />
              姓名
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#FF4D4F] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              disabled={!isEditing}
              placeholder="请输入姓名"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Mail size={14} className="text-gray-400" />
              邮箱
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#FF4D4F] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              disabled={!isEditing}
              placeholder="请输入邮箱"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Phone size={14} className="text-gray-400" />
              电话
            </label>
            <input
              type="tel"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#FF4D4F] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              disabled={!isEditing}
              placeholder="请输入电话"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Calendar size={14} className="text-gray-400" />
              生日
            </label>
            <input
              type="date"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#FF4D4F] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              disabled={!isEditing}
            />
          </div>
          <div className="col-span-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <MapPin size={14} className="text-gray-400" />
              地址
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#FF4D4F] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              disabled={!isEditing}
              placeholder="请输入地址"
            />
          </div>
          <div className="col-span-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Globe size={14} className="text-gray-400" />
              个人网站
            </label>
            <input
              type="url"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#FF4D4F] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              disabled={!isEditing}
              placeholder="请输入个人网站"
            />
          </div>
        </div>

        {/* 自定义字段部分 */}
        {customFields.length > 0 && (
          <div className="border-t border-gray-100 pt-6 mt-6">
            <div className="space-y-4">
              {customFields.map(field => (
                <div key={field.id} className="relative group">
                  <div className="flex items-center gap-4">
                    {/* 字段名称 (2份) */}
                    <input
                      type="text"
                      value={field.title}
                      onChange={(e) => handleUpdateCustomField(field.id, 'title', e.target.value)}
                      className="w-[25%] px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#FF4D4F] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      disabled={!isEditing}
                      placeholder="字段名称"
                    />
                    {/* 字段内容 (5份) */}
                    <input
                      type="text"
                      value={field.content}
                      onChange={(e) => handleUpdateCustomField(field.id, 'content', e.target.value)}
                      className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#FF4D4F] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      disabled={!isEditing}
                      placeholder="字段内容"
                    />
                    {/* 删除按钮 (1份) */}
                    {isEditing && (
                      <div className="w-[6%] flex justify-center">
                        <button
                          onClick={() => handleRemoveCustomField(field.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 添加自定义字段按钮 */}
        {isEditing && (
          <motion.div 
            variants={item}
            className="flex justify-center mt-6"
          >
            <button
              onClick={handleAddCustomField}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#FF4D4F] hover:bg-red-50 rounded-lg transition-colors"
            >
              <Plus size={16} />
              <span>添加自定义字段</span>
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* 个人简介 */}
      <motion.div 
        variants={item}
        className="space-y-4 bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
      >
        <div className="flex items-center gap-2 text-gray-900 mb-6">
          <FileText size={20} className="text-[#FF4D4F]" />
          <h2 className="text-xl font-semibold">个人简介</h2>
        </div>
        <AIRichTextEditor
          content=""
          onChange={() => {}}
          isEditing={isEditing}
          onAIGenerate={async () => {
            // TODO: 实现 AI 生成功能
            console.log('AI 生成个人简介')
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