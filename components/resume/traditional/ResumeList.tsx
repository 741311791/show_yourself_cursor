"use client"

import { motion } from "framer-motion"
import { FileText } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { zhCN } from "date-fns/locale"
import { Resume } from "@/types/resume"
import { ResumeAction } from "@/types/resume"
import { ResumeContextMenu } from "./ResumeContextMenu"
import Image from "next/image"
import ResumePlaceholder from "@/public/CVPreview.png"
import { useRouter } from "next/navigation"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
}

const item = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 }
}

interface ResumeListProps {
  resumes: Resume[]
  onAction: (action: ResumeAction) => void
}

export function ResumeList({ resumes, onAction }: ResumeListProps) {
  const router = useRouter()

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-3"
    >
      {resumes.map((resume) => (
        <ResumeContextMenu
          key={resume.id}
          resume={resume}
          onAction={onAction}
        >
          <motion.div 
            variants={item}
            className="group flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 cursor-pointer"
            onClick={() => router.push(`/resume/builder/${resume.id}`)}
          >
            {/* 缩略图 */}
            <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-md border">
              <Image
                src={resume.thumbnailUrl || ResumePlaceholder.src}
                alt={resume.name}
                fill
                className="object-cover"
              />
            </div>

            {/* 信息区域 */}
            <div className="flex-grow min-w-0">
              <h3 className="font-medium truncate">{resume.name}</h3>
              {resume.updatedAt && (
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(resume.updatedAt), {
                    addSuffix: true,
                    locale: zhCN
                  })}
                </p>
              )}
            </div>

            {/* 状态图标 */}
            <div className="shrink-0 text-muted-foreground">
              <FileText className="h-5 w-5" />
            </div>
          </motion.div>
        </ResumeContextMenu>
      ))}
    </motion.div>
  )
} 