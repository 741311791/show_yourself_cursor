import { CustomField } from "./shared"  // 导入共享类型

export type SkillLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
export type SkillCategory = 'LANGUAGE' | 'PROGRAMMING' | 'DESIGN' | 'BUSINESS' | 'OTHER'


export interface Skill {
  id?: string
  name: string            // 技能名称
  category?: SkillCategory // 技能类别
  level?: SkillLevel      // 最高等级
  certDate?: string       // 认证时间
  certName?: string       // 认证名称
  certOrg?: string        // 认证机构
  customFields?: CustomField[]
  summary?: string        // 技能总结
  photos?: string[]       // 照片墙
} 

export const defaultSkill: Skill = {
  name: '',
  category: 'OTHER',
  level: 'BEGINNER',
  certDate: '',
  certName: '',
  certOrg: '',
  customFields: [],
  summary: '',
  photos: []
}
