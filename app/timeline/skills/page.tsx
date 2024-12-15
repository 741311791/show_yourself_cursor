import { SkillTimeline } from "@/components/timeline/skill/SkillTimeline"
import { MainLayout } from "@/components/layout/MainLayout"

export default function SkillsPage() {
  return (
    <MainLayout>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">技能</h1>
          </div>
          <SkillTimeline />
        </div>
      </div>
    </MainLayout>
  )
} 