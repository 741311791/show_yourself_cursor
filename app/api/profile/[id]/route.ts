import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

interface Params {
  params: {
    id: string
  }
}

// 获取指定用户的 Profile
export async function GET(req: Request, { params }: Params) {
  try {
    const profile = await prisma.profile.findFirst({
      where: { userId: params.id }
    })

    if (!profile) {
      return new NextResponse('Profile not found', { status: 404 })
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Get profile error:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

// 更新指定用户的 Profile
export async function PUT(req: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.id !== params.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const data = await req.json()
    
    // 先查找是否存在 profile
    const existingProfile = await prisma.profile.findFirst({
      where: { userId: params.id }
    })

    if (!existingProfile) {
      return new NextResponse('Profile not found', { status: 404 })
    }

    // 更新 profile
    const profile = await prisma.profile.update({
      where: { id: existingProfile.id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    })

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Update profile error:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

// 删除指定用户的 Profile
export async function DELETE(req: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.id !== params.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const existingProfile = await prisma.profile.findFirst({
      where: { userId: params.id }
    })

    if (!existingProfile) {
      return new NextResponse('Profile not found', { status: 404 })
    }

    await prisma.profile.delete({
      where: { id: existingProfile.id }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Delete profile error:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
} 