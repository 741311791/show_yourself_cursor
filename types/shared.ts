// 字段标签配置
export interface FieldLabel {
  key: string        // 字段键名
  label: string      // 显示的标签文本
  icon?: string      // 图标名称(可选)
}

// 部分配置
export interface SectionConfig {
  title: string              // 部分标题
  fields: FieldLabel[]       // 字段标签配置
  enabled: boolean          // 是否启用
  order?: number           // 显示顺序
}

// 保持原有的 CustomField 不变
export interface CustomField {
  id: string
  title: string
  content: string
  icon: string
} 