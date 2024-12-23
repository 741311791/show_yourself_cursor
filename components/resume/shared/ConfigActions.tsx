"use client"

import { Download, Upload, Loader2, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ConfigActionsProps {
  isLoading?: boolean
  onLoad?: () => Promise<void>
  onSave?: () => Promise<void>
  className?: string
}

export function ConfigActions({
  isLoading,
  onLoad,
  onSave,
  className
}: ConfigActionsProps) {
  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-full hover:bg-background/80"
          >
            <MoreVertical className="h-4 w-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={onLoad}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            <span>从配置加载</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onSave}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            <span>保存至配置</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
} 