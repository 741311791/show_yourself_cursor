"use client"

import {
  MoreHorizontal,
  Pencil,
  Copy,
  FileDown,
  Image,
  FileJson,
  Trash2,
  Type
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Resume } from "@/types/resume"
import { ResumeAction } from "@/types/resume"


interface ResumeDropdownMenuProps {
  resume: Resume
  onAction: (action: ResumeAction) => void
}

export function ResumeDropdownMenu({ resume, onAction }: ResumeDropdownMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => onAction({ type: 'rename', resume })}>
            <Type className="mr-2 h-4 w-4" />
            重命名
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAction({ type: 'edit', resume })}>
            <Pencil className="mr-2 h-4 w-4" />
            编辑
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAction({ type: 'duplicate', resume })}>
            <Copy className="mr-2 h-4 w-4" />
            复制
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => onAction({ type: 'export', resume })}>
            <FileDown className="mr-2 h-4 w-4" />
            下载 PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAction({ type: 'export', resume })}>
            <Image className="mr-2 h-4 w-4" />
            下载图片
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAction({ type: 'export', resume })}>
            <FileJson className="mr-2 h-4 w-4" />
            导出 JSON
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => onAction({ type: 'delete', resume })}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          删除
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 