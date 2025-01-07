import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// 获取当前用户的所有出版物
export async function GET() {
  try {
    const user = await requireAuth()
    if (!user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const publications = await prisma.publication.findMany({
      where: {
        userId: user.id
      },
      orderBy: {
        publishDate: 'desc'
      }
    })

    return NextResponse.json(publications)
  } catch (error) {
    console.error("[PUBLICATION_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// 创建新的出版物
export async function POST(req: Request) {
  try {
    const user = await requireAuth()
    if (!user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await req.json()
    const publication = await prisma.publication.create({
      data: {
        userId: user.id,
        name: json.name || "新的出版物",
        type: json.type || "JOURNAL",
        publishDate: json.publishDate,
        journal: json.journal,
        database: json.database,
        photos: json.photos || [],
        summary: json.summary,
        customFields: json.customFields || []
      }
    })

    revalidatePath('/timeline/publication')
    return NextResponse.json(publication)
  } catch (error) {
    console.error("[PUBLICATION_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 