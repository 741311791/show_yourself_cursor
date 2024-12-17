"use client"

import React, { useState, useMemo, useEffect } from "react"
import { Plus, FileText, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { CustomBlockItem, CustomBlock } from "@/types/custom"
import { CustomBlockFormDetail } from "@/components/timeline/custom/CustomBlockFormDetail"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { TimelineList, type TimelineItem } from "../shared/TimelineList"

interface CustomBlockTimelineProps {
  block: CustomBlock
}

export function CustomBlockTimeline({ block }: CustomBlockTimelineProps) {
  const [items, setItems] = useState<CustomBlockItem[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true)
        setError(null)
        // TODO: 调用API获取据
        await new Promise(resolve => setTimeout(resolve, 1000))
        const data: CustomBlockItem[] = []
        setItems(data)
      } catch (error) {
        console.error('获取数据失败:', error)
        setError('获取数据失败，请刷新页面重试')
      } finally {
        setIsLoading(false)
      }
    }

    fetchItems()
  }, [])

  const timelineItems: TimelineItem[] = useMemo(() => {
    return items.map(item => ({
      id: item.id,
      title: item.fields[block.fields[0]?.id] || '未命名', // 使用第一个字段作为标题
      cover: item.photos[0] || null,
      details: block.fields.slice(1).map(field => ({
        icon: FileText,
        content: <span>{item.fields[field.id]}</span>
      }))
    }))
  }, [items, block.fields])

  const handleAdd = () => {
    const newItem: CustomBlockItem = {
      id: Math.random().toString(),
      blockId: block.id,
      fields: {},
      customFields: [],
      summary: "",
      photos: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setItems(prev => [...prev, newItem])
    setSelectedId(newItem.id)
  }

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true)
      // TODO: 调用删除API
      await new Promise(resolve => setTimeout(resolve, 1000))
      setItems(prev => prev.filter(i => i.id !== id))
      setDeleteId(null)
    } catch (error) {
      console.error('删除失败:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  // ... 其他处理函数

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">加载数据...</p>
        </div>
      </div>
    )
  }

  if (selectedId) {
    const item = items.find(i => i.id === selectedId)
    if (!item) return null

    return (
      <CustomBlockFormDetail
        item={item}
        block={block}
        onSave={(updatedItem) => {
          setItems(prev => prev.map(i => i.id === selectedId ? updatedItem : i))
        }}
        onCancel={() => setSelectedId(null)}
      />
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
        <TimelineList 
          items={timelineItems}
          icon={FileText}
          onEdit={setSelectedId}
          onDelete={setDeleteId}
          isDeleting={isDeleting}
          deleteId={deleteId}
          onDeleteConfirm={handleDelete}
          onDeleteCancel={() => setDeleteId(null)}
          deleteDialogTitle="确认删除"
          deleteDialogDescription="确定要删除这条记录吗？此操作无法撤销。"
        />
      </div>
    )
  }

  return (
    <>
      <TimelineList 
        items={timelineItems}
        icon={FileText}
        onEdit={setSelectedId}
        onDelete={setDeleteId}
        isDeleting={isDeleting}
        deleteId={deleteId}
        onDeleteConfirm={async (id) => {
          try {
            setIsDeleting(true)
            // TODO: 调用删除API
            await new Promise(resolve => setTimeout(resolve, 1000))
            setItems(prev => prev.filter(i => i.id !== id))
            setDeleteId(null)
          } catch (error) {
            console.error('删除失败:', error)
          } finally {
            setIsDeleting(false)
          }
        }}
        onDeleteCancel={() => setDeleteId(null)}
        deleteDialogTitle="确认删除"
        deleteDialogDescription="确定要删除这条记录吗？此操作无法撤销。"
      />
      
      <motion.div 
        className="mt-16 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Button
          onClick={handleAdd}
          className={cn(
            "gap-2 bg-gradient-to-r from-primary to-primary/80",
            "hover:shadow-lg hover:shadow-primary/20",
            "dark:from-primary/90 dark:to-primary/70",
            "dark:hover:shadow-primary/40",
            "transform hover:-translate-y-0.5 transition-all"
          )}
        >
          <Plus className="h-4 w-4" />
          新增
        </Button>
      </motion.div>
    </>
  )
} 