"use client"

import React, { useState, useEffect } from "react"
import { motion } from "motion/react"
import { Plus, Loader2 } from "lucide-react"
import { Hobby } from "@/types/hobby"
import { HobbyFormDetail } from "@/components/timeline/hobby/HobbyFormDetail"
import { cn } from "@/lib/utils"
import Image from "next/image"

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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {hobbies.map((hobby) => (
            <motion.div
              key={hobby.id}
              onClick={() => setSelectedId(hobby.id)}
              className={cn(
                "relative aspect-square rounded-lg overflow-hidden cursor-pointer group",
                "hover:shadow-lg transition-shadow"
              )}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              {hobby.cover ? (
                <Image
                  src={hobby.cover}
                  alt={hobby.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-muted" />
              )}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <h3 className="text-2xl font-bold text-white">{hobby.name}</h3>
              </div>
            </motion.div>
          ))}
        </div>
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {hobbies.map((hobby) => (
        <motion.div
          key={hobby.id}
          onClick={() => setSelectedId(hobby.id)}
          className={cn(
            "relative aspect-square rounded-lg overflow-hidden cursor-pointer group",
            "hover:shadow-lg transition-shadow"
          )}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          {hobby.cover ? (
            <Image
              src={hobby.cover}
              alt={hobby.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-muted" />
          )}
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <h3 className="text-2xl font-bold text-white">{hobby.name}</h3>
          </div>
        </motion.div>
      ))}

      {/* 添加按钮卡片 */}
      <motion.div
        onClick={handleAddHobby}
        className={cn(
          "relative aspect-square rounded-lg cursor-pointer",
          "bg-muted hover:bg-muted/80 transition-colors",
          "flex items-center justify-center"
        )}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <Plus className="w-8 h-8 text-muted-foreground" />
      </motion.div>
    </div>
  )
} 