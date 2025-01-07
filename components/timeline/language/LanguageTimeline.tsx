"use client"

import React from "react"
import { Languages, Calendar, Award } from "lucide-react"
import { Language, defaultLanguage } from "@/types/language"
import { LanguageFormDetail } from "./LanguageFormDetail"
import { TimelineBase } from "../shared/TimelineBase"
import { TimelineItem } from "../shared/TimelineList"

export function LanguageTimeline() {
  // 将 language 数据转换为 timeline 项目
  const transformToTimelineItems = (languages: Language[]): TimelineItem[] => {
    return languages.map(language => ({
      id: language.id!,
      title: language.name,
      cover: language.photos?.[0] || null,
      details: [
        {
          icon: Award,
          content: <span className="line-clamp-1">{language.level}</span>
        },
        {
          icon: Calendar,
          content: <span>{language.acquireDate}</span>
        },
        {
          icon: Languages,
          content: <span className="line-clamp-1">{language.certificate}</span>
        }
      ]
    }))
  }

  return (
    <TimelineBase<Language>
      apiEndpoint="/api/language"
      addButtonText="添加语言记录"
      loadingText="加载语言记录..."
      emptyText="暂无语言记录，快来添加吧~"
      transformToTimelineItems={transformToTimelineItems}
      FormComponent={LanguageFormDetail}
      icon={Languages}
      deleteDialogTitle="确认删除"
      deleteDialogDescription="确定要删除这条语言记录吗？此操作无法撤销。"
      defaultValue={defaultLanguage}
      sortItems={(items) => [...items].sort((a, b) => {
        if (!a.acquireDate) return 1
        if (!b.acquireDate) return -1
        return new Date(b.acquireDate).getTime() - new Date(a.acquireDate).getTime()
      })}
    />
  )
} 