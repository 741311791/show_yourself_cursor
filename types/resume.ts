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
  createdBy: string     // 创建者
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
  config?: ResumeConfig    // 添加配置字段
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

export interface ResumeConfig {
  profile?: SectionConfig
  education?: SectionConfig
  work?: SectionConfig
  projects?: SectionConfig
  skills?: SectionConfig
  awards?: SectionConfig
  certificates?: SectionConfig
  languages?: SectionConfig
}

export interface FieldLabel {
  key: string
  label: string
  icon?: string
}

// 修改 SectionConfig 接口
export interface SectionConfig {
  title: string
  isShow: boolean  // 添加显示控制字段
  fields: FieldLabel[]
}

// 更新默认配置
export const DEFAULT_RESUME_CONFIG: ResumeConfig = {
  profile: {
    title: "基本信息",
    isShow: true,
    fields: [
      { key: "name", label: "姓名", icon: "User" },
      { key: "title", label: "职位", icon: "Briefcase" },
      { key: "email", label: "邮箱", icon: "Mail" },
      { key: "phone", label: "电话", icon: "Phone" },
      { key: "location", label: "地点", icon: "MapPin" },
      { key: "summary", label: "个人简介", icon: "FileText" }
    ]
  },
  education: {
    title: "教育经历",
    isShow: true,
    fields: [
      { key: "school", label: "学校", icon: "GraduationCap" },
      { key: "major", label: "专业", icon: "BookOpen" },
      { key: "degree", label: "学位", icon: "Award" },
      { key: "startDate", label: "开始时间", icon: "CalendarRange" },
      { key: "endDate", label: "结束时间", icon: "CalendarRange" },
      { key: "gpa", label: "GPA", icon: "Star" },
      { key: "courses", label: "主修课程", icon: "ListChecks" },
      { key: "summary", label: "在校经历", icon: "FileText" }
    ]
  },
  work: {
    title: "工作经历",
    isShow: true,
    fields: [
      { key: "company", label: "公司", icon: "Building2" },
      { key: "position", label: "职位", icon: "Briefcase" },
      { key: "startDate", label: "开始时间", icon: "CalendarRange" },
      { key: "endDate", label: "结束时间", icon: "CalendarRange" },
      { key: "location", label: "地点", icon: "MapPin" },
      { key: "summary", label: "工作内容", icon: "FileText" }
    ]
  },
  projects: {
    title: "项目经历",
    isShow: true,
    fields: [
      { key: "name", label: "项目名称", icon: "Folder" },
      { key: "role", label: "担任角色", icon: "UserCircle" },
      { key: "startDate", label: "开始时间", icon: "CalendarRange" },
      { key: "endDate", label: "结束时间", icon: "CalendarRange" },
      { key: "summary", label: "项目描述", icon: "FileText" }
    ]
  },
  skills: {
    title: "技能特长",
    isShow: true,
    fields: [
      { key: "category", label: "类别", icon: "Tag" },
      { key: "items", label: "技能项", icon: "List" }
    ]
  },
  awards: {
    title: "获奖经历",
    isShow: true,
    fields: [
      { key: "title", label: "奖项名称", icon: "Award" },
      { key: "date", label: "获奖时间", icon: "Calendar" },
      { key: "issuer", label: "颁发机构", icon: "Building" },
      { key: "summary", label: "奖项描述", icon: "FileText" }
    ]
  },
  certificates: {
    title: "证书资质",
    isShow: true,
    fields: [
      { key: "name", label: "证书名称", icon: "Certificate" },
      { key: "issuer", label: "颁发机构", icon: "Building" },
      { key: "date", label: "获得时间", icon: "Calendar" },
      { key: "summary", label: "证书描述", icon: "FileText" }
    ]
  },
  languages: {
    title: "语言能力",
    isShow: true,
    fields: [
      { key: "language", label: "语言", icon: "Languages" },
      { key: "level", label: "水平", icon: "BarChart" }
    ]
  }
}

