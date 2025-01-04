import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/session'
import { prisma } from '@/lib/prisma'

// 获取当前用户的所有项目经历
export async function GET(req: Request) {
  try {
    const user = await requireAuth()
    const { searchParams } = new URL(req.url)
    const workId = searchParams.get('workId')
    
    const projects = await prisma.project.findMany({
      where: { 
        userId: user.id,
        ...(workId ? { workId } : {}) // 如果提供了 workId，则按 workId 筛选
      },
      orderBy: { startDate: 'desc' }
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Get projects error:', error)
    return new NextResponse('Unauthorized', { status: 401 })
  }
}

// 创建新的项目经历
export async function POST(req: Request) {
  try {
    const user = await requireAuth()
    const data = await req.json()

    const project = await prisma.project.create({
      data: {
        ...data,
        userId: user.id
      }
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error('Create project error:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}