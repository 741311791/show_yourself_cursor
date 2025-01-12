import { ResumeSection, defaultResumeSection } from "@/types/section"
import { ResumeMetadata, defaultResumeMetadata } from "@/types/metadata"


// 简历基本信息类型
export interface Resume {
  id?: string
  name: string          // 简历名称
  isPublic: boolean    // 是否公开
  thumbnailUrl: string    // 添加缩略图字段
  createdAt?: string
  updatedAt?: string
}

// 简历详细信息类型
export interface ResumeDetail extends Resume {
  sections: ResumeSection
  metadata: ResumeMetadata
}

export const defaultResume: Resume = {
  name: "",
  isPublic: false,
  thumbnailUrl: ""
}

export const defaultResumeDetail: ResumeDetail = {
  ...defaultResume,
  sections: defaultResumeSection,
  metadata: defaultResumeMetadata,
}

export interface ResumeAction {
  type: 'edit' | 'rename' | 'duplicate' | 'delete' | 'export'
  resume?: Resume
}