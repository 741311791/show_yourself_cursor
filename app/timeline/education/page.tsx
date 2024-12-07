import { MainLayout } from "@/components/layout/MainLayout"
import { EducationTimeline } from "@/components/timeline/education/EducationTimeline"

export default function EducationPage() {
  return (
    <MainLayout>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">教育经历</h1>
          </div>
          <EducationTimeline />
        </div>
      </div>
    </MainLayout>
  )
} 