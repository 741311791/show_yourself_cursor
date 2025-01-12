"use client"

import { useState, useEffect } from "react"
import { Resume } from "@/types/resume"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface RenameResumeDialogProps {
  resume: Resume | undefined
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function RenameResumeDialog({
  resume,
  open,
  onOpenChange,
  onSuccess
}: RenameResumeDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [newName, setNewName] = useState('')

  useEffect(() => {
    if (resume && open) {
      setNewName(resume.name)
    }
  }, [resume, open])

  const handleConfirm = async () => {
    if (!resume || !newName.trim()) return
    
    try {
      setIsProcessing(true)
      const response = await fetch(`/api/resumes/${resume.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName })
      })

      if (!response.ok) {
        throw new Error('重命名失败')
      }

      toast.success('简历已重命名')
      if (onSuccess) {
        await onSuccess()
      }
    } catch (err) {
      console.error('重命名简历失败:', err)
      toast.error(err instanceof Error ? err.message : '重命名失败')
    } finally {
      setIsProcessing(false)
      onOpenChange(false)
    }
  }

  return (
    <Dialog 
      open={open} 
      onOpenChange={(open) => {
        if (!isProcessing) {
          onOpenChange(open)
          if (!open) {
            setNewName('')
          }
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>重命名简历</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="请输入新的简历名称"
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => !isProcessing && onOpenChange(false)}
            disabled={isProcessing}
          >
            取消
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isProcessing || !newName.trim()}
          >
            {isProcessing ? '处理中...' : '确认'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 