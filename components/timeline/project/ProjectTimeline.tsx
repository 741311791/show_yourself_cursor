"use client"

import React, { useState, useMemo } from "react"
import { Plus, Pencil, Trash2, FileText } from "lucide-react"
import { motion } from "motion/react"
import { Project } from "@/types/project"
import { ProjectFormDetail, ProjectCard } from "."
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
    source: 'custom'
  }
]

export function ProjectTimeline() {
  const [projects, setProjects] = useState<Project[]>(mockProjects)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // 根据时间排序的项目列表
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
      source: 'custom'
    }
    setProjects(prev => [...prev, newProject])
    setSelectedId(newProject.id)
  }

  const handleSaveProject = (updatedProject: Project) => {
    setProjects(prev => 
      prev.map(project => project.id === selectedId ? updatedProject : project)
    )
    setSelectedId(null)
  }

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true)
      // TODO: 调用删除项目 API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // TODO: 重新获取项目列表
      setProjects(prev => prev.filter(project => project.id !== id))
      setDeleteId(null)
    } catch (error) {
      console.error('删除失败:', error)
    } finally {
      setIsDeleting(false)
    }
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

      {/* 项目列表 */}
      <div className="space-y-8">
        {sortedProjects.map((project) => (
          <ContextMenu key={project.id}>
            <ContextMenuTrigger>
              <motion.div
                variants={item}
                className="relative flex items-start gap-6 group cursor-pointer"
              >
                {/* 时间线节点 */}
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF4D4F] to-[#FF7875] flex items-center justify-center shadow-md shadow-red-200/50 transform group-hover:scale-110 transition-transform">
                    <FileText size={20} className="text-white" />
                  </div>
                  <div className="absolute -right-3 top-1/2 w-3 h-[2px] bg-[#FF4D4F]" />
                </div>

                {/* 项目卡片 */}
                <div className="flex-1 group-hover:transform group-hover:-translate-y-1 transition-all duration-200">
                  <ProjectCard
                    project={project}
                    onClick={() => setSelectedId(project.id)}
                  />
                </div>
              </motion.div>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem
                onClick={() => setSelectedId(project.id)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Pencil size={14} />
                <span>编辑</span>
              </ContextMenuItem>
              {project.source === 'custom' && (
                <ContextMenuItem
                  onClick={() => setDeleteId(project.id)}
                  className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <Trash2 size={14} />
                  <span>删除</span>
                </ContextMenuItem>
              )}
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
          onClick={handleAddProject}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#FF4D4F] to-[#FF7875] rounded-lg hover:shadow-lg hover:shadow-red-200/50 transform hover:-translate-y-0.5 transition-all"
        >
          <Plus size={18} />
          <span>添加项目经历</span>
        </button>
      </motion.div>

      {/* 删除确认对话框 */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除这条项目经历吗？此操作无法撤销。
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