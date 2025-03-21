import { CustomField } from "./shared"

export interface Profile {
  id?: string
  name: string
  avatar?: string
  email: string
  phone: string
  location: string
  title: string
  birthday?: string
  gender?: string
  website?: string
  summary: string
  customFields: CustomField[]
} 

export const defaultProfile: Profile = {
  name: "",
  email: "",
  phone: "",
  birthday: "",
  location: "",
  title: "",
  website: "",
  customFields: [],
  summary: "",
  avatar: ""
}