import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/session'
import { prisma } from '@/lib/prisma'

// 获取当前用户的所有技能
export async function GET() {
  try {
    const user = await requireAuth()
    
    const skills = await prisma.skill.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(skills)
  } catch (error) {
    console.error('Get skills error:', error)
    return new NextResponse('Unauthorized', { status: 401 })
  }
}

// 创建新的技能
export async function POST(req: Request) {
  try {
    const user = await requireAuth()
    const data = await req.json()

    const skill = await prisma.skill.create({
      data: {
        ...data,
        userId: user.id
      }
    })

    return NextResponse.json(skill)
  } catch (error) {
    console.error('Create skill error:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
} 