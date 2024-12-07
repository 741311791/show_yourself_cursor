"use client"

import React, { useState, useMemo } from "react"
import { Plus, Briefcase, MapPin, Calendar, ChevronRight, Pencil, Trash2 } from "lucide-react"
import { motion } from "motion/react"
import { Work } from "@/types/work"
import { WorkFormDetail } from "./WorkFormDetail"
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

// 动画配置
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

const mockWorks: Work[] = [
  {
    id: "1",
    company: "示例公司",
    location: "北京",
    startDate: "2020-01",
    endDate: "2023-12",
    position: "高级开发工程师",
    photo: null,
    projects: [],
    customFields: [],
    summary: ""
  }
]

export function WorkTimeline() {
  const [works, setWorks] = useState<Work[]>(mockWorks)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const sortedWorks = useMemo(() => {
    return [...works].sort((a, b) => {
      if (!a.startDate) return 1
      if (!b.startDate) return -1
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    })
  }, [works])

  const handleAddWork = () => {
    const newWork: Work = {
      id: Math.random().toString(),
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      position: "",
      photo: null,
      projects: [],
      customFields: [],
      summary: ""
    }
    setWorks(prev => [...prev, newWork])
    setSelectedId(newWork.id)
  }

  const handleSaveWork = (updatedWork: Work) => {
    setWorks(prev => 
      prev.map(work => work.id === selectedId ? updatedWork : work)
    )
  }

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true)
      // TODO: 调用删除工作经历 API
      await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟 API 调用
      
      // TODO: 重新获取工作经历列表
      setWorks(prev => prev.filter(work => work.id !== id))
      setDeleteId(null)
    } catch (error) {
      console.error('删除失败:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  // 如果选中了某个工作经历，显示详情编辑页面
  if (selectedId) {
    const work = works.find(w => w.id === selectedId)
    if (!work) return null

    return (
      <WorkFormDetail
        work={work}
        onSave={handleSaveWork}
        onCancel={() => setSelectedId(null)}
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

      {/* 工作经历列表 */}
      <div className="space-y-8">
        {sortedWorks.map((work) => (
          <ContextMenu key={work.id}>
            <ContextMenuTrigger>
              <motion.div
                variants={item}
                onClick={() => setSelectedId(work.id)}
                className="relative flex items-start gap-6 group cursor-pointer"
              >
                {/* 时间线节点 */}
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF4D4F] to-[#FF7875] flex items-center justify-center shadow-md shadow-red-200/50 transform group-hover:scale-110 transition-transform">
                    <Briefcase size={20} className="text-white" />
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
                            {work.company}
                          </h3>
                          <ChevronRight 
                            size={18} 
                            className="text-gray-400 group-hover:text-[#FF4D4F] transform group-hover:translate-x-1 transition-all shrink-0" 
                          />
                        </div>
                        <div className="space-y-2.5 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin size={14} className="text-[#FF4D4F] shrink-0" />
                            <span className="line-clamp-1">{work.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar size={14} className="text-[#FF4D4F] shrink-0" />
                            <span>{work.startDate} - {work.endDate}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Briefcase size={14} className="text-[#FF4D4F] shrink-0" />
                            <span className="font-medium line-clamp-1">{work.position}</span>
                          </div>
                        </div>
                      </div>

                      {/* 图片部分 */}
                      {work.photo ? (
                        <div className="relative flex-1">
                          <Image
                            src={work.photo}
                            alt={work.company}
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
                onClick={() => setSelectedId(work.id)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Pencil size={14} />
                <span>编辑</span>
              </ContextMenuItem>
              <ContextMenuItem
                onClick={() => setDeleteId(work.id)}
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
          onClick={handleAddWork}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#FF4D4F] to-[#FF7875] rounded-lg hover:shadow-lg hover:shadow-red-200/50 transform hover:-translate-y-0.5 transition-all"
        >
          <Plus size={18} />
          <span>添加工作经历</span>
        </button>
      </motion.div>

      {/* 删除确认对话框 */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除这条工作经历吗？此操作无法撤销。
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