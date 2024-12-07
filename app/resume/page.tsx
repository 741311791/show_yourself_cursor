import { MainLayout } from "@/components/layout/MainLayout"
import { ResumeGrid } from "@/components/layout/ResumeGrid"
import { Toolbar } from "@/components/layout/Toolbar"

export default function ResumePage() {
  return (
    <MainLayout>
      <div className="flex flex-col h-full">
        <Toolbar />
        <div className="p-6">
          <div className="space-y-6">
            <h1 className="text-2xl font-semibold">我的简历</h1>
            <ResumeGrid />
          </div>
        </div>
      </div>
    </MainLayout>
  )
} 