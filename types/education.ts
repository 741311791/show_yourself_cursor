import { CustomField } from "@/types/shared"  // 导入共享类型
import { SchoolExperience } from "./schoolExperience"

export interface Education {
  id: string
  school: string
  degree: string
  startDate: string
  endDate: string
  gpa?: string
  location?: string
  courses?: string
  photos?: string[]
  major?: string
  schoolExperience?: SchoolExperience[]
  customFields?: CustomField[]
  summary?: string
} 