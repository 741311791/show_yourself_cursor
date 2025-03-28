import { CustomField } from "./shared"  // 导入共享类型

export type ResearchResultType = 'PAPER' | 'PATENT' | 'CONFERENCE' | 'OTHER'

export interface ResearchResult {
  id?: string
  researchId?: string
  type: ResearchResultType
  name: string
  role?: string
  date?: string
  customFields?: CustomField[]
  photos?: string[]
  summary?: string
}

export interface Research {
  id?: string
  direction: string
  institution?: string
  role?: string
  startDate?: string
  endDate?: string
  photos?: string[]
  customFields?: CustomField[]
  summary?: string
} 

export const defaultResearch: Research = {
  direction: '',
  institution: '',
  role: '',
  startDate: '',
  endDate: '',
  photos: [],
  customFields: [],
  summary: ''
}

export const defaultResearchResult: ResearchResult = {
  type: 'PAPER',
  name: '',
  role: '',
  date: '',
  customFields: [],
  photos: [],
  summary: ''
}
