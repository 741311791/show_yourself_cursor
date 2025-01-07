"use client"

import React from "react"
import { Trophy, Calendar, Medal } from "lucide-react"
import { Award, defaultAward } from "@/types/award"
import { AwardFormDetail } from "./AwardFormDetail"
import { TimelineBase } from "../shared/TimelineBase"
import { TimelineItem } from "../shared/TimelineList"

export function AwardTimeline() {
  // 将 award 数据转换为 timeline 项目
  const transformToTimelineItems = (awards: Award[]): TimelineItem[] => {
    return awards.map(award => ({
      id: award.id!,
      title: award.name,
      cover: award.photos?.[0] || null,
      details: [
        {
          icon: Medal,
          content: <span className="line-clamp-1">{award.level} · {award.ranking}</span>
        },
        {
          icon: Calendar,
          content: <span>{award.acquireDate}</span>
        },
        {
          icon: Trophy,
          content: <span className="line-clamp-1">{award.issuer}</span>
        }
      ]
    }))
  }

  return (
    <TimelineBase<Award>
      apiEndpoint="/api/award"
      addButtonText="添加获奖记录"
      loadingText="加载获奖记录..."
      emptyText="暂无获奖记录，快来添加吧~"
      transformToTimelineItems={transformToTimelineItems}
      FormComponent={AwardFormDetail}
      icon={Trophy}
      deleteDialogTitle="确认删除"
      deleteDialogDescription="确定要删除这条获奖记录吗？此操作无法撤销。"
      defaultValue={defaultAward}
      sortItems={(items) => [...items].sort((a, b) => {
        if (!a.acquireDate) return 1
        if (!b.acquireDate) return -1
        return new Date(b.acquireDate).getTime() - new Date(a.acquireDate).getTime()
      })}
    />
  )
} 