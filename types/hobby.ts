import { CustomField } from "./shared"  // 导入共享类型

export interface HobbyAward {
  id: string
  title: string
  date: string
}

export interface Hobby {
  id: string
  name: string
  cover: string | null
  photos: string[]
  description: string
  createdAt: string
  startDate: string
  awards: HobbyAward[]
  customFields: CustomField[]
} 