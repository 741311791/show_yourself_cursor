export type CustomBlockType = 'page' | 'timeline'

export interface CustomBlockField {
  id: string
  label: string
  type: 'text' | 'date' | 'textarea'
  required?: boolean
}

export interface CustomBlock {
  id: string
  name: string          // 显示名称
  route: string         // 路由名称 (custom-menu-1)
  type: CustomBlockType // 展示形式
  icon?: string         // 图标
  fields: CustomBlockField[] // 自定义字段
  createdAt: string
  updatedAt: string
}

export interface CustomBlockItem {
  id: string
  blockId: string      // 关联的自定义块ID
  fields: Record<string, string> // 字段值
  customFields: Array<{
    id: string
    title: string
    content: string
  }>
  summary: string
  photos: string[]
  createdAt: string
  updatedAt: string
} 