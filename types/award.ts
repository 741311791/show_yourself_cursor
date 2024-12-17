import { CustomField } from "./shared"  // 导入共享类型
export interface Award {
  id: string
  name: string // 奖项名称
  level: string // 获奖级别
  issuer: string // 颁发机构
  acquireDate: string // 获取时间
  photo: string | null // 证书图片
  ranking: string // 排名/名次
  participants: string // 参与人数
  customFields: CustomField[]
  summary: string // 获奖总结
} 