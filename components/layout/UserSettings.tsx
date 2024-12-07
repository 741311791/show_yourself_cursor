"use client"

import { useState, useCallback } from 'react'
import { Moon, Sun, Settings, LogOut, User as UserIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/hooks/useTheme'
import { useClickOutside } from '@/hooks/useClickOutside'

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
  const [showUserMenu, setShowUserMenu] = useState(false)

  const closeMenu = useCallback(() => {
    setShowUserMenu(false)
  }, [])

  const userMenuRef = useClickOutside(closeMenu)

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  const handleLogout = () => {
    console.log('调用登出 API')
    // TODO: 实现登出逻辑
  }

  return (
    <div className="mt-auto space-y-2">
      {/* 设置 */}
      <Link
        href="/settings"
        className="flex items-center gap-2 px-4 py-2 w-full hover:bg-white/60 rounded-lg text-gray-700"
      >
        <Settings size={18} />
        <span>设置</span>
      </Link>

      {/* 底部操作栏 */}
      <div className="border-t border-gray-200 pt-2">
        <div className="flex items-center justify-between px-4 py-2">
          {/* 用户头像和菜单 */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center hover:bg-white/60 rounded-lg p-2 text-gray-700"
            >
              <div className="relative w-6 h-6 rounded-full overflow-hidden bg-gray-200">
                <Image
                  src={mockUser.avatar}
                  alt={mockUser.name}
                  fill
                  className="object-cover"
                />
              </div>
            </button>

            {/* 用户菜单 */}
            {showUserMenu && (
              <div className="absolute bottom-full left-0 mb-2 w-36 bg-white rounded-lg shadow-lg border py-1">
                <button
                  onClick={() => {
                    router.push('/settings#profile')
                    setShowUserMenu(false)
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <UserIcon size={16} />
                  <span>个人信息</span>
                </button>
                <button
                  onClick={() => {
                    handleLogout()
                    setShowUserMenu(false)
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-gray-50"
                >
                  <LogOut size={16} />
                  <span>退出</span>
                </button>
              </div>
            )}
          </div>

          {/* 主题切换 */}
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-white/60 rounded-lg text-gray-700"
          >
            {theme === 'light' ? (
              <Sun size={18} />
            ) : (
              <Moon size={18} />
            )}
          </button>
        </div>
      </div>
    </div>
  )
} 