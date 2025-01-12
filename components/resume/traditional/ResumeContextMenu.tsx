"use client"

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  Pencil,
  Copy,
  FileDown,
  
  FileJson,
  Trash2,
  Type
} from "lucide-react"
import { Resume } from "@/types/resume"
import { ResumeAction } from "@/types/resume"

interface ResumeContextMenuProps {
  children: React.ReactNode
  resume: Resume
  onAction: (action: ResumeAction) => void
}

export function ResumeContextMenu({
  children,
  resume,
  onAction
}: ResumeContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem onClick={() => onAction({ type: 'rename', resume })}>
          <Type className="mr-2 h-4 w-4" />
          重命名
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onAction({ type: 'edit', resume })}>
          <Pencil className="mr-2 h-4 w-4" />
          编辑
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onAction({ type: 'duplicate', resume })}>
          <Copy className="mr-2 h-4 w-4" />
          复制
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => onAction({ type: 'export', resume })}>
          <FileDown className="mr-2 h-4 w-4" />
          下载 PDF
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onAction({ type: 'export', resume })}>
          <FileDown className="mr-2 h-4 w-4" />
          下载图片
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onAction({ type: 'export', resume })}>
          <FileJson className="mr-2 h-4 w-4" />
          导出 JSON
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem 
          onClick={() => onAction({ type: 'delete', resume })}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          删除
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
} 