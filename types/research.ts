import { CustomField } from "./shared"  // 导入共享类型

export type ResearchResultType = 'paper' | 'patent' | 'conference' | 'other'

export interface ResearchResult {
  id: string
  type: ResearchResultType
  name: string
  role: string
  date: string
  customFields: CustomField[]
  summary: string
}

export interface Research {
  id: string
  direction: string
  institution: string
  role: string
  startDate: string
  endDate: string
  photos: string[]
  customFields: CustomField[]
  results: ResearchResult[]
  summary: string
} 