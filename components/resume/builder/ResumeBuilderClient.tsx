"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Panel, PanelGroup, PanelResizeHandle } from "@/components/ui/panel"
import { cn } from "@/lib/utils"
import { useBreakpoint } from "@/hooks/useBreakpoint"
import { LeftSidebar } from "./sidebars/LeftSidebar"
import { RightSidebar } from "./sidebars/RightSidebar"
import { useResumeStore } from "@/store/useResumeStore"
import { convertToResumeDetail } from "@/services/resume/resumeService"
import { toast } from "sonner"
import { WhiteboardPlaceholder } from "./WhiteboardPlaceholder"
import { AutoSaver } from "@/components/resume/shared/AutoSaver"

export function ResumeBuilderClient() {
  const params = useParams()
  const resumeId = params.id as string
  
  const [mounted, setMounted] = useState(false)
  const { } = useBreakpoint()
  const setResumeData = useResumeStore(state => state.setResumeData)

  // 侧边栏拖拽状态
  const [leftDragging, setLeftDragging] = useState(false)
  const [rightDragging, setRightDragging] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 获取简历数据并初始化 store
  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await fetch(`/api/resume/${resumeId}`)
        if (!response.ok) {
          throw new Error('获取简历失败')
        }
        const data = await response.json()
        const resumeDetail = convertToResumeDetail(data)
        console.log('🚀 获取简历:', resumeDetail)
        setResumeData(resumeDetail)
      } catch (error) {
        console.error('获取简历失败:', error)
        toast.error('获取简历失败，请刷新重试')
      }
    }

    if (resumeId) {
      fetchResume()
    }
  }, [resumeId, setResumeData])

  if (!mounted) {
    return null
  }

  return (
    <div className="relative h-screen overflow-hidden">
      <AutoSaver resumeId={resumeId} interval={30000} />

      <PanelGroup direction="horizontal">
        <Panel
          minSize={25}
          maxSize={45}
          defaultSize={30}
          className={cn(
            "z-10 bg-background",
            !leftDragging && "transition-[flex]"
          )}
        >
          <LeftSidebar />
        </Panel>

        <PanelResizeHandle
          isDragging={leftDragging}
          onDragging={setLeftDragging}
        />

        <Panel>
          <div className="h-full overflow-y-auto bg-muted/30 p-6">
            <WhiteboardPlaceholder />
          </div>
        </Panel>

        <PanelResizeHandle
          isDragging={rightDragging}
          onDragging={setRightDragging}
        />

        <Panel
          minSize={25}
          maxSize={45}
          defaultSize={30}
          className={cn(
            "z-10 bg-background",
            !rightDragging && "transition-[flex]"
          )}
        >
          <RightSidebar />
        </Panel>
      </PanelGroup>
    </div>
  )
} 