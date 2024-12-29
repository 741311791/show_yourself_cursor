import { NextResponse } from 'next/server'
import { sign } from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'
import { sendResetPasswordEmail } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return new NextResponse('用户不存在', { status: 400 })
    }

    // 生成重置令牌
    const token = sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    )

    // 发送重置邮件
    await sendResetPasswordEmail(email, token)

    return new NextResponse('重置链接已发送', { status: 200 })
  } catch (error) {
    console.error('Reset password request error:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
} 