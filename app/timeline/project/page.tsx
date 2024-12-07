import { MainLayout } from "@/components/layout/MainLayout"
import { ProjectTimeline } from "@/components/timeline/project"

export default function ProjectPage() {
  return (
    <MainLayout>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">项目经历</h1>
          </div>
          <ProjectTimeline />
        </div>
      </div>
    </MainLayout>
  )
} 