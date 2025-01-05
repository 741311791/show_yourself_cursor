'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ResetPasswordCard } from '@/components/auth/ResetPasswordCard'
import { AuthPageTemplate } from '@/components/auth/AuthPageTemplate'

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
    <AuthPageTemplate
      quote={{
        content: "别担心，我们会帮您找回账号。",
        author: "Support Team"
      }}
    >
      <ResetPasswordCard
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
        step={step}
      />
    </AuthPageTemplate>
  )
} 