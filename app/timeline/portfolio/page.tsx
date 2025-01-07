import { MainLayout } from "@/components/layout/MainLayout"
import { PortfolioTimeline } from "@/components/timeline/portfolio"

export default function PortfolioPage() {
  return (
    <MainLayout>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">作品集</h1>
          </div>
          <PortfolioTimeline />
        </div>
      </div>
    </MainLayout>
  )
} 