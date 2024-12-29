import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Github } from "lucide-react"
import { signIn } from "next-auth/react"
import { validatePassword } from '@/lib/password'

interface RegisterCardProps {
  onSubmit: (data: { 
    email: string
    username: string
    password: string
    confirmPassword: string 
  }) => Promise<void>
  loading?: boolean
  error?: string
  className?: string
}

export function RegisterCard({
  className,
  onSubmit,
  loading = false,
  error,
}: RegisterCardProps) {
  const [formData, setFormData] = React.useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: ""
  })
  const [validationError, setValidationError] = React.useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 密码验证
    const { isValid, message } = validatePassword(formData.password)
    if (!isValid) {
      setValidationError(message)
      return
    }

    // 确认密码验证
    if (formData.password !== formData.confirmPassword) {
      setValidationError('两次输入的密码不一致')
      return
    }

    setValidationError("") // 清除验证错误
    onSubmit(formData)
  }

  return (
    <Card className={cn("w-[380px]", className)}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">注册账号</CardTitle>
        <CardDescription className="text-center">
          创建您的账号以开始使用
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">邮箱</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              disabled={loading}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="username">用户名</Label>
            <Input
              id="username"
              type="text"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              disabled={loading}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">密码</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              disabled={loading}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">确认密码</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              disabled={loading}
              required
            />
          </div>
          {(error || validationError) && (
            <div className="text-sm text-destructive">
              {validationError || error}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button 
            className="w-full" 
            type="submit"
            disabled={loading}
          >
            {loading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            注册
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                或者
              </span>
            </div>
          </div>
          <Button 
            variant="outline" 
            type="button"
            className="w-full"
            onClick={() => signIn('github')}
            disabled={loading}
          >
            <Github className="mr-2 h-4 w-4" />
            Github 登录
          </Button>
          <div className="text-center text-sm">
            已有账号？{" "}
            <Button variant="link" className="px-0" asChild>
              <a href="/auth/login">去登录</a>
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
} 