import { CustomField } from "./shared"  // 导入共享类型

export interface Hobby {
  id?: string
  name: string
  cover?: string | null
  photos?: string[]
  description?: string
  startDate?: string
  customFields?: CustomField[]
  summary?: string
} 

export const defaultHobby: Hobby = {
  name: "",
  cover: null,
  photos: [],
  description: "",
  startDate: "",
  customFields: [],
  summary: ""
}
