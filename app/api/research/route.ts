import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/session'
import { prisma } from '@/lib/prisma'

// 获取研究经历列表
export async function GET(req: Request) {
  try {
    const user = await requireAuth()

    const researches = await prisma.research.findMany({
      where: {
        userId: user.id
      },
      orderBy: {
        startDate: 'desc'
      }
    })

    return NextResponse.json(researches)
  } catch (error) {
    console.error('Get researches error:', error)
    return new NextResponse('Unauthorized', { status: 401 })
  }
}

// 创建研究经历
export async function POST(req: Request) {
  try {
    const user = await requireAuth()
    const data = await req.json()

    const research = await prisma.research.create({
      data: {
        ...data,
        userId: user.id
      }
    })

    return NextResponse.json(research)
  } catch (error) {
    console.error('Create research error:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
} 