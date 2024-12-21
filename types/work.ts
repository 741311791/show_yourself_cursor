import { CustomField } from "./shared"  // 导入共享类型
export interface Project {
  id: string
  name: string
  startDate: string
  endDate: string
  description: string
  techStack: string
  achievement: string
  isCore: boolean
  order: number
  customFields: CustomField[]
}

export interface Work {
  id: string
  company: string
  location: string
  startDate: string
  endDate: string
  position: string
  photo: string | null
  projects: Project[]
  customFields: CustomField[]
  summary: string
} 