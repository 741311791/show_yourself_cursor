"use client"

import { useState, useEffect, useMemo } from 'react'
import Link from "next/link"
import { 
  FileText, History, HelpCircle, MessageSquare, 
  ChevronDown, User, GraduationCap, Briefcase,
  Folder, Heart, Languages, Award, Medal,
  BookOpen, BookMarked, Plus, Globe, Code,
  Pencil, Trash2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { UserSettings } from "./UserSettings"
import { motion } from "motion/react"
import { usePathname } from 'next/navigation'
import { CustomBlockDialog } from "@/components/timeline/custom/CustomBlockDialog"
import { useCustomBlockStore } from '@/store/customBlock'
import { CustomBlock } from "@/types/custom"

interface SubMenuItem {
  icon: typeof FileText
  label: string
  href: string
  isCustomBlock?: boolean
  blockId?: string
  onEdit?: () => void
  onDelete?: () => void
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
      { icon: User, label: "个人信息", href: "/timeline/profile" },
      { icon: GraduationCap, label: "教育经历", href: "/timeline/education" },
      { icon: Briefcase, label: "工作经历", href: "/timeline/work" },
      { icon: Folder, label: "项目经历", href: "/timeline/project" },
      { icon: BookMarked, label: "科研经历", href: "/timeline/research" },
      { icon: Heart, label: "兴趣爱好", href: "/timeline/hobby" },
      { icon: Languages, label: "语言", href: "/timeline/languages" },
      { icon: Award, label: "技能", href: "/timeline/skills" },
      { icon: Medal, label: "获奖", href: "/timeline/awards" },
      { icon: BookOpen, label: "证书", href: "/timeline/certificates" },
      { icon: Globe, label: "出版物", href: "/timeline/publications" },
      { 
        icon: Plus, 
        label: "新增自定义块", 
        href: "/timeline/custom",
        isCustomBlock: true  // 标记为自定义块菜单
      },
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

// 将函数改为自定义 hook
const useActiveRoute = () => {
  const pathname = usePathname()
  
  return (href: string) => {
    if (href === '/') {
      return pathname === href
    }
    return pathname === href || pathname.startsWith(`${href}/`)
  }
}

// 定义动画变体
const menuItemVariants = {
  initial: { 
    backgroundColor: "transparent",
    boxShadow: "none",
    transition: { duration: 0.2 }
  },
  hover: { 
    backgroundColor: "hsl(var(--muted) / 0.8)",
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    transition: { duration: 0.2 }
  },
  active: {
    backgroundColor: "hsl(var(--primary) / 0.1)",
    transition: { duration: 0.2 }
  }
}

const iconVariants = {
  initial: { 
    color: "hsl(var(--muted-foreground))",
    x: 0
  },
  hover: { 
    color: "hsl(var(--primary))",
    x: 2,
    transition: { duration: 0.2 }
  }
}

const labelVariants = {
  initial: { x: 0 },
  hover: { 
    x: 4,
    transition: { duration: 0.2 }
  }
}

const chevronVariants = {
  initial: { rotate: 0 },
  open: { 
    rotate: 180,
    transition: { duration: 0.2 }
  }
}

const useCustomBlocks = () => {
  const blocks = useCustomBlockStore(state => state.blocks)
  const removeBlock = useCustomBlockStore(state => state.removeBlock)
  const updateBlock = useCustomBlockStore(state => state.updateBlock)

  return {
    customMenuItems: blocks.map(block => ({
      icon: FileText,
      label: block.name,
      href: `/timeline/custom/${block.route}`,
      isCustomBlock: true,
      blockId: block.id,
      onEdit: () => {
        updateBlock(block.id, {
          name: block.name,
          // ... 其他需要更新的属性
        })
      },
      onDelete: async () => {
        if (confirm('确定要删除此自定义块吗？')) {
          try {
            // TODO: 调用删除API
            await new Promise(resolve => setTimeout(resolve, 1000))
            removeBlock(block.id)
          } catch (error) {
            console.error('删除失败:', error)
          }
        }
      }
    }))
  }
}

export function Sidebar() {
  const addBlock = useCustomBlockStore(state => state.addBlock)
  const isActiveRoute = useActiveRoute()

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

  const [customBlockDialogOpen, setCustomBlockDialogOpen] = useState(false)

  const { customMenuItems } = useCustomBlocks()

  const allTimelineMenuItems = useMemo(() => {
    const baseItems = timelineMenuItems[0].subItems || []
    return [{
      ...timelineMenuItems[0],
      subItems: [
        ...baseItems.slice(0, -1),
        ...customMenuItems,
        baseItems[baseItems.length - 1] // 保持"新增自定义块"在最后
      ]
    }]
  }, [customMenuItems])

  const renderMenuItem = (item: MenuItem) => {
    const isOpen = openMenus.includes(item.label)

    return (
      <div key={item.label} className="space-y-1">
        <motion.div
          initial="initial"
          whileHover="hover"
          animate={isOpen ? "open" : "initial"}
          variants={menuItemVariants}
        >
          <Button
            variant="ghost"
            className="w-full justify-between"
            onClick={() => toggleMenu(item.label)}
          >
            <div className="flex items-center gap-3">
              <motion.div variants={iconVariants}>
                <item.icon className="h-4 w-4" />
              </motion.div>
              <motion.span variants={labelVariants}>
                {item.label}
              </motion.span>
            </div>
            {item.subItems && (
              <motion.div variants={chevronVariants}>
                <ChevronDown className="h-4 w-4" />
              </motion.div>
            )}
          </Button>
        </motion.div>

        {item.subItems && isOpen && (
          <div className="ml-4 pl-4 border-l border-primary/20 space-y-1">
            {item.subItems.map(subItem => {
              const isActive = isActiveRoute(subItem.href)
              return (
                <div key={subItem.href} className="group relative">
                  {subItem.isCustomBlock && !subItem.blockId ? (
                    <motion.div
                      initial="initial"
                      whileHover="hover"
                      animate={isActive ? "active" : "initial"}
                      variants={menuItemVariants}
                      className="rounded-md overflow-hidden"
                    >
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-3"
                        onClick={() => setCustomBlockDialogOpen(true)}
                      >
                        <motion.div variants={iconVariants}>
                          <subItem.icon className="h-4 w-4" />
                        </motion.div>
                        <motion.span variants={labelVariants}>
                          {subItem.label}
                        </motion.span>
                      </Button>
                    </motion.div>
                  ) : subItem.isCustomBlock && subItem.blockId ? (
                    <motion.div
                      initial="initial"
                      whileHover="hover"
                      animate={isActive ? "active" : "initial"}
                      variants={menuItemVariants}
                      className="rounded-md overflow-hidden"
                    >
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-3"
                        asChild
                      >
                        <Link href={subItem.href}>
                          <motion.div 
                            initial={false}
                            variants={iconVariants}
                            animate={isActive ? { color: "hsl(var(--primary))" } : {}}
                          >
                            <subItem.icon className="h-4 w-4" />
                          </motion.div>
                          <motion.span 
                            initial={false}
                            variants={labelVariants}
                            animate={isActive ? { fontWeight: 500 } : {}}
                          >
                            {subItem.label}
                          </motion.span>
                        </Link>
                      </Button>
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                          onClick={(e) => {
                            e.stopPropagation()
                            subItem.onEdit?.()
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation()
                            subItem.onDelete?.()
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial="initial"
                      whileHover="hover"
                      animate={isActive ? "active" : "initial"}
                      variants={menuItemVariants}
                      className="rounded-md overflow-hidden"
                    >
                      <Button variant="ghost" className="w-full justify-start gap-3" asChild>
                        <Link href={subItem.href}>
                          <motion.div 
                            initial={false}
                            variants={iconVariants}
                            animate={isActive ? { color: "hsl(var(--primary))" } : {}}
                          >
                            <subItem.icon className="h-4 w-4" />
                          </motion.div>
                          <motion.span 
                            initial={false}
                            variants={labelVariants}
                            animate={isActive ? { fontWeight: 500 } : {}}
                          >
                            {subItem.label}
                          </motion.span>
                        </Link>
                      </Button>
                    </motion.div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn(
      "fixed left-0 top-0 z-20",
      "h-screen w-64",
      "border-r border-border/40",
      "bg-gradient-to-b from-muted/80 to-muted",
      "backdrop-blur-sm",
      "shadow-[1px_0_3px_rgba(0,0,0,0.05)]",
      "flex flex-col"
    )}>
      {/* Logo 区域 */}
      <div className="flex-none p-4 hover:opacity-80 transition-opacity">
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

      {/* 可滚动区域 */}
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-6">
          {/* 第一组：简历相关 */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground px-4 mb-2">
              简历管理
            </p>
            {allTimelineMenuItems.map(renderMenuItem)}
            {resumeMenuItems.map(renderMenuItem)}
          </div>

          {/* 支持 */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground px-4 mb-2">
              支持
            </p>
            <Button 
              variant="ghost" 
              className={cn(
                "w-full justify-start gap-3 group",
                "hover:bg-muted/80 hover:shadow-sm",
                "transition-all duration-200"
              )} 
              asChild
            >
              <Link href="/help">
                <HelpCircle className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="group-hover:translate-x-1 transition-transform duration-200">
                  帮助
                </span>
              </Link>
            </Button>
            <Button 
              variant="ghost" 
              className={cn(
                "w-full justify-start gap-3 group",
                "hover:bg-muted/80 hover:shadow-sm",
                "transition-all duration-200"
              )} 
              asChild
            >
              <Link href="/feedback">
                <MessageSquare className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="group-hover:translate-x-1 transition-transform duration-200">
                  反馈
                </span>
              </Link>
            </Button>
          </div>
        </div>
      </ScrollArea>

      {/* 用户设置区域 */}
      <div className="flex-none p-4 border-t border-border/40 bg-muted/90">
        <UserSettings />
      </div>

      <CustomBlockDialog
        open={customBlockDialogOpen}
        onOpenChange={setCustomBlockDialogOpen}
        onConfirm={async (data) => {
          try {
            // TODO: 调用新增自定义块API
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            // 生成新的自定义块
            const newBlock: CustomBlock = {
              id: Math.random().toString(),
              name: data.name,
              route: data.route,
              type: data.type,
              fields: data.fields,
              icon: data.icon || 'FileText',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
            
            // 加到store中
            addBlock(newBlock)
            
            // 关闭对话框
            setCustomBlockDialogOpen(false)
            
            // 可选：显示成功提示
            // toast.success('创建成功')
            
          } catch (error) {
            console.error('新增失败:', error)
            // 可选：显示错误提示
            // toast.error('创建失败，请重试')
          }
        }}
      />
    </div>
  )
} 