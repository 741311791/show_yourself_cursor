import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id } = await context.params

    const student = await prisma.student.findUnique({
      where: {
        id,
        userId: user.id
      }
    })

    if (!student) {
      return new NextResponse('Student not found', { status: 404 })
    }

    return NextResponse.json(student)
  } catch (error) {
    console.error('Get student error:', error)
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

    const student = await prisma.student.update({
      where: {
        id,
        userId: user.id
      },
      data
    })

    revalidatePath('/timeline/student')

    return NextResponse.json(student)
  } catch (error) {
    console.error('Update student error:', error)
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

    await prisma.student.delete({
      where: {
        id,
        userId: user.id
      }
    })

    revalidatePath('/timeline/student')
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Delete student error:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
} 