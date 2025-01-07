"use client"

import { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react'
import Link from "next/link"
import { 
  FileText, History, HelpCircle, MessageSquare, 
  ChevronDown, User, GraduationCap, Briefcase,
  Folder, Heart, Languages, Award, Medal,
  BookOpen, BookMarked, Plus, Globe, Code,
  Pencil, Trash2, ScrollText, UserRound
} from "lucide-react"
import { motion } from "framer-motion"
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useCustomBlockStore } from '@/store/customBlock'
import { CustomBlockDialog } from "@/components/timeline/custom/CustomBlockDialog"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/shared/AlertDialog"
import { ScrollArea } from "@/components/ui/scroll-area"

// 从Sidebar组件复制相关类型和常量
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
    label: "个人履历",
    href: "/timeline",
    subItems: [
      { icon: User, label: "个人信息", href: "/timeline/profile" },
      { icon: GraduationCap, label: "教育经历", href: "/timeline/education" },
      { icon: UserRound, label: "学生经历", href: "/timeline/student" },
      { icon: Briefcase, label: "工作经历", href: "/timeline/work" },
      { icon: Folder, label: "项目经历", href: "/timeline/project" },
      { icon: BookMarked, label: "科研经历", href: "/timeline/research" },
      { icon: ScrollText, label: "研究成果", href: "/timeline/research-result" },
      { icon: Heart, label: "兴趣爱好", href: "/timeline/hobby" },
      { icon: Languages, label: "语言", href: "/timeline/languages" },
      { icon: Award, label: "技能", href: "/timeline/skills" },
      { icon: Medal, label: "获奖", href: "/timeline/awards" },
      { icon: BookOpen, label: "证书", href: "/timeline/certificates" },
      { icon: Globe, label: "出版物", href: "/timeline/publications" },
      { icon: Folder, label: "作品集", href: "/timeline/portfolio" },
      { 
        icon: Plus, 
        label: "新增自定义块", 
        href: "/timeline/custom",
        isCustomBlock: true
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

// 复制动画变体定义
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

const getCustomMenuItems = (blocks: any[], onDelete: (id: string) => void) => {
  return blocks.map(block => ({
    icon: FileText,
    label: block.name,
    href: `/timeline/custom/${block.route}`,
    isCustomBlock: true,
    blockId: block.id,
    onDelete: () => onDelete(block.id)
  }))
}

export function SidebarMenus() {
  const [deleteBlockId, setDeleteBlockId] = useState<string | null>(null)
  const blocks = useCustomBlockStore(state => state.blocks)
  const updateBlock = useCustomBlockStore(state => state.updateBlock)
  const removeBlock = useCustomBlockStore(state => state.removeBlock)
  const addBlock = useCustomBlockStore(state => state.addBlock)
  const pathname = usePathname()

  const [openMenus, setOpenMenus] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebarOpenMenus')
      return saved ? JSON.parse(saved) : ['简历管理', '个人履历']
    }
    return ['简历管理', '个人履历']
  })

  const [customBlockDialogOpen, setCustomBlockDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const scrollElement = containerRef.current?.querySelector('[data-radix-scroll-area-viewport]')
    
    if (scrollElement) {
      const savedPosition = sessionStorage.getItem('sidebarScrollPosition')
      if (savedPosition) {
        scrollElement.scrollTop = parseInt(savedPosition)
      }

      const handleScroll = () => {
        sessionStorage.setItem('sidebarScrollPosition', scrollElement.scrollTop.toString())
      }

      scrollElement.addEventListener('scroll', handleScroll)
      return () => scrollElement.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('sidebarOpenMenus', JSON.stringify(openMenus))
  }, [openMenus])

  const isActiveRoute = (href: string) => {
    if (href === '/') {
      return pathname === href
    }
    if (href === '/timeline/custom') {
      return pathname === href
    }
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  const toggleMenu = (label: string) => {
    setOpenMenus(prev => {
      const newState = prev.includes(label)
        ? prev.filter(item => item !== label)
        : [...prev, label]
      return newState
    })
  }

  const customMenuItems = useMemo(() => 
    getCustomMenuItems(blocks, setDeleteBlockId),
    [blocks]
  )

  const allTimelineMenuItems = useMemo(() => {
    const baseItems = timelineMenuItems[0].subItems || []
    return [{
      ...timelineMenuItems[0],
      subItems: [
        ...baseItems.slice(0, -1),
        ...customMenuItems,
        baseItems[baseItems.length - 1]
      ]
    }]
  }, [customMenuItems])

  const renderMenuItem = (item: MenuItem) => {
    const isOpen = openMenus.includes(item.label)
    const isActive = item.href ? isActiveRoute(item.href) : false

    return (
      <div key={item.label} className="space-y-1">
        <motion.div
          initial="initial"
          whileHover="hover"
          animate={isOpen ? "open" : "initial"}
          variants={menuItemVariants}
        >
          <div className="flex">
            {item.href ? (
              <Button
                variant="ghost"
                className="flex-1 justify-start gap-3"
                asChild
              >
                <Link href={item.href}>
                  <motion.div variants={iconVariants}>
                    <item.icon className="h-4 w-4" />
                  </motion.div>
                  <motion.span variants={labelVariants}>
                    {item.label}
                  </motion.span>
                </Link>
              </Button>
            ) : (
              <Button
                variant="ghost"
                className="flex-1 justify-start gap-3"
                onClick={() => toggleMenu(item.label)}
              >
                <motion.div variants={iconVariants}>
                  <item.icon className="h-4 w-4" />
                </motion.div>
                <motion.span variants={labelVariants}>
                  {item.label}
                </motion.span>
              </Button>
            )}
            {item.subItems && (
              <Button
                variant="ghost"
                size="icon"
                className="px-2"
                onClick={() => toggleMenu(item.label)}
              >
                <motion.div variants={chevronVariants}>
                  <ChevronDown className="h-4 w-4" />
                </motion.div>
              </Button>
            )}
          </div>
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

  const handleDelete = async () => {
    if (!deleteBlockId) return
    
    try {
      setIsDeleting(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      removeBlock(deleteBlockId)
    } catch (error) {
      console.error('删除失败:', error)
    } finally {
      setIsDeleting(false)
      setDeleteBlockId(null)
    }
  }

  return (
    <ScrollArea 
      ref={containerRef}
      className="flex-1 px-4 sidebar-scroll"
    >
      <div className="space-y-6">
          <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground px-4 mb-2">
            简历管理
          </p>
          {resumeMenuItems.map(renderMenuItem)}
          {allTimelineMenuItems.map(renderMenuItem)}
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

      <AlertDialog open={!!deleteBlockId} onOpenChange={() => setDeleteBlockId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除此自定义块吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>取消</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? '删除中...' : '删除'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <CustomBlockDialog
        open={customBlockDialogOpen}
        onOpenChange={setCustomBlockDialogOpen}
        onConfirm={async (data) => {
          try {
            await new Promise(resolve => setTimeout(resolve, 1000))
            const newBlock = {
              id: Math.random().toString(),
              name: data.name,
              route: data.route,
              type: data.type,
              fields: data.fields,
              icon: data.icon || 'FileText',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
            addBlock(newBlock)
            setCustomBlockDialogOpen(false)
          } catch (error) {
            console.error('新增失败:', error)
          }
        }}
      />
    </ScrollArea>
  )
} 