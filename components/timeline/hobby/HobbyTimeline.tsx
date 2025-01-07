"use client"

import React from "react"
import { Heart, Calendar, Trophy } from "lucide-react"
import { Hobby, defaultHobby } from "@/types/hobby"
import { HobbyFormDetail } from "./HobbyFormDetail"
import { TimelineBase } from "../shared/TimelineBase"
import { TimelineItem } from "../shared/TimelineList"

export function HobbyTimeline() {
  // 将 hobby 数据转换为 timeline 项目
  const transformToTimelineItems = (hobbies: Hobby[]): TimelineItem[] => {
    return hobbies.map(hobby => ({
      id: hobby.id!,
      title: hobby.name,
      cover: hobby.cover,
      details: [
        {
          icon: Calendar,
          content: <span>开始于 {hobby.startDate}</span>
        },

      ]
    }))
  }

  return (
    <TimelineBase<Hobby>
      apiEndpoint="/api/hobby"
      addButtonText="添加兴趣爱好"
      loadingText="加载兴趣爱好..."
      emptyText="暂无兴趣爱好，快来添加吧~"
      transformToTimelineItems={transformToTimelineItems}
      FormComponent={HobbyFormDetail}
      icon={Heart}
      deleteDialogTitle="确认删除"
      deleteDialogDescription="确定要删除这条兴趣爱好吗？此操作无法撤销。"
      defaultValue={defaultHobby}
      sortItems={(items) => [...items].sort((a, b) => {
        if (!a.startDate) return 1
        if (!b.startDate) return -1
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      })}
    />
  )
}