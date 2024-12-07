"use client"

import React, { useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { 
  ChevronDown, ChevronUp, Star, Trash2, 
  Calendar, Code, FileText, Edit2, Save,
  GripVertical
} from "lucide-react"
import { Project } from "@/types/work"
import { AIRichTextEditor } from "@/components/shared/AIRichTextEditor"
import { Tooltip } from "@/components/shared/Tooltip"

interface ProjectItemProps {
  project: Project
  isEditing: boolean
  onUpdate: (id: string, field: keyof Project, value: string | boolean) => void
  onRemove: (id: string) => void
  onToggleCore: (id: string) => void
}

export function ProjectItem({
  project,
  isEditing: parentIsEditing,
  onUpdate,
  onRemove,
  onToggleCore
}: ProjectItemProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [localIsEditing, setLocalIsEditing] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const isEditable = parentIsEditing && localIsEditing

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: project.id,
    disabled: !parentIsEditing
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setLocalIsEditing(false)
    } catch (error) {
      console.error('保存失败:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = () => {
    setLocalIsEditing(true)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-lg border border-gray-100 overflow-hidden"
    >
      {/* 项目标题栏 */}
      <div className="flex items-center justify-between p-4 bg-gray-50">
        <div className="flex items-center gap-3">
          {parentIsEditing && (
            <button
              {...attributes}
              {...listeners}
              className="p-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
            >
              <GripVertical size={18} />
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          <h4 className="text-lg font-medium text-gray-900">{project.name || '新项目'}</h4>
        </div>
        <div className="flex items-center gap-2">
          {parentIsEditing && (
            <>
              <Tooltip content={project.isCore ? "取消核心项目" : "标记为核心项目"}>
                <button
                  onClick={() => onToggleCore(project.id)}
                  className={`p-1.5 rounded-full transition-colors ${
                    project.isCore 
                      ? 'text-yellow-500 bg-yellow-50 hover:bg-yellow-100' 
                      : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'
                  }`}
                >
                  <Star size={18} />
                </button>
              </Tooltip>
              <button
                onClick={() => onRemove(project.id)}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* 项目详情 */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* 项目名称 */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <FileText size={14} className="text-gray-400" />
              项目名称
            </label>
            <input
              type="text"
              value={project.name}
              onChange={(e) => onUpdate(project.id, 'name', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#FF4D4F] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              disabled={!isEditable}
              placeholder="请输入项目名称"
            />
          </div>

          {/* 项目时间 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar size={14} className="text-gray-400" />
                开始时间
              </label>
              <input
                type="date"
                value={project.startDate}
                onChange={(e) => onUpdate(project.id, 'startDate', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#FF4D4F] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                disabled={!isEditable}
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar size={14} className="text-gray-400" />
                结束时间
              </label>
              <input
                type="date"
                value={project.endDate}
                onChange={(e) => onUpdate(project.id, 'endDate', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#FF4D4F] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                disabled={!isEditable}
              />
            </div>
          </div>

          {/* 项目描述 */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <FileText size={14} className="text-gray-400" />
              项目描述
            </label>
            <textarea
              value={project.description}
              onChange={(e) => onUpdate(project.id, 'description', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#FF4D4F] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 min-h-[100px]"
              disabled={!isEditable}
              placeholder="请输入项目描述"
            />
          </div>

          {/* 技术栈 */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Code size={14} className="text-gray-400" />
              技术栈
            </label>
            <input
              type="text"
              value={project.techStack}
              onChange={(e) => onUpdate(project.id, 'techStack', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#FF4D4F] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              disabled={!isEditable}
              placeholder="请输入使用的技术栈（选填）"
            />
          </div>

          {/* 个人成绩 */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Star size={14} className="text-gray-400" />
              个人成绩
            </label>
            <AIRichTextEditor
              content={project.achievement}
              onChange={(html) => onUpdate(project.id, 'achievement', html)}
              isEditing={isEditable}
              onAIGenerate={async () => {
                console.log('AI 生成个人成绩')
              }}
            />
          </div>

          {/* 保存/编辑按钮 */}
          {parentIsEditing && (
            <div className="flex justify-end pt-4">
              <button
                onClick={localIsEditing ? handleSave : handleEdit}
                disabled={isSaving}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm
                  transition-all duration-200 transform hover:scale-105
                  ${localIsEditing
                    ? 'bg-gradient-to-r from-[#FF4D4F] to-[#FF7875]'
                    : 'bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]'
                  }
                  ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {localIsEditing ? (
                  <>
                    <Save size={16} className={isSaving ? 'animate-spin' : ''} />
                    <span>{isSaving ? '保存中...' : '保存'}</span>
                  </>
                ) : (
                  <>
                    <Edit2 size={16} />
                    <span>编辑</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
} 