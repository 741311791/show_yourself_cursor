interface CustomField {
  id: string
  title: string
  content: string
}

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert'
export type SkillCategory = 'language' | 'programming' | 'design' | 'business' | 'other'

// 作品集项目
export interface SkillWork {
  id: string
  name: string           // 作品名称
  date: string          // 完成时间
  description: string   // 作品描述
  photos: string[]      // 作品图片
  customFields: CustomField[]
  summary: string       // 作品总结
}

export interface Skill {
  id: string
  name: string            // 技能名称
  category: SkillCategory // 技能类别
  level: SkillLevel      // 最高等级
  certDate: string       // 认证时间
  certName: string       // 认证名称
  certOrg: string        // 认证机构
  customFields: CustomField[]
  works: SkillWork[]     // 作品集
  summary: string        // 技能总结
  photos: string[]       // 照片墙
} 