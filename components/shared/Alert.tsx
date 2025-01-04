"use client"

import { motion, AnimatePresence } from "motion/react"
import { CheckCircle2, XCircle, Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface AlertProps {
  show: boolean
  type: 'success' | 'error' | 'info'
  message: string
}

export function Alert({ show, type, message }: AlertProps) {
  const icons = {
    success: <CheckCircle2 className="h-5 w-5" />,
    error: <XCircle className="h-5 w-5" />,
    info: <Info className="h-5 w-5" />
  }

  const styles = {
    success: 'bg-green-50 text-green-600 border-green-200',
    error: 'bg-red-50 text-red-600 border-red-200',
    info: 'bg-blue-50 text-blue-600 border-blue-200'
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="fixed top-4 right-4 z-50"
        >
          <div 
            className={cn(
              "flex items-center gap-2 px-4 py-3 rounded-lg border shadow-lg",
              "backdrop-blur-sm bg-opacity-95",
              styles[type]
            )}
          >
            {icons[type]}
            <span className="font-medium text-sm">{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}