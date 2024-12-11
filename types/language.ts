export interface Language {
  id: string
  name: string // 语种名称
  level: string // 语言等级
  certificate: string // 证书名称
  acquireDate: string // 获取时间
  photo: string | null // 证书图片
  score: string // 分数
  validPeriod: string // 有效期
  customFields: {
    id: string
    title: string
    content: string
  }[]
  summary: string // 语言学习总结
} 