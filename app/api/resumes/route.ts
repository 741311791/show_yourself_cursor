import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/session'
import { prisma } from '@/lib/prisma'

// 获取当前用户的所有简历
export async function GET() {
  try {
    const user = await requireAuth()
    
    const resumes = await prisma.resume.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(resumes)
  } catch (error) {
    console.error('Get resumes error:', error)
    return new NextResponse('Unauthorized', { status: 401 })
  }
}

// 创建新的简历
export async function POST(req: Request) {
  try {
    const user = await requireAuth()
    const data = await req.json()

    const resume = await prisma.resume.create({
      data: {
        ...data,
        userId: user.id
      }
    })

    return NextResponse.json(resume)
  } catch (error) {
    console.error('Create resume error:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
} 