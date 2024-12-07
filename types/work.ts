export interface Project {
  id: string
  name: string
  startDate: string
  endDate: string
  description: string
  techStack?: string
  achievement: string
  isCore: boolean
  order: number
}

export interface Work {
  id: string
  company: string
  location: string
  startDate: string
  endDate: string
  position: string
  photo: string | null
  projects: Project[]
  customFields: {
    id: string
    title: string
    content: string
  }[]
  summary: string
} 