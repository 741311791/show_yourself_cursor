"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { Profile } from "@/types/profile"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import * as Icons from "lucide-react"
import { AvatarUpload } from "@/components/shared/AvatarUpload"
import { AIRichTextEditor } from "@/components/shared/AIRichTextEditor"
import { CustomFieldsSection } from "@/components/resume/shared/CustomFieldsSection"
import { LucideIcon } from "lucide-react"
import { SectionConfigDialog } from "@/components/resume/shared/SectionConfigDialog"
import { ResumeDetail, DEFAULT_RESUME_CONFIG } from "@/types/resume"
import { useDebounce } from "@/hooks/useDebounce"
import { FieldLabel } from "@/types/resume"
import { CustomField } from "@/types/shared"
import { useResumeStore } from "@/store/useResumeStore"
import { Button } from "@/components/ui/button"
import { Edit2, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { ConfigActions } from "@/components/resume/shared/ConfigActions"
import { Switch } from "@/components/ui/switch"


interface EditableLabelProps {
  label: string
  onSave: (newLabel: string) => void
  variant?: 'default' | 'title'
  className?: string
}

function EditableLabel({ label, onSave, variant = 'default' }: EditableLabelProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editingLabel, setEditingLabel] = useState(label)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setEditingLabel(label)
  }, [label])

  const handleSave = () => {
    if (editingLabel.trim()) {
      onSave(editingLabel)
      setIsEditing(false)
    }
  }

  return (
    <div className={cn(
      "group relative flex items-center gap-2",
      variant === 'title' && "w-full justify-between"
    )}>
      <div className="relative flex-1">
        <Input
          ref={inputRef}
          value={editingLabel}
          onChange={(e) => setEditingLabel(e.target.value)}
          disabled={!isEditing}
          className={cn(
            "border-none bg-transparent p-0 focus-visible:ring-0",
            "disabled:opacity-100",
            variant === 'title' && "text-lg font-semibold",
            !isEditing && [
              "cursor-default",
              "text-foreground",
              "placeholder:text-foreground"
            ],
            isEditing && [
              "border-b-2 border-primary/50",
              "bg-muted/30",
              "px-2 rounded-sm",
              "cursor-text"
            ]
          )}
        />
        {isEditing && (
          <div className="absolute right-0 top-1/2 flex -translate-y-1/2 items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn(
                "h-6 w-6 hover:bg-green-50 hover:text-green-600",
                variant === 'title' && "h-8 w-8"
              )}
              onClick={handleSave}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn(
                "h-6 w-6 hover:bg-red-50 hover:text-red-600",
                variant === 'title' && "h-8 w-8"
              )}
              onClick={() => {
                setEditingLabel(label)
                setIsEditing(false)
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      {!isEditing && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            "opacity-0 group-hover:opacity-100 transition-opacity",
            "hover:bg-accent/50",
            variant === 'title' ? "h-8 w-8" : "h-6 w-6"
          )}
          onClick={() => setIsEditing(true)}
        >
          <Edit2 className={cn(
            "h-4 w-4",
            variant === 'title' && "h-5 w-5"
          )} />
        </Button>
      )}
    </div>
  )
}

export function ProfileSection() {
  const config = useResumeStore(
    state => state.resumeData?.config?.profile ?? DEFAULT_RESUME_CONFIG.profile!
  )
  const updateConfig = useResumeStore(state => state.updateConfig)
  const updateSection = useResumeStore(state => state.updateSection)
  const resumeData = useResumeStore(state => state.resumeData)

  const handleVisibilityChange = useCallback((checked: boolean) => {
    const store = useResumeStore.getState()
    console.log('Current store state:', store)
    
    updateConfig('profile', {
      ...config,
      isShow: checked
    })
    
    setTimeout(() => {
      console.log('Updated store state:', useResumeStore.getState())
    }, 0)
  }, [config, updateConfig])

  const [profile, setProfile] = useState<Profile>(() => ({
    id: crypto.randomUUID(),
    name: "",
    email: "",
    phone: "",
    location: "",
    title: "",
    summary: "",
    customFields: []
  }))

  const debouncedProfile = useDebounce(profile, 500)

  useEffect(() => {
    if (debouncedProfile) {
      useResumeStore.getState().updateSection('profile', debouncedProfile)
    }
  }, [debouncedProfile])

  const handleLabelChange = (key: string) => (newLabel: string) => {
    console.log('Before label change:', useResumeStore.getState().resumeData?.config?.profile)
    if (config?.fields) {
      const newFields = config.fields.map(field => 
        field.key === key ? { ...field, label: newLabel } : field
      )
      const newConfig = {
        ...config,
        fields: newFields
      }
      updateConfig('profile', newConfig)
      console.log('After label change:', useResumeStore.getState().resumeData?.config?.profile)
    }
  }

  const handleTitleChange = (newTitle: string) => {
    console.log('Before title change:', useResumeStore.getState().resumeData?.config?.profile)
    const newConfig = {
      ...config,
      title: newTitle
    }
    updateConfig('profile', newConfig)
    console.log('After title change:', useResumeStore.getState().resumeData?.config?.profile)
  }

  const handleChange = useCallback((field: keyof Profile) => (
    e: React.ChangeEvent<HTMLInputElement> | string
  ) => {
    setProfile(prev => ({
      ...prev,
      [field]: typeof e === 'string' ? e : e.target.value
    }))
  }, [])

  const handleCustomFieldsChange = useCallback((fields: CustomField[]) => {
    setProfile(prev => ({
      ...prev,
      customFields: fields
    }))
  }, [])

  const renderField = (fieldConfig: FieldLabel) => {
    const { key, label, icon } = fieldConfig
    const IconComponent = icon ? Icons[icon as keyof typeof Icons] as LucideIcon : null

    return (
      <div>
        <div className="group mb-2 flex items-center gap-2">
          {IconComponent && <IconComponent className="h-4 w-4 shrink-0 text-muted-foreground" />}
          <EditableLabel
            label={label}
            onSave={handleLabelChange(key)}
          />
        </div>
        {key === 'summary' ? (
          <AIRichTextEditor
            content={profile[key as keyof Profile] as string ?? ""}
            onChange={handleChange(key as keyof Profile)}
            className="min-h-[200px]"
          />
        ) : (
          <Input
            type={key === 'email' ? 'email' : 'text'}
            value={profile[key as keyof Profile] as string ?? ""}
            onChange={handleChange(key as keyof Profile)}
            placeholder={`输入${label}`}
          />
        )}
      </div>
    )
  }

  const handleLoadConfig = useCallback(async () => {
    try {
      const response = await fetch(`/api/users/current/configs/profile`)
      const data = await response.json()
      
      if (data.profile) {
        updateSection('profile', data.profile)
      }
    } catch (error) {
      console.error('加载配置失败:', error)
    }
  }, [updateSection])

  const handleSaveConfig = useCallback(async () => {
    try {
      await fetch(`/api/users/current/configs/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profile: resumeData?.profile
        }),
      })
    } catch (error) {
      console.error('保存配置失败:', error)
    }
  }, [resumeData?.profile])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <EditableLabel
          label={config?.title ?? ""}
          variant="title"
          onSave={handleTitleChange}
          className={cn(
            "transition-colors flex-1",
            !config?.isShow && "text-muted-foreground"
          )}
        />
        <div className="flex items-center gap-4">
          <Switch
            checked={config.isShow ?? true}
            onCheckedChange={handleVisibilityChange}
            className={cn(
              "data-[state=checked]:bg-green-500",
              "data-[state=unchecked]:bg-muted",
              "transition-colors"
            )}
          />
          <ConfigActions
            section="profile"
            onLoad={handleLoadConfig}
            onSave={handleSaveConfig}
          />
        </div>
      </div>

      <div className="relative bg-card p-4">
        <div className="grid gap-6">
          <div className="flex justify-center">
            <AvatarUpload
              value={profile.avatar}
              onChange={(url) => handleChange("avatar")(url)}
            />
          </div>

          <div className="grid gap-4">
            {config?.fields
              ?.filter(field => field.key !== 'summary')
              ?.reduce((groups, field, index, array) => {
                if (index % 2 === 0) {
                  groups.push(array.slice(index, index + 2))
                }
                return groups
              }, [] as FieldLabel[][])
              ?.map((group, groupIndex) => (
                <div key={`group-${groupIndex}`} className="grid gap-4 sm:grid-cols-2">
                  {group.map(field => (
                    <div key={field.key}>
                      {renderField(field)}
                    </div>
                  ))}
                </div>
              ))}

            <CustomFieldsSection
              title="自定义信息"
              fields={profile.customFields}
              onChange={handleCustomFieldsChange}
            />

            {(() => {
              const summaryField = config?.fields?.find(f => f.key === 'summary')
              return summaryField && renderField(summaryField)
            })()}
          </div>
        </div>
      </div>
    </div>
  )
} 