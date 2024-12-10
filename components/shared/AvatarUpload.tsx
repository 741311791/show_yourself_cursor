"use client"

import { useState } from 'react'
import { Upload as UploadIcon, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useToast } from "@/components/ui/use-toast"
import { cn, uploadToOSS } from "@/lib/utils"

interface AvatarUploadProps {
  value?: string
  onChange?: (url: string) => void
  disabled?: boolean
}

export function AvatarUpload({ value, onChange, disabled }: AvatarUploadProps) {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const { toast } = useToast()

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // 验证文件大小（10MB）
    if (file.size / 1024 / 1024 > 10) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "图片大小不能超过 10MB"
      })
      return
    }

    try {
      setLoading(true)
      const url = await uploadToOSS(file, {
        directory: 'avatars',
        onProgress: setProgress
      })
      onChange?.(url)
      toast({
        title: "成功",
        description: "头像上传成功"
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "上传失败，请重试"
      })
      console.error('上传错误:', error)
    } finally {
      setLoading(false)
      setProgress(0)
    }
  }

  return (
    <div className="relative group">
      <label className="block cursor-pointer">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={disabled || loading}
          className="hidden"
        />
        <div className={cn(
          "w-36 h-36 rounded-full overflow-hidden border-2 transition-colors duration-200",
          value ? "border-transparent" : "border-dashed border-muted-foreground/25",
          !disabled && "group-hover:border-primary",
          disabled && "opacity-50"
        )}>
          {value ? (
            <Image
              src={value}
              alt="头像"
              width={152}
              height={152}
              className="w-full h-full object-cover"
              quality={100}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted/50">
              <UploadIcon className="w-12 h-12 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* 上传进度遮罩 */}
        {loading && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm rounded-full flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
              <div className="text-xs mt-1 text-foreground">{progress}%</div>
            </div>
          </div>
        )}
        
        {/* 悬浮提示 */}
        {!disabled && !loading && (
          <div className={cn(
            "absolute inset-0 bg-background/50 backdrop-blur-sm rounded-full",
            "flex items-center justify-center",
            "opacity-0 group-hover:opacity-100 transition-opacity"
          )}>
            <div className="text-xs font-medium">更换头像</div>
          </div>
        )}
      </label>
    </div>
  )
} 