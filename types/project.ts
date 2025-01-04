import { CustomField } from "./shared"  // 导入共享类型

export interface Project {
  id?: string
  name: string
  workId?: string
  company?: string
  role?: string
  startDate?: string
  endDate?: string
  description?: string
  techStack?: string
  achievement?: string
  summary?: string
  photos?: string[]
  customFields?: CustomField[]
} 

export const defaultProject: Project = {
  name: "",
  company: "",
  role: "",
  startDate: "",
  endDate: "",
  description: "",
  customFields: [],
  photos: [],
  summary: "",
  techStack: "",
  achievement: ""
}
