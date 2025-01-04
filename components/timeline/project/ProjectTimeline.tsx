"use client"

import React, { useState, useMemo, useEffect } from "react"
import { Plus, FileText, MapPin, Calendar, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { Project, defaultProject } from "@/types/project"
import { ProjectFormDetail } from "./ProjectFormDetail"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { TimelineList, type TimelineItem } from "../shared/TimelineList"
import { Alert } from "@/components/shared/Alert"
import { v4 as uuidv4 } from "uuid"

export function ProjectTimeline() {
  const [projects, setProjects] = useState<Project[]>([])
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

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const response = await fetch('/api/project')
        if (!response.ok) {
          throw new Error('获取项目经历失败')
        }
        
        const data = await response.json()
        setProjects(data)

        if (data.length === 0) {
          showAlert('info', '暂无项目经历，快来添加吧~')
        } else {
          showAlert('success', '成功获取项目经历')
        }
      } catch (error) {
        console.error('获取项目经历失败:', error)
        setError('获取项目经历失败，请刷新页面重试')
        showAlert('error', '获取项目经历失败，请刷新页面重试')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) => {
      if (!a.startDate) return 1
      if (!b.startDate) return -1
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    })
  }, [projects])

  const handleAddProject = async () => {
    try {
      const response = await fetch('/api/project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(defaultProject),
      })

      if (!response.ok) {
        throw new Error('创建项目经历失败')
      }

      const newProject = await response.json()
      setProjects(prev => [...prev, newProject])
      setSelectedId(newProject.id)
      showAlert('success', '已创建新的项目经历')
    } catch (error) {
      console.error('创建项目经历失败:', error)
      showAlert('error', '创建项目经历失败，请重试')
    }
  }

  const handleSaveProject = async (updatedProject: Project) => {
    try {
      const response = await fetch(`/api/project/${updatedProject.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProject),
      })

      if (!response.ok) {
        throw new Error('更新项目经历失败')
      }

      const savedProject = await response.json()
      setProjects(prev => 
        prev.map(project => project.id === selectedId ? savedProject : project)
      )
      setSelectedId(null)
      showAlert('success', '保存成功')
    } catch (error) {
      console.error('更新项目经历失败:', error)
      showAlert('error', '保存失败，请重试')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true)
      
      const response = await fetch(`/api/project/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('删除项目经历失败')
      }

      setProjects(prev => prev.filter(project => project.id !== id))
      setDeleteId(null)
      showAlert('success', '删除成功')
    } catch (error) {
      console.error('删除失败:', error)
      showAlert('error', '删除失败，请重试')
    } finally {
      setIsDeleting(false)
    }
  }

  const timelineItems: TimelineItem[] = useMemo(() => {
    return sortedProjects.map(project => ({
      id: project.id ?? "",
      title: project.name,
      cover: project.photos?.[0] ?? null,
      details: [
        {
          icon: MapPin,
          content: <span className="line-clamp-1">{project.company}</span>
        },
        {
          icon: Calendar,
          content: <span>{project.startDate} - {project.endDate}</span>
        },
        {
          icon: FileText,
          content: <span className="line-clamp-2">{project.description}</span>
        }
      ]
    }))
  }, [sortedProjects])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">加载项目经历...</p>
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
          deleteDialogDescription="确定要删除这条项目经历吗？此操作无法撤销。"
        />
      </div>
    )
  }

  if (selectedId) {
    const project = projects.find(p => p.id === selectedId)
    if (!project) return null

    return (
      <ProjectFormDetail
        project={project}
        onSave={handleSaveProject}
        onCancel={() => setSelectedId(null)}
      />
    )
  }

  return (
    <>
      <Alert
        show={alertState.show}
        type={alertState.type}
        message={alertState.message}
      />

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
        deleteDialogDescription="确定要删除这条项目经历吗？此操作无法撤销。"
      />
      
      {/* 添加按钮 */}
      <motion.div 
        className="mt-16 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Button
          onClick={handleAddProject}
          className={cn(
            "gap-2 bg-gradient-to-r from-primary to-primary/80",
            "hover:shadow-lg hover:shadow-primary/20",
            "dark:from-primary/90 dark:to-primary/70",
            "dark:hover:shadow-primary/40",
            "transform hover:-translate-y-0.5 transition-all"
          )}
        >
          <Plus className="h-4 w-4" />
          添加项目经历
        </Button>
      </motion.div>
    </>
  )
} 