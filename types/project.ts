import { Project as WorkProject } from "./work"

// 继承工作经历中的项目类型，添加公司信息
export interface Project extends WorkProject {
  company: string  // 添加公司信息字段
  source: 'work' | 'custom'  // 标记项目来源：工作经历/自定义
} 