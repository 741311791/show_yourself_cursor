import { PublicationTimeline } from "@/components/timeline/publication"
import { MainLayout } from "@/components/layout/MainLayout"

export default function PublicationsPage() {
  return (
    <MainLayout>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">出版物</h1>
          </div>
          <PublicationTimeline />
        </div>
      </div>
    </MainLayout>
  )
} 