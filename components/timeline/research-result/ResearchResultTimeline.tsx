"use client"

import React, { useState, useMemo, useEffect } from "react"
import { Plus, BookMarked, MapPin, Calendar, ChevronRight, Pencil, Trash2, Loader2, User } from "lucide-react"
import { motion } from "motion/react"
import { ResearchResult, defaultResearchResult } from "@/types/research"
import { ResearchResultFormDetail } from "@/components/timeline/research-result/ResearchResultFormDetail"
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
import Image from "next/image"
import { Alert } from "@/components/shared/Alert"

interface ResearchResultListProps {
  results: ResearchResult[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  isDeleting: boolean
  deleteId: string | null
  onDeleteConfirm: (id: string) => Promise<void>
  onDeleteCancel: () => void
}

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

function ResearchResultList({
  results,
  onEdit,
  onDelete,
  isDeleting,
  deleteId,
  onDeleteConfirm,
  onDeleteCancel
}: ResearchResultListProps) {
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

      {/* 研究成果列表 */}
      <div className="flex flex-col">
        {results.map((result, index) => (
          <React.Fragment key={result.id}>
            {index > 0 && <div className="h-4" />}
            
            <ContextMenu>
              <ContextMenuTrigger>
                <motion.div
                  variants={item}
                  onClick={() => onEdit(result.id ?? '')}
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
                      <BookMarked size={20} className="text-primary-foreground" />
                    </div>
                    {/* 节点到卡片的连接线 */}
                    <div className="absolute -right-3 top-1/2 w-3 h-[2px] bg-primary" />
                  </div>

                  {/* 内容卡片 */}
                  <Card className={cn(
                    "flex-1 overflow-hidden",
                    "group-hover:transform group-hover:-translate-y-1 transition-all duration-200",
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
                              {result.name}
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
                              <span className="line-clamp-1">{result.type}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar size={14} className="text-primary shrink-0" />
                              <span>{result.date}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <User size={14} className="text-primary shrink-0" />
                              <span className="font-medium line-clamp-1">{result.role}</span>
                            </div>
                          </div>
                        </div>

                        {/* 图片部分 */}
                        {result.photos && result.photos.length > 0 ? (
                          <div className="relative flex-1 border-l border-border">
                            <Image
                              src={result.photos[0]}
                              alt={result.name ?? ''}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-background/20 to-transparent mix-blend-overlay" />
                            <div className="absolute inset-0 bg-gradient-to-l from-background/20 to-transparent" />
                          </div>
                        ) : (
                          <div className="relative flex-1 border-l border-border bg-gradient-to-r from-muted to-muted/50" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem onClick={() => onEdit(result.id ?? '')}>
                  <Pencil className="mr-2 h-4 w-4" />
                  <span>编辑</span>
                </ContextMenuItem>
                <ContextMenuItem
                  onClick={() => onDelete(result.id ?? '')}
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
              确定要删除这条科研经历吗？此操作无法撤销。
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

export function ResearchResultTimeline() {
  const [researches, setResearches] = useState<ResearchResult[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [alertState, setAlertState] = useState<{
    show: boolean
    type: 'success' | 'error' | 'info'
    message: string
  }>({
    show: false,
    type: 'success',
    message: ''
  })

  const showAlert = (type: 'success' | 'error' | 'info', message: string) => {
    setAlertState({ show: true, type, message })
    setTimeout(() => {
      setAlertState(prev => ({ ...prev, show: false }))
    }, 3000)
  }

  // 获取研究经历列表
  useEffect(() => {
    const fetchResearches = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const response = await fetch('/api/research-result')
        if (!response.ok) {
          throw new Error('获取研究成果失败')
        }
        
        const data = await response.json()
        setResearches(data)

        if (data.length === 0) {
          showAlert('info', '暂无研究成果，快来添加吧~')
        } else {
          showAlert('success', '成功获取研究成果')
        }
      } catch (error) {
        console.error('获取研究成果失败:', error)
        setError('获取研究成果失败，请刷新页面重试')
        showAlert('error', '获取研究成果失败，请刷新页面重试')
      } finally {
        setIsLoading(false)
      }
    }

    fetchResearches()
  }, [])

  // 根据开始时间排序的科研经历
  const sortedResearches = useMemo(() => {
    return [...researches].sort((a, b) => {
      if (!a.date) return 1
      if (!b.date) return -1
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
  }, [researches])

  const handleAddResearchResult = async () => {
    try {
      const response = await fetch('/api/research-result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(defaultResearchResult)
      })

      if (!response.ok) {
        throw new Error('创建研究成果失败')
      }

      const newResearch = await response.json()
      setResearches(prev => [...prev, newResearch])
      setSelectedId(newResearch.id)
      showAlert('success', '已创建新的研究成果')
    } catch (error) {
      console.error('创建研究成果失败:', error)
      showAlert('error', '创建研究成果失败，请重试')
    }
  }

  const handleSaveResearchResult = (updatedResearch: ResearchResult) => {
    setResearches(prev => 
      prev.map(research => research.id === updatedResearch.id ? updatedResearch : research)
    )
    setSelectedId(null)
    showAlert('success', '保存成功')
  }

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true)
      
      const response = await fetch(`/api/research-result/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('删除研究成果失败')
      }

      setResearches(prev => prev.filter(research => research.id !== id))
      setDeleteId(null)
      showAlert('success', '删除成功')
    } catch (error) {
      console.error('删除失败:', error)
      showAlert('error', '删除失败，请重试')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      {/* Alert 组件 */}
      <Alert
        show={alertState.show}
        type={alertState.type}
        message={alertState.message}
      />

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">加载研究成果...</p>
          </div>
        </div>
      ) : error ? (
        <div className="space-y-6">
          <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
          <ResearchResultList 
            results={sortedResearches}
            onEdit={setSelectedId}
            onDelete={setDeleteId}
            isDeleting={isDeleting}
            deleteId={deleteId}
            onDeleteConfirm={handleDelete}
            onDeleteCancel={() => setDeleteId(null)}
          />
        </div>
      ) : selectedId ? (
        <ResearchResultFormDetail
          result={researches.find(r => r.id === selectedId)!}
          onSave={handleSaveResearchResult}
          onCancel={() => setSelectedId(null)}
        />
      ) : (
        <>
          <ResearchResultList 
            results={sortedResearches}
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
              onClick={handleAddResearchResult}
              className={cn(
                "gap-2 bg-gradient-to-r from-primary to-primary/80",
                "hover:shadow-lg hover:shadow-primary/20",
                "dark:from-primary/90 dark:to-primary/70",
                "dark:hover:shadow-primary/40",
                "transform hover:-translate-y-0.5 transition-all"
              )}
            >
              <Plus className="h-4 w-4" />
              添加研究成果
            </Button>
          </motion.div>
        </>
      )}
    </>
  )
}