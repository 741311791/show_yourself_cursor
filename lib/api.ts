import axios from 'axios'
import { ResumeDetail } from '@/types/resume'

const api = axios.create({
  baseURL: '/api'
})

export const resumeApi = {
  // 获取所有简历
  getAll: () => 
    api.get<ResumeDetail[]>('/resumes').then(res => res.data),

  // 获取单个简历
  getById: (id: string) => 
    api.get<ResumeDetail>(`/resumes/${id}`).then(res => res.data),

  // 创建简历
  create: (data: Partial<ResumeDetail>) => 
    api.post<ResumeDetail>('/resumes', data).then(res => res.data),

  // 更新简历
  update: (id: string, data: Partial<ResumeDetail>) => 
    api.patch<ResumeDetail>(`/resumes/${id}`, data).then(res => res.data),

  // 删除简历
  delete: (id: string) => 
    api.delete(`/resumes/${id}`).then(res => res.data)
} 