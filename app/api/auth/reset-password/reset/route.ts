import { NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { validatePassword } from '@/lib/password'

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json()

    // 验证令牌
    const decoded = verify(token, process.env.JWT_SECRET!) as { userId: string }
    if (!decoded?.userId) {
      return new NextResponse('无效的重置链接', { status: 400 })
    }

    // 验证密码强度
    const { isValid, message } = validatePassword(password)
    if (!isValid) {
      return new NextResponse(message, { status: 400 })
    }

    // 更新密码
    const hashedPassword = await hash(password, 12)
    await prisma.user.update({
      where: { id: decoded.userId },
      data: { password: hashedPassword }
    })

    return new NextResponse('密码重置成功', { status: 200 })
  } catch (error) {
    console.error('Reset password error:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
} 