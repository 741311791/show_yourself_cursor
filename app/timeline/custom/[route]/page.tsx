"use client"

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useCustomBlockStore } from '@/store/customBlock'
import { CustomBlockTimeline } from '@/components/timeline/custom'
import { CustomBlockPage } from '@/components/timeline/custom'
import { MainLayout } from "@/components/layout/MainLayout"


export default function CustomBlockRoute() {
  const { route } = useParams()
  const router = useRouter()
  const blocks = useCustomBlockStore(state => state.blocks)
  
  const block = blocks.find(b => b.route === route)
  
  useEffect(() => {
    if (!block) {
      router.push('/timeline')
    }
  }, [block, router])

  if (!block) return null

  return block.type === 'timeline' ? (
    <MainLayout>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">{block.name}</h1>
          </div>
          <CustomBlockTimeline block={block} />
        </div>
      </div>
    </MainLayout>
  ) : (
    <MainLayout>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">{block.name}</h1>
          </div>
          <CustomBlockPage block={block} />
        </div>
      </div>
    </MainLayout>
  )
} 