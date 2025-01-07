import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// 获取特定语言能力
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    if (!user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { id } = await context.params
    const language = await prisma.language.findUnique({
      where: {
        id: id,
        userId: user.id
      }
    })

    if (!language) {
      return new NextResponse("Not Found", { status: 404 })
    }

    return NextResponse.json(language)
  } catch (error) {
    console.error("[LANGUAGE_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// 更新语言能力
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    if (!user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await req.json()
    const { id } = await context.params
    const updatedLanguage = await prisma.language.update({
      where: {
        id: id,
        userId: user.id
      },
      data: {
        name: json.name,
        level: json.level,
        certificate: json.certificate,
        acquireDate: json.acquireDate,
        photos: json.photos,
        score: json.score,
        validPeriod: json.validPeriod,
        summary: json.summary,
        customFields: json.customFields
      }
    })

    revalidatePath('/timeline/language')
    return NextResponse.json(updatedLanguage)
  } catch (error) {
    console.error("[LANGUAGE_PUT]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// 删除语言能力
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    if (!user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { id } = await context.params
    await prisma.language.delete({
      where: {
        id: id,
        userId: user.id
      }
    })

    revalidatePath('/timeline/language')
    return new NextResponse(null, { status: 200 })
  } catch (error) {
    console.error("[LANGUAGE_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 