"use client"

import { useState, useEffect } from "react"
import { Resume } from "@/types/resume"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface DuplicateResumeDialogProps {
  resume: Resume | undefined
  open: boolean
  // onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function DuplicateResumeDialog({
  resume,
  open,
  // onOpenChange,
  onSuccess
}: DuplicateResumeDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [newName, setNewName] = useState('')

  useEffect(() => {
    if (resume && open) {
      setNewName(`${resume.name} 的副本`)
    } else if (!open) {
      setNewName('')
      setIsProcessing(false)
    }
  }, [resume, open])

  const handleConfirm = async () => {
    if (!resume || !newName.trim() || isProcessing) return
    
    try {
      setIsProcessing(true)
      const response = await fetch('/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...resume,
          id: undefined,
          name: newName
        })
      })

      if (!response.ok) {
        throw new Error('复制简历失败')
      }

      toast.success('简历已复制')
      if (onSuccess) {
        await onSuccess()
      }
    } catch (err) {
      console.error('复制简历失败:', err)
      toast.error(err instanceof Error ? err.message : '复制失败')
    } finally {
      setIsProcessing(false)
      // onOpenChange(false)
    }
  }

  return (
    <Dialog 
      open={open}
      // onOpenChange={(open) => {
      //   if (!isProcessing) {
      //     onOpenChange(open)
      //   }
      // }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>复制简历</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="请输入新的简历名称"
            disabled={isProcessing}
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