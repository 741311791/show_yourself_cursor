"use client"

import { useRef } from "react"
import { useResumeStore } from "@/store/useResumeStore"
import { ProfileSection } from "@/components/resume/sections/ProfileSection"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  User, FileText, Medal, Share2, Briefcase,
  GraduationCap, Award, Gamepad2, Languages,
  Puzzle, BookOpen, Wrench, Users
} from "lucide-react"

// 定义部分配置
const sections = [
  { id: 'profile', icon: User, title: "基本信息" },
  { id: 'education', icon: GraduationCap, title: "教育经历" },
  { id: 'work', icon: Briefcase, title: "工作经历" },
  { id: 'projects', icon: Puzzle, title: "项目经历" },
  { id: 'skills', icon: Wrench, title: "技能特长" },
  { id: 'awards', icon: Medal, title: "获奖经历" },
  { id: 'certificates', icon: Award, title: "证书资质" },
  { id: 'publications', icon: BookOpen, title: "出版物" },
  { id: 'languages', icon: Languages, title: "语言能力" },
  { id: 'interests', icon: Gamepad2, title: "兴趣爱好" },
  { id: 'references', icon: Users, title: "推荐信" },
  { id: 'profiles', icon: Share2, title: "社交账号" }
] as const

export function LeftSidebar() {
  const { resumeData } = useResumeStore()
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
      {/* 左侧图标导航栏 */}
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

      {/* 右侧内容区域 */}
      <ScrollArea className="h-[calc(100vh-4rem)] flex-1">
        <div ref={contentRef} className="space-y-8 p-6">
          {/* 基本信息部分 */}
          <section id="profile">
            <ProfileSection />
          </section>

          {/* 其他部分 */}
          {sections.slice(1).map(({ id, title }) => (
            <section key={id} id={id} className="space-y-4">
              <h2 className="text-lg font-semibold">{title}</h2>
              <div className="rounded-lg border bg-card p-4">
                {/* 后续添加对应的编辑组件 */}
                <div className="h-32 flex items-center justify-center text-muted-foreground">
                  开发中...
                </div>
              </div>
            </section>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
} 