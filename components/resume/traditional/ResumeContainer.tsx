"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Resume } from "@/types/resume"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Download, Plus, RotateCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { CreateResumeDialog } from "./CreateResumeDialog"
import { ResumeCard } from "../shared/ResumeCard"
import { ResumeActionCard } from "../shared/ResumeActionCard"
import { ResumeAction } from "./ResumeDropdownMenu"
import { toast } from "sonner"
import ResumePlaceholder from "@/public/CVPreview.png"
import { RenameResumeDialog } from "./RenameResumeDialog"
import { DuplicateResumeDialog } from "./DuplicateResumeDialog"
import { DeleteResumeDialog } from "./DeleteResumeDialog"
import { Button } from "@/components/ui/button"

interface ResumeContainerProps {
  viewMode: "grid" | "list"
}

interface DialogState {
  type: 'create' | 'rename' | 'duplicate' | 'delete' | null
  resume?: Resume
}

export function ResumeContainer({ viewMode }: ResumeContainerProps) {
  const router = useRouter()
  const [resumes, setResumes] = useState<Resume[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dialog, setDialog] = useState<DialogState>({ type: null })

  const fetchResumes = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/resumes')
      if (!response.ok) {
        throw new Error('获取简历列表失败')
      }
      const data = await response.json()
      setResumes(data)
      setError(null)
    } catch (err) {
      console.error('获取简历列表失败:', err)
      setError('获取简历列表失败，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchResumes()
  }, [])

  const handleAction = (action: ResumeAction) => {
    console.log('action', action.type)
    switch (action.type) {
      case 'edit':
        router.push(`/resume/builder/${action.resume.id}`)
        break
      case 'rename':
      case 'duplicate':
      case 'delete':
        setDialog({ type: action.type, resume: action.resume })
        break
      case 'export':
        toast.info(`${action.format.toUpperCase()} 导出功能即将上线`)
        break
    }
  }

  const handleDialogClose = () => {
    setDialog({ type: null })
  }

  const handleDialogSuccess = async () => {
    try {
      await fetchResumes()
      handleDialogClose()
    } catch (err) {
      console.error('刷新数据失败:', err)
      toast.error('刷新数据失败，请重试')
    }
  }

  const handleRefresh = async () => {
    setDialog({ type: null })
    await fetchResumes()
    toast.success('刷新成功')
  }

  const ActionCards = () => (
    <>
      <ResumeActionCard
        title="创建新简历"
        description="从头开始构建"
        icon={Plus}
        clickFunc={() => setDialog({ type: 'create' })}
      />
      <ResumeActionCard
        title="导入现有简历"
        description="JSON 简历等"
        icon={Download}
        clickFunc={() => console.log('导入简历')}
      />
    </>
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
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">我的简历</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RotateCw className={cn(
            "h-4 w-4 mr-2",
            isLoading && "animate-spin"
          )} />
          刷新
        </Button>
      </div>

      {resumes.length === 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            暂无简历，点击下方卡片开始创建吧！
          </AlertDescription>
        </Alert>
      )}

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          <ActionCards />
          {resumes.map(resume => (
            <ResumeCard
              key={resume.id}
              variant="resume"
              title={resume.name}
              thumbnailUrl={resume.thumbnailUrl || ResumePlaceholder.src}
              resume={resume}
              onAction={handleAction}
            />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ActionCards />
          </div>
          <div className="space-y-4">
            {resumes.map(resume => (
              <ResumeCard
                key={resume.id}
                variant="resume"
                title={resume.name}
                thumbnailUrl={resume.thumbnailUrl || ResumePlaceholder.src}
                resume={resume}
                onAction={handleAction}
              />
            ))}
          </div>
        </>
      )}

      <RenameResumeDialog 
        resume={dialog.type === 'rename' ? dialog.resume : undefined}
        open={dialog.type === 'rename'}
        onOpenChange={handleDialogClose}
        onSuccess={handleDialogSuccess}
      />

      <DuplicateResumeDialog 
        resume={dialog.type === 'duplicate' ? dialog.resume : undefined}
        open={dialog.type === 'duplicate'}
        onOpenChange={handleDialogClose}
        onSuccess={handleDialogSuccess}
      />

      <DeleteResumeDialog 
        resume={dialog.type === 'delete' ? dialog.resume : undefined}
        open={dialog.type === 'delete'}
        onOpenChange={handleDialogClose}
        onSuccess={handleDialogSuccess}
      />

      <CreateResumeDialog 
        open={dialog.type === 'create'}
        onOpenChange={handleDialogClose}
      />
    </div>
  )
} 