"use client"

import React, { useState, useMemo, useEffect } from "react"
import { Plus, Briefcase, MapPin, Calendar, ChevronRight, Pencil, Trash2, Loader2 } from "lucide-react"
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
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

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

interface WorkListProps {
  works: Work[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  isDeleting: boolean
  deleteId: string | null
  onDeleteConfirm: (id: string) => Promise<void>
  onDeleteCancel: () => void
}

function WorkList({
  works,
  onEdit,
  onDelete,
  isDeleting,
  deleteId,
  onDeleteConfirm,
  onDeleteCancel
}: WorkListProps) {
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
        animate={{ 
          background: `linear-gradient(180deg, 
            hsl(var(--primary)) 0%,
            hsl(var(--primary) / 0.8) 50%,
            hsl(var(--primary) / 0.3) 100%
          )`
        }}
        transition={{ duration: 1 }}
      />

      {/* 工作经历列表 */}
      <div className="flex flex-col">
        {works.map((work, index) => (
          <React.Fragment key={work.id}>
            {index > 0 && <div className="h-4" />}
            
            <ContextMenu>
              <ContextMenuTrigger>
                <motion.div
                  variants={item}
                  onClick={() => onEdit(work.id)}
                  className="relative flex items-start gap-6 group cursor-pointer"
                >
                  {/* 时间线节点 */}
                  <div className="relative">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center shadow-lg",
                      "bg-gradient-to-br from-primary to-primary/80",
                      "dark:from-primary/90 dark:to-primary/70",
                      "transform group-hover:scale-110 transition-transform",
                      "shadow-primary/20 dark:shadow-primary/40",
                      "relative z-10"
                    )}>
                      <Briefcase size={20} className="text-primary-foreground" />
                    </div>
                    {/* 节点到卡片的连接线 */}
                    <div className="absolute -right-3 top-1/2 w-3 h-[2px] bg-primary" />
                  </div>

                  {/* 内容卡片 */}
                  <Card className={cn(
                    "flex-1 group-hover:transform group-hover:-translate-y-1 transition-all duration-200",
                    "group-hover:shadow-md"
                  )}>
                    <CardContent className="p-0">
                      <div className="flex h-full">
                        {/* 文字内容 */}
                        <div className="flex-[2] p-5">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className={cn(
                              "text-lg font-bold text-foreground",
                              "group-hover:text-primary transition-colors line-clamp-1"
                            )}>
                              {work.company}
                            </h3>
                            <ChevronRight 
                              size={18} 
                              className={cn(
                                "text-muted-foreground",
                                "group-hover:text-primary transform group-hover:translate-x-1 transition-all shrink-0"
                              )}
                            />
                          </div>
                          <div className="space-y-2.5 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MapPin size={14} className="text-primary shrink-0" />
                              <span className="line-clamp-1">{work.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar size={14} className="text-primary shrink-0" />
                              <span>{work.startDate} - {work.endDate}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Briefcase size={14} className="text-primary shrink-0" />
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
                            <div className="absolute inset-0 bg-gradient-to-r from-background/20 to-transparent mix-blend-overlay" />
                            <div className="absolute inset-0 bg-gradient-to-l from-background/20 to-transparent" />
                          </div>
                        ) : (
                          <div className="relative flex-1 bg-gradient-to-r from-muted to-muted/50" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem onClick={() => onEdit(work.id)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  <span>编辑</span>
                </ContextMenuItem>
                <ContextMenuItem
                  onClick={() => onDelete(work.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>删除</span>
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          </React.Fragment>
        ))}
      </div>

      {/* 删除确认对话框 */}
      <AlertDialog open={!!deleteId} onOpenChange={onDeleteCancel}>
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
              onClick={() => deleteId && onDeleteConfirm(deleteId)}
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

export function WorkTimeline() {
  const [works, setWorks] = useState<Work[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 获取工作经历列表
  useEffect(() => {
    const fetchWorks = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // TODO: 替换为实际的 API 调用
        // const response = await fetch('/api/works')
        // const data = await response.json()
        
        // 模拟 API 调用
        await new Promise(resolve => setTimeout(resolve, 1000))
        const data: Work[] = []

        // 如果返回的数据为空，使用 mock 数据
        setWorks(data.length > 0 ? data : mockWorks)
      } catch (error) {
        console.error('获取工作经历失败:', error)
        setError('获取工作经历失败，请刷新页面重试')
        // 发生错误时也使用 mock 数据
        setWorks(mockWorks)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWorks()
  }, [])

  // 根据开始时间排序的工作经历
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
      await new Promise(resolve => setTimeout(resolve, 1000))
      setWorks(prev => prev.filter(work => work.id !== id))
      setDeleteId(null)
    } catch (error) {
      console.error('删除失败:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  // 如果有错误但使用了 mock 数据，显示错误提示
  if (error) {
    return (
      <div className="space-y-6">
        <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
        <WorkList 
          works={sortedWorks}
          onEdit={setSelectedId}
          onDelete={setDeleteId}
          isDeleting={isDeleting}
          deleteId={deleteId}
          onDeleteConfirm={handleDelete}
          onDeleteCancel={() => setDeleteId(null)}
        />
      </div>
    )
  }

  // 如果正在加载，显示加载状态
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">加载工作经历...</p>
        </div>
      </div>
    )
  }

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
    <>
      <WorkList 
        works={sortedWorks}
        onEdit={setSelectedId}
        onDelete={setDeleteId}
        isDeleting={isDeleting}
        deleteId={deleteId}
        onDeleteConfirm={handleDelete}
        onDeleteCancel={() => setDeleteId(null)}
      />
      
      {/* 添加按钮 */}
      <motion.div 
        className="mt-16 text-center"
        variants={item}
      >
        <Button
          onClick={handleAddWork}
          className={cn(
            "gap-2 bg-gradient-to-r from-primary to-primary/80",
            "hover:shadow-lg hover:shadow-primary/20",
            "dark:from-primary/90 dark:to-primary/70",
            "dark:hover:shadow-primary/40",
            "transform hover:-translate-y-0.5 transition-all"
          )}
        >
          <Plus className="h-4 w-4" />
          添加工作经历
        </Button>
      </motion.div>
    </>
  )
} 