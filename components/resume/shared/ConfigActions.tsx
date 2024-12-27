"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Settings2 } from "lucide-react"

interface ConfigActionsProps {
  section: string  // 配置部分的名称
  onLoad: () => Promise<void>  // 加载配置的回调
  onSave: () => Promise<void>  // 保存配置的回调
}

export function ConfigActions({ section, onLoad, onSave }: ConfigActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Settings2 className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onLoad}>
          从配置加载
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onSave}>
          保存到配置
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 