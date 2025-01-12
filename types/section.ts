import { Profile, defaultProfile } from "@/types/profile"
import { Education, defaultEducation } from "@/types/education"
import { Work, defaultWork } from "@/types/work"
import { Project, defaultProject } from "@/types/project"
import { Research, defaultResearch } from "@/types/research"
import { Hobby, defaultHobby } from "@/types/hobby"
import { Language, defaultLanguage } from "@/types/language"
import { Skill, defaultSkill } from "@/types/skill"
import { Award, defaultAward } from "@/types/award"
import { Certificate, defaultCertificate } from "@/types/certificate"
import { Publication, defaultPublication } from "@/types/publication"
import { CustomBlockForm, defaultCustomBlockForm } from "@/types/custom"
import { Student, defaultStudent } from "@/types/student"
import { ResearchResult, defaultResearchResult } from "@/types/research"


export interface PictureConfig {
    size: number
    aspectRatio: number
    borderRadius: number
    effects: {
        hidden: boolean
        border: boolean
        grayscale: boolean
    }
}

export interface LabelConfig {
    key: string
    label: string
    icon?: string
}

export interface SectionConfig {
    title: string
    isShow: boolean
    columns: number
    separateLinks: boolean
}

export interface ProfileSection extends Profile {
    pictureConfig: PictureConfig
    labelConfig: LabelConfig[]
    sectionConfig: SectionConfig
}

export interface EducationSection extends Education {
    labelConfig: LabelConfig[]
    sectionConfig: SectionConfig
}

export interface WorkSection extends Work {
    labelConfig: LabelConfig[]
    sectionConfig: SectionConfig
}

export interface ProjectSection extends Project {
    labelConfig: LabelConfig[]
    sectionConfig: SectionConfig
}

export interface ResearchSection extends Research {
    labelConfig: LabelConfig[]
    sectionConfig: SectionConfig
}

export interface HobbySection extends Hobby {
    labelConfig: LabelConfig[]
    sectionConfig: SectionConfig
}

export interface LanguageSection extends Language {
    labelConfig: LabelConfig[]
    sectionConfig: SectionConfig
}

export interface SkillSection extends Skill {
    labelConfig: LabelConfig[]
    sectionConfig: SectionConfig
}

export interface AwardSection extends Award {
    labelConfig: LabelConfig[]
    sectionConfig: SectionConfig
}

export interface CertificateSection extends Certificate {
    labelConfig: LabelConfig[]
    sectionConfig: SectionConfig
}

export interface PublicationSection extends Publication {
    labelConfig: LabelConfig[]
    sectionConfig: SectionConfig
}

export interface CustomBlockSection extends CustomBlockForm {
    labelConfig: LabelConfig[]
    sectionConfig: SectionConfig
}

export interface StudentSection extends Student {
    labelConfig: LabelConfig[]
    sectionConfig: SectionConfig
}

export interface ResearchResultSection extends ResearchResult {
    labelConfig: LabelConfig[]
    sectionConfig: SectionConfig
}

export interface ResumeSection {
    profile: ProfileSection
    education: EducationSection
    work: WorkSection
    project: ProjectSection
    research: ResearchSection
    hobby: HobbySection
    language: LanguageSection
    skill: SkillSection
    award: AwardSection
    certificate: CertificateSection
    publication: PublicationSection
    customBlock: CustomBlockSection
    student: StudentSection
    researchResult: ResearchResultSection
}

export const defaultProfileSection: ProfileSection = {
    ...defaultProfile,
    pictureConfig: {
        size: 64,
        aspectRatio: 1,
        borderRadius: 0,
        effects: {
            hidden: false,
            border: false,
            grayscale: false
        }
    },
    labelConfig: [
        { key: "name", label: "姓名", icon: "User" },
        { key: "title", label: "职位", icon: "Briefcase" },
        { key: "email", label: "邮箱", icon: "Mail" },
        { key: "phone", label: "电话", icon: "Phone" },
        { key: "location", label: "地点", icon: "MapPin" },
        { key: "summary", label: "个人简介", icon: "FileText" },
        { key: "avatar", label: "头像", icon: "User" },
        { key: "birthday", label: "生日", icon: "Calendar" },
        { key: "gender", label: "性别", icon: "Gender" },
        { key: "website", label: "个人网站", icon: "Globe" }
    ],
    sectionConfig: {
        title: "基本信息",
        isShow: true,
        columns: 1,
        separateLinks: false
    }
}

export const defaultEducationSection: EducationSection = {
    ...defaultEducation,
    labelConfig: [
        { key: "school", label: "学校", icon: "GraduationCap" },
        { key: "major", label: "专业", icon: "BookOpen" },
        { key: "degree", label: "学位", icon: "Award" },
        { key: "startDate", label: "开始时间", icon: "CalendarRange" },
        { key: "endDate", label: "结束时间", icon: "CalendarRange" },
        { key: "gpa", label: "GPA", icon: "Star" },
        { key: "courses", label: "主修课程", icon: "ListChecks" },
        { key: "location", label: "地点", icon: "MapPin" },
        { key: "summary", label: "个人简介", icon: "FileText" }
    ],
    sectionConfig: {
        title: "教育经历",
        isShow: true,
        columns: 1,
        separateLinks: false
    }
}

export const defaultWorkSection: WorkSection = {
    ...defaultWork,
    labelConfig: [
        { key: "company", label: "公司", icon: "Building2" },
        { key: "position", label: "职位", icon: "Briefcase" },
        { key: "startDate", label: "开始时间", icon: "CalendarRange" },
        { key: "endDate", label: "结束时间", icon: "CalendarRange" },
        { key: "location", label: "地点", icon: "MapPin" },
        { key: "summary", label: "总结", icon: "FileText" }
    ],
    sectionConfig: {
        title: "工作经历",
        isShow: true,
        columns: 1,
        separateLinks: false
    }
}

export const defaultProjectSection: ProjectSection = {
    ...defaultProject,
    labelConfig: [
        { key: "name", label: "项目名称", icon: "Folder" },
        { key: "company", label: "公司", icon: "Building2" },
        { key: "role", label: "担任角色", icon: "UserCircle" },
        { key: "startDate", label: "开始时间", icon: "CalendarRange" },
        { key: "endDate", label: "结束时间", icon: "CalendarRange" },
        { key: "description", label: "项目描述", icon: "FileText" },
        { key: "techStack", label: "技术栈", icon: "Code" },
        { key: "summary", label: "总结", icon: "FileText" }
    ],
    sectionConfig: {
        title: "项目经历",
        isShow: true,
        columns: 1,
        separateLinks: false
    }
}

export const defaultHobbySection: HobbySection = {
    ...defaultHobby,
    labelConfig: [
        { key: "name", label: "名称", icon: "Folder" },
        { key: "startDate", label: "开始时间", icon: "CalendarRange" },
        { key: "summary", label: "总结", icon: "FileText" }
    ],
    sectionConfig: {
        title: "兴趣爱好",
        isShow: true,
        columns: 1,
        separateLinks: false
    }
}

export const defaultLanguageSection: LanguageSection = {
    ...defaultLanguage,
    labelConfig: [
        { key: "name", label: "名称", icon: "Languages" },
        { key: "level", label: "水平", icon: "BarChart" },
        { key: "certificate", label: "证书", icon: "Certificate" },
        { key: "acquireDate", label: "获得时间", icon: "Calendar" },
        { key: "score", label: "分数", icon: "Star" },
        { key: "validPeriod", label: "有效期", icon: "CalendarRange" },
        { key: "summary", label: "总结", icon: "FileText" }
    ],
    sectionConfig: {
        title: "语言能力",
        isShow: true,
        columns: 1,
        separateLinks: false
    }
}

export const defaultSkillSection: SkillSection = {
    ...defaultSkill,
    labelConfig: [
        { key: "name", label: "名称", icon: "Folder" },
        { key: "category", label: "类别", icon: "Tag" },
        { key: "level", label: "等级", icon: "Star" },
        { key: "certDate", label: "认证时间", icon: "Calendar" },
        { key: "certName", label: "认证名称", icon: "Certificate" },
        { key: "certOrg", label: "认证机构", icon: "Building" },
        { key: "summary", label: "总结", icon: "FileText" }
    ],
    sectionConfig: {
        title: "技能",
        isShow: true,
        columns: 1,
        separateLinks: false
    }
}

export const defaultAwardSection: AwardSection = {
    ...defaultAward,
    labelConfig: [
        { key: "name", label: "名称", icon: "Award" },
        { key: "issuer", label: "颁发机构", icon: "Building" },
        { key: "date", label: "获得时间", icon: "Calendar" },
        { key: "summary", label: "总结", icon: "FileText" }
    ],
    sectionConfig: {
        title: "奖项",
        isShow: true,
        columns: 1,
        separateLinks: false
    }
}

export const defaultCertificateSection: CertificateSection = {
    ...defaultCertificate,
    labelConfig: [
        { key: "name", label: "名称", icon: "Certificate" },
        { key: "issuer", label: "颁发机构", icon: "Building" },
        { key: "date", label: "获得时间", icon: "Calendar" },
        { key: "level", label: "证书级别", icon: "Star" },
        { key: "summary", label: "总结", icon: "FileText" }
    ],
    sectionConfig: {
        title: "证书",
        isShow: true,
        columns: 1,
        separateLinks: false
    }
}

export const defaultPublicationSection: PublicationSection = {
    ...defaultPublication,
    labelConfig: [
        { key: "name", label: "名称", icon: "BookOpen" },
        { key: "type", label: "类型", icon: "Tag" },
        { key: "date", label: "出版时间", icon: "Calendar" },
        { key: "journal", label: "刊物名称", icon: "BookOpen" },
        { key: "database", label: "数据库收录", icon: "Database" },
        { key: "summary", label: "总结", icon: "FileText" }
    ],
    sectionConfig: {
        title: "出版物",
        isShow: true,
        columns: 1,
        separateLinks: false
    }
}

export const defaultResearchSection: ResearchSection = {
    ...defaultResearch,
    labelConfig: [
        { key: "direction", label: "研究方向", icon: "BookOpen" },
        { key: "institution", label: "研究机构", icon: "Building" },
        { key: "role", label: "担任角色", icon: "UserCircle" },
        { key: "startDate", label: "开始时间", icon: "CalendarRange" },
        { key: "endDate", label: "结束时间", icon: "CalendarRange" },
        { key: "summary", label: "总结", icon: "FileText" }
    ],
    sectionConfig: {
        title: "研究经历",
        isShow: true,
        columns: 1,
        separateLinks: false
    }
}

export const defaultStudentSection: StudentSection = {
    ...defaultStudent,
    labelConfig: [
        { key: "activityName", label: "活动/项目名称", icon: "Folder" },
        { key: "organization", label: "组织/社团名称", icon: "Building" },
        { key: "role", label: "担任角色", icon: "UserCircle" },
        { key: "startDate", label: "开始时间", icon: "CalendarRange" },
        { key: "endDate", label: "结束时间", icon: "CalendarRange" },
        { key: "summary", label: "总结", icon: "FileText" }
    ],
    sectionConfig: {
        title: "学生经历",
        isShow: true,
        columns: 1,
        separateLinks: false
    }
}

export const defaultResearchResultSection: ResearchResultSection = {
    ...defaultResearchResult,
    labelConfig: [
        { key: "name", label: "名称", icon: "Folder" },
        { key: "type", label: "类型", icon: "Tag" },
        { key: "role", label: "担任角色", icon: "UserCircle" },
        { key: "date", label: "出版时间", icon: "Calendar" },
        { key: "summary", label: "总结", icon: "FileText" }
    ],
    sectionConfig: {
        title: "研究成果",
        isShow: true,
        columns: 1,
        separateLinks: false
    }
}

export const defaultCustomBlockSection: CustomBlockSection = {
    ...defaultCustomBlockForm,
    labelConfig: [],
    sectionConfig: {
        title: "自定义块",
        isShow: true,
        columns: 1,
        separateLinks: false
    }
}

export const defaultResumeSection: ResumeSection = {
    profile: defaultProfileSection,
    education: defaultEducationSection,
    work: defaultWorkSection,
    project: defaultProjectSection,
    research: defaultResearchSection,
    hobby: defaultHobbySection,
    language: defaultLanguageSection,
    skill: defaultSkillSection,
    award: defaultAwardSection,
    certificate: defaultCertificateSection,
    publication: defaultPublicationSection,
    customBlock: defaultCustomBlockSection,
    student: defaultStudentSection,
    researchResult: defaultResearchResultSection
}
