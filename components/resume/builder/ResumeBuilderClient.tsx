"use client"

import { useEffect, useState } from "react"
import { Panel, PanelGroup, PanelResizeHandle } from "@/components/ui/panel"
import { cn } from "@/lib/utils"
import { useBreakpoint } from "@/hooks/useBreakpoint"
import { LeftSidebar } from "./sidebars/LeftSidebar"
import { RightSidebar } from "./sidebars/RightSidebar"
import { useResumeStore } from "@/store/useResumeStore"
import { toast } from "sonner"

interface ResumeBuilderClientProps {
  id: string
}

export function ResumeBuilderClient({ id }: ResumeBuilderClientProps) {
  const [mounted, setMounted] = useState(false)
  const { isDesktop } = useBreakpoint()
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
        const response = await fetch(`/api/resumes/${id}`)
        if (!response.ok) {
          throw new Error('获取简历失败')
        }
        const data = await response.json()
        setResumeData(data)
      } catch (error) {
        console.error('获取简历失败:', error)
        toast.error('获取简历失败，请刷新重试')
      }
    }

    fetchResume()
  }, [id, setResumeData])

  function WhiteboardPlaceholder() {
    return (
      <div className="h-full w-full flex items-center justify-center bg-white rounded-lg shadow-sm">
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-gray-800">白板页面</h3>
          <p className="text-sm text-gray-500">该功能正在开发中...</p>
        </div>
      </div>
    )
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="relative h-screen overflow-hidden">
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
          <div className="flex-1 overflow-auto bg-muted/30 p-6">
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