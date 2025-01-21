"use client"

import { useState, useEffect, useCallback } from "react"
import { useResumeStore } from "@/store/useResumeStore"
import { useDebounce } from "@/hooks/useDebounce"
import { AwardSection, defaultAwardSection } from "@/types/section"
import { Award } from "@/types/award"
import { Switch } from "@/components/ui/switch"
import { EditableLabel } from "@/components/resume/shared/EditableLabel"
import { AwardCard } from "@/components/resume/cards/AwardCard"
import { LoadFromTimelineButton } from "@/components/resume/shared/LoadFromTimeline"
import { v4 as uuidv4 } from 'uuid'

export function AwardSec() {
  const awardData = useResumeStore(state => state.resumeData?.sections.award)
  const [localAwardSection, setLocalAwardSection] = useState<AwardSection>(defaultAwardSection)

  useEffect(() => {
    setLocalAwardSection(awardData || defaultAwardSection)
  }, [awardData])

  const updateGlobalSection = useCallback((section: AwardSection) => {
    useResumeStore.getState().updateSection('award', section)
  }, [])

  const debouncedSection = useDebounce(localAwardSection, 500)

  useEffect(() => {
    updateGlobalSection(debouncedSection)
  }, [debouncedSection, updateGlobalSection])

  const handleUpdate = useCallback((updates: Partial<AwardSection>) => {
    setLocalAwardSection(prev => {
      const newSection = { ...prev, ...updates }
      return newSection
    })
  }, [])

  const handleAwardDataLoaded = useCallback((awardData: Award[]) => {
    setLocalAwardSection(prev => ({
      ...prev,
      items: awardData.map((award: Award) => ({
        id: uuidv4(),
        name: award.name || '',
        level: award.level || '',
        issuer: award.issuer || '',
        acquireDate: award.acquireDate || '',
        ranking: award.ranking || '',
        participants: award.participants || '',
        summary: award.summary || '',
        customFields: award.customFields || []
      }))
    }))
  }, [])

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <EditableLabel
          label={localAwardSection.sectionConfig.title}
          onSave={(newTitle) => handleUpdate({ 
            sectionConfig: { ...localAwardSection.sectionConfig, title: newTitle } 
          })}
          className="text-lg font-semibold leading-none"
        />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={localAwardSection.sectionConfig.isShow}
              onCheckedChange={(checked) => handleUpdate({ 
                sectionConfig: { ...localAwardSection.sectionConfig, isShow: checked } 
              })}
              className="data-[state=checked]:bg-emerald-500"
            />
            <span className="text-sm text-muted-foreground">
              {localAwardSection.sectionConfig.isShow ? '显示' : '隐藏'}
            </span>
          </div>
          <LoadFromTimelineButton<Award[]>
            sectionType="award"
            onDataLoaded={handleAwardDataLoaded}
          />
        </div>
      </div>

      <AwardCard
        section={localAwardSection}
        onUpdate={handleUpdate}
      />
    </div>
  )
}
