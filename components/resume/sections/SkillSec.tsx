"use client"

import { useState, useEffect, useCallback } from "react"
import { useResumeStore } from "@/store/useResumeStore"
import { useDebounce } from "@/hooks/useDebounce"
import { SkillSection, defaultSkillSection } from "@/types/section"
import { Skill } from "@/types/skill"
import { Switch } from "@/components/ui/switch"
import { EditableLabel } from "@/components/resume/shared/EditableLabel"
import { SkillCard } from "@/components/resume/cards/SkillCard"
import { LoadFromTimelineButton } from "@/components/resume/shared/LoadFromTimeline"
import { v4 as uuidv4 } from 'uuid'

export function SkillSec() {
  const skillData = useResumeStore(state => state.resumeData?.sections.skill)
  const [localSkillSection, setLocalSkillSection] = useState<SkillSection>(defaultSkillSection)

  useEffect(() => {
    setLocalSkillSection(skillData || defaultSkillSection)
  }, [skillData])

  const updateGlobalSection = useCallback((section: SkillSection) => {
    useResumeStore.getState().updateSection('skill', section)
  }, [])

  const debouncedSection = useDebounce(localSkillSection, 500)

  useEffect(() => {
    updateGlobalSection(debouncedSection)
  }, [debouncedSection, updateGlobalSection])

  const handleUpdate = useCallback((updates: Partial<SkillSection>) => {
    setLocalSkillSection(prev => {
      const newSection = { ...prev, ...updates }
      return newSection
    })
  }, [])

  const handleSkillDataLoaded = useCallback((skillData: Skill[]) => {
    setLocalSkillSection(prev => ({
      ...prev,
      items: skillData.map((skill: Skill) => ({
        id: uuidv4(),
        name: skill.name || '',
        level: skill.level || 'BEGINNER',
        category: skill.category || 'OTHER',
        certDate: skill.certDate || '',
        certName: skill.certName || '',
        certOrg: skill.certOrg || '',
        summary: skill.summary || '',
        customFields: skill.customFields || []
      }))
    }))
  }, [])

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <EditableLabel
          label={localSkillSection.sectionConfig.title}
          onSave={(newTitle) => handleUpdate({ 
            sectionConfig: { ...localSkillSection.sectionConfig, title: newTitle } 
          })}
          className="text-lg font-semibold leading-none"
        />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={localSkillSection.sectionConfig.isShow}
              onCheckedChange={(checked) => handleUpdate({ 
                sectionConfig: { ...localSkillSection.sectionConfig, isShow: checked } 
              })}
              className="data-[state=checked]:bg-emerald-500"
            />
            <span className="text-sm text-muted-foreground">
              {localSkillSection.sectionConfig.isShow ? '显示' : '隐藏'}
            </span>
          </div>
          <LoadFromTimelineButton<Skill[]>
            sectionType="skill"
            onDataLoaded={handleSkillDataLoaded}
          />
        </div>
      </div>

      <SkillCard
        section={localSkillSection}
        onUpdate={handleUpdate}
      />
    </div>
  )
}
