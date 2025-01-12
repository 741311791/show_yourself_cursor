"use client"

import { useState } from "react"
import { Resume } from "@/types/resume"
import { cn } from "@/lib/utils"
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
}

export function DeleteResumeDialog({
  resume,
  open,
  onOpenChange,
  onSuccess
}: DeleteResumeDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleConfirm = async () => {
    if (!resume) return
    
    try {
      setIsProcessing(true)
      const response = await fetch(`/api/resumes/${resume.id}`, {
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
      setIsProcessing(false)
    }
  }

  return (
    <AlertDialog open={!!deleteId}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              此操作不可撤销，确定要删除吗？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => setDeleteId(null)}
              disabled={isDeleting}
            >
              取消
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
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