import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'

// GET /api/resumes - 获取当前用户的所有简历
export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const resumes = await prisma.resume.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: 'desc' }
    })

    return NextResponse.json(resumes)
  } catch (error) {
    console.error('Error fetching resumes:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

// POST /api/resumes - 创建新简历
export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const json = await req.json()
    const resume = await prisma.resume.create({
      data: {
        name: json.name,
        userId: user.id,
        profile: json.profile,
        config: json.config
      }
    })

    return NextResponse.json(resume)
  } catch (error) {
    console.error('Error creating resume:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
} 