export interface HobbyAward {
  id: string
  title: string
  date: string
}

interface CustomField {
  id: string
  title: string
  content: string
}

export interface Hobby {
  id: string
  name: string
  cover: string | null
  photos: string[]
  description: string
  createdAt: string
  startDate: string
  awards: HobbyAward[]
  customFields: CustomField[]
} 