"use client"

import { motion } from "framer-motion"
import { FileText } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { zhCN } from "date-fns/locale"
import { ResumeDropdownMenu } from "@/components/resume/traditional/ResumeDropdownMenu"
import { Resume } from "@/types/resume"

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
  onAction?: (action: ResumeAction, resume: Resume) => void
}

export function ResumeList({ resumes, onAction }: ResumeListProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-2"
    >
      {resumes.map((resume) => (
        <motion.div 
          key={resume.id}
          variants={item}
          className="group flex items-center justify-between p-4 rounded-lg border bg-card hover:shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">{resume.name}</h3>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(resume.updatedAt), {
                  addSuffix: true,
                  locale: zhCN
                })}
              </p>
            </div>
          </div>

          <ResumeDropdownMenu 
            resume={resume} 
            onAction={(action) => onAction?.(action, resume)} 
          />
        </motion.div>
      ))}
    </motion.div>
  )
} 