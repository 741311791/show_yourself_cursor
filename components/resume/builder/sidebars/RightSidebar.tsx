"use client"

import { useRef } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { TemplateSec } from "@/components/resume/sections/rightsidebar/TemplateSec"
import { 
  Layout, Palette, Share2, Download,
  Type, Grid, LayoutTemplate
} from "lucide-react"

// 定义部分配置
const sections = [
  { id: 'template', icon: LayoutTemplate, title: "模板" },
  { id: 'layout', icon: Layout, title: "布局" },
  { id: 'typography', icon: Type, title: "排版" },
  { id: 'theme', icon: Palette, title: "主题" },
  { id: 'pages', icon: Grid, title: "页面" },
  { id: 'share', icon: Share2, title: "分享" },
  { id: 'export', icon: Download, title: "导出" }
] as const

export function RightSidebar() {
  const contentRef = useRef<HTMLDivElement>(null)

  const scrollToSection = (sectionId: string) => {
    const section = contentRef.current?.querySelector(`#${sectionId}`)
    if (section) {
      section.scrollIntoView({ 
        behavior: "smooth",
        block: "start"
      })
    }
  }

  return (
    <div className="flex h-full">
      {/* 左侧内容区域 */}
      <ScrollArea className="h-[calc(100vh-4rem)] flex-1">
        <div ref={contentRef} className="space-y-8 p-6">
          {/* 模板部分 */}
          <TemplateSec />

          {/* 其他部分保持不变 */}
          {sections.slice(1).map(({ id, title }) => (
            <section key={id} id={id} className="space-y-4">
              <h2 className="text-lg font-semibold">{title}</h2>
              <div className="rounded-lg border bg-card p-4">
                <div className="h-32 flex items-center justify-center text-muted-foreground">
                  开发中...
                </div>
              </div>
            </section>
          ))}
        </div>
      </ScrollArea>

      {/* 右侧图标导航栏 */}
      <div className="flex w-12 flex-col items-center gap-1 bg-muted/30 py-4">
        {sections.map(({ id, icon: Icon, title }) => (
          <Button
            key={id}
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-lg"
            title={title}
            onClick={() => scrollToSection(id)}
          >
            <Icon className="h-4 w-4" />
          </Button>
        ))}
      </div>
    </div>
  )
} 