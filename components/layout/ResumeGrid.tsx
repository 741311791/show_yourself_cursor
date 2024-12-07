"use client"

import { ResumeCard } from "@/components/resume/ResumeCard"
import { useViewMode } from "@/hooks/useViewMode"

const MOCK_RESUMES = [
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
  },
  // 更多示例数据...
]

export function ResumeGrid() {
  const { viewMode } = useViewMode()

  return (
    <div className={
      viewMode === 'grid'
        ? "grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4"
        : "flex flex-col gap-4"
    }>
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