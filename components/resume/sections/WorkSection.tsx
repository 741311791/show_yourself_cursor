"use client"

import { useState, useCallback, useEffect } from "react"
import { Work } from "@/types/work"
import { useResumeStore } from "@/store/useResumeStore"
import { ConfigActions } from "@/components/resume/shared/ConfigActions"
import { EditableLabel } from "@/components/resume/shared/EditableLabel"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { WorkCard } from "@/components/resume/cards/WorkCard"
import { DEFAULT_RESUME_CONFIG } from "@/types/resume"
import { useDebounce } from "@/hooks/useDebounce"

export function WorkSection() {
  const { resumeData, updateSection, updateConfig } = useResumeStore()
  const config = resumeData?.config?.work ?? DEFAULT_RESUME_CONFIG.work!
  const [works, setWorks] = useState<Work[]>(resumeData?.work ?? [])

  // 使用防抖处理更新
  const debouncedWorks = useDebounce(works, 500)

  useEffect(() => {
    updateSection('work', debouncedWorks)
  }, [debouncedWorks, updateSection])

  // 处理标题更新
  const handleTitleChange = (newTitle: string) => {
    const newConfig = {
      ...config,
      title: newTitle
    }
    updateConfig('work', newConfig)
  }

  // 处理工作经历添加
  const handleAdd = () => {
    const newWork: Work = {
      id: crypto.randomUUID(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      location: "",
      summary: "",
      customFields: []
    }
    setWorks(prev => [...prev, newWork])
  }

  // 处理工作经历更新
  const handleUpdate = (id: string, data: Partial<Work>) => {
    setWorks(prev => 
      prev.map(item => 
        item.id === id ? { ...item, ...data } : item
      )
    )
  }

  // 处理工作经历删除
  const handleDelete = (id: string) => {
    setWorks(prev => prev.filter(item => item.id !== id))
  }

  // 处理拖拽排序
  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(works)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setWorks(items)
  }

  // 处理配置加载
  const handleLoadConfig = useCallback(async () => {
    try {
      const response = await fetch(`/api/users/current/configs/work`)
      const data = await response.json()
      
      if (data.work) {
        updateSection('work', data.work)
      }
    } catch (error) {
      console.error('加载配置失败:', error)
    }
  }, [updateSection])

  // 处理配置保存
  const handleSaveConfig = useCallback(async () => {
    try {
      await fetch(`/api/users/current/configs/work`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          work: works
        }),
      })
    } catch (error) {
      console.error('保存配置失败:', error)
    }
  }, [works])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <EditableLabel
          label={config?.title ?? ""}
          variant="title"
          onSave={handleTitleChange}
        />
        <ConfigActions
          section="work"
          onLoad={handleLoadConfig}
          onSave={handleSaveConfig}
        />
      </div>

      <div className="relative bg-card p-4">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="works">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {works.map((work, index) => (
                  <Draggable
                    key={work.id}
                    draggableId={work.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <WorkCard
                          data={work}
                          onUpdate={(data) => handleUpdate(work.id, data)}
                          onDelete={() => handleDelete(work.id)}
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
          添加工作经历
        </Button>
      </div>
    </div>
  )
} 