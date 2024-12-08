"use client"

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { 
  Settings, LogOut, User as UserIcon,
  Moon, Sun
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface User {
  name: string
  avatar: string
}

const mockUser: User = {
  name: "张三",
  avatar: "https://picsum.photos/200"
}

export function UserSettings() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  const handleLogout = () => {
    console.log('调用登出 API')
    // TODO: 实现登出逻辑
  }

  return (
    <div className="space-y-2">
      {/* 设置按钮 */}
      <Button
        variant="ghost"
        className="w-full justify-start gap-3 hover-primary"
        asChild
      >
        <a href="/settings">
          <Settings className="h-4 w-4 text-primary-custom" />
          <span>设置</span>
        </a>
      </Button>

      <div className="flex items-center justify-between">
        {/* 用户头像和菜单 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-9 w-9 p-0"
            >
              <div className="relative w-8 h-8 rounded-full overflow-hidden">
                <Image
                  src={mockUser.avatar}
                  alt={mockUser.name}
                  fill
                  className="object-cover"
                />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem onClick={() => router.push('/settings#profile')}>
              <UserIcon className="mr-2 h-4 w-4" />
              <span>个人信息</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleLogout}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>退出</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 主题切换按钮 */}
        <Button
          variant="ghost"
          size="sm"
          className="w-9 px-0"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          <Sun className={cn(
            "h-4 w-4 rotate-0 scale-100 transition-all",
            theme === 'dark' && "rotate-90 scale-0"
          )} />
          <Moon className={cn(
            "absolute h-4 w-4 rotate-90 scale-0 transition-all",
            theme === 'dark' && "rotate-0 scale-100"
          )} />
          <span className="sr-only">切换主题</span>
        </Button>
      </div>
    </div>
  )
} 