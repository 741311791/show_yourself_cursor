import { CustomField } from "./shared"  // 导入共享类型

export type CustomBlockType = 'page' | 'timeline'

export interface CustomBlockField {
  id: string
  label: string
  icon: string
  fieldType: 'text' | 'date' | 'textarea'
  required?: boolean
}

export interface CustomBlock {
  id: string
  name: string          // 显示名称
  route: string         // 路由名称 (custom-menu-1)
  type: CustomBlockType // 展示形式
  icon?: string         // 图标
  fields: CustomBlockField[] // 自定义字段
}

export interface CustomBlockForm {
  id?: string
  blockId?: string      // 关联的自定义块ID
  fields: Record<string, string> // 字段值
  customFields: CustomField[]
  summary: string
  photos: string[]
} 

export const defaultCustomBlockForm: CustomBlockForm = {
  fields: {},
  customFields: [],
  summary: "",
  photos: []
}