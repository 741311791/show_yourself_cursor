"use client"

import React from "react"
import { motion } from "motion/react"
import { ChevronRight, Pencil, Trash2, LucideIcon } from "lucide-react"
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
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export interface TimelineItem {
  id: string
  title: string
  cover?: string | null
  details: {
    icon: LucideIcon
    content: React.ReactNode
  }[]
}

interface TimelineListProps {
  items: TimelineItem[]
  icon: LucideIcon
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  isDeleting: boolean
  deleteId: string | null
  onDeleteConfirm: (id: string) => Promise<void>
  onDeleteCancel: () => void
  deleteDialogTitle?: string
  deleteDialogDescription?: string
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

export const timelineItemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export function TimelineList({
  items,
  icon: ItemIcon,
  onEdit,
  onDelete,
  isDeleting,
  deleteId,
  onDeleteConfirm,
  onDeleteCancel,
  deleteDialogTitle = "确认删除",
  deleteDialogDescription = "确定要删除这条记录吗？此操作无法撤销。"
}: TimelineListProps) {
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

      {/* 列表 */}
      <div className="flex flex-col">
        {items.map((item, index) => (
          <React.Fragment key={item.id}>
            {index > 0 && <div className="h-4" />}
            
            <ContextMenu>
              <ContextMenuTrigger>
                <motion.div
                  variants={timelineItemVariants}
                  onClick={() => onEdit(item.id)}
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
                      <ItemIcon size={20} className="text-primary-foreground" />
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
                              {item.title}
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
                            {item.details.map((detail, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-muted-foreground">
                                <detail.icon size={14} className="text-primary shrink-0" />
                                {detail.content}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 图片部分 */}
                        {item.cover ? (
                          <div className="relative flex-1 border-l border-border">
                            <Image
                              src={item.cover}
                              alt={item.title}
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
                <ContextMenuItem onClick={() => onEdit(item.id)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  <span>编辑</span>
                </ContextMenuItem>
                <ContextMenuItem
                  onClick={() => onDelete(item.id)}
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
            <AlertDialogTitle>{deleteDialogTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteDialogDescription}
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