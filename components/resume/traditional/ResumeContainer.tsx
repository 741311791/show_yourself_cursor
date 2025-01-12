"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Resume } from "@/types/resume"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Download, LayoutGrid, List, Plus, RotateCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { CreateResumeDialog } from "./CreateResumeDialog"
import { toast } from "sonner"
import { RenameResumeDialog } from "./RenameResumeDialog"
import { DuplicateResumeDialog } from "./DuplicateResumeDialog"
import { DeleteResumeDialog } from "./DeleteResumeDialog"
import { Button } from "@/components/ui/button"
import { ResumeList } from "./ResumeList"
import { ResumeGrid } from "./ResumeGrid"
import { ResumeAction } from "@/types/resume"

type ViewMode = "grid" | "list"

interface DialogState {
  type: 'create' | 'rename' | 'duplicate' | 'delete' | null
  resume?: Resume
}


export function ResumeContainer() {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [resumes, setResumes] = useState<Resume[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dialog, setDialog] = useState<DialogState>({ type: null })

  const fetchResumes = async () => {
    console.log('📝 开始获取简历列表...')
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch('/api/resumes', {
        headers: {
          'Cache-Control': 'no-cache',
        }
      })
      if (!response.ok) {
        throw new Error('获取简历列表失败')
      }
      const data = await response.json()
      console.log('✅ 获取简历列表成功:', data.length, '个简历')
      setResumes(data)
    } catch (err) {
      console.error('❌ 获取简历列表失败:', err)
      setError('获取简历列表失败，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    console.log('🔄 组件挂载，初始化获取简历列表')
    fetchResumes()
  }, [])

  const handleAction = (action: ResumeAction) => {
    console.log('👆 用户触发操作:', action.type, action.resume?.id)
    switch (action.type) {
      case 'edit':
        router.push(`/resume/builder/${action.resume?.id}`)
        break
      case 'rename':
      case 'duplicate':
      case 'delete':
        setDialog({ type: action.type, resume: action.resume })
        break
      case 'export':
        toast.info(`${action.type.toUpperCase()} 导出功能即将上线`)
        break
    }
  }

  const handleDialogClose = () => {
    console.log('🔒 关闭对话框:', dialog.type)
    setDialog({ type: null })
  }

  const handleOperationSuccess = async () => {
    console.log('✨ 操作成功，准备刷新数据')
    await handleRefresh()
  }

  const handleRefresh = async () => {
    if (isLoading) {
      console.log('⏳ 正在加载中，跳过刷新')
      return
    }

    console.log('🔄 开始刷新数据')
    try {
      setIsLoading(true)
      await fetchResumes()
      toast.success('刷新成功')
      console.log('✅ 刷新数据成功')
    } catch (err) {
      console.error('❌ 刷新数据失败:', err)
      toast.error('刷新失败，请重试')
    } finally {
      setIsLoading(false)
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
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-muted rounded-lg p-1">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8",
                viewMode === "grid" && "bg-background shadow-sm"
              )}
              onClick={() => {
                console.log('🔀 切换到网格视图')
                setViewMode("grid")
              }}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8",
                viewMode === "list" && "bg-background shadow-sm"
              )}
              onClick={() => {
                console.log('🔀 切换到列表视图')
                setViewMode("list")
              }}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

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

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              console.log('📥 点击导入简历按钮')
              console.log('导入简历')
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            导入简历
          </Button>
          <Button
            size="sm"
            onClick={() => {
              console.log('➕ 点击新建简历按钮')
              setDialog({ type: 'create' })
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            新建简历
          </Button>
        </div>
      </div>

      {resumes.length === 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            暂无简历，点击右上角按钮开始创建吧！
          </AlertDescription>
        </Alert>
      )}

      {viewMode === "grid" ? (
        <ResumeGrid resumes={resumes} onAction={handleAction} />
      ) : (
        <ResumeList resumes={resumes} onAction={handleAction} />
      )}

      <RenameResumeDialog 
        resume={dialog.type === 'rename' ? dialog.resume : undefined}
        open={dialog.type === 'rename'}
        onOpenChange={handleDialogClose}
        onSuccess={handleOperationSuccess}
      />

      <DuplicateResumeDialog 
        resume={dialog.type === 'duplicate' ? dialog.resume : undefined}
        open={dialog.type === 'duplicate'}
        // onOpenChange={ open => !open && handleDialogClose() }
        onSuccess={handleOperationSuccess}
      />

      <DeleteResumeDialog 
        resume={dialog.type === 'delete' ? dialog.resume : undefined}
        open={dialog.type === 'delete'}
        onOpenChange={handleDialogClose}
        onSuccess={handleOperationSuccess}
      />

      <CreateResumeDialog 
        open={dialog.type === 'create'}
        onOpenChange={handleDialogClose}
      />
    </div>
  )
} 