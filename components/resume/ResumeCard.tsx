"use client"

import Image from "next/image"
import { formatDate } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ResumeCardProps {
  resume: {
    id: string
    title: string
    lastUpdated: string
    thumbnail: string
  }
  viewMode: 'grid' | 'list'
}

export function ResumeCard({ resume, viewMode }: ResumeCardProps) {
  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardContent className={cn(
        "p-4",
        viewMode === 'grid' ? "space-y-3" : "flex items-center gap-4"
      )}>
        {/* 缩略图 */}
        <div className={cn(
          "relative overflow-hidden rounded-lg border",
          viewMode === 'grid' ? "aspect-[3/4]" : "w-24 h-32"
        )}>
          <Image
            src={resume.thumbnail}
            alt={resume.title}
            fill
            className="object-cover"
          />
        </div>

        {/* 信息 */}
        <div className="space-y-1">
          <h3 className="font-medium line-clamp-2">{resume.title}</h3>
          <p className="text-sm text-muted-foreground">
            最后更新：{formatDate(resume.lastUpdated)}
          </p>
        </div>
      </CardContent>
    </Card>
  )
} 