import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// 获取当前用户的所有语言能力
export async function GET() {
  try {
    const user = await requireAuth()
    if (!user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const languages = await prisma.language.findMany({
      where: {
        userId: user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(languages)
  } catch (error) {
    console.error("[LANGUAGE_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// 创建新的语言能力
export async function POST(req: Request) {
  try {
    const user = await requireAuth()
    if (!user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await req.json()
    const language = await prisma.language.create({
      data: {
        userId: user.id,
        name: json.name || "新的语言",
        level: json.level || "初级",
        certificate: json.certificate,
        acquireDate: json.acquireDate,
        photos: json.photos || [],
        score: json.score,
        validPeriod: json.validPeriod,
        summary: json.summary,
        customFields: json.customFields || []
      }
    })

    revalidatePath('/timeline/language')
    return NextResponse.json(language)
  } catch (error) {
    console.error("[LANGUAGE_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}