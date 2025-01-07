import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/session'
import { prisma } from '@/lib/prisma'

// 获取当前用户的所有学生经历
export async function GET() {
  try {
    const user = await requireAuth()
    
    const students = await prisma.student.findMany({
      where: { userId: user.id },
      orderBy: { startDate: 'desc' }
    })

    return NextResponse.json(students)
  } catch (error) {
    console.error('Get students error:', error)
    return new NextResponse('Unauthorized', { status: 401 })
  }
}

// 创建新的学生经历
export async function POST(req: Request) {
  try {
    const user = await requireAuth()
    const data = await req.json()

    const student = await prisma.student.create({
      data: {
        ...data,
        userId: user.id
      }
    })

    return NextResponse.json(student)
  } catch (error) {
    console.error('Create student error:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
} 