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

interface LoginCardProps {
  onSubmit: (data: { email: string; password: string }) => Promise<void>
  loading?: boolean
  error?: string
  className?: string
}

export function LoginCard({ 
  className, 
  onSubmit,
  loading = false,
  error,
}: LoginCardProps) {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ email, password })
  }

  return (
    <Card className={cn("w-[380px]", className)}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">登录</CardTitle>
        <CardDescription className="text-center">
          输入您的邮箱和密码登录
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">密码</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          {error && (
            <div className="text-sm text-destructive">{error}</div>
          )}
          <div className="flex items-center justify-end">
            <Button variant="link" className="px-0" asChild>
              <a href="/auth/reset-password">忘记密码？</a>
            </Button>
          </div>
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
            登录
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
            还没有账号？{" "}
            <Button variant="link" className="px-0" asChild>
              <a href="/auth/register">注册</a>
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
} 