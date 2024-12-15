import { ResearchTimeline } from "@/components/timeline/research"
import { MainLayout } from "@/components/layout/MainLayout"

export default function ResearchPage() {
  return (
    <MainLayout>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">科研经历</h1>
          </div>
          <ResearchTimeline />
        </div>
      </div>
    </MainLayout>
  )
} 