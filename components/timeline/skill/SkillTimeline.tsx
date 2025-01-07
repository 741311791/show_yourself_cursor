"use client"

import React from "react"
import { Code, Calendar, Star, Award } from "lucide-react"
import { Skill, defaultSkill } from "@/types/skill"
import { SkillFormDetail } from "./SkillFormDetail"
import { TimelineBase } from "../shared/TimelineBase"
import { TimelineItem } from "../shared/TimelineList"

// 技能等级标签颜色
const levelColors = {
  BEGINNER: "bg-blue-500",
  INTERMEDIATE: "bg-green-500",
  ADVANCED: "bg-yellow-500",
  EXPERT: "bg-red-500"
}

// 技能等级标签文本
const levelLabels = {
  BEGINNER: "初级",
  INTERMEDIATE: "中级",
  ADVANCED: "高级",
  EXPERT: "专家"
}

export function SkillTimeline() {
  // 将 skill 数据转换为 timeline 项目
  const transformToTimelineItems = (skills: Skill[]): TimelineItem[] => {
    return skills.map(skill => ({
      id: skill.id!,
      title: skill.name,
      cover: skill.photos?.[0] || null,
      details: [
        {
          icon: Star,
          content: (
            <span className={`px-2 py-0.5 rounded-full text-white text-xs ${levelColors[skill.level!]}`}>
              {levelLabels[skill.level!]}
            </span>
          )
        },
        {
          icon: Award,
          content: <span className="line-clamp-1">{skill.certName || ''}</span>
        },
        {
          icon: Calendar,
          content: <span>{skill.certDate || ''}</span>
        }
      ]
    }))
  }

  return (
    <TimelineBase<Skill>
      apiEndpoint="/api/skill"
      addButtonText="添加技能"
      loadingText="加载技能..."
      emptyText="暂无技能，快来添加吧~"
      transformToTimelineItems={transformToTimelineItems}
      FormComponent={SkillFormDetail}
      icon={Code}
      deleteDialogTitle="确认删除"
      deleteDialogDescription="确定要删除这项技能吗？此操作无法撤销。"
      defaultValue={defaultSkill}
      sortItems={(items) => [...items].sort((a, b) => {
        if (!a.certDate) return 1
        if (!b.certDate) return -1
        return new Date(b.certDate).getTime() - new Date(a.certDate).getTime()
      })}
    />
  )
} 