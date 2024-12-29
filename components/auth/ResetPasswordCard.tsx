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
import { Loader2 } from "lucide-react"
import { validatePassword } from '@/lib/password'

interface ResetPasswordCardProps {
  onSubmit: (data: { email?: string; password?: string; confirmPassword?: string }) => Promise<void>
  loading?: boolean
  error?: string
  step: 'request' | 'reset'
  className?: string
}

export function ResetPasswordCard({
  className,
  onSubmit,
  loading = false,
  error,
  step,
}: ResetPasswordCardProps) {
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [validationError, setValidationError] = React.useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (step === 'reset') {
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
    }

    setValidationError("") // 清除验证错误
    if (step === 'request') {
      onSubmit({ email: formData.email })
    } else {
      onSubmit({ password: formData.password, confirmPassword: formData.confirmPassword })
    }
  }

  return (
    <Card className={cn("w-[380px]", className)}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">
          {step === 'request' ? '重置密码' : '设置新密码'}
        </CardTitle>
        <CardDescription className="text-center">
          {step === 'request' 
            ? '输入您的邮箱，我们将发送重置链接'
            : '请输入您的新密码'
          }
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-4">
          {step === 'request' ? (
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
          ) : (
            <>
              <div className="grid gap-2">
                <Label htmlFor="password">新密码</Label>
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
                <Label htmlFor="confirmPassword">确认新密码</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  disabled={loading}
                  required
                />
              </div>
            </>
          )}
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
            {step === 'request' ? '发送重置链接' : '重置密码'}
          </Button>
          <div className="text-center text-sm">
            <Button variant="link" className="px-0" asChild>
              <a href="/auth/login">返回登录</a>
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
} 