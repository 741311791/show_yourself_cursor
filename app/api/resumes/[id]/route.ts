import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'

// GET /api/resumes/[id] - 获取指定简历
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const resume = await prisma.resume.findUnique({
      where: { 
        id: params.id,
        userId: user.id
      }
    })

    if (!resume) {
      return new NextResponse('Not Found', { status: 404 })
    }

    return NextResponse.json(resume)
  } catch (error) {
    console.error('Error fetching resume:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

// PATCH /api/resumes/[id] - 更新简历
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const json = await req.json()
    const resume = await prisma.resume.update({
      where: { 
        id: params.id,
        userId: user.id
      },
      data: json
    })

    return NextResponse.json(resume)
  } catch (error) {
    console.error('Error updating resume:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

// DELETE /api/resumes/[id] - 删除简历
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    await prisma.resume.delete({
      where: { 
        id: params.id,
        userId: user.id
      }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting resume:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
} 