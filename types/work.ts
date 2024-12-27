import { CustomField } from "./shared"  // 导入共享类型
import { Project } from "./project"

export interface Work {
  id: string
  company: string
  title: string
  location: string
  startDate: string
  endDate: string
  position: string
  photo: string | null
  projects: Project[]
  customFields: CustomField[]
  summary: string
} 