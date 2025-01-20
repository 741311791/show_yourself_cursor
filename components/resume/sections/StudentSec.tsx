"use client"

import { useState, useEffect, useCallback } from "react"
import { useResumeStore } from "@/store/useResumeStore"
import { useDebounce } from "@/hooks/useDebounce"
import { StudentSection, defaultStudentSection } from "@/types/section"
import { Student } from "@/types/student"
import { Switch } from "@/components/ui/switch"
import { EditableLabel } from "@/components/resume/shared/EditableLabel"
import { StudentCard } from "@/components/resume/cards/StudentCard"
import { LoadFromTimelineButton } from "@/components/resume/shared/LoadFromTimeline"
import { v4 as uuidv4 } from 'uuid'

export function StudentSec() {
  const studentData = useResumeStore(state => state.resumeData?.sections.student)
  const [localStudentSection, setLocalStudentSection] = useState<StudentSection>(defaultStudentSection)

  useEffect(() => {
    setLocalStudentSection(studentData || defaultStudentSection)
  }, [studentData])

  const updateGlobalSection = useCallback((section: StudentSection) => {
    useResumeStore.getState().updateSection('student', section)
  }, [])

  const debouncedSection = useDebounce(localStudentSection, 500)

  useEffect(() => {
    updateGlobalSection(debouncedSection)
  }, [debouncedSection, updateGlobalSection])

  const handleUpdate = useCallback((updates: Partial<StudentSection>) => {
    setLocalStudentSection(prev => {
      const newSection = { ...prev, ...updates }
      return newSection
    })
  }, [])

  const handleStudentDataLoaded = useCallback((studentData: Student[]) => {
    setLocalStudentSection(prev => ({
      ...prev,
      items: studentData.map((student: Student) => ({
        id: uuidv4(),
        organization: student.organization || '',
        role: student.role || '',
        startDate: student.startDate || '',
        endDate: student.endDate || '',
        location: student.location || '',
        summary: student.summary || '',
        customFields: student.customFields || []
      }))
    }))
  }, [])

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <EditableLabel
          label={localStudentSection.sectionConfig.title}
          onSave={(newTitle) => handleUpdate({ 
            sectionConfig: { ...localStudentSection.sectionConfig, title: newTitle } 
          })}
          className="text-lg font-semibold leading-none"
        />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={localStudentSection.sectionConfig.isShow}
              onCheckedChange={(checked) => handleUpdate({ 
                sectionConfig: { ...localStudentSection.sectionConfig, isShow: checked } 
              })}
              className="data-[state=checked]:bg-emerald-500"
            />
            <span className="text-sm text-muted-foreground">
              {localStudentSection.sectionConfig.isShow ? '显示' : '隐藏'}
            </span>
          </div>
          <LoadFromTimelineButton<Student[]>
            sectionType="student"
            onDataLoaded={handleStudentDataLoaded}
          />
        </div>
      </div>

      <StudentCard
        section={localStudentSection}
        onUpdate={handleUpdate}
      />
    </div>
  )
}
