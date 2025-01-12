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
  onSuccess?: () => void
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
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('删除失败')
      }
      
      toast.success('简历已删除')
      onSuccess?.()
      onOpenChange(false)
    } catch (err) {
      console.error('删除简历失败:', err)
      toast.error(err instanceof Error ? err.message : '删除失败')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <AlertDialog 
      open={open}
      onOpenChange={() => !isProcessing && onOpenChange(false)}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确认删除</AlertDialogTitle>
          <AlertDialogDescription>
            确定要删除简历"{resume?.name}"吗？此操作无法撤销。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => !isProcessing && onOpenChange(false)}>
            取消
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isProcessing}
            className={cn(
              "bg-destructive hover:bg-destructive/90",
              isProcessing && "opacity-50 cursor-not-allowed"
            )}
          >
            {isProcessing ? '删除中...' : '确认删除'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
} 