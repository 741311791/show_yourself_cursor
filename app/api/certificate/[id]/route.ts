import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// 获取特定证书
export async function GET(
  req: Request,
  context: { params: Promise<{ certificateId: string }> }
) {
  try {
    const user = await requireAuth()
    const { certificateId } = await context.params
    if (!user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const certificate = await prisma.certificate.findUnique({
      where: {
        id: certificateId,
        userId: user.id
      }
    })

    if (!certificate) {
      return new NextResponse("Not Found", { status: 404 })
    }

    return NextResponse.json(certificate)
  } catch (error) {
    console.error("[CERTIFICATE_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// 更新证书
export async function PATCH(
  req: Request,
  context: { params: Promise<{ certificateId: string }> }
) {
  try {
    const user = await requireAuth()
    if (!user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await req.json()
    const { certificateId } = await context.params
    const updatedCertificate = await prisma.certificate.update({
      where: {
        id: certificateId,
        userId: user.id
      },
      data: {
        name: json.name,
        issuer: json.issuer,
        date: json.date,
        level: json.level,
        number: json.number,
        photos: json.photos,
        summary: json.summary,
        customFields: json.customFields
      }
    })

    revalidatePath('/timeline/certificate')
    return NextResponse.json(updatedCertificate)
  } catch (error) {
    console.error("[CERTIFICATE_PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// 删除证书
export async function DELETE(
  req: Request,
  context: { params: Promise<{ certificateId: string }> }
) {
  try {
    const user = await requireAuth()
    if (!user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { certificateId } = await context.params
    await prisma.certificate.delete({
      where: {
        id: certificateId,
        userId: user.id
      }
    })

    revalidatePath('/timeline/certificate')
    return new NextResponse(null, { status: 200 })
  } catch (error) {
    console.error("[CERTIFICATE_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 