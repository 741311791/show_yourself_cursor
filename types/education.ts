import { CustomField } from "./shared"  // 导入共享类型

export interface Education {
  id: string
  school: string
  location: string
  startDate: string
  endDate: string
  major: string
  courses: string
  gpa: string
  degree: string
  photo: string | null
  customFields: CustomField[]
  summary: string
} 