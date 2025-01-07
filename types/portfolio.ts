import { CustomField } from "./shared"

// 作品集项目
export interface Portfolio {
    id?: string
    name: string           // 作品名称
    date?: string          // 完成时间
    description?: string   // 作品描述
    photos?: string[]      // 作品图片
    customFields?: CustomField[]
    summary?: string       // 作品总结
  }
  

export const defaultPortfolio: Portfolio = {
    name: '',
    date: '',
    description: '',
    photos: [],
    customFields: [],
    summary: ''
}
