"use client"

import { useState, useEffect } from 'react'
import { 
  FileText, History, HelpCircle, MessageSquare, 
  ChevronDown, User, GraduationCap, Briefcase,
  Folder, Heart, Languages, Award, Medal,
  BookOpen, BookMarked, Plus, Globe, Code
} from "lucide-react"
import Link from "next/link"
import { UserSettings } from "./UserSettings"
import { cn } from "@/lib/utils"

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
      return saved ? JSON.parse(saved) : ['简历管理', '人生时间线']
    }
    return ['简历管理', '人生时间线']
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
      <div key={item.label}>
        <button
          onClick={() => toggleMenu(item.label)}
          className="flex items-center justify-between w-full px-3 py-2 hover:bg-white rounded-lg text-gray-700 hover:text-[#FF4D4F] transition-colors"
        >
          <div className="flex items-center gap-3">
            <item.icon size={18} />
            <span>{item.label}</span>
          </div>
          {item.subItems && (
            <ChevronDown 
              size={16} 
              className={cn(
                "transition-transform",
                isOpen && "rotate-180"
              )}
            />
          )}
        </button>

        {item.subItems && isOpen && (
          <div className="ml-9 mt-1 space-y-1">
            {item.subItems.map(subItem => (
              <Link
                key={subItem.href}
                href={subItem.href}
                className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-white rounded-lg text-gray-700 hover:text-[#FF4D4F] transition-colors"
              >
                <subItem.icon size={16} />
                <span>{subItem.label}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="fixed left-0 top-0 h-full w-60 bg-[#F5F5F5] flex flex-col">
      {/* Logo 区域 - 固定在顶部 */}
      <div className="flex-none p-4">
        <Link href="/" className="block">
          <div className="flex flex-col items-center">
            {/* Logo 图标 */}
            <div className="w-12 h-12 bg-gradient-to-br from-[#FF4D4F] to-[#FF7875] rounded-xl flex items-center justify-center shadow-lg mb-2">
              <span className="text-2xl font-bold text-white">S</span>
            </div>
            {/* 网站标题 */}
            <div className="text-center">
              <h1 className="text-xl font-bold bg-gradient-to-r from-[#FF4D4F] to-[#FF7875] bg-clip-text text-transparent">
                Show Yourself
              </h1>
              <p className="text-xs text-gray-500 mt-1">创建专业的简历</p>
            </div>
          </div>
        </Link>
      </div>

      {/* 可滚动的内容区域 */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
        <div className="p-4">
          {/* 第一组：简历相关 */}
          <nav className="space-y-1 mb-8">
            <p className="text-xs text-gray-500 px-3 mb-2">简历管理</p>
            {timelineMenuItems.map(renderMenuItem)}
            {resumeMenuItems.map(renderMenuItem)}
          </nav>
        </div>
      </div>

      {/* 底部固定区域：帮助、反馈和用户设置 */}
      <div className="flex-none p-4 space-y-4 border-t border-gray-100">
        {/* 帮助和反馈 */}
        <nav className="space-y-1">
          <p className="text-xs text-gray-500 px-3 mb-2">支持</p>
          <Link 
            href="/help"
            className="flex items-center gap-3 px-3 py-2 hover:bg-white rounded-lg text-gray-700 hover:text-[#FF4D4F] transition-colors"
          >
            <HelpCircle size={18} />
            <span>帮助</span>
          </Link>
          <Link 
            href="/feedback"
            className="flex items-center gap-3 px-3 py-2 hover:bg-white rounded-lg text-gray-700 hover:text-[#FF4D4F] transition-colors"
          >
            <MessageSquare size={18} />
            <span>反馈</span>
          </Link>
        </nav>

        {/* 用户设置 */}
        <UserSettings />
      </div>
    </div>
  )
} 