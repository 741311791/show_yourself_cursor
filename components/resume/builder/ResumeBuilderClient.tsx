"use client"

import { useEffect, useState } from "react"
import { Panel, PanelGroup, PanelResizeHandle } from "@/components/ui/panel"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useBreakpoint } from "@/hooks/useBreakpoint"
import { ResumeEditor } from "@/components/resume/builder/ResumeEditor"
import { ResumePreview } from "@/components/resume/builder/ResumePreview"
import { ResumeToolbar } from "@/components/resume/builder/ResumeToolbar"
import { LeftSidebar } from "@/components/resume/builder/sidebars/LeftSidebar"
import { RightSidebar } from "@/components/resume/builder/sidebars/RightSidebar"
import { 
  ResumeDetail, 
  ResumeEditorState, 
  ResumeTemplate,
  ExportFormat 
} from "@/types/resume"

interface ResumeBuilderClientProps {
  id: string
}

export function ResumeBuilderClient({ id }: ResumeBuilderClientProps) {
  const [mounted, setMounted] = useState(false)
  const { isDesktop } = useBreakpoint()
  const [state, setState] = useState<ResumeEditorState>({
    data: null,
    template: 'modern',
    scale: 1,
    isDirty: false
  })

  const [leftDragging, setLeftDragging] = useState(false)
  const [rightDragging, setRightDragging] = useState(false)
  const [leftSize, setLeftSize] = useState(30)
  const [rightSize, setRightSize] = useState(30)

  const [sheet, setSheet] = useState({
    left: { open: false },
    right: { open: false }
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const mockData: ResumeDetail = {
          id,
          name: "示例简历",
          createdBy: "admin",
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          profile: undefined,
          education: [],
          work: [],
          projects: [],
          research: [],
          hobbies: [],
          languages: [],
          skills: [],
          awards: [],
          certificates: [],
          publications: [],
          customBlocks: []
        }
        setState(prev => ({ ...prev, data: mockData }))
      } catch (error) {
        console.error('获取简历失败:', error)
      }
    }

    fetchResume()
  }, [id])

  const handleUpdate = (data: Partial<ResumeDetail>) => {
    setState(prev => ({
      ...prev,
      data: prev.data ? { ...prev.data, ...data } : null,
      isDirty: true
    }))
  }

  const handleTemplateChange = (template: ResumeTemplate) => {
    setState(prev => ({ ...prev, template }))
  }

  const handleExport = async (format: ExportFormat) => {
    console.log('导出格式:', format)
  }

  const MainContent = () => (
    <div className="relative flex h-screen flex-col">
      <ResumeToolbar
        onExport={handleExport}
        onTemplateChange={handleTemplateChange}
        isDirty={state.isDirty}
      />

      <div className="flex-1 overflow-auto bg-muted/30 p-6">
        <ResumePreview
          data={state.data}
          template={state.template}
          scale={state.scale}
        />
      </div>
    </div>
  )

  if (!mounted) {
    return null
  }

  return isDesktop ? (
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
          onResize={setLeftSize}
        >
          <LeftSidebar />
        </Panel>

        <PanelResizeHandle
          isDragging={leftDragging}
          onDragging={setLeftDragging}
        />

        <Panel>
          <ResumeEditor
            data={state.data}
            onUpdate={handleUpdate}
          />
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
          onResize={setRightSize}
        >
          <RightSidebar />
        </Panel>
      </PanelGroup>
    </div>
  ) : (
    <div className="relative">
      <Sheet
        open={sheet.left.open}
        onOpenChange={(open) => setSheet(prev => ({
          ...prev,
          left: { open }
        }))}
      >
        <SheetContent
          side="left"
          showClose={false}
          className="top-16 p-0 sm:max-w-xl"
        >
          <LeftSidebar />
        </SheetContent>
      </Sheet>

      <MainContent />

      <Sheet
        open={sheet.right.open}
        onOpenChange={(open) => setSheet(prev => ({
          ...prev,
          right: { open }
        }))}
      >
        <SheetContent
          side="right"
          showClose={false}
          className="top-16 p-0 sm:max-w-xl"
        >
          <RightSidebar />
        </SheetContent>
      </Sheet>
    </div>
  )
} 