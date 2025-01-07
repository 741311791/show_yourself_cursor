import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/session'
import { prisma } from '@/lib/prisma'

// 获取当前用户的所有作品
export async function GET() {
  try {
    const user = await requireAuth()
    
    const portfolios = await prisma.portfolio.findMany({
      where: { userId: user.id },
      orderBy: { date: 'desc' }
    })

    return NextResponse.json(portfolios)
  } catch (error) {
    console.error('Get portfolios error:', error)
    return new NextResponse('Unauthorized', { status: 401 })
  }
}

// 创建新的作品集
export async function POST(req: Request) {
  try {
    const user = await requireAuth()
    const data = await req.json()

    const portfolio = await prisma.portfolio.create({
      data: {
        ...data,
        userId: user.id
      }
    })

    return NextResponse.json(portfolio)
  } catch (error) {
    console.error('Create portfolio error:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
} 