import { CustomField } from "./shared"  // 导入共享类型

export interface Project {
  id: string
  name: string
  company: string
  role: string
  startDate: string
  endDate: string
  description: string
  techStack: string
  achievement: string
  summary: string
  isCore?: boolean
  source: 'custom' | 'work'
  photos?: string[]
  order: number
  customFields: CustomField[]
} 