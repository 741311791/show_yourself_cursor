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

    const research = await prisma.research.findUnique({
      where: {
        id,
        userId: user.id
      }
    })

    if (!research) {
      return new NextResponse('Research not found', { status: 404 })
    }

    return NextResponse.json(research)
  } catch (error) {
    console.error('Get research error:', error)
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

    const research = await prisma.research.update({
      where: {
        id,
        userId: user.id
      },
      data
    })

    return NextResponse.json(research)
  } catch (error) {
    console.error('Update research error:', error)
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

    // 首先删除相关的研究成果
    await prisma.researchResult.deleteMany({
      where: {
        researchId: id
      }
    })

    // 然后删除研究经历
    await prisma.research.delete({
      where: {
        id,
        userId: user.id
      }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Delete research error:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
} 