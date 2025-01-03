"use client"

import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useSession, signOut } from 'next-auth/react'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from "@/lib/utils"

export function UserSettings() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { data: session } = useSession()

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/')
  }

  if (!session?.user) {
    return null
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
              className="relative h-10 w-10 rounded-full p-0.5 ring-2 ring-primary/10 transition-all hover:ring-4 hover:ring-primary/20"
            >
              <Avatar className="h-full w-full rounded-full border-2 border-background">
                <AvatarImage 
                  src={session.user.image || ''} 
                  className="object-cover"
                />
                <AvatarFallback className="bg-primary/5 text-primary">
                  {session.user.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-background bg-green-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center gap-2 p-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={session.user.image || ''} />
                <AvatarFallback>
                  {session.user.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-0.5">
                <p className="text-sm font-medium">{session.user.name}</p>
                <p className="text-xs text-muted-foreground">{session.user.email}</p>
              </div>
            </div>
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