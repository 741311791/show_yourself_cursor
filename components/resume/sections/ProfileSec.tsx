"use client"

import { useState, useEffect, useCallback } from "react"
import { useResumeStore } from "@/store/useResumeStore"
import { useDebounce } from "@/hooks/useDebounce"
import { ProfileSection, defaultProfileSection } from "@/types/section"
import { Switch } from "@/components/ui/switch"
import { EditableLabel } from "@/components/resume/shared/EditableLabel"
import { AvatarUpload } from "@/components/shared/AvatarUpload"
import { CustomFieldsSection } from "@/components/resume/shared/CustomFieldsSection"

export function ProfileSec() {
  // 从全局状态获取 profile 数据
  const profileData = useResumeStore(state => state.resumeData?.sections.profile)
  const [localProfileSection, setLocalProfileSection] = useState<ProfileSection>(defaultProfileSection)

  // 初始化本地状态
  useEffect(() => {
    setLocalProfileSection(profileData || defaultProfileSection)
  }, [])

  // 防抖更新全局状态
  const updateGlobalSection = useCallback((section: ProfileSection) => {
    useResumeStore.getState().updateSection('profile', section)
  }, [])

  // 创建防抖值而不是函数
  const debouncedSection = useDebounce(localProfileSection, 500)

  // 监听防抖后的值变化来更新全局状态
  useEffect(() => {
    updateGlobalSection(debouncedSection)
  }, [debouncedSection, updateGlobalSection])

  // 更新处理函数
  const handleUpdate = useCallback((updates: Partial<ProfileSection>) => {
    setLocalProfileSection(prev => {
      const newSection = { ...prev, ...updates }
      return newSection
    })
  }, [])

  return (
    <div className="space-y-6">
      {/* 标题和显示控制 */}
      <div className="flex items-center justify-between">
        <EditableLabel
          label={localProfileSection.sectionConfig.title}
          onSave={(newTitle) => handleUpdate({ 
            sectionConfig: { ...localProfileSection.sectionConfig, title: newTitle } 
          })}
          className="text-lg font-semibold leading-none"
        />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={localProfileSection.sectionConfig.isShow}
              onCheckedChange={(checked) => handleUpdate({ 
                sectionConfig: { ...localProfileSection.sectionConfig, isShow: checked } 
              })}
              className="data-[state=checked]:bg-emerald-500"
            />
            <span className="text-sm text-muted-foreground">
              {localProfileSection.sectionConfig.isShow ? '显示' : '隐藏'}
            </span>
          </div>
        </div>
      </div>

      {/* 头像上传 */}
      <div className="space-y-2">
        <AvatarUpload
          value={localProfileSection.avatar}
          onChange={(url) => handleUpdate({avatar: url})}
        />
      </div>

      {/* 自定义字段 */}
      <CustomFieldsSection
        fields={localProfileSection.customFields}
        onChange={(fields) => handleUpdate({ customFields: fields })}
      />
    </div>
  )
} 