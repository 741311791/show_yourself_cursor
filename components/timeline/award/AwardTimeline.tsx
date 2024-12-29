"use client"

import React, { useState, useMemo, useEffect } from "react"
import { motion } from "motion/react"
import { 
  Plus, Medal, Calendar, Trophy,
  ChevronRight, Pencil, Trash2, Loader2 
} from "lucide-react"
import { Award } from "@/types/award"
import { AwardFormDetail } from "@/components/timeline/award/AwardFormDetail"
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

const mockAwards: Award[] = [
  {
    id: "1",
    name: "全国大学生创新创业大赛",
    level: "国家级",
    issuer: "教育部",
    acquireDate: "2023-06",
    photos: [],
    ranking: "一等奖",
    participants: "10000+",
    customFields: [],
    summary: ""
  }
]

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

interface AwardListProps {
  awards: Award[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  isDeleting: boolean
  deleteId: string | null
  onDeleteConfirm: (id: string) => Promise<void>
  onDeleteCancel: () => void
}

function AwardList({
  awards,
  onEdit,
  onDelete,
  isDeleting,
  deleteId,
  onDeleteConfirm,
  onDeleteCancel
}: AwardListProps) {
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

      {/* 获奖列表 */}
      <div className="flex flex-col">
        {awards.map((award, index) => (
          <React.Fragment key={award.id}>
            {index > 0 && <div className="h-4" />}
            
            <ContextMenu>
              <ContextMenuTrigger>
                <motion.div
                  variants={item}
                  onClick={() => onEdit(award.id)}
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
                      <Trophy size={20} className="text-primary-foreground" />
                    </div>
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
                              {award.name}
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
                              <Medal size={14} className="text-primary shrink-0" />
                              <span className="line-clamp-1">{award.level} · {award.ranking}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar size={14} className="text-primary shrink-0" />
                              <span>{award.acquireDate}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Trophy size={14} className="text-primary shrink-0" />
                              <span className="line-clamp-1">{award.issuer}</span>
                            </div>
                          </div>
                        </div>

                        {/* 证书图片 */}
                        {award.photos.length > 0 ? (
                          <div className="relative flex-1 border-l border-border">
                            <Image
                              src={award.photos[0]}
                              alt={award.name}
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
                <ContextMenuItem onClick={() => onEdit(award.id)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  <span>编辑</span>
                </ContextMenuItem>
                <ContextMenuItem
                  onClick={() => onDelete(award.id)}
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
              确定要删除这条获奖记录吗？此操作无法撤销。
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

export function AwardTimeline() {
  const [awards, setAwards] = useState<Award[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 获取获奖列表
  useEffect(() => {
    const fetchAwards = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // TODO: 替换为实际的 API 调用
        await new Promise(resolve => setTimeout(resolve, 1000))
        const data: Award[] = []
        
        setAwards(data.length > 0 ? data : mockAwards)
      } catch (error) {
        console.error('获取获奖记录失败:', error)
        setError('获取获奖记录失败，请刷新页面重试')
        setAwards(mockAwards)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAwards()
  }, [])

  // 根据获取时间排序
  const sortedAwards = useMemo(() => {
    return [...awards].sort((a, b) => {
      if (!a.acquireDate) return 1
      if (!b.acquireDate) return -1
      return new Date(b.acquireDate).getTime() - new Date(a.acquireDate).getTime()
    })
  }, [awards])

  const handleAddAward = () => {
    const newAward: Award = {
      id: Math.random().toString(),
      name: "",
      level: "",
      issuer: "",
      acquireDate: "",
      photos: [],
      ranking: "",
      participants: "",
      customFields: [],
      summary: ""
    }
    setAwards(prev => [...prev, newAward])
    setSelectedId(newAward.id)
  }

  const handleSaveAward = (updatedAward: Award) => {
    setAwards(prev => 
      prev.map(award => award.id === selectedId ? updatedAward : award)
    )
  }

  const handleReturn = () => {
    setSelectedId(null)
  }

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setAwards(prev => prev.filter(award => award.id !== id))
      setDeleteId(null)
    } catch (error) {
      console.error('删除失败:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">加载获奖记录...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
        <AwardList 
          awards={sortedAwards}
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

  if (selectedId) {
    const award = awards.find(award => award.id === selectedId)
    if (!award) return null

    return (
      <AwardFormDetail
        award={award}
        onSave={handleSaveAward}
        onCancel={handleReturn}
      />
    )
  }

  return (
    <>
      <AwardList 
        awards={sortedAwards}
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
          onClick={handleAddAward}
          className={cn(
            "gap-2 bg-gradient-to-r from-primary to-primary/80",
            "hover:shadow-lg hover:shadow-primary/20",
            "dark:from-primary/90 dark:to-primary/70",
            "dark:hover:shadow-primary/40",
            "transform hover:-translate-y-0.5 transition-all"
          )}
        >
          <Plus className="h-4 w-4" />
          添加获奖记录
        </Button>
      </motion.div>
    </>
  )
} 