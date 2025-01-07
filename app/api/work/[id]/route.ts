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

    const work = await prisma.work.findUnique({
      where: {
        id,
        userId: user.id
      }
    })

    if (!work) {
      return new NextResponse('Work not found', { status: 404 })
    }

    return NextResponse.json(work)
  } catch (error) {
    console.error('Get work error:', error)
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

    const work = await prisma.work.update({
      where: {
        id,
        userId: user.id
      },
      data
    })

    revalidatePath('/timeline/work')

    return NextResponse.json(work)
  } catch (error) {
    console.error('Update work error:', error)
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

    await prisma.work.delete({
      where: {
        id,
        userId: user.id
      }
    })

    revalidatePath('/timeline/work')
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Delete work error:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
} 