"use client"

import React, { useState, useMemo } from "react"
import { Plus, GraduationCap, MapPin, Calendar, ChevronRight, Pencil, Trash2 } from "lucide-react"
import { motion } from "motion/react"
import { Education } from "@/types/education"
import { EducationFormDetail } from "../education/EducationFormDetail"
import Image from "next/image"
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/shared/ContextMenu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/shared/AlertDialog"

const mockEducations: Education[] = [
  {
    id: "1",
    school: "示例大学",
    location: "北京",
    startDate: "2019-09",
    endDate: "2023-06",
    major: "计算机科学",
    courses: "数据结构、算法",
    gpa: "3.8",
    degree: "学士",
    photo: null,
    customFields: [],
    summary: ""
  }
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export function EducationTimeline() {
  const [educations, setEducations] = useState<Education[]>(mockEducations)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // 根据开始时间排序的教育经历
  const sortedEducations = useMemo(() => {
    return [...educations].sort((a, b) => {
      // 将空日期排在最后
      if (!a.startDate) return 1
      if (!b.startDate) return -1
      // 按时间降序排序（最近的在前）
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    })
  }, [educations])

  const handleAddEducation = () => {
    const newEducation: Education = {
      id: Math.random().toString(),
      school: "",
      location: "",
      startDate: "",
      endDate: "",
      major: "",
      courses: "",
      gpa: "",
      degree: "",
      photo: null,
      customFields: [],
      summary: ""
    }
    setEducations(prev => [...prev, newEducation])
    setSelectedId(newEducation.id)
  }

  const handleSaveEducation = (updatedEducation: Education) => {
    setEducations(prev => 
      prev.map(edu => edu.id === selectedId ? updatedEducation : edu)
    )
  }

  const handleReturn = () => {
    setSelectedId(null)
  }

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true)
      // TODO: 调用删除教育经历 API
      await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟 API 调用
      
      // TODO: 重新获取教育经历列表
      setEducations(prev => prev.filter(edu => edu.id !== id))
      setDeleteId(null)
    } catch (error) {
      console.error('删除失败:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  if (selectedId) {
    const education = educations.find(edu => edu.id === selectedId)
    if (!education) return null

    return (
      <EducationFormDetail
        education={education}
        onSave={handleSaveEducation}
        onCancel={handleReturn}
      />
    )
  }

  return (
    <motion.div 
      className="relative max-w-3xl mx-auto"
      initial="hidden"
      animate="show"
      variants={container}
    >
      {/* 时间线 */}
      <motion.div 
        className="absolute left-6 top-0 bottom-0 w-[2px]"
        initial={{ background: "linear-gradient(to bottom, transparent, transparent)" }}
        animate={{ background: "linear-gradient(to bottom, #FF4D4F, rgba(255, 77, 79, 0.3))" }}
        transition={{ duration: 1 }}
      />

      {/* 教育经历列表 */}
      <div className="space-y-8">
        {sortedEducations.map((education) => (
          <ContextMenu key={education.id}>
            <ContextMenuTrigger>
              <motion.div
                variants={item}
                onClick={() => setSelectedId(education.id)}
                className="relative flex items-start gap-6 group cursor-pointer"
              >
                {/* 时间线节点 */}
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF4D4F] to-[#FF7875] flex items-center justify-center shadow-md shadow-red-200/50 transform group-hover:scale-110 transition-transform">
                    <GraduationCap size={20} className="text-white" />
                  </div>
                  <div className="absolute -right-3 top-1/2 w-3 h-[2px] bg-[#FF4D4F]" />
                </div>

                {/* 内容卡片 */}
                <div className="flex-1 group-hover:transform group-hover:-translate-y-1 transition-all duration-200">
                  <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100">
                    <div className="flex h-full">
                      {/* 文字内容 */}
                      <div className="flex-[2] p-5">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#FF4D4F] transition-colors line-clamp-1">
                            {education.school}
                          </h3>
                          <ChevronRight 
                            size={18} 
                            className="text-gray-400 group-hover:text-[#FF4D4F] transform group-hover:translate-x-1 transition-all shrink-0" 
                          />
                        </div>
                        <div className="space-y-2.5 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin size={14} className="text-[#FF4D4F] shrink-0" />
                            <span className="line-clamp-1">{education.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar size={14} className="text-[#FF4D4F] shrink-0" />
                            <span>{education.startDate} - {education.endDate}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <GraduationCap size={14} className="text-[#FF4D4F] shrink-0" />
                            <div className="flex items-center gap-1 min-w-0">
                              <span className="font-medium line-clamp-1">{education.major}</span>
                              <span className="text-gray-400 shrink-0">·</span>
                              <span className="line-clamp-1">{education.degree}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 图片部分 */}
                      {education.photo ? (
                        <div className="relative flex-1">
                          <Image
                            src={education.photo}
                            alt={education.school}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent mix-blend-overlay" />
                          <div className="absolute inset-0 bg-gradient-to-l from-black/20 to-transparent" />
                        </div>
                      ) : (
                        <div className="relative flex-1 bg-gradient-to-r from-gray-50 to-gray-100" />
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem
                onClick={() => setSelectedId(education.id)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Pencil size={14} />
                <span>编辑</span>
              </ContextMenuItem>
              <ContextMenuItem
                onClick={() => setDeleteId(education.id)}
                className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <Trash2 size={14} />
                <span>删除</span>
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        ))}
      </div>

      {/* 添加按钮 */}
      <motion.div 
        className="mt-10 text-center"
        variants={item}
      >
        <button
          onClick={handleAddEducation}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#FF4D4F] to-[#FF7875] rounded-lg hover:shadow-lg hover:shadow-red-200/50 transform hover:-translate-y-0.5 transition-all"
        >
          <Plus size={18} />
          <span>添加教育经历</span>
        </button>
      </motion.div>

      {/* 删除确认对话框 */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除这条教育经历吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              disabled={isDeleting}
              className={isDeleting ? 'opacity-50 cursor-not-allowed' : ''}
            >
              {isDeleting ? '删除中...' : '确认删除'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  )
} 