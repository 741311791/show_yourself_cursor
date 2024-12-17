"use client"

import React, { useState, useMemo, useEffect } from "react"
import { Plus, FileText, MapPin, Calendar, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { Project } from "@/types/project"
import { ProjectFormDetail } from "./ProjectFormDetail"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { TimelineList, type TimelineItem } from "../shared/TimelineList"

const mockProjects: Project[] = [
  {
    id: "1",
    name: "示例项目",
    company: "示例公司",
    startDate: "2023-01",
    endDate: "2023-12",
    description: "这是一个示例项目描述",
    techStack: "React, TypeScript, Tailwind CSS",
    achievement: "<p>这是项目中的个人成绩</p>",
    isCore: true,
    order: 0,
    source: 'custom',
    summary: "",
    photo: null,
    customFields: []
  }
]

export function ProjectTimeline() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true)
        setError(null)
        await new Promise(resolve => setTimeout(resolve, 1000))
        const data: Project[] = []
        setProjects(data.length > 0 ? data : mockProjects)
      } catch (error) {
        console.error('获取项目经历失败:', error)
        setError('获取项目经历失败，请刷新页面重试')
        setProjects(mockProjects)
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

  const handleAddProject = () => {
    const newProject: Project = {
      id: Math.random().toString(),
      name: "",
      company: "",
      startDate: "",
      endDate: "",
      description: "",
      techStack: "",
      achievement: "",
      isCore: false,
      order: projects.length,
      source: 'custom',
      summary: "",
      photo: null,
      customFields: []
    }
    setProjects(prev => [...prev, newProject])
    setSelectedId(newProject.id)
  }

  const handleSaveProject = (updatedProject: Project) => {
    setProjects(prev => 
      prev.map(project => project.id === selectedId ? updatedProject : project)
    )
  }

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setProjects(prev => prev.filter(project => project.id !== id))
      setDeleteId(null)
    } catch (error) {
      console.error('删除失败:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const timelineItems: TimelineItem[] = useMemo(() => {
    return sortedProjects.map(project => ({
      id: project.id,
      title: project.name,
      cover: project.photo,
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