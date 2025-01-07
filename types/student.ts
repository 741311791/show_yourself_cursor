import { CustomField } from "./shared"

export type StudentType = 'STUDENT' | 'GRADUATE' | 'OTHER'

export interface Student {
  id: string
  userId: string
  educationId?: string
  type: StudentType
  name: string           // 活动/项目名称
  organization?: string   // 组织/社团名称
  role?: string          // 担任角色
  startDate?: string
  endDate?: string
  description?: string   // 详细描述
  achievement?: string   // 成就/获奖
  summary?: string      // 简要总结
  photos?: string[]
  customFields?: CustomField[]
} 