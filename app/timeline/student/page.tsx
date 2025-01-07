import { MainLayout } from "@/components/layout/MainLayout"
import { StudentTimeline } from "@/components/timeline/student"

export default function PortfolioPage() {
  return (
    <MainLayout>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">学生经历</h1>
          </div>
          <StudentTimeline />
        </div>
      </div>
    </MainLayout>
  )
} 