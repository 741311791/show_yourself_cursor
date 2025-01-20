"use client"

import { useState, useEffect, useCallback } from "react"
import { useResumeStore } from "@/store/useResumeStore"
import { useDebounce } from "@/hooks/useDebounce"
import { ProjectSection, defaultProjectSection } from "@/types/section"
import { Project } from "@/types/project"
import { Switch } from "@/components/ui/switch"
import { EditableLabel } from "@/components/resume/shared/EditableLabel"
import { ProjectCard } from "@/components/resume/cards/ProjectCard"
import { LoadFromTimelineButton } from "@/components/resume/shared/LoadFromTimeline"
import { v4 as uuidv4 } from 'uuid'

export function ProjectSec() {
  const projectData = useResumeStore(state => state.resumeData?.sections.project)
  const [localProjectSection, setLocalProjectSection] = useState<ProjectSection>(defaultProjectSection)

  useEffect(() => {
    setLocalProjectSection(projectData || defaultProjectSection)
  }, [projectData])

  const updateGlobalSection = useCallback((section: ProjectSection) => {
    useResumeStore.getState().updateSection('project', section)
  }, [])

  const debouncedSection = useDebounce(localProjectSection, 500)

  useEffect(() => {
    updateGlobalSection(debouncedSection)
  }, [debouncedSection, updateGlobalSection])

  const handleUpdate = useCallback((updates: Partial<ProjectSection>) => {
    setLocalProjectSection(prev => {
      const newSection = { ...prev, ...updates }
      return newSection
    })
  }, [])

  const handleProjectDataLoaded = useCallback((projectData: Project[]) => {
    setLocalProjectSection(prev => ({
      ...prev,
      items: projectData.map((proj: Project) => ({
        id: uuidv4(),
        name: proj.name || '',
        role: proj.role || '',
        company: proj.company || '',
        startDate: proj.startDate || '',
        endDate: proj.endDate || '',
        description: proj.description || '',
        techStack: proj.techStack || '',
        customFields: proj.customFields || [],
        summary: proj.summary || ''
      }))
    }))
  }, [])

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <EditableLabel
          label={localProjectSection.sectionConfig.title}
          onSave={(newTitle) => handleUpdate({ 
            sectionConfig: { ...localProjectSection.sectionConfig, title: newTitle } 
          })}
          className="text-lg font-semibold leading-none"
        />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={localProjectSection.sectionConfig.isShow}
              onCheckedChange={(checked) => handleUpdate({ 
                sectionConfig: { ...localProjectSection.sectionConfig, isShow: checked } 
              })}
              className="data-[state=checked]:bg-emerald-500"
            />
            <span className="text-sm text-muted-foreground">
              {localProjectSection.sectionConfig.isShow ? '显示' : '隐藏'}
            </span>
          </div>
          <LoadFromTimelineButton<Project[]>
            sectionType="project"
            onDataLoaded={handleProjectDataLoaded}
          />
        </div>
      </div>

      <ProjectCard
        section={localProjectSection}
        onUpdate={handleUpdate}
      />
    </div>
  )
}
