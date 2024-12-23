import { CustomField } from "./shared"  // 导入共享类型

export interface Education {
  id: string
  school: string
  degree: string
  field: string
  startDate: string
  endDate: string
  gpa?: string
  location?: string
  description: string
  courses?: string[]
  highlights?: string[]
} 