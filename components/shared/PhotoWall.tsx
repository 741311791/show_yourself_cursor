"use client"

import React from "react"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface PhotoWallProps {
  photos: string[]
  onChange: (photos: string[]) => void
  disabled?: boolean
}

export function PhotoWall({
  photos,
  onChange,
  disabled = false
}: PhotoWallProps) {
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return

    // TODO: 实现实际的图片上传逻辑
    // 这里仅作为示例，使用本地 URL
    const newPhotos = Array.from(e.target.files).map(file => 
      URL.createObjectURL(file)
    )
    onChange([...photos, ...newPhotos])
  }

  const handleRemove = (index: number) => {
    onChange(photos.filter((_, i) => i !== index))
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {photos.map((photo, index) => (
        <div 
          key={photo} 
          className={cn(
            "group relative aspect-square rounded-lg overflow-hidden",
            "bg-muted border-2 border-muted-foreground/20"
          )}
        >
          <Image
            src={photo}
            alt={`照片 ${index + 1}`}
            fill
            className="object-cover"
          />
          {!disabled && (
            <Button
              variant="destructive"
              size="icon"
              onClick={() => handleRemove(index)}
              className={cn(
                "absolute top-2 right-2 h-6 w-6",
                "opacity-0 group-hover:opacity-100 transition-opacity"
              )}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
      
      {!disabled && (
        <label className={cn(
          "relative aspect-square rounded-lg",
          "bg-muted border-2 border-dashed border-muted-foreground/20",
          "hover:border-primary/50 hover:bg-muted/80 transition-colors",
          "flex items-center justify-center cursor-pointer"
        )}>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            className="hidden"
          />
          <Plus className="h-8 w-8 text-muted-foreground" />
        </label>
      )}
    </div>
  )
} 