import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// 获取特定兴趣爱好
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

    const hobby = await prisma.hobby.findUnique({
      where: {
        id: id,
        userId: user.id
      }
    })

    return NextResponse.json(hobby)
  } catch (error) {
    console.error("[HOBBY_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// 更新兴趣爱好
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
    const updatedHobby = await prisma.hobby.update({
      where: {
        id: id,
        userId: user.id
      },
      data: {
        name: json.name,
        cover: json.cover,
        photos: json.photos,
        description: json.description,
        startDate: json.startDate,
        summary: json.summary,
        customFields: json.customFields
      }
    })

    revalidatePath('/timeline/hobby')
    return NextResponse.json(updatedHobby)
  } catch (error) {
    console.error("[HOBBY_PUT]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// 删除兴趣爱好
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

    await prisma.hobby.delete({
      where: {
        id: id,
        userId: user.id
      }
    })

    revalidatePath('/timeline/hobby')
    return new NextResponse(null, { status: 200 })
  } catch (error) {
    console.error("[HOBBY_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}