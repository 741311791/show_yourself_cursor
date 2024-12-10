import { MainLayout } from "@/components/layout/MainLayout"
import { HobbyTimeline } from "@/components/timeline/hobby"

export default function HobbyPage() {
  return (
    <MainLayout>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">兴趣爱好</h1>
          </div>
          <HobbyTimeline />
        </div>
      </div>
    </MainLayout>
  )
} 