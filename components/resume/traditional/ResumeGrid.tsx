"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FileText, MoreVertical } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { zhCN } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { ResumeDropdownMenu } from "@/components/resume/traditional/ResumeDropdownMenu"
import { Resume } from "@/types/resume"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

interface ResumeGridProps {
  resumes: Resume[]
  onAction?: (action: ResumeAction, resume: Resume) => void
}

export function ResumeGrid({ resumes, onAction }: ResumeGridProps) {
  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {resumes.map((resume) => (
        <motion.div key={resume.id} variants={item}>
          <div className="group relative p-6 rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow">
            {resume.thumbnail && (
              <div className="aspect-video mb-4 rounded-lg overflow-hidden">
                <img 
                  src={resume.thumbnail} 
                  alt={resume.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-lg font-semibold truncate">{resume.name}</h2>
            </div>
            
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(resume.updatedAt), {
                  addSuffix: true,
                  locale: zhCN
                })}
              </p>
              
              <ResumeDropdownMenu 
                resume={resume} 
                onAction={(action) => onAction?.(action, resume)} 
              />
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
} 