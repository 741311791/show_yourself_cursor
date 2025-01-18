import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { ResumeDetail, Resume } from '@/types/resume'
import { ResumeSection } from '@/types/section'
import { ResumeMetadata } from '@/types/metadata'

interface ResumeStore {
  // 状态
  resumeData: ResumeDetail | null
  
  // 基本信息更新
  setResumeData: (data: ResumeDetail) => void
  updateBasicInfo: (data: Partial<Resume>) => void
  
  // 内容更新
  updateSection: <K extends keyof ResumeSection>(
    sectionKey: K,
    data: ResumeSection[K]
  ) => void
  
  // 元数据更新
  updateMetadata: <K extends keyof ResumeMetadata>(
    key: K,
    value: ResumeMetadata[K]
  ) => void
}

export const useResumeStore = create<ResumeStore>()(
  subscribeWithSelector((set) => ({
    resumeData: null,

    // 设置整个简历数据
    setResumeData: (data) => {
      set({ resumeData: data })
    },

    // 更新基本信息
    updateBasicInfo: (data) => 
      set((state) => {
        if (!state.resumeData) return state

        const newData = {
          ...state.resumeData,
          ...data
        }

        console.log('Updating basic info:', {
          changes: data,
          newData
        })

        return { resumeData: newData }
      }),

    // 更新简历内容区域
    updateSection: (sectionKey, data) => {
      set((state) => {
        if (!state.resumeData) return state

        return {
          resumeData: {
            ...state.resumeData,
            sections: {
              ...state.resumeData.sections,
              [sectionKey]: data
            }
          }
        }
      })
    },

    // 更新元数据/布局配置
    updateMetadata: (key, value) =>
      set((state) => {
        if (!state.resumeData) return state

        const newData = {
          ...state.resumeData,
          metadata: {
            ...state.resumeData.metadata,
            [key]: value
          }
        }

        console.log('Updating metadata:', {
          key,
          value,
          newData: newData.metadata
        })

        return { resumeData: newData }
      })
  }))
)

// 添加状态变化订阅
useResumeStore.subscribe(
  (state) => state.resumeData,
  (newData, oldData) => {
    if (!oldData || !newData) return

    // 检查基本信息变化
    const basicInfoChanged = ['name', 'isPublic', 'thumbnailUrl'].some(
      key => oldData[key as keyof Resume] !== newData[key as keyof Resume]
    )

    // 检查内容变化
    const sectionsChanged = JSON.stringify(oldData.sections) !== JSON.stringify(newData.sections)
    
    // 检查元数据变化
    const metadataChanged = JSON.stringify(oldData.metadata) !== JSON.stringify(newData.metadata)

    console.log('Resume state changed:', {
      basicInfoChanged,
      sectionsChanged,
      metadataChanged,
      timestamp: new Date().toISOString()
    })
  }
)

// 导出选择器函数，方便组件使用
export const selectResumeData = (state: ResumeStore) => state.resumeData
export const selectResumeSections = (state: ResumeStore) => state.resumeData?.sections
export const selectResumeMetadata = (state: ResumeStore) => state.resumeData?.metadata 