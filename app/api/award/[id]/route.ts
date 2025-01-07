import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// 获取特定获奖经历
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

    const award = await prisma.award.findUnique({
      where: {
        id: id,
        userId: user.id
      }
    })

    if (!award) {
      return new NextResponse("Not Found", { status: 404 })
    }

    return NextResponse.json(award)
  } catch (error) {
    console.error("[AWARD_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// 更新获奖经历
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

    const updatedAward = await prisma.award.update({
      where: {
        id: id,
        userId: user.id
      },
      data
    })

    revalidatePath('/timeline/award')
    return NextResponse.json(updatedAward)
  } catch (error) {
    console.error("[AWARD_PUT]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// 删除获奖经历
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id } = await context.params
    if (!user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    await prisma.award.delete({
      where: {
        id: id,
        userId: user.id
      }
    })

    revalidatePath('/timeline/award')
    return new NextResponse(null, { status: 200 })
  } catch (error) {
    console.error("[AWARD_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 