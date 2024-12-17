"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface PageTitleProps {
  title: string
  className?: string
  children?: React.ReactNode
}

export function PageTitle({
  title,
  className,
  children
}: PageTitleProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative pb-6 mb-8",
        "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full",
        "after:bg-gradient-to-r after:from-primary/80 after:via-primary/20 after:to-transparent",
        className
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1"
        >
          <h1 className="text-4xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {title}
            </span>
          </h1>
        </motion.div>

        {children && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2"
          >
            {children}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
} 