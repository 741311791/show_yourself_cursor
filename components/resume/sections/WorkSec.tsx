"use client"

import { useState, useEffect, useCallback } from "react"
import { useResumeStore } from "@/store/useResumeStore"
import { useDebounce } from "@/hooks/useDebounce"
import { WorkSection, defaultWorkSection } from "@/types/section"
import { Work } from "@/types/work"
import { Switch } from "@/components/ui/switch"
import { EditableLabel } from "@/components/resume/shared/EditableLabel"
import { WorkCard } from "@/components/resume/cards/WorkCard"
import { LoadFromTimelineButton } from "@/components/resume/shared/LoadFromTimeline"
import { v4 as uuidv4 } from 'uuid'

export function WorkSec() {
  const workData = useResumeStore(state => state.resumeData?.sections.work)
  const [localWorkSection, setLocalWorkSection] = useState<WorkSection>(defaultWorkSection)

  useEffect(() => {
    setLocalWorkSection(workData || defaultWorkSection)
  }, [workData])

  const updateGlobalSection = useCallback((section: WorkSection) => {
    useResumeStore.getState().updateSection('work', section)
  }, [])

  const debouncedSection = useDebounce(localWorkSection, 500)

  useEffect(() => {
    updateGlobalSection(debouncedSection)
  }, [debouncedSection, updateGlobalSection])

  const handleUpdate = useCallback((updates: Partial<WorkSection>) => {
    setLocalWorkSection(prev => {
      const newSection = { ...prev, ...updates }
      return newSection
    })
  }, [])

  const handleWorkDataLoaded = useCallback((workData: Work[]) => {
    setLocalWorkSection(prev => ({
      ...prev,
      items: workData.map((work: Work) => ({
        id: uuidv4(),
        company: work.company || '',
        title: work.title || '',
        position: work.position || '',
        startDate: work.startDate || '',
        endDate: work.endDate || '',
        location: work.location || '',
        summary: work.summary || '',
        customFields: work.customFields || []
      }))
    }))
  }, [])

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <EditableLabel
          label={localWorkSection.sectionConfig.title}
          onSave={(newTitle) => handleUpdate({ 
            sectionConfig: { ...localWorkSection.sectionConfig, title: newTitle } 
          })}
          className="text-lg font-semibold leading-none"
        />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={localWorkSection.sectionConfig.isShow}
              onCheckedChange={(checked) => handleUpdate({ 
                sectionConfig: { ...localWorkSection.sectionConfig, isShow: checked } 
              })}
              className="data-[state=checked]:bg-emerald-500"
            />
            <span className="text-sm text-muted-foreground">
              {localWorkSection.sectionConfig.isShow ? '显示' : '隐藏'}
            </span>
          </div>
          <LoadFromTimelineButton<Work[]>
            sectionType="work"
            onDataLoaded={handleWorkDataLoaded}
          />
        </div>
      </div>

      <WorkCard
        section={localWorkSection}
        onUpdate={handleUpdate}
      />
    </div>
  )
}
