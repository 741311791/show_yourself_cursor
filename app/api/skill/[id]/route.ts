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

    const skill = await prisma.skill.findUnique({
      where: {
        id,
        userId: user.id
      }
    })

    if (!skill) {
      return new NextResponse('Skill not found', { status: 404 })
    }

    return NextResponse.json(skill)
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

    const skill = await prisma.skill.update({
      where: {
        id,
        userId: user.id
      },
      data
    })

    revalidatePath('/timeline/skill')

    return NextResponse.json(skill)
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

    await prisma.skill.delete({
      where: {
        id,
        userId: user.id
      }
    })

    revalidatePath('/timeline/skill')
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Delete skill error:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
} 