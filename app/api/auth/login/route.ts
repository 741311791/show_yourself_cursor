import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return new NextResponse('用户不存在', { status: 400 })
    }

    const isValid = await compare(password, user.password)
    if (!isValid) {
      return new NextResponse('密码错误', { status: 400 })
    }

    const token = sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
} 