"use client"

import { useState } from "react"
import { CloudDownload, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

interface LoadFromTimelineButtonProps<T> {
  sectionType: 'profile' | 'education' | 'work' | 'project' | 'award' | 'certificate' | 'hobby' | 'skill' | 'language' | 'research' | 'research-result' | 'student'
  onDataLoaded: (data: T) => void
}

export function LoadFromTimelineButton<T>({ 
  sectionType, 
  onDataLoaded 
}: LoadFromTimelineButtonProps<T>) {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)

  const handleLoad = async () => {
    if (!session?.user?.id) {
      toast.error('请先登录')
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch(`/api/${sectionType}`)
      
      if (!response.ok) {
        throw new Error('获取数据失败')
      }

      const data = await response.json()
      onDataLoaded(data)
      toast.success('加载成功')
    } catch (error) {
      console.error('加载失败:', error)
      toast.error('加载失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      size="icon"
      variant="ghost"
      className="h-8 w-8"
      onClick={handleLoad}
      disabled={isLoading}
      title="从个人履历加载"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <CloudDownload className="h-4 w-4" />
      )}
    </Button>
  )
} 