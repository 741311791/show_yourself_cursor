"use client"

import Link from "next/link"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarItemProps {
  title: string
  icon: LucideIcon
  href: string
  isActive?: boolean
}

export function SidebarItem({ 
  title, 
  icon: Icon, 
  href, 
  isActive 
}: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center rounded-md px-3 py-2 text-sm font-medium",
        "hover:bg-accent hover:text-accent-foreground",
        "transition-colors",
        isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
      )}
    >
      <Icon className={cn(
        "mr-2 h-4 w-4",
        "transition-transform group-hover:scale-110",
        isActive && "text-primary"
      )} />
      <span>{title}</span>
    </Link>
  )
} 