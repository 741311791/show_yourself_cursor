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
  direction: string      // 研究方向
  institution: string    // 研究机构
  startDate: string     // 开始时间
  endDate: string       // 结束时间
  role: string          // 担当角色
  keyFindings: string   // 重点研究成果
  photo: string | null  // 相关图片
  customFields: CustomField[]
  details: string       // 具体工作
  results: ResearchResult[] // 研究成果列表
  summary: string       // 科研总结
} 