import { MainLayout } from "@/components/layout/MainLayout"
import { ResumeGrid } from "@/components/resume/ResumeGrid"
import { Toolbar } from "@/components/layout/Toolbar"

export default function TraditionalResumePage() {
  return (
    <MainLayout>
      <div className="flex-1 overflow-hidden flex flex-col">
        <Toolbar />
        <div className="flex-1 overflow-auto p-6">
          <ResumeGrid />
        </div>
      </div>
    </MainLayout>
  )
} 