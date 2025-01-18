import { ResumeDetail } from "@/types/resume"
import { defaultResumeSection } from "@/types/section"
import { defaultResumeMetadata } from "@/types/metadata"

/**
 * 将数据库 Resume 记录转换为 ResumeDetail 对象
 */
export function convertToResumeDetail(dbResume: Partial<ResumeDetail>): ResumeDetail {
  // 基础字段
  const resumeDetail: ResumeDetail = {
    id: dbResume.id,
    name: dbResume.name || ""   ,
    isPublic: dbResume.isPublic || false,
    thumbnailUrl: dbResume.thumbnailUrl || "",
    createdAt: dbResume.createdAt,
    updatedAt: dbResume.updatedAt,
    sections: dbResume.sections || defaultResumeSection,
    metadata: dbResume.metadata || defaultResumeMetadata
  }

  return resumeDetail
}

