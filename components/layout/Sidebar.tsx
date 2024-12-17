"use client"

import Link from "next/link"
import { UserSettings } from "./UserSettings"
import { SidebarMenus } from "./SidebarMenus"
import { cn } from "@/lib/utils"

export function Sidebar() {
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
      <SidebarMenus />

      {/* 用户设置区域 */}
      <div className="flex-none p-4 border-t border-border/40 bg-muted/90">
        <UserSettings />
      </div>
    </div>
  )
} 