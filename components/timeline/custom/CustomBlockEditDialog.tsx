"use client"

import { useState, useEffect } from 'react'
import { CustomBlock } from '@/types/custom'
import { CustomBlockDialog } from './CustomBlockDialog'

interface CustomBlockEditDialogProps {
  block: CustomBlock
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (data: Partial<CustomBlock>) => void
}

export function CustomBlockEditDialog({
  block,
  open,
  onOpenChange,
  onConfirm
}: CustomBlockEditDialogProps) {
  const [formData, setFormData] = useState({
    name: block.name,
    type: block.type,
    fields: block.fields
  })

  useEffect(() => {
    if (open) {
      setFormData({
        name: block.name,
        type: block.type,
        fields: block.fields
      })
    }
  }, [open, block])

  return (
    <CustomBlockDialog
      open={open}
      onOpenChange={onOpenChange}
      initialData={formData}
      onConfirm={onConfirm}
      mode="edit"
    />
  )
} 