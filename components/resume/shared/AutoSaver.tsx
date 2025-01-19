"use client"

import { useEffect, useRef, useState } from "react"
import { useResumeStore } from "@/store/useResumeStore"
import { toast } from "sonner"

interface AutoSaverProps {
  resumeId: string
  interval?: number // 自动保存间隔，单位毫秒，默认 30 秒
}

export function AutoSaver({ resumeId, interval = 30000 }: AutoSaverProps) {
  const resumeData = useResumeStore(state => state.resumeData)
  const [lastSavedData, setLastSavedData] = useState(resumeData)
  const timeoutRef = useRef<NodeJS.Timeout>()
  const [isSaving, setIsSaving] = useState(false)

  // 保存简历数据
  const saveResume = async () => {
    if (!resumeData || isSaving) return

    try {
      setIsSaving(true)
      const response = await fetch(`/api/resume/${resumeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resumeData),
      })

      if (!response.ok) {
        throw new Error('保存失败')
      }

      setLastSavedData(resumeData)
      toast.success('简历已自动保存')
    } catch (error) {
      console.error('自动保存失败:', error)
      toast.error('自动保存失败，请检查网络连接')
    } finally {
      setIsSaving(false)
    }
  }

  // 检查数据是否发生变化
  const hasChanges = () => {
    return JSON.stringify(resumeData) !== JSON.stringify(lastSavedData)
  }

  useEffect(() => {
    // 清除之前的定时器
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // 如果数据有变化，设置新的定时器
    if (hasChanges()) {
      timeoutRef.current = setTimeout(saveResume, interval)
    }

    // 组件卸载时清理
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [resumeData, interval])

  // 页面关闭前保存
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges()) {
        saveResume()
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [resumeData])

  return null // 这是一个无UI组件
} 