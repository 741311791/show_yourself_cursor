'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RegisterCard } from '@/components/auth/RegisterCard'
import { AuthPageTemplate } from '@/components/auth/AuthPageTemplate'

export default function Register() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (data: {
    email: string
    username: string
    password: string
    confirmPassword: string
  }) => {
    try {
      setLoading(true)
      setError('')

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const error = await res.text()
        throw new Error(error)
      }

      router.push('/auth/login?message=注册成功，请登录')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthPageTemplate
      quote={{
        content: "加入我们，开启您的职业生涯新篇章。",
        author: "John Doe"
      }}
    >
      <RegisterCard
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
      />
    </AuthPageTemplate>
  )
} 