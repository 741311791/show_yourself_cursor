"use client"

import React from "react"
import { GraduationCap, Calendar, Building, Award } from "lucide-react"
import { Student, defaultStudent, ActivityType } from "@/types/student"
import { StudentFormDetail } from "./StudentFormDetail"
import { TimelineBase } from "../shared/TimelineBase"
import { TimelineItem } from "../shared/TimelineList"

// 活动类型标签颜色
const activityTypeColors: Record<ActivityType, string> = {
  CLUB: "bg-blue-500",
  COMPETITION: "bg-green-500",
  VOLUNTEER: "bg-yellow-500",
  OTHER: "bg-gray-500"
}

// 活动类型标签文本
const activityTypeLabels = {
  CLUB: "学生组织",
  COMPETITION: "竞赛活动",
  VOLUNTEER: "志愿服务",
  OTHER: "其他"
}

export function StudentTimeline() {
  // 将 student 数据转换为 timeline 项目
  const transformToTimelineItems = (students: Student[]): TimelineItem[] => {
    return students.map(student => ({
      id: student.id!,
      title: student.activityName,
      cover: student.photos?.[0] || null,
      details: [
        {
          icon: Building,
          content: (
            <span className="line-clamp-1">
              {student.organization} · {student.role}
            </span>
          )
        },
        {
          icon: Calendar,
          content: (
            <span>
              {student.startDate} ~ {student.endDate || '至今'}
            </span>
          )
        },
        {
          icon: Award,
          content: (
            <span className={`px-2 py-0.5 rounded-full text-white text-xs ${activityTypeColors[student.activityType!]}`}>
              {activityTypeLabels[student.activityType!]}
            </span>
          )
        }
      ]
    }))
  }

  return (
    <TimelineBase<Student>
      apiEndpoint="/api/student"
      addButtonText="添加学生经历"
      loadingText="加载学生经历..."
      emptyText="暂无学生经历，快来添加吧~"
      transformToTimelineItems={transformToTimelineItems}
      FormComponent={StudentFormDetail}
      icon={GraduationCap}
      deleteDialogTitle="确认删除"
      deleteDialogDescription="确定要删除这条学生经历吗？此操作无法撤销。"
      defaultValue={defaultStudent}
      sortItems={(items) => [...items].sort((a, b) => {
        if (!a.startDate) return 1
        if (!b.startDate) return -1
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      })}
    />
  )
} 