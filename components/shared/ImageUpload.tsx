"use client"

import { useState, useRef } from "react"
import { Upload, Loader2 } from "lucide-react"
import Image from "next/image"
import { cn, uploadToOSS } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/shared/AlertDialog"

interface ImageUploadProps {
  value?: string | null
  onChange?: (url: string) => void
  className?: string
  width?: number
  height?: number
  tip?: string
  disabled?: boolean
}

const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

export function ImageUpload({
  value,
  onChange,
  className,
  width = 256,
  height = 160,
  tip = "点击上传图片",
  disabled
}: ImageUploadProps) {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleError = (message: string) => {
    setErrorMessage(message)
    setShowError(true)
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 验证文件类型
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      handleError("请上传 JPG、PNG、GIF 或 WebP 格式的图片")
      return
    }

    // 验证文件大小
    if (file.size > MAX_FILE_SIZE) {
      handleError("图片大小不能超过 20MB")
      return
    }

    try {
      setLoading(true)
      const url = await uploadToOSS(file, {
        directory: 'photos',
        onProgress: setProgress
      })
      onChange?.(url)
      toast({
        title: "成功",
        description: "图片上传成功"
      })
    } catch (error) {
      handleError("图片上传失败，请重试")
      console.error('上传错误:', error)
    } finally {
      setLoading(false)
      setProgress(0)
    }
  }

  return (
    <div className="relative">
      <input 
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept={ALLOWED_FILE_TYPES.join(',')}
        onChange={handleFileSelect}
        disabled={disabled || loading}
      />

      <div 
        onClick={() => !disabled && !loading && fileInputRef.current?.click()}
        className={cn(
          "relative group cursor-pointer",
          (disabled || loading) && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        <div 
          className="relative overflow-hidden bg-muted ring-4 ring-background shadow-lg rounded-lg"
          style={{ width, height }}
        >
          {value ? (
            <Image
              src={value}
              alt="Uploaded image"
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
              <Upload className="h-8 w-8" />
              <span className="text-sm">{tip}</span>
            </div>
          )}
        </div>
        
        {/* 上传进度遮罩 */}
        {loading && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
              <div className="text-xs mt-1 text-foreground">{progress}%</div>
            </div>
          </div>
        )}

        {!disabled && !loading && (
          <div className={cn(
            "absolute inset-0 flex flex-col items-center justify-center gap-2",
            "bg-background/80 backdrop-blur-sm text-foreground rounded-lg",
            "opacity-0 group-hover:opacity-100 transition-opacity"
          )}>
            <Upload className="h-6 w-6" />
            <span className="text-sm font-medium">更换图片</span>
          </div>
        )}
      </div>

      <AlertDialog open={showError} onOpenChange={setShowError}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>上传失败</AlertDialogTitle>
            <AlertDialogDescription>{errorMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowError(false)}>
              确定
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 