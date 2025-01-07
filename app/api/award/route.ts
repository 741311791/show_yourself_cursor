import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// 获取当前用户的所有获奖经历
export async function GET() {
  try {
    const user = await requireAuth()
    if (!user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const awards = await prisma.award.findMany({
      where: {
        userId: user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(awards)
  } catch (error) {
    console.error("[AWARD_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// 创建新的获奖经历
export async function POST(req: Request) {
  try {
    const user = await requireAuth()
    if (!user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await req.json()
    const award = await prisma.award.create({
      data: {
        userId: user.id,
        name: json.name || "新的获奖经历",
        level: json.level,
        issuer: json.issuer,
        acquireDate: json.acquireDate,
        photos: json.photos || [],
        ranking: json.ranking,
        participants: json.participants,
        summary: json.summary,
        customFields: json.customFields || []
      }
    })

    revalidatePath('/timeline/award')
    return NextResponse.json(award)
  } catch (error) {
    console.error("[AWARD_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 