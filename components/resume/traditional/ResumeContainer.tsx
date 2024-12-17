"use client"

import { useEffect, useState } from "react"
import { ResumeGrid } from "./ResumeGrid"
import { ResumeList } from "./ResumeList"
import { Resume } from "@/types/resume"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

// 修改模拟数据，使用 picsum.photos 的图片
const mockResumes: Resume[] = [
  {
    id: "1",
    name: "前端开发简历",
    updatedAt: "2024-03-20T10:00:00Z",
    createdAt: "2024-03-20T10:00:00Z",
    thumbnail: "https://picsum.photos/seed/resume1/400/225" // 16:9 比例的随机图片
  },
  {
    id: "2",
    name: "产品经理简历",
    updatedAt: "2024-03-19T15:30:00Z",
    createdAt: "2024-03-19T15:30:00Z",
    thumbnail: "https://picsum.photos/seed/resume2/400/225"
  },
  {
    id: "3",
    name: "UI设计师简历",
    updatedAt: "2024-03-18T09:20:00Z",
    createdAt: "2024-03-18T09:20:00Z",
    thumbnail: "https://picsum.photos/seed/resume3/400/225"
  }
]

interface ResumeContainerProps {
  viewMode: "grid" | "list"
}

export function ResumeContainer({ viewMode }: ResumeContainerProps) {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchResumes() {
      try {
        setIsLoading(true)
        // TODO: ��换为实际的API调用
        await new Promise(resolve => setTimeout(resolve, 1000))
        // const response = await fetch('/api/resumes')
        // const data = await response.json()
        
        // 暂时使用模拟数据
        setResumes(mockResumes)
        setError(null)
      } catch (err) {
        console.error('获取简历列表失败:', err)
        setError('获取简历列表失败，请稍后重试')
        // 使用模拟数据兜底
        setResumes(mockResumes)
      } finally {
        setIsLoading(false)
      }
    }

    fetchResumes()
  }, [])

  const handleAction = (action: ResumeAction, resume: Resume) => {
    switch (action) {
      case 'rename':
        console.log('重命名', resume)
        break
      case 'edit':
        console.log('编辑', resume)
        break
      case 'duplicate':
        console.log('复制', resume)
        break
      case 'export':
        console.log('导出', resume)
        break
      case 'delete':
        console.log('删除', resume)
        break
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (resumes.length === 0) {
    return (
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          暂无简历，点击"新建简历"开始创建吧！
        </AlertDescription>
      </Alert>
    )
  }

  return viewMode === "grid" ? (
    <ResumeGrid resumes={resumes} onAction={handleAction} />
  ) : (
    <ResumeList resumes={resumes} onAction={handleAction} />
  )
} 