"use client"

import React, { useState, useMemo, useEffect } from "react"
import { LucideIcon } from "lucide-react"
import { Plus, Loader2 } from "lucide-react"
import { motion } from "motion/react"
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
import { cn } from "@/lib/utils"
import { Alert } from "@/components/shared/Alert"
import { TimelineList, type TimelineItem } from "./TimelineList"

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

interface TimelineBaseProps<T> {
  // 基础配置
  apiEndpoint: string // API 端点路径
  addButtonText: string // 添加按钮文本
  loadingText: string // 加载提示文本
  emptyText: string // 空数据提示文本
  
  // 数据转换函数
  transformToTimelineItems: (items: T[]) => TimelineItem[]
  
  // 表单组件
  FormComponent: React.ComponentType<{
    data: T
    onSave: (data: T) => Promise<void>
    onCancel: () => void
  }>

  // 列表配置
  icon: React.ElementType
  deleteDialogTitle?: string
  deleteDialogDescription?: string

  // 默认值
  defaultValue: T

  // 排序函数
  sortItems?: (items: T[]) => T[]
}

export function TimelineBase<T extends { id?: string }>({
  apiEndpoint,
  addButtonText,
  loadingText,
  emptyText,
  transformToTimelineItems,
  FormComponent,
  icon,
  deleteDialogTitle,
  deleteDialogDescription,
  defaultValue,
  sortItems
}: TimelineBaseProps<T>) {
  const [items, setItems] = useState<T[]>([])
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

  // 获取列表数据
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const response = await fetch(apiEndpoint)
        if (!response.ok) throw new Error('获取数据失败')
        
        const data = await response.json()
        setItems(data)

        if (data.length === 0) {
          showAlert('info', emptyText)
        }
      } catch (error) {
        console.error('获取数据失败:', error)
        setError('获取数据失败，请刷新页面重试')
        showAlert('error', '获取数据失败，请刷新页面重试')
      } finally {
        setIsLoading(false)
      }
    }

    fetchItems()
  }, [apiEndpoint, emptyText])

  // 排序数据
  const sortedItems = useMemo(() => {
    if (sortItems) {
      return sortItems(items)
    }
    return items
  }, [items, sortItems])

  // 添加新项目
  const handleAdd = async () => {
    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(defaultValue)
      })

      if (!response.ok) throw new Error('创建失败')

      const newItem = await response.json()
      setItems(prev => [...prev, newItem])
      setSelectedId(newItem.id)
      showAlert('success', '创建成功')
    } catch (error) {
      console.error('创建失败:', error)
      showAlert('error', '创建失败，请重试')
    }
  }

  // 保存项目
  const handleSave = async (updatedItem: T) => {
    setItems(prev => 
      prev.map(item => item.id === updatedItem.id ? updatedItem : item)
    )
    setSelectedId(null)
    showAlert('success', '保存成功')
  }

  // 删除项目
  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true)
      const response = await fetch(`${apiEndpoint}/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('删除失败')

      setItems(prev => prev.filter(item => item.id !== id))
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
      <Alert
        show={alertState.show}
        type={alertState.type}
        message={alertState.message}
      />

      {/* 删除确认对话框 */}
      <AlertDialog open={!!deleteId}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              此操作不可撤销，确定要删除吗？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => setDeleteId(null)}
              disabled={isDeleting}
            >
              取消
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              disabled={isDeleting}
              className={cn(
                "bg-destructive hover:bg-destructive/90",
                isDeleting && "opacity-50 cursor-not-allowed"
              )}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  删除中...
                </>
              ) : (
                "确认删除"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">{loadingText}</p>
          </div>
        </div>
      ) : error ? (
        <div className="space-y-6">
          <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
          <TimelineList 
            items={transformToTimelineItems(sortedItems)}
            icon={icon as LucideIcon}
            onEdit={setSelectedId}
            onDelete={setDeleteId}
            isDeleting={isDeleting}
            deleteId={deleteId}
            onDeleteConfirm={handleDelete}
            onDeleteCancel={() => setDeleteId(null)}
            deleteDialogTitle={deleteDialogTitle}
            deleteDialogDescription={deleteDialogDescription}
          />
        </div>
      ) : selectedId ? (
        <FormComponent
          data={items.find(item => item.id === selectedId)!}
          onSave={handleSave}
          onCancel={() => setSelectedId(null)}
        />
      ) : (
        <>
          <TimelineList 
            items={transformToTimelineItems(sortedItems)}
            icon={icon as LucideIcon}
            onEdit={setSelectedId}
            onDelete={setDeleteId}
            isDeleting={isDeleting}
            deleteId={deleteId}
            onDeleteConfirm={handleDelete}
            onDeleteCancel={() => setDeleteId(null)}
            deleteDialogTitle={deleteDialogTitle}
            deleteDialogDescription={deleteDialogDescription}
          />
          
          {/* 添加按钮 */}
          <motion.div 
            className="mt-16 text-center"
            variants={item}
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
              {addButtonText}
            </Button>
          </motion.div>
        </>
      )}
    </>
  )
}