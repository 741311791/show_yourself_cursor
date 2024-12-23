"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { 
  User, FileText, Medal, Share2, Briefcase,
  GraduationCap, Award, Gamepad2, Languages,
  Puzzle, BookOpen, Wrench, Users
} from "lucide-react"
import { ProfileSection } from "@/components/resume/sections/ProfileSection"
import { EducationSection } from "@/components/resume/sections/EducationSection"
// import { WorkSection } from "@/components/resume/sections/WorkSection"
// import { ProjectSection } from "@/components/resume/sections/ProjectSection"
// import { SkillSection } from "@/components/resume/sections/SkillSection"
// import { AwardSection } from "@/components/resume/sections/AwardSection"
import { ResumeDetail } from "@/types/resume"

// 更新图标映射
const sectionIcons = {
  basics: User,
  summary: FileText,
  awards: Medal,
  profiles: Share2,
  experience: Briefcase,
  education: GraduationCap,
  certifications: Award,
  interests: Gamepad2,
  languages: Languages,
  projects: Puzzle,
  publications: BookOpen,
  skills: Wrench,
  references: Users,
}

// 定义部分标题
const sectionTitles = {
  basics: "基本信息",
  summary: "个人简介",
  awards: "获奖经历",
  profiles: "社交账号",
  experience: "工作经历",
  education: "教育经历",
  certifications: "证书资质",
  interests: "兴趣爱好",
  languages: "语言能力",
  projects: "项目经历",
  publications: "出版物",
  skills: "技能特长"
}

interface LeftSidebarProps {
  data?: ResumeDetail
  onUpdate?: (data: Partial<ResumeDetail>) => void
}

export function LeftSidebar({ data, onUpdate }: LeftSidebarProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const scrollIntoView = (selector: string) => {
    const section = containerRef.current?.querySelector(selector)
    section?.scrollIntoView({ behavior: "smooth" })
  }

  const handleUpdate = (key: keyof ResumeDetail) => (value: ResumeDetail[typeof key]) => {
    onUpdate?.({ [key]: value })
  }

  return (
    <div className="flex bg-secondary-accent/30">
      <div className="hidden basis-12 flex-col items-center justify-between bg-secondary-accent/30 py-4 sm:flex">
        {Object.entries(sectionIcons).map(([id, Icon]) => (
          <Button
            key={id}
            size="icon"
            variant="ghost"
            className="size-8 rounded-full"
            onClick={() => scrollIntoView(`#${id}`)}
          >
            <Icon className="h-4 w-4" />
          </Button>
        ))}
      </div>

      <ScrollArea className="h-screen flex-1 pb-16 lg:pb-0">
        <div ref={containerRef} className="grid gap-y-6 p-6">
          {/* 基本信息 */}
          <section id="basics">
            <h2 className="mb-4 text-lg font-semibold">{sectionTitles.basics}</h2>
            <ProfileSection 
              data={data?.profile}
              onChange={handleUpdate("profile")}
            />
          </section>

          {/* 教育经历 */}
          <section id="education">
            <h2 className="mb-4 text-lg font-semibold">{sectionTitles.education}</h2>
            <EducationSection 
              data={data?.education}
              onChange={handleUpdate("education")}
            />
          </section>

          {/* 工作经历 */}
          {/* <section id="experience">
            <h2 className="mb-4 text-lg font-semibold">{sectionTitles.experience}</h2>
            <WorkSection 
              data={data?.work}
              onChange={handleUpdate("work")}
            />
          </section>
          <Separator /> */}

          {/* 项目经历 */}
          {/* <section id="projects">
            <h2 className="mb-4 text-lg font-semibold">{sectionTitles.projects}</h2>
            <ProjectSection 
              data={data?.projects}
              onChange={handleUpdate("projects")}
            />
          </section>
          <Separator /> */}

          {/* 技能特长 */}
          {/* <section id="skills">
            <h2 className="mb-4 text-lg font-semibold">{sectionTitles.skills}</h2>
            <SkillSection 
              data={data?.skills}
              onChange={handleUpdate("skills")}
            />
          </section>
          <Separator /> */}

          {/* 获奖经历 */}
          {/* <section id="awards">
            <h2 className="mb-4 text-lg font-semibold">{sectionTitles.awards}</h2>
            <AwardSection 
              data={data?.awards}
              onChange={handleUpdate("awards")}
            />
          </section> */}
        </div>
      </ScrollArea>
    </div>
  )
} 