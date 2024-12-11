// types/certificate.ts
export interface Certificate {
  id: string
  name: string          // 证书名称
  issuer: string       // 发证机构
  date: string         // 获取时间
  level: string        // 证书级别
  number: string       // 证书编号
  photo: string | null // 证书图片
  summary: string      // 证书总结
}
