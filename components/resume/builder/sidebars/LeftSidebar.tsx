"use client"

import { useRef } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { ProfileSec } from "@/components/resume/sections/ProfileSec"
import { Button } from "@/components/ui/button"
import { EducationSec } from "@/components/resume/sections/EducationSec"
import { WorkSec } from "@/components/resume/sections/WorkSec"
import { ProjectSec } from "@/components/resume/sections/ProjectSec"
import { StudentSec } from "@/components/resume/sections/StudentSec"
import { LanguageSec } from "@/components/resume/sections/LanguageSec"
import { SkillSec } from "@/components/resume/sections/SkillSec"
import { AwardSec } from "@/components/resume/sections/AwardSec"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  User, Medal, Briefcase,
  GraduationCap, Award, Gamepad2, Languages,
  Puzzle, BookOpen, Wrench, ScrollText, UserRound,
  Sun, Moon, Home
} from "lucide-react"

// 定义部分配置
const sections = [
  { id: 'profile', icon: User, title: "基本信息" },
  { id: 'education', icon: GraduationCap, title: "教育经历" },
  { id: 'work', icon: Briefcase, title: "工作经历" },
  { id: 'projects', icon: Puzzle, title: "项目经历" },
  { id: 'student', icon: UserRound, title: "学生经历" },
  { id: 'languages', icon: Languages, title: "语言能力" },
  { id: 'skills', icon: Wrench, title: "技能特长" },
  { id: 'awards', icon: Medal, title: "获奖经历" },
  { id: 'research', icon: BookOpen, title: "研究经历" },
  { id: 'researchResult', icon: ScrollText, title: "研究成果" },
  { id: 'interests', icon: Gamepad2, title: "兴趣爱好" },
  { id: 'certificates', icon: Award, title: "证书资质" },
  { id: 'publications', icon: BookOpen, title: "出版物" }
] as const

export function LeftSidebar() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
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
      <div className="flex w-12 flex-col bg-muted/30 py-4">
        {/* 主要导航按钮 */}
        <div className="flex-1 flex flex-col items-center gap-1">
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

        {/* 底部功能按钮 */}
        <div className="flex flex-col items-center gap-2 pt-4 border-t border-border/50">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-lg"
            title={theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-lg"
            title="返回主页"
            onClick={() => router.push('/resume/traditional')}
          >
            <Home className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 右侧内容区域 */}
      <ScrollArea className="h-[calc(100vh-4rem)] flex-1">
        <div ref={contentRef} className="space-y-8 p-6">
          {/* 基本信息部分 */}
          <section id="profile">
            <ProfileSec />
          </section>

          {/* 教育经历部分 */}
          <section id="education">
            <EducationSec />
          </section>

          <section id="work">
            <WorkSec />
          </section>

          <section id="projects">
            <ProjectSec />
          </section>

          <section id="student">
            <StudentSec />
          </section>

          <section id="languages">
            <LanguageSec />
          </section>

          <section id="skills">
            <SkillSec />
          </section>

          <section id="awards">
            <AwardSec />
          </section>

          {/* 其他部分 */}
          {sections.slice(8).map(({ id, title }) => (
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
    </div>
  )
} 