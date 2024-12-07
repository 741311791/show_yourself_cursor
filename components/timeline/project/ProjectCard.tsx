"use client"

import React, { useState } from "react"
import { ChevronDown, ChevronUp, Calendar, Briefcase, FileText, Code, Star } from "lucide-react"
import { Project } from "@/types/project"

interface ProjectCardProps {
  project: Project
  onClick: () => void
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsExpanded(!isExpanded)
  }

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100 cursor-pointer group"
    >
      <div className="p-5 space-y-4">
        {/* 标题 */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#FF4D4F] transition-colors line-clamp-1">
            {project.name}
          </h3>
        </div>

        {/* 基本信息 */}
        <div className="space-y-2.5 text-sm">
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

        {/* 展开内容 */}
        {isExpanded && (
          <div className="space-y-2.5 text-sm">
            {project.techStack && (
              <div className="flex items-center gap-2 text-gray-600">
                <Code size={14} className="text-[#FF4D4F] shrink-0" />
                <span className="line-clamp-1">{project.techStack}</span>
              </div>
            )}
            <div className="flex items-start gap-2 text-gray-600">
              <Star size={14} className="text-[#FF4D4F] shrink-0 mt-1" />
              <div 
                className="prose prose-sm max-w-none text-gray-600"
                dangerouslySetInnerHTML={{ __html: project.achievement }}
              />
            </div>
          </div>
        )}

        {/* 展开/收起按钮 */}
        <div className="flex justify-center pt-2">
          <button
            onClick={handleExpandClick}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#FF4D4F] transition-colors"
          >
            {isExpanded ? (
              <>
                <ChevronUp size={16} />
                <span>收起</span>
              </>
            ) : (
              <>
                <ChevronDown size={16} />
                <span>展开</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
} 