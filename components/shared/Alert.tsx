"use client"

import { motion, AnimatePresence } from "motion/react"
import { CheckCircle2, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface AlertProps {
  type: 'success' | 'error'
  message: string
  show: boolean
}

export function Alert({ type, message, show }: AlertProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
        >
          <div className={cn(
            "px-4 py-2 rounded-lg shadow-lg flex items-center gap-2",
            type === 'success' ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
          )}>
            {type === 'success' ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <XCircle className="h-5 w-5" />
            )}
            <span className="font-medium">{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 