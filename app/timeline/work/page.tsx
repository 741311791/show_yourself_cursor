import { MainLayout } from "@/components/layout/MainLayout"
import { WorkTimeline } from "@/components/timeline/work/WorkTimeline"

export default function WorkPage() {
  return (
    <MainLayout>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">工作经历</h1>
          </div>
          <WorkTimeline />
        </div>
      </div>
    </MainLayout>
  )
} 