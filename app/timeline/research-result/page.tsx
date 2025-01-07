import { ResearchResultTimeline } from "@/components/timeline/research-result"
import { MainLayout } from "@/components/layout/MainLayout"

export default function ResearchResultPage() {
    return (
      <MainLayout>
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">研究成果</h1>
            </div>
            <ResearchResultTimeline />
          </div>
        </div>
      </MainLayout>
    )
  } 