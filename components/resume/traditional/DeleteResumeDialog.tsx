"use client"

import { useState } from "react"
import { Resume } from "@/types/resume"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/shared/AlertDialog"

interface DeleteResumeDialogProps {
  resume: Resume | undefined
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => Promise<void>
  isParentLoading?: boolean
}

export function DeleteResumeDialog({
  resume,
  open,
  onOpenChange,
  onSuccess,
  isParentLoading
}: DeleteResumeDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!resume || isDeleting || isParentLoading) return
    
    try {
      setIsDeleting(true)
      const response = await fetch(`/api/resume/${resume.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('删除失败')
      }
      
      toast.success('简历已删除')
      if (onSuccess) {
        await onSuccess()
      }
    } catch (err) {
      console.error('删除简历失败:', err)
      toast.error(err instanceof Error ? err.message : '删除失败')
    } finally {
      setIsDeleting(false)
      onOpenChange(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!isDeleting) {
      onOpenChange(open)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确认删除</AlertDialogTitle>
          <AlertDialogDescription>
            确定要删除简历 &quot;{resume?.name}&quot; 吗？此操作不可撤销。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            onClick={() => !isDeleting && onOpenChange(false)}
            disabled={isDeleting}
          >
            取消
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className={cn(
              "bg-destructive hover:bg-destructive/90",
              isDeleting && "opacity-50 cursor-not-allowed"
            )}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                删除中...
              </>
            ) : (
              "确认删除"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
} 