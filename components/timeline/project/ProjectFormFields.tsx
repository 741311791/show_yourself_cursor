"use client"

import React from "react"
import { 
  FileText, Calendar, Briefcase,
  Code, Star
} from "lucide-react"
import { Project } from "@/types/project"
import { AIRichTextEditor } from "@/components/shared/AIRichTextEditor"

interface ProjectFormFieldsProps {
  project: Project
  isEditing: boolean
  onUpdate: (field: keyof Project, value: string | boolean) => void
  preview?: boolean
}

export function ProjectFormFields({
  project,
  isEditing,
  onUpdate,
  preview = false
}: ProjectFormFieldsProps) {
  if (preview) {
    return (
      <div className="space-y-2.5">
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar size={14} className="text-[#FF4D4F] shrink-0" />
          <span>{project.startDate} - {project.endDate}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Briefcase size={14} className="text-[#FF4D4F] shrink-0" />
          <span className="line-clamp-1">{project.company}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <FileText size={14} className="text-[#FF4D4F] shrink-0" />
          <span className="line-clamp-2">{project.description}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 项目名称 */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <FileText size={14} className="text-gray-400" />
          项目名称
        </label>
        <input
          type="text"
          value={project.name}
          onChange={(e) => onUpdate('name', e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2  focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
          disabled={!isEditing}
          placeholder="请输入项目名称"
        />
      </div>

      {/* 所属公司 */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Briefcase size={14} className="text-gray-400" />
          所属公司
        </label>
        <input
          type="text"
          value={project.company}
          onChange={(e) => onUpdate('company', e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2  focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
          disabled={!isEditing}
          placeholder="请输入所属公司"
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
            onChange={(e) => onUpdate('startDate', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2  focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
            disabled={!isEditing}
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
            onChange={(e) => onUpdate('endDate', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2  focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
            disabled={!isEditing}
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
          onChange={(e) => onUpdate('description', e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2  focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 min-h-[100px]"
          disabled={!isEditing}
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
          onChange={(e) => onUpdate('techStack', e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2  focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
          disabled={!isEditing}
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
          onChange={(html) => onUpdate('achievement', html)}
          isEditing={isEditing}
          onAIGenerate={async () => {
            // TODO: 实现 AI 生成功能
            console.log('AI 生成个人成绩')
          }}
        />
      </div>
    </div>
  )
} 