import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { ResumeDetail, ResumeConfig } from '@/types/resume'

// 添加索引签名
type ConfigKey = keyof ResumeConfig
interface ResumeStore {
  resumeData: ResumeDetail | null
  setResumeData: (data: ResumeDetail) => void
  updateSection: <T extends keyof ResumeDetail>(section: T, data: ResumeDetail[T]) => void
  updateConfig: (sectionKey: ConfigKey, newConfig: ResumeConfig[ConfigKey]) => void
}

export const useResumeStore = create<ResumeStore>()(
  subscribeWithSelector((set) => ({
    resumeData: null,

    setResumeData: (data) => set({ resumeData: data }),

    updateSection: (section, data) => 
      set((state) => {
        const newState = {
          resumeData: state.resumeData ? {
            ...state.resumeData,
            [section]: data
          } : null
        }
        console.log('State updated (updateSection):', {
          section,
          oldData: state.resumeData?.[section],
          newData: data,
          fullState: newState
        })
        return newState
      }),

    updateConfig: (sectionKey, newConfig) =>
      set((state) => {
        const newState = {
          resumeData: state.resumeData ? {
            ...state.resumeData,
            config: {
              ...state.resumeData.config,
              [sectionKey]: newConfig
            }
          } : null
        }
        console.log('State updated (updateConfig):', {
          sectionKey,
          oldConfig: state.resumeData?.config?.[sectionKey],
          newConfig,
          fullState: newState
        })
        return newState
      })
  }))
)

// 添加状态变化订阅
useResumeStore.subscribe(
  (state) => state.resumeData,
  (newData, oldData) => {
    console.log('ResumeData changed:', {
      old: oldData,
      new: newData,
      diff: JSON.stringify(newData) !== JSON.stringify(oldData)
    })
  }
) 