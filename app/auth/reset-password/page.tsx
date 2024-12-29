'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ResetPasswordCard } from '@/components/auth/ResetPasswordCard'
import { Alert } from '@/components/ui/alert'

export default function ResetPassword() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'request' | 'reset'>('request')
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  useEffect(() => {
    if (token) {
      setStep('reset')
    }
  }, [token])

  const handleSubmit = async (data: { 
    email?: string
    password?: string
    confirmPassword?: string 
  }) => {
    try {
      setLoading(true)
      setError('')

      const endpoint = step === 'request' 
        ? '/api/auth/reset-password/request'
        : '/api/auth/reset-password/reset'

      const body = step === 'request'
        ? { email: data.email }
        : { token, password: data.password }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const error = await res.text()
        throw new Error(error)
      }

      const message = step === 'request'
        ? '重置密码链接已发送到您的邮箱'
        : '密码重置成功，请登录'

      router.push(`/auth/login?message=${message}`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <img src="/logo.svg" alt="Logo" className="h-8 w-8 mr-2" />
          ShowYourself
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "别担心，我们会帮您找回账号。"
            </p>
            <footer className="text-sm">Support Team</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[380px]">
          <ResetPasswordCard
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
            step={step}
          />
        </div>
      </div>
    </div>
  )
} 