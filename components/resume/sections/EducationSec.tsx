"use client"

import { useState, useEffect, useCallback } from "react"
import { useResumeStore } from "@/store/useResumeStore"
import { useDebounce } from "@/hooks/useDebounce"
import { EducationSection, defaultEducationSection } from "@/types/section"
import { Education } from "@/types/education"
import { Switch } from "@/components/ui/switch"
import { EditableLabel } from "@/components/resume/shared/EditableLabel"
import { EducationCard } from "@/components/resume/cards/EducationCard"
import { LoadFromTimelineButton } from "@/components/resume/shared/LoadFromTimeline"
import { v4 as uuidv4 } from 'uuid'

export function EducationSec() {
  // 从全局状态获取 education 数据
  const educationData = useResumeStore(state => state.resumeData?.sections.education)
  const [localEducationSection, setLocalEducationSection] = useState<EducationSection>(defaultEducationSection)

  // 初始化本地状态
  useEffect(() => {
    setLocalEducationSection(educationData || defaultEducationSection)
  }, [educationData])

  // 防抖更新全局状态
  const updateGlobalSection = useCallback((section: EducationSection) => {
    useResumeStore.getState().updateSection('education', section)
  }, [])

  // 创建防抖值而不是函数
  const debouncedSection = useDebounce(localEducationSection, 500)

  // 监听防抖后的值变化来更新全局状态
  useEffect(() => {
    updateGlobalSection(debouncedSection)
  }, [debouncedSection, updateGlobalSection])

  // 更新处理函数
  const handleUpdate = useCallback((updates: Partial<EducationSection>) => {
    setLocalEducationSection(prev => {
      const newSection = { ...prev, ...updates }
      return newSection
    })
  }, [])

  // 处理从个人履历加载的数据
  const handleEducationDataLoaded = useCallback((educationData: Education[]) => {
    setLocalEducationSection(prev => ({
      ...prev,
      items: educationData.map((edu: Education) => ({
        id: uuidv4(),
        school: edu.school || '',
        major: edu.major || '',
        degree: edu.degree || '',
        startDate: edu.startDate || '',
        endDate: edu.endDate || '',
        location: edu.location || '',
        gpa: edu.gpa || '',
        courses: edu.courses || '',
        summary: edu.summary || '',
        customFields: edu.customFields || []
      }))
    }))
  }, [])

  return (
    <div className="space-y-8">
      {/* 标题和显示控制 */}
      <div className="flex items-center justify-between">
        <EditableLabel
          label={localEducationSection.sectionConfig.title}
          onSave={(newTitle) => handleUpdate({ 
            sectionConfig: { ...localEducationSection.sectionConfig, title: newTitle } 
          })}
          className="text-lg font-semibold leading-none"
        />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={localEducationSection.sectionConfig.isShow}
              onCheckedChange={(checked) => handleUpdate({ 
                sectionConfig: { ...localEducationSection.sectionConfig, isShow: checked } 
              })}
              className="data-[state=checked]:bg-emerald-500"
            />
            <span className="text-sm text-muted-foreground">
              {localEducationSection.sectionConfig.isShow ? '显示' : '隐藏'}
            </span>
          </div>
          <LoadFromTimelineButton<Education[]>
            sectionType="education"
            onDataLoaded={handleEducationDataLoaded}
          />
        </div>
      </div>

      {/* Education 卡片 */}
      <EducationCard
        section={localEducationSection}
        onUpdate={handleUpdate}
      />
    </div>
  )
}
