import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { validatePassword } from '@/lib/password'

export async function POST(req: Request) {
  try {
    const { email, username, password } = await req.json()

    // 验证密码强度
    const { isValid, message } = validatePassword(password)
    if (!isValid) {
      return new NextResponse(message, { status: 400 })
    }

    // 检查邮箱是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return new NextResponse('邮箱已被注册', { status: 400 })
    }

    // 创建用户
    const hashedPassword = await hash(password, 12)
    await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        salt: '',
        role: 'COMMON_USER',
        status: 'ACTIVE'
      }
    })

    return new NextResponse('注册成功', { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      console.error('Registration error:', error)
      return new NextResponse(error.message, { status: 400 })
    }
    return new NextResponse('注册失败', { status: 500 })
  }
} 