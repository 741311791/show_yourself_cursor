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

    const portfolio = await prisma.portfolio.findUnique({
      where: {
        id,
        userId: user.id
      }
    })

    if (!portfolio) {
      return new NextResponse('portfolio not found', { status: 404 })
    }

    return NextResponse.json(portfolio)
  } catch (error) {
    console.error('Get skill error:', error)
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

    const portfolio = await prisma.portfolio.update({
      where: {
        id,
        userId: user.id
      },
      data
    })

    revalidatePath('/timeline/portfolio')

    return NextResponse.json(portfolio)
  } catch (error) {
    console.error('Update skill error:', error)
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

    await prisma.portfolio.delete({
      where: {
        id,
        userId: user.id
      }
    })

    revalidatePath('/timeline/portfolio')
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Delete portfolio error:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
} 