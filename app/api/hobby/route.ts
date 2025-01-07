import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// 获取当前用户的所有兴趣爱好
export async function GET() {
  try {
    const user = await requireAuth()
    if (!user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const hobbies = await prisma.hobby.findMany({
      where: {
        userId: user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(hobbies)
  } catch (error) {
    console.error("[HOBBY_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// 创建新的兴趣爱好
export async function POST(req: Request) {
  try {
    const user = await requireAuth()
    if (!user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await req.json()
    const hobby = await prisma.hobby.create({
      data: {
        userId: user.id,
        name: json.name || "新的兴趣爱好",
        cover: json.cover,
        photos: json.photos || [],
        description: json.description,
        startDate: json.startDate,
        summary: json.summary,
        customFields: json.customFields || []
      }
    })

    revalidatePath('/timeline/hobby')
    return NextResponse.json(hobby)
  } catch (error) {
    console.error("[HOBBY_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 