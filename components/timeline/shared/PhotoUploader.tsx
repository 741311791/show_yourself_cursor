"use client"

import { useState } from "react"
import { Camera, Upload, X } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ImageUpload } from "@/components/shared/ImageUpload"
import { cn } from "@/lib/utils"

interface PhotoUploaderProps {
  title?: string
  description?: string
  photos: string[]
  maxPhotos?: number
  isEditing?: boolean
  className?: string
  onChange: (photos: string[]) => void
}

export function PhotoUploader({
  title = "照片墙",
  description = "上传相关照片",
  photos = [],
  maxPhotos = 5,
  isEditing = true,
  className,
  onChange
}: PhotoUploaderProps) {
  const handlePhotoChange = (index: number, url: string) => {
    const newPhotos = [...photos]
    newPhotos[index] = url
    onChange(newPhotos)
  }

  const handlePhotoDelete = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index)
    onChange(newPhotos)
  }

  const handlePhotoAdd = (url: string) => {
    if (photos.length < maxPhotos) {
      onChange([...photos, url])
    }
  }

  return (
    <Card className={className}>
      <CardHeader className="flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <Camera className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        {isEditing && (
          <p className="text-xs text-muted-foreground">
            {photos.length}/{maxPhotos} 张图片
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {description && (
          <p className="text-sm text-muted-foreground text-center">
            {description}
          </p>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo, index) => (
            <div key={index} className="relative group aspect-square">
              <ImageUpload
                value={photo}
                onChange={(url) => handlePhotoChange(index, url)}
                disabled={!isEditing}
              />
              {isEditing && (
                <Button
                  variant="destructive"
                  size="icon"
                  className={cn(
                    "absolute -top-2 -right-2 h-6 w-6",
                    "opacity-0 group-hover:opacity-100 transition-opacity",
                    "shadow-lg"
                  )}
                  onClick={() => handlePhotoDelete(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          {isEditing && photos.length < maxPhotos && (
            <div>
              <ImageUpload
                value={null}
                onChange={handlePhotoAdd}
                disabled={!isEditing}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 