import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/session'
import { prisma } from '@/lib/prisma'

// 获取当前用户的所有教育经历
export async function GET() {
  try {
    const user = await requireAuth()
    
    const educations = await prisma.education.findMany({
      where: { userId: user.id },
      orderBy: { startDate: 'desc' }
    })

    return NextResponse.json(educations)
  } catch (error) {
    console.error('Get educations error:', error)
    return new NextResponse('Unauthorized', { status: 401 })
  }
}

// 创建新的教育经历
export async function POST(req: Request) {
  try {
    const user = await requireAuth()
    const data = await req.json()

    const education = await prisma.education.create({
      data: {
        ...data,
        userId: user.id
      }
    })

    return NextResponse.json(education)
  } catch (error) {
    console.error('Create education error:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}