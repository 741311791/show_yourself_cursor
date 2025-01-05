import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/session'
import { prisma } from '@/lib/prisma'

// 获取研究成果列表
export async function GET(req: Request) {
  try {
    const user = await requireAuth()
    const { searchParams } = new URL(req.url)
    const researchId = searchParams.get('researchId')

    const results = await prisma.researchResult.findMany({
        where: { 
          userId: user.id,
          ...(researchId ? { researchId } : {}) // 如果提供了 researchId，则按 researchId 筛选
        },
        orderBy: { date: 'desc' }
      })

    return NextResponse.json(results)
  } catch (error) {
    console.error('Get research results error:', error)
    return new NextResponse('Unauthorized', { status: 401 })
  }
}

// 创建研究成果
export async function POST(req: Request) {
  try {
    const user = await requireAuth()
    const data = await req.json()

    const result = await prisma.researchResult.create({
      data: {
        ...data,
        userId: user.id
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Create research result error:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
} 