"use client"

import Image from "next/image"
import { MoreVertical, FileEdit, Eye } from "lucide-react"

interface ResumeCardProps {
  resume: {
    id: string
    title: string
    lastUpdated: string
    thumbnail: string
  }
  viewMode: 'grid' | 'list'
}

export function ResumeCard({ resume, viewMode }: ResumeCardProps) {
  if (viewMode === 'list') {
    return (
      <div className="group relative bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
        <div className="flex items-center p-3">
          <div className="relative w-[60px] h-[85px] flex-shrink-0">
            <Image
              src={resume.thumbnail}
              alt={resume.title}
              fill
              className="object-cover rounded-lg"
              sizes="60px"
              priority
            />
          </div>
          
          <div className="ml-3 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm">{resume.title}</h3>
              <div className="flex items-center gap-1">
                <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600">
                  <FileEdit size={16} />
                </button>
                <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600">
                  <Eye size={16} />
                </button>
                <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              最后更新: {resume.lastUpdated}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="group relative bg-white rounded-md shadow-sm border hover:shadow-md transition-shadow">
      <div className="relative w-full pt-[141.4%] overflow-hidden rounded-t-md bg-gray-50">
        <Image
          src={resume.thumbnail}
          alt={resume.title}
          fill
          className="object-cover absolute inset-0 hover:scale-105 transition-transform duration-300"
          sizes="(min-width: 1536px) 12.5vw, (min-width: 1280px) 16.67vw, (min-width: 768px) 25vw, 33.33vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      <div className="p-2">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-xs truncate flex-1">{resume.title}</h3>
          <button className="p-0.5 rounded-full hover:bg-gray-100 ml-1 text-gray-600">
            <MoreVertical size={14} />
          </button>
        </div>
        <p className="text-[10px] text-gray-500 mt-0.5">
          最后更新: {resume.lastUpdated}
        </p>
      </div>
      
      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
        <button className="px-2 py-1 bg-white rounded-md text-xs font-medium hover:bg-gray-50 transition-colors">
          编辑
        </button>
        <button className="px-2 py-1 bg-white rounded-md text-xs font-medium hover:bg-gray-50 transition-colors">
          预览
        </button>
      </div>
    </div>
  )
} 