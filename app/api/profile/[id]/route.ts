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

    const profile = await prisma.profile.findUnique({
      where: {
        id,
        userId: user.id
      }
    })

    if (!profile) {
      return new NextResponse('Profile not found', { status: 404 })
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Get profile error:', error)
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

    const profile = await prisma.profile.update({
      where: {
        id,
        userId: user.id
      },
      data
    })

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Update profile error:', error)
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

    await prisma.profile.delete({
      where: {
        id,
        userId: user.id
      }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Delete profile error:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
} 