"use client"

import { useState } from 'react'
import { CustomBlock, CustomBlockItem } from '@/types/custom'
import { CustomBlockFormDetail } from './CustomBlockFormDetail'

interface CustomBlockPageProps {
  block: CustomBlock
}

export function CustomBlockPage({ block }: CustomBlockPageProps) {
  const [item] = useState<CustomBlockItem>(() => ({
    id: '1',
    blockId: block.id,
    fields: {},
    customFields: [],
    summary: '',
    photos: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }))

  return (
    <CustomBlockFormDetail
      item={item}
      block={block}
      onSave={(updatedItem) => {
        // TODO: 调用保存API
        console.log('保存:', updatedItem)
      }}
      onCancel={() => {}}
    />
  )
} 