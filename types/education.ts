import { CustomField } from "@/types/shared"  // 导入共享类型

export interface Education {
  id?: string
  school: string
  degree: string
  startDate?: string
  endDate?: string
  gpa?: string
  location?: string
  courses?: string
  photos?: string[]
  major?: string
  customFields?: CustomField[]
  summary?: string
}

export const defaultEducation: Education = {
  school: "",
  degree: "",
  startDate: "",
  endDate: "",
  photos: [],
  customFields: [],
  summary: "",
  location: "",
  major: "",
  courses: "",
  gpa: "",
}
