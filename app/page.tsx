import { Sidebar } from "@/components/layout/Sidebar"
import { Toolbar } from "@/components/layout/Toolbar"
import { ResumeGrid } from "@/components/resume/ResumeGrid"

export default function Home() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-60 flex-1">
        <Toolbar />
        <div className="p-6">
          <ResumeGrid />
        </div>
      </main>
    </div>
  )
}
