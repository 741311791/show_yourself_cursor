"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ResumeGrid } from "./ResumeGrid"
import { ResumeList } from "./ResumeList"
import { Resume } from "@/types/resume"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Plus, Download, FileText } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { CreateResumeDialog } from "./CreateResumeDialog"

// 修改模拟数据，使用 picsum.photos 的图片
const mockResumes: Resume[] = [
  {
    id: "1",
    name: "前端开发简历",
    updatedAt: "2024-03-20T10:00:00Z",
    createdAt: "2024-03-20T10:00:00Z",
    thumbnail: "https://picsum.photos/seed/resume1/400/225"
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
  const router = useRouter()
  const [resumes, setResumes] = useState<Resume[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  useEffect(() => {
    async function fetchResumes() {
      try {
        setIsLoading(true)
        await new Promise(resolve => setTimeout(resolve, 1000))
        setResumes(mockResumes)
        setError(null)
      } catch (err) {
        console.error('获取简历列表失败:', err)
        setError('获取简历列表失败，请稍后重试')
        setResumes(mockResumes)
      } finally {
        setIsLoading(false)
      }
    }

    fetchResumes()
  }, [])

  const handleAction = (action: string, resume: Resume) => {
    switch (action) {
      case 'rename':
        console.log('重命名', resume)
        break
      case 'edit':
        router.push(`/resume/builder/${resume.id}`)
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

  const ActionCards = () => (
    <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card
        className={cn(
          "group relative cursor-pointer overflow-hidden",
          "hover:shadow-lg transition-all duration-300",
          "flex flex-col items-center justify-center gap-4 p-8",
          "border-dashed hover:border-solid hover:border-primary"
        )}
        onClick={() => setShowCreateDialog(true)}
      >
        <div className={cn(
          "h-12 w-12 rounded-full",
          "flex items-center justify-center",
          "bg-primary/10 text-primary",
          "group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground",
          "transition-all duration-300"
        )}>
          <FileText className="h-6 w-6" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-1">创建新简历</h3>
          <p className="text-sm text-muted-foreground">从头开始构建</p>
        </div>
      </Card>

      <Card
        className={cn(
          "group relative cursor-pointer overflow-hidden",
          "hover:shadow-lg transition-all duration-300",
          "flex flex-col items-center justify-center gap-4 p-8",
          "border-dashed hover:border-solid hover:border-primary"
        )}
      >
        <div className={cn(
          "h-12 w-12 rounded-full",
          "flex items-center justify-center",
          "bg-primary/10 text-primary",
          "group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground",
          "transition-all duration-300"
        )}>
          <Plus className="h-6 w-6" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-1">使用模板</h3>
          <p className="text-sm text-muted-foreground">从模板快速创建</p>
        </div>
      </Card>

      <Card
        className={cn(
          "group relative cursor-pointer overflow-hidden",
          "hover:shadow-lg transition-all duration-300",
          "flex flex-col items-center justify-center gap-4 p-8",
          "border-dashed hover:border-solid hover:border-primary"
        )}
      >
        <div className={cn(
          "h-12 w-12 rounded-full",
          "flex items-center justify-center",
          "bg-primary/10 text-primary",
          "group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground",
          "transition-all duration-300"
        )}>
          <Download className="h-6 w-6" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-1">导入简历</h3>
          <p className="text-sm text-muted-foreground">导入已有简历</p>
        </div>
      </Card>
    </div>
  )

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

  return (
    <div>
      <ActionCards />
      {resumes.length === 0 ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            暂无简历，点击上方卡片开始创建吧！
          </AlertDescription>
        </Alert>
      ) : viewMode === "grid" ? (
        <ResumeGrid resumes={resumes} onAction={handleAction} />
      ) : (
        <ResumeList resumes={resumes} onAction={handleAction} />
      )}
      
      <CreateResumeDialog 
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  )
} 