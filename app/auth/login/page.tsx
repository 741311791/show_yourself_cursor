'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { LoginCard } from '@/components/auth/LoginCard'
import { AuthPageTemplate } from '@/components/auth/AuthPageTemplate'

export default function Login() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const message = searchParams.get('message')

  const handleSubmit = async (data: { email: string; password: string }) => {
    try {
      setLoading(true)
      setError('')

      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      })

      if (result?.error) {
        throw new Error(result.error)
      }

      router.push('/resume/traditional')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthPageTemplate 
      message={message}
      quote={{
        content: "这个平台帮助我创建了一份专业的简历，让我在求职过程中脱颖而出。",
        author: "Sofia Davis"
      }}
    >
      <LoginCard
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
      />
    </AuthPageTemplate>
  )
} 