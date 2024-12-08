"use client"

import { useState, useEffect } from 'react'
import Link from "next/link"
import { 
  FileText, History, HelpCircle, MessageSquare, 
  ChevronDown, User, GraduationCap, Briefcase,
  Folder, Heart, Languages, Award, Medal,
  BookOpen, BookMarked, Plus, Globe, Code
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { UserSettings } from "./UserSettings"

interface SubMenuItem {
  icon: typeof FileText
  label: string
  href: string
}

interface MenuItem {
  icon: typeof FileText
  label: string
  href?: string
  subItems?: SubMenuItem[]
}

const timelineMenuItems: MenuItem[] = [
  {
    icon: History,
    label: "简历配置",
    href: "/timeline",
    subItems: [
      { icon: User, label: "个人资料", href: "/timeline/profile" },
      { icon: GraduationCap, label: "教育经历", href: "/timeline/education" },
      { icon: Briefcase, label: "工作经历", href: "/timeline/work" },
      { icon: Folder, label: "项目经历", href: "/timeline/project" },
      { icon: Heart, label: "兴趣爱好", href: "/timeline/interests" },
      { icon: Languages, label: "语言", href: "/timeline/languages" },
      { icon: Award, label: "技能", href: "/timeline/skills" },
      { icon: Medal, label: "获奖", href: "/timeline/awards" },
      { icon: BookOpen, label: "证书", href: "/timeline/certificates" },
      { icon: BookMarked, label: "研究成果", href: "/timeline/research" },
      { icon: Globe, label: "出版物", href: "/timeline/publications" },
      { icon: Plus, label: "新增自定义块", href: "/timeline/custom" },
    ]
  }
]

const resumeMenuItems: MenuItem[] = [
  {
    icon: FileText,
    label: "简历管理",
    subItems: [
      { icon: FileText, label: "传统简历", href: "/resume/traditional" },
      { icon: Code, label: "Web简历", href: "/resume/web" },
    ]
  }
]

export function Sidebar() {
  const [openMenus, setOpenMenus] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebarOpenMenus')
      return saved ? JSON.parse(saved) : ['简历管理', '简历配置']
    }
    return ['简历管理', '简历配置']
  })

  useEffect(() => {
    localStorage.setItem('sidebarOpenMenus', JSON.stringify(openMenus))
  }, [openMenus])

  const toggleMenu = (label: string) => {
    setOpenMenus(prev => {
      const newState = prev.includes(label)
        ? prev.filter(item => item !== label)
        : [...prev, label]
      return newState
    })
  }

  const renderMenuItem = (item: MenuItem) => {
    const isOpen = openMenus.includes(item.label)

    return (
      <div key={item.label} className="space-y-1">
        <Button
          variant="ghost"
          className="w-full justify-between"
          onClick={() => toggleMenu(item.label)}
        >
          <div className="flex items-center gap-3">
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </div>
          {item.subItems && (
            <ChevronDown 
              className={cn(
                "h-4 w-4 transition-transform",
                isOpen && "rotate-180"
              )}
            />
          )}
        </Button>

        {item.subItems && isOpen && (
          <div className="ml-4 pl-4 border-l space-y-1">
            {item.subItems.map(subItem => (
              <Button
                key={subItem.href}
                variant="ghost"
                className="w-full justify-start gap-3"
                asChild
              >
                <Link href={subItem.href}>
                  <subItem.icon className="h-4 w-4" />
                  <span>{subItem.label}</span>
                </Link>
              </Button>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="fixed left-0 top-0 z-20 h-full w-60 border-r bg-background flex flex-col">
      {/* Logo 区域 */}
      <div className="flex-none p-4">
        <Link href="/" className="block">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 logo-gradient rounded-xl flex items-center justify-center shadow-lg mb-2">
              <span className="text-2xl font-bold text-white">S</span>
            </div>
            <div className="text-center">
              <h1 className="text-xl font-bold logo-gradient bg-clip-text text-transparent">
                Show Yourself
              </h1>
              <p className="text-xs text-muted-foreground mt-1">创建专业的简历</p>
            </div>
          </div>
        </Link>
      </div>

      <Separator />

      {/* 可滚动的内容区域 */}
      <ScrollArea className="flex-grow">
        <div className="p-4 space-y-6">
          {/* 第一组：简历相关 */}
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground px-4 mb-2">简历管理</p>
            {timelineMenuItems.map(renderMenuItem)}
            {resumeMenuItems.map(renderMenuItem)}
          </div>

          <Separator />

          {/* 支持 */}
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground px-4 mb-2">支持</p>
            <Button variant="ghost" className="w-full justify-start gap-3" asChild>
              <Link href="/help">
                <HelpCircle className="h-4 w-4" />
                <span>帮助</span>
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3" asChild>
              <Link href="/feedback">
                <MessageSquare className="h-4 w-4" />
                <span>反馈</span>
              </Link>
            </Button>
          </div>
        </div>
      </ScrollArea>

      {/* 用户设置区域 - 修改这部分 */}
      <div className="flex-none p-4 border-t bg-background">
        <UserSettings />
      </div>
    </div>
  )
} 