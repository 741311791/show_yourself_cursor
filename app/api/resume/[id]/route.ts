import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// 获取指定简历
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id } = await context.params

    const resume = await prisma.resume.findUnique({
      where: {
        id,
        userId: user.id
      }
    })

    if (!resume) {
      return new NextResponse('Resume not found', { status: 404 })
    }

    return NextResponse.json(resume)
  } catch (error) {
    console.error('Get resume error:', error)
    return new NextResponse('Unauthorized', { status: 401 })
  }
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id } = await context.params
    const data = await req.json()

    const resume = await prisma.resume.update({
      where: {
        id,
        userId: user.id
      },
      data
    })

    revalidatePath('/resume/traditional')

    return NextResponse.json(resume)
  } catch (error) {
    console.error('Update resume error:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

// 更新简历名称
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id } = await context.params
    const data = await req.json()

    const resume = await prisma.resume.update({
      where: {
        id,
        userId: user.id
      },
      data: {
        name: data.name
      }
    })

    revalidatePath('/resume/traditional')

    // 添加响应头
    return NextResponse.json(resume)
  } catch (error) {
    console.error('Update resume error:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id } = await context.params

    await prisma.resume.delete({
      where: {
        id,
        userId: user.id
      }
    })

    revalidatePath('/resume/traditional')
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Delete resume error:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
} 