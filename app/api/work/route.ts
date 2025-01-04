import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/session'
import { prisma } from '@/lib/prisma'

// 获取当前用户的所有工作经历
export async function GET() {
  try {
    const user = await requireAuth()
    
    const works = await prisma.work.findMany({
      where: { userId: user.id },
      orderBy: { startDate: 'desc' }
    })

    return NextResponse.json(works)
  } catch (error) {
    console.error('Get works error:', error)
    return new NextResponse('Unauthorized', { status: 401 })
  }
}

// 创建新的工作经历
export async function POST(req: Request) {
  try {
    const user = await requireAuth()
    const data = await req.json()

    const work = await prisma.work.create({
      data: {
        ...data,
        userId: user.id
      }
    })

    return NextResponse.json(work)
  } catch (error) {
    console.error('Create work error:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
} 