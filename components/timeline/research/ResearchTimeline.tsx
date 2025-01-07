"use client"

import React from "react"
import { FlaskConical, Calendar, Building } from "lucide-react"
import { Research, defaultResearch } from "@/types/research"
import { ResearchFormDetail } from "./ResearchFormDetail"
import { TimelineBase } from "../shared/TimelineBase"
import { TimelineItem } from "../shared/TimelineList"

export function ResearchTimeline() {
  // 将 research 数据转换为 timeline 项目
  const transformToTimelineItems = (researches: Research[]): TimelineItem[] => {
    return researches.map(research => ({
      id: research.id!,
      title: research.direction || '',
      cover: research.photos?.[0] || null,
      details: [
        {
          icon: Building,
          content: (
            <span className="line-clamp-1">
              {research.institution} · {research.role}
            </span>
          )
        },
        {
          icon: Calendar,
          content: (
            <span>
              {research.startDate} ~ {research.endDate || '至今'}
            </span>
          )
        },
        {
          icon: FlaskConical,
          content: <span className="line-clamp-1">{research.institution}</span>
        }
      ]
    }))
  }

  return (
    <TimelineBase<Research>
      apiEndpoint="/api/research"
      addButtonText="添加研究经历"
      loadingText="加载研究经历..."
      emptyText="暂无研究经历，快来添加吧~"
      transformToTimelineItems={transformToTimelineItems}
      FormComponent={ResearchFormDetail}
      icon={FlaskConical}
      deleteDialogTitle="确认删除"
      deleteDialogDescription="确定要删除这条研究经历吗？此操作无法撤销。"
      defaultValue={defaultResearch}
      sortItems={(items) => [...items].sort((a, b) => {
      if (!a.startDate) return 1
      if (!b.startDate) return -1
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      })}
    />
  )
}