import { CustomField } from "./shared"  // 导入共享类型
export type PublicationType = 'JOURNAL' | 'CONFERENCE' | 'BOOK' | 'OTHER'

export interface Publication {
  id?: string
  name: string            // 作品名称
  type?: PublicationType   // 作品类别
  date?: string           // 出版时间
  journal?: string        // 刊物名称
  database?: string       // 数据库收录
  photos?: string[]       // 刊物图片
  customFields?: CustomField[]
  summary?: string        // 作品总结
} 

export const defaultPublication: Publication = {
  name: '',
  type: 'JOURNAL',
  date: '',
  journal: '',
  database: '',
  photos: [],
  customFields: [],
  summary: ''
}
