"use client"

import { motion, AnimatePresence } from "motion/react"
import { CheckCircle2, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface AlertProps {
  show: boolean
  type: 'success' | 'error' | 'info'
  message: string
}

export function Alert({ show, type, message }: AlertProps) {
  if (!show) return null

  const styles = {
    success: 'bg-green-100 text-green-800 border-green-300',
    error: 'bg-red-100 text-red-800 border-red-300',
    info: 'bg-blue-100 text-blue-800 border-blue-300'
  }

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg border ${styles[type]} shadow-lg transition-all duration-300`}>
      {message}
    </div>
  )
} 