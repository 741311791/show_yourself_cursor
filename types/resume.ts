import { Profile } from "@/types/profile"
import { Education } from "@/types/education"
import { Work } from "@/types/work"
import { Project } from "@/types/project"
import { Research } from "@/types/research"
import { Hobby } from "@/types/hobby"
import { Language } from "@/types/language"
import { Skill } from "@/types/skill"
import { Award } from "@/types/award"
import { Certificate } from "@/types/certificate"
import { Publication } from "@/types/publication"
import { CustomBlockItem } from "@/types/custom"

// 简历基本信息类型
export interface Resume {
  id: string
  name: string          // 简历名称
  updatedAt: string     // 最后更新时间
  createdAt: string     // 创建时间
  isTemplate?: boolean  // 是否为模板
  isPublic?: boolean    // 是否公开
  thumbnail?: string    // 添加缩略图字段
}

// 简历详细信息类型
export interface ResumeDetail extends Resume {
  profile?: Profile       // 个人信息
  education?: Education[] // 教育经历
  work?: Work[]          // 工作经历
  projects?: Project[]    // 项目经历
  research?: Research[]   // 科研经历
  hobbies?: Hobby[]      // 兴趣爱好
  languages?: Language[]  // 语言能力
  skills?: Skill[]       // 技能特长
  awards?: Award[]       // 获奖经历
  certificates?: Certificate[] // 证书资质
  publications?: Publication[] // 出版物
  customBlocks?: CustomBlockItem[] // 自定义模块
}

// 简历导出格式类型
export type ResumeExportFormat = 'pdf' | 'image' | 'json'

// 简历模板类型
export type ResumeTemplate = 'modern' | 'classic' | 'minimal' | 'professional'

// 简历导出格式
export type ExportFormat = 'pdf' | 'image' | 'json'

// 简历编辑器状态
export interface ResumeEditorState {
  data: ResumeDetail | null
  template: ResumeTemplate
  scale: number
  isDirty: boolean
}

// 简历布局配置
export interface ResumeLayout {
  spacing: number
  fontSize: number
  fontFamily: string
  primaryColor: string
}

// 添加预览相关的类型
export interface ResumePreviewProps {
  data: ResumeDetail | null
  template: ResumeTemplate
  scale?: number
  isPrinting?: boolean
}

export interface TemplateProps {
  data: ResumeDetail
  metadata?: {
    template: ResumeTemplate
    fontSize: number
    spacing: number
    showIcons: boolean
    showDates: boolean
  }
}

