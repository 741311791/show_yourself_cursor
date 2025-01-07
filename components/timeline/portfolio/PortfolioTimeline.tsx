"use client"

import React from "react"
import { Folder, Calendar, FileText } from "lucide-react"
import { Portfolio, defaultPortfolio } from "@/types/portfolio"
import { PortfolioFormDetail } from "@/components/timeline/portfolio/PortfolioFormDetail"
import { TimelineBase } from "../shared/TimelineBase"
import { TimelineItem } from "../shared/TimelineList"

export function PortfolioTimeline() {
  // 将 portfolio 数据转换为 timeline 项目
  const transformToTimelineItems = (portfolios: Portfolio[]): TimelineItem[] => {
    return portfolios.map(portfolio => ({
      id: portfolio.id!,
      title: portfolio.name,
      cover: portfolio.photos?.[0] || null,
      details: [
        {
          icon: Calendar,
          content: <span>{portfolio.date || ''}</span>
        },
        {
          icon: FileText,
          content: <span className="line-clamp-2">{portfolio.description || ''}</span>
        }
      ]
    }))
  }

  return (
    <TimelineBase<Portfolio>
      apiEndpoint="/api/portfolio"
      addButtonText="添加作品"
      loadingText="加载作品..."
      emptyText="暂无作品，快来添加吧~"
      transformToTimelineItems={transformToTimelineItems}
      FormComponent={PortfolioFormDetail}
      icon={Folder}
      deleteDialogTitle="确认删除"
      deleteDialogDescription="确定要删除这个作品吗？此操作无法撤销。"
      defaultValue={defaultPortfolio}
      sortItems={(items) => [...items].sort((a, b) => {
        if (!a.date) return 1
        if (!b.date) return -1
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      })}
    />
  )
} 