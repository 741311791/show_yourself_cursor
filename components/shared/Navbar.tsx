'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import logo from '@/public/logo.svg'

const navItems = [
  {
    title: '简历制作',
    href: '/resume/builder'
  },
  {
    title: '履历管理',
    href: '/timeline'
  },
  {
    title: '个人主页',
    href: '/profile'
  },
  {
    title: '面经分享',
    href: '/interviews'
  }
]

export function Navbar() {
  const { data: session } = useSession()
  const router = useRouter()

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/')
  }

  return (
    <nav className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Logo */}
        <Link href="/" className="mr-8 flex items-center space-x-2">
          <img src={logo.src} alt="Logo" className="h-16 w-16" />
          <span className="font-bold">ShowYourself</span>
        </Link>

        {/* Navigation Items */}
        <NavigationMenu className="mx-auto">
          <NavigationMenuList>
            {navItems.map((item) => (
              <NavigationMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    {item.title}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Language Selector */}
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
            >
              <Globe className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {Object.entries(languages).map(([locale, { label, flag }]) => (
              <DropdownMenuItem
                key={locale}
                onClick={() => {
                  router.replace(`/${locale}${pathname}`)
                }}
              >
                <span className="mr-2">{flag}</span>
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu> */}

        {/* Auth Buttons */}
        <div className="ml-auto flex items-center space-x-4">
          {session?.user ? (
            <>
              <div className="flex items-center space-x-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session.user.image || ''} />
                  <AvatarFallback>
                    {session.user.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">
                  欢迎，{session.user.name}
                </span>
                <Button variant="ghost" onClick={handleLogout}>
                  注销
                </Button>
              </div>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => router.push('/auth/login')}>
                登录
              </Button>
              <Button onClick={() => router.push('/auth/register')}>
                注册
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
} 