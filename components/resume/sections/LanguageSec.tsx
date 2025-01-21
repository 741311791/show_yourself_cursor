"use client"

import { useState, useEffect, useCallback } from "react"
import { useResumeStore } from "@/store/useResumeStore"
import { useDebounce } from "@/hooks/useDebounce"
import { LanguageSection, defaultLanguageSection } from "@/types/section"
import { Language } from "@/types/language"
import { Switch } from "@/components/ui/switch"
import { EditableLabel } from "@/components/resume/shared/EditableLabel"
import { LanguageCard } from "@/components/resume/cards/LanguageCard"
import { LoadFromTimelineButton } from "@/components/resume/shared/LoadFromTimeline"
import { v4 as uuidv4 } from 'uuid'

export function LanguageSec() {
  const languageData = useResumeStore(state => state.resumeData?.sections.language)
  const [localLanguageSection, setLocalLanguageSection] = useState<LanguageSection>(defaultLanguageSection)

  useEffect(() => {
    setLocalLanguageSection(languageData || defaultLanguageSection)
  }, [languageData])

  const updateGlobalSection = useCallback((section: LanguageSection) => {
    useResumeStore.getState().updateSection('language', section)
  }, [])

  const debouncedSection = useDebounce(localLanguageSection, 500)

  useEffect(() => {
    updateGlobalSection(debouncedSection)
  }, [debouncedSection, updateGlobalSection])

  const handleUpdate = useCallback((updates: Partial<LanguageSection>) => {
    setLocalLanguageSection(prev => {
      const newSection = { ...prev, ...updates }
      return newSection
    })
  }, [])

  const handleLanguageDataLoaded = useCallback((languageData: Language[]) => {
    setLocalLanguageSection(prev => ({
      ...prev,
      items: languageData.map((lang: Language) => ({
        id: uuidv4(),
        name: lang.name || '',
        level: lang.level || 'BEGINNER',
        certificate: lang.certificate || '',
        acquireDate: lang.acquireDate || '',
        score: lang.score || '',
        validPeriod: lang.validPeriod || '',
        summary: lang.summary || '',
        customFields: lang.customFields || []
      }))
    }))
  }, [])

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <EditableLabel
          label={localLanguageSection.sectionConfig.title}
          onSave={(newTitle) => handleUpdate({ 
            sectionConfig: { ...localLanguageSection.sectionConfig, title: newTitle } 
          })}
          className="text-lg font-semibold leading-none"
        />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={localLanguageSection.sectionConfig.isShow}
              onCheckedChange={(checked) => handleUpdate({ 
                sectionConfig: { ...localLanguageSection.sectionConfig, isShow: checked } 
              })}
              className="data-[state=checked]:bg-emerald-500"
            />
            <span className="text-sm text-muted-foreground">
              {localLanguageSection.sectionConfig.isShow ? '显示' : '隐藏'}
            </span>
          </div>
          <LoadFromTimelineButton<Language[]>
            sectionType="language"
            onDataLoaded={handleLanguageDataLoaded}
          />
        </div>
      </div>

      <LanguageCard
        section={localLanguageSection}
        onUpdate={handleUpdate}
      />
    </div>
  )
}
