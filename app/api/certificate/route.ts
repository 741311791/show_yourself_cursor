import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// 获取当前用户的所有证书
export async function GET() {
  try {
    const user = await requireAuth()
    if (!user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const certificates = await prisma.certificate.findMany({
      where: {
        userId: user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(certificates)
  } catch (error) {
    console.error("[CERTIFICATE_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// 创建新的证书
export async function POST(req: Request) {
  try {
    const user = await requireAuth()
    if (!user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await req.json()
    const certificate = await prisma.certificate.create({
      data: {
        userId: user.id,
        name: json.name || "新的证书",
        issuer: json.issuer || "",
        date: json.date,
        level: json.level,
        number: json.number,
        photos: json.photos || [],
        summary: json.summary,
        customFields: json.customFields || []
      }
    })

    revalidatePath('/timeline/certificate')
    return NextResponse.json(certificate)
  } catch (error) {
    console.error("[CERTIFICATE_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}