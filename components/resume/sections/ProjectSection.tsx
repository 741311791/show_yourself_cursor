"use client"

import { useState, useCallback, useEffect } from "react"
import { Project } from "@/types/project"
import { useResumeStore } from "@/store/useResumeStore"
import { ConfigActions } from "@/components/resume/shared/ConfigActions"
import { EditableLabel } from "@/components/resume/shared/EditableLabel"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { ProjectCard } from "@/components/resume/cards/ProjectCard"
import { DEFAULT_RESUME_CONFIG } from "@/types/resume"
import { useDebounce } from "@/hooks/useDebounce"

export function ProjectSection() {
  const { resumeData, updateSection, updateConfig } = useResumeStore()
  const config = resumeData?.config?.projects ?? DEFAULT_RESUME_CONFIG.projects!
  const [projects, setProjects] = useState<Project[]>(resumeData?.projects ?? [])

  // 使用防抖处理更新
  const debouncedProjects = useDebounce(projects, 500)

  useEffect(() => {
    updateSection('projects', debouncedProjects)
  }, [debouncedProjects, updateSection])

  // 处理标题更新
  const handleTitleChange = (newTitle: string) => {
    const newConfig = {
      ...config,
      title: newTitle
    }
    updateConfig('projects', newConfig)
  }

  // 处理项目添加
  const handleAdd = () => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      name: "",
      role: "",
      startDate: "",
      endDate: "",
      summary: "",
      company: "",
      source: "custom",
      description: "",
      techStack: "",
      achievement: "",
      order: projects.length,
      customFields: []
    }
    setProjects(prev => [...prev, newProject])
  }

  // 处理项目更新
  const handleUpdate = (id: string, data: Partial<Project>) => {
    setProjects(prev => 
      prev.map(item => 
        item.id === id ? { ...item, ...data } : item
      )
    )
  }

  // 处理项目删除
  const handleDelete = (id: string) => {
    setProjects(prev => prev.filter(item => item.id !== id))
  }

  // 处理拖拽排序
  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(projects)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setProjects(items)
  }

  // 处理配置加载
  const handleLoadConfig = useCallback(async () => {
    try {
      const response = await fetch(`/api/users/current/configs/projects`)
      const data = await response.json()
      
      if (data.projects) {
        updateSection('projects', data.projects)
      }
    } catch (error) {
      console.error('加载配置失败:', error)
    }
  }, [updateSection])

  // 处理配置保存
  const handleSaveConfig = useCallback(async () => {
    try {
      await fetch(`/api/users/current/configs/projects`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projects: projects
        }),
      })
    } catch (error) {
      console.error('保存配置失败:', error)
    }
  }, [projects])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <EditableLabel
          label={config?.title ?? ""}
          variant="title"
          onSave={handleTitleChange}
        />
        <ConfigActions
          section="projects"
          onLoad={handleLoadConfig}
          onSave={handleSaveConfig}
        />
      </div>

      <div className="relative bg-card p-4">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="projects">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {projects.map((project, index) => (
                  <Draggable
                    key={project.id}
                    draggableId={project.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <ProjectCard
                          data={project}
                          onUpdate={(data) => handleUpdate(project.id, data)}
                          onDelete={() => handleDelete(project.id)}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <Button
          onClick={handleAdd}
          variant="outline"
          className="mt-4 w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          添加项目经历
        </Button>
      </div>
    </div>
  )
} 