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

    const result = await prisma.researchResult.findUnique({
      where: {
        id,
        userId: user.id
      }
    })

    if (!result) {
      return new NextResponse('Research result not found', { status: 404 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Get research result error:', error)
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

    const result = await prisma.researchResult.update({
      where: {
        id,
        userId: user.id
      },
      data
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Update research result error:', error)
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

    await prisma.researchResult.delete({
      where: {
        id,
        userId: user.id
      }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Delete research result error:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
} 