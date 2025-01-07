import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// 获取特定出版物
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id } = await context.params
    if (!user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const publication = await prisma.publication.findUnique({
      where: {
        id,
        userId: user.id
      }
    })

    if (!publication) {
      return new NextResponse("Not Found", { status: 404 })
    }

    return NextResponse.json(publication)
  } catch (error) {
    console.error("[PUBLICATION_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// 更新出版物
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id } = await context.params
    const data = await req.json()

    if (!user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const publication = await prisma.publication.update({
      where: {
        id,
        userId: user.id
      },
      data
    })

    revalidatePath('/timeline/publication')
    return NextResponse.json(publication)
  } catch (error) {
    console.error("[PUBLICATION_PUT]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// 删除出版物
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

    await prisma.publication.delete({
      where: {
        id,
        userId: user.id
      }
    })

    revalidatePath('/timeline/publication')
    return new NextResponse(null, { status: 200 })
  } catch (error) {
    console.error("[PUBLICATION_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 