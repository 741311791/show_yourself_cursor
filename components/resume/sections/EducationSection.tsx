"use client"

import { useState, useEffect } from "react"
import { Education } from "@/types/education"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, GripVertical, School } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { ConfigActions } from "@/components/resume/shared/ConfigActions"
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { EducationForm } from "@/components/resume/forms/EducationForm"
import { DropResult } from "@hello-pangea/dnd"

export function EducationSection() {
  const [educations, setEducations] = useState<Education[]>([])
  const [editingEducation, setEditingEducation] = useState<Education | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // 监听教育经历变化
  useEffect(() => {
    console.log("Educations updated:", educations)
  }, [educations])

  const handleAdd = () => {
    const newEducation: Education = {
      id: crypto.randomUUID(),
      school: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      description: ""
    }
    setEditingEducation(newEducation)
  }

  const handleEdit = (education: Education) => {
    setEditingEducation(education)
  }

  const handleSave = (education: Education) => {
    if (educations.find(e => e.id === education.id)) {
      setEducations(prev => 
        prev.map(item => item.id === education.id ? education : item)
      )
    } else {
      setEducations(prev => [...prev, education])
    }
    setEditingEducation(null)
  }

  const handleDelete = (id: string) => {
    setEducations(prev => prev.filter(item => item.id !== id))
    setEditingEducation(null)
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(educations)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setEducations(items)
  }

  const handleLoadFromConfig = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/resume/education')
      const data = await response.json()
      setEducations(data)
      toast({
        title: "加载成功",
        description: "已从简历配置中加载教育经历"
      })
    } catch (error: unknown) {
      console.error('加载配置失败:', error)
      toast({
        title: "加载失败",
        description: error instanceof Error ? error.message : "无法从简历配置中加载教育经历",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveToConfig = async () => {
    setIsLoading(true)
    try {
      await fetch('/api/resume/education', {
        method: 'POST',
        body: JSON.stringify(educations)
      })
      toast({
        title: "保存成功",
        description: "已更新至简历配置"
      })
    } catch (error: unknown) {
      console.error('保存配置失败:', error)
      toast({
        title: "保存失败",
        description: error instanceof Error ? error.message : "无法更新至简历配置",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="relative p-4">
        <ConfigActions
          isLoading={isLoading}
          onLoad={handleLoadFromConfig}
          onSave={handleSaveToConfig}
          className="absolute right-4 top-4"
        />

        <div className="space-y-4">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="educations">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  {educations.map((education, index) => (
                    <Draggable
                      key={education.id}
                      draggableId={education.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={cn(
                            "flex items-center gap-2 rounded-lg border bg-card p-3",
                            "hover:bg-accent/50 cursor-pointer",
                            snapshot.isDragging && "opacity-50"
                          )}
                          onClick={() => handleEdit(education)}
                        >
                          <div
                            {...provided.dragHandleProps}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <GripVertical className="h-4 w-4" />
                          </div>
                          <School className="h-4 w-4 text-muted-foreground" />
                          <div className="flex-1 text-sm">
                            <div className="font-medium">{education.school}</div>
                            <div className="text-muted-foreground">
                              {education.degree} {education.field}
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {education.startDate} - {education.endDate}
                          </div>
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
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            增加一项
          </Button>
        </div>
      </Card>

      <Dialog 
        open={!!editingEducation} 
        onOpenChange={() => setEditingEducation(null)}
      >
        <DialogContent className="max-w-2xl">
          {editingEducation && (
            <EducationForm
              data={editingEducation}
              onSave={handleSave}
              onDelete={() => handleDelete(editingEducation.id)}
              onCancel={() => setEditingEducation(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 