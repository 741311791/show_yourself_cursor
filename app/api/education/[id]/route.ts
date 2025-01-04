import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id } = await context.params

    const education = await prisma.education.findUnique({
      where: {
        id,
        userId: user.id
      }
    })

    if (!education) {
      return new NextResponse('Education not found', { status: 404 })
    }

    return NextResponse.json(education)
  } catch (error) {
    console.error('Get education error:', error)
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

    const education = await prisma.education.update({
      where: {
        id,
        userId: user.id
      },
      data
    })

    return NextResponse.json(education)
  } catch (error) {
    console.error('Update education error:', error)
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

    await prisma.education.delete({
      where: {
        id,
        userId: user.id
      }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Delete education error:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
} 