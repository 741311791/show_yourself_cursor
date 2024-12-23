"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { pinyin } from 'pinyin-pro'

interface CreateResumeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateResumeDialog({ open, onOpenChange }: CreateResumeDialogProps) {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateSlug = (text: string) => {
    return pinyin(text, { 
      toneType: 'none',
      type: 'array',
      nonZh: 'consecutive'
    })
      .map(p => p.toLowerCase())
      .join('')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  useEffect(() => {
    setSlug(generateSlug(title))
  }, [title])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title) return

    try {
      setLoading(true)
      setError(null)
      
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
      
      await new Promise(resolve => setTimeout(resolve, 500))
      
      onOpenChange(false)
      router.push(`/resume/builder/${id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : '创建简历失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新建简历</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">简历标题</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如: 阿里巴巴大数据工程师"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">URL</Label>
            <Input
              id="slug"
              value={slug}
              readOnly
              className="bg-muted"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              取消
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? '创建中...' : '创建'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 