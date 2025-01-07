"use client"

import React from "react"
import { Award, Calendar } from "lucide-react"
import { Certificate, defaultCertificate } from "@/types/certificate"
import { CertificateFormDetail } from "./CertificateFormDetail"
import { TimelineBase } from "../shared/TimelineBase"
import { TimelineItem } from "../shared/TimelineList"

export function CertificateTimeline() {
  // 将 certificate 数据转换为 timeline 项目
  const transformToTimelineItems = (certificates: Certificate[]): TimelineItem[] => {
    return certificates.map(certificate => ({
      id: certificate.id!,
      title: certificate.name,
      cover: certificate.photos?.[0] || null,
      details: [
        {
          icon: Award,
          content: (
            <span className="line-clamp-1">
              {certificate.issuer} · {certificate.level}
            </span>
          )
        },
        {
          icon: Calendar,
          content: <span>{certificate.date}</span>
        },
        {
          icon: Award,
          content: <span className="line-clamp-1">{certificate.number}</span>
        }
      ]
    }))
  }

  return (
    <TimelineBase<Certificate>
      apiEndpoint="/api/certificate"
      addButtonText="添加证书"
      loadingText="加载证书..."
      emptyText="暂无证书，快来添加吧~"
      transformToTimelineItems={transformToTimelineItems}
      FormComponent={CertificateFormDetail}
      icon={Award}
      deleteDialogTitle="确认删除"
      deleteDialogDescription="确定要删除这个证书吗？此操作无法撤销。"
      defaultValue={defaultCertificate}
      sortItems={(items) => [...items].sort((a, b) => {
        if (!a.date) return 1
        if (!b.date) return -1
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      })}
    />
  )
}