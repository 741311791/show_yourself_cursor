import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/session'
import { prisma } from '@/lib/prisma'

// 获取当前用户的 Profile
export async function GET() {
  try {
    const user = await requireAuth()
    
    const profile = await prisma.profile.findFirst({
      where: { userId: user.id }
    })

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Get profile error:', error)
    return new NextResponse('Unauthorized', { status: 401 })
  }
}

// 创建或更新 Profile
export async function POST(req: Request) {
  try {
    const user = await requireAuth()
    const data = await req.json()

    // 先查找是否存在 profile
    const existingProfile = await prisma.profile.findFirst({
      where: { userId: user.id }
    })

    let profile
    if (existingProfile) {
      // 更新现有 profile
      profile = await prisma.profile.update({
        where: { id: existingProfile.id },
        data: {
          ...data,
          updatedAt: new Date()
        }
      })
    } else {
      // 创建新 profile
      profile = await prisma.profile.create({
        data: {
          ...data,
          userId: user.id
        }
      })
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Create/Update profile error:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
} 