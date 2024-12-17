"use client"

import React, { useState, useMemo, useEffect } from "react"
import { Plus, Heart, Calendar, Trophy, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { Hobby } from "@/types/hobby"
import { HobbyFormDetail } from "./HobbyFormDetail"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { TimelineList, type TimelineItem } from "../shared/TimelineList"

const mockHobbies: Hobby[] = [
  {
    id: "1",
    name: "滑雪",
    cover: "https://picsum.photos/seed/ski/800/800",
    photos: ["https://picsum.photos/seed/ski/800/800"],
    description: "热爱滑雪的乐趣",
    createdAt: "2024-01-01",
    startDate: "2023-01-01",
    awards: [
      {
        id: "1",
        title: "初级滑雪证书",
        date: "2023-03-01"
      }
    ],
    customFields: []
  }
]

export function HobbyTimeline() {
  const [hobbies, setHobbies] = useState<Hobby[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHobbies = async () => {
      try {
        setIsLoading(true)
        setError(null)
        await new Promise(resolve => setTimeout(resolve, 1000))
        const data: Hobby[] = []
        setHobbies(data.length > 0 ? data : mockHobbies)
      } catch (error) {
        console.error('获取兴趣爱好失败:', error)
        setError('获取兴趣爱好失败，请刷新页面重试')
        setHobbies(mockHobbies)
      } finally {
        setIsLoading(false)
      }
    }

    fetchHobbies()
  }, [])

  const sortedHobbies = useMemo(() => {
    return [...hobbies].sort((a, b) => {
      if (!a.startDate) return 1
      if (!b.startDate) return -1
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    })
  }, [hobbies])

  const handleAddHobby = () => {
    const newHobby: Hobby = {
      id: Math.random().toString(),
      name: "",
      cover: null,
      photos: [],
      description: "",
      createdAt: new Date().toISOString(),
      startDate: "",
      awards: [],
      customFields: []
    }
    setHobbies(prev => [...prev, newHobby])
    setSelectedId(newHobby.id)
  }

  const handleSaveHobby = (updatedHobby: Hobby) => {
    setHobbies(prev => 
      prev.map(hobby => hobby.id === selectedId ? updatedHobby : hobby)
    )
  }

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setHobbies(prev => prev.filter(hobby => hobby.id !== id))
      setDeleteId(null)
    } catch (error) {
      console.error('删除失败:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const timelineItems: TimelineItem[] = useMemo(() => {
    return sortedHobbies.map(hobby => ({
      id: hobby.id,
      title: hobby.name,
      cover: hobby.cover,
      details: [
        {
          icon: Calendar,
          content: <span>开始于 {hobby.startDate}</span>
        },
        ...(hobby.awards && hobby.awards.length > 0 ? [{
          icon: Trophy,
          content: (
            <span className="line-clamp-1">
              {hobby.awards[0].title}
              {hobby.awards.length > 1 && ` 等${hobby.awards.length}个荣誉`}
            </span>
          )
        }] : [])
      ]
    }))
  }, [sortedHobbies])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">加载兴趣爱好...</p>
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
          icon={Heart}
          onEdit={setSelectedId}
          onDelete={setDeleteId}
          isDeleting={isDeleting}
          deleteId={deleteId}
          onDeleteConfirm={handleDelete}
          onDeleteCancel={() => setDeleteId(null)}
          deleteDialogTitle="确认删除"
          deleteDialogDescription="确定要删除这条兴趣爱好吗？此操作无法撤销。"
        />
      </div>
    )
  }

  if (selectedId) {
    const hobby = hobbies.find(h => h.id === selectedId)
    if (!hobby) return null

    return (
      <HobbyFormDetail
        hobby={hobby}
        onSave={handleSaveHobby}
        onCancel={() => setSelectedId(null)}
      />
    )
  }

  return (
    <>
      <TimelineList 
        items={timelineItems}
        icon={Heart}
        onEdit={setSelectedId}
        onDelete={setDeleteId}
        isDeleting={isDeleting}
        deleteId={deleteId}
        onDeleteConfirm={handleDelete}
        onDeleteCancel={() => setDeleteId(null)}
        deleteDialogTitle="确认删除"
        deleteDialogDescription="确定要删除这条兴趣爱好吗？此操作无法撤销。"
      />
      
      {/* 添加按钮 */}
      <motion.div 
        className="mt-16 text-center" 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Button
          onClick={handleAddHobby}
          className={cn(
            "gap-2 bg-gradient-to-r from-primary to-primary/80",
            "hover:shadow-lg hover:shadow-primary/20",
            "dark:from-primary/90 dark:to-primary/70",
            "dark:hover:shadow-primary/40",
            "transform hover:-translate-y-0.5 transition-all"
          )}
        >
          <Plus className="h-4 w-4" />
          添加兴趣爱好
        </Button>
      </motion.div>
    </>
  )
} 