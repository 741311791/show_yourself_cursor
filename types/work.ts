import { CustomField } from "./shared"  // 导入共享类型

export interface Work {
  id?: string
  company: string
  title?: string
  location?: string
  startDate?: string
  endDate?: string
  position?: string
  photos?: string[]
  customFields?: CustomField[]
  summary?: string
} 


export const defaultWork: Work = {
  company: "",
  title: "",
  location: "",
  startDate: "",
  endDate: "",
  position: "",
  photos: [],
  customFields: [],
  summary: "",
}

