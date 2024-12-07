export interface Education {
  id: string
  school: string
  location: string
  startDate: string
  endDate: string
  major: string
  courses: string
  gpa: string
  degree: string
  photo: string | null
  customFields: {
    id: string
    title: string
    content: string
  }[]
  summary: string
} 