"use client"

import { useState, useCallback, useEffect } from "react"
import { Education } from "@/types/education"
import { useResumeStore } from "@/store/useResumeStore"
import { ConfigActions } from "@/components/resume/shared/ConfigActions"
import { EditableLabel } from "@/components/resume/shared/EditableLabel"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { EducationCard } from "@/components/resume/cards/EducationCard"
import { DEFAULT_RESUME_CONFIG } from "@/types/resume"
import { useDebounce } from "@/hooks/useDebounce"

export function EducationSection() {
  const { resumeData, updateSection, updateConfig } = useResumeStore()
  const config = resumeData?.config?.education ?? DEFAULT_RESUME_CONFIG.education!
  const [educations, setEducations] = useState<Education[]>(resumeData?.education ?? [])

  // 使用防抖处理更新
  const debouncedEducations = useDebounce(educations, 500)

  useEffect(() => {
    updateSection('education', debouncedEducations)
  }, [debouncedEducations, updateSection])

  // 处理标题更新
  const handleTitleChange = (newTitle: string) => {
    const newConfig = {
      ...config,
      title: newTitle
    }
    updateConfig('education', newConfig)
  }

  // 处理教育经历添加
  const handleAdd = () => {
    const newEducation: Education = {
      id: crypto.randomUUID(),
      school: "",
      degree: "",
      startDate: "",
      endDate: "",
      major: "",
      summary: "",
      customFields: []
    }
    setEducations(prev => [...prev, newEducation])
  }

  // 处理教育经历更新
  const handleUpdate = (id: string, data: Partial<Education>) => {
    setEducations(prev => 
      prev.map(item => 
        item.id === id ? { ...item, ...data } : item
      )
    )
  }

  // 处理教育经历删除
  const handleDelete = (id: string) => {
    setEducations(prev => prev.filter(item => item.id !== id))
  }

  // 处理拖拽排序
  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(educations)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setEducations(items)
  }

  // 处理配置加载
  const handleLoadConfig = useCallback(async () => {
    try {
      const response = await fetch(`/api/users/current/configs/education`)
      const data = await response.json()
      
      if (data.education) {
        updateSection('education', data.education)
      }
    } catch (error) {
      console.error('加载配置失败:', error)
    }
  }, [updateSection])

  // 处理配置保存
  const handleSaveConfig = useCallback(async () => {
    try {
      await fetch(`/api/users/current/configs/education`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          education: educations
        }),
      })
    } catch (error) {
      console.error('保存配置失败:', error)
    }
  }, [educations])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <EditableLabel
          label={config?.title ?? ""}
          variant="title"
          onSave={handleTitleChange}
        />
        <ConfigActions
          section="education"
          onLoad={handleLoadConfig}
          onSave={handleSaveConfig}
        />
      </div>

      <div className="relative bg-card p-4">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="educations">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {educations.map((education, index) => (
                  <Draggable
                    key={education.id}
                    draggableId={education.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <EducationCard
                          data={education}
                          onUpdate={(data) => handleUpdate(education.id, data)}
                          onDelete={() => handleDelete(education.id)}
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
          添加教育经历
        </Button>
      </div>
    </div>
  )
} 