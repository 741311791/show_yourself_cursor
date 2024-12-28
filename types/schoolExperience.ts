import { CustomField } from "./shared"

export interface SchoolExperience {
  id: string
  name: string           // 活动/项目名称
  organization: string   // 组织/社团名称
  role: string          // 担任角色
  startDate: string
  endDate: string
  description: string   // 详细描述
  achievement: string   // 成就/获奖
  summary: string      // 简要总结
  isCore?: boolean     // 是否为核心经历
  source: 'club' | 'competition' | 'volunteer' | 'other'  // 经历类型
  photos: string[]
  order: number
  customFields: CustomField[]
} 