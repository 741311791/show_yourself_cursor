"use client"

import { useViewMode } from "@/hooks/useViewMode"
import { ResumeCard } from "./ResumeCard"
import { cn } from "@/lib/utils"

interface Resume {
  id: string
  title: string
  lastUpdated: string
  thumbnail: string
}

const MOCK_RESUMES: Resume[] = [
  {
    id: '1',
    title: '软件工程师简历',
    lastUpdated: '2024-03-15',
    thumbnail: 'https://picsum.photos/400/500?random=1'
  },
  {
    id: '2',
    title: '产品经理简历',
    lastUpdated: '2024-03-14',
    thumbnail: 'https://picsum.photos/400/500?random=2'
  },
  {
    id: '3',
    title: '市场营销简历',
    lastUpdated: '2024-03-13',
    thumbnail: 'https://picsum.photos/400/500?random=3'
  }
]

export function ResumeGrid() {
  const { viewMode } = useViewMode()

  return (
    <div className={cn(
      "w-full",
      viewMode === 'grid' 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4"
        : "flex flex-col gap-4"
    )}>
      {MOCK_RESUMES.map((resume) => (
        <ResumeCard 
          key={resume.id} 
          resume={resume}
          viewMode={viewMode}
        />
      ))}
    </div>
  )
} 