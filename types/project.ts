import { Project as WorkProject } from "./work"
import { CustomField } from "./shared"  // 导入共享类型
// 继承工作经历中的项目类型，添加公司信息
export interface Project extends WorkProject {
  company: string  // 添加公司信息字段
  source: 'work' | 'custom'  // 标记项目来源：工作经历/自定义
} 


export interface Project {
  id: string
  name: string
  company: string
  startDate: string
  endDate: string
  description: string
  techStack: string
  achievement: string
  summary: string
  isCore: boolean
  source: 'custom' | 'work'
  photo: string | null
  customFields: CustomField[]
} 