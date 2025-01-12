"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Profile } from "@/types/profile"
import { Input } from "@/components/ui/input"
import * as Icons from "lucide-react"
import { AvatarUpload } from "@/components/shared/AvatarUpload"
import { AIRichTextEditor } from "@/components/shared/AIRichTextEditor"
import { CustomFieldsSection } from "@/components/resume/shared/CustomFieldsSection"
import { LucideIcon } from "lucide-react"
import { useResumeStore } from "@/store/useResumeStore"
import { Button } from "@/components/ui/button"
import { Edit2, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { ConfigActions } from "@/components/resume/shared/ConfigActions"
import { Switch } from "@/components/ui/switch"
import { CustomField } from "@/types/shared"

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
  const resumeData = useResumeStore(state => state.resumeData)
  const updateSection = useResumeStore(state => state.updateSection)

  const [profile, setProfile] = useState<Profile>(() => ({
    id: crypto.randomUUID(),
    name: resumeData?.sections?.profile?.name || "",
    email: resumeData?.sections?.profile?.email || "",
    phone: resumeData?.sections?.profile?.phone || "",
    location: resumeData?.sections?.profile?.location || "",
    title: resumeData?.sections?.profile?.title || "",
    summary: resumeData?.sections?.profile?.summary || "",
    customFields: resumeData?.sections?.profile?.customFields || [],
    sectionConfig: {
      isShow: true,
      title: "个人信息"
    },
    labelConfig: [
      { key: "name", label: "姓名", icon: "User" },
      { key: "email", label: "邮箱", icon: "Mail" },
      { key: "phone", label: "电话", icon: "Phone" },
      { key: "location", label: "地址", icon: "MapPin" },
      { key: "title", label: "职位", icon: "Briefcase" },
      { key: "summary", label: "个人简介", icon: "FileText" }
    ],
    pictureConfig: {
      isShow: true,
      url: resumeData?.sections?.profile?.pictureConfig?.url || ""
    }
  }))

  const debouncedProfile = useDebounce(profile, 500)

  useEffect(() => {
    if (debouncedProfile) {
      updateSection('profile', debouncedProfile)
    }
  }, [debouncedProfile, updateSection])

  const handleLabelChange = (key: string) => (newLabel: string) => {
    setProfile(prev => ({
      ...prev,
      labelConfig: prev.labelConfig.map(field => 
        field.key === key ? { ...field, label: newLabel } : field
      )
    }))
  }

  const handleTitleChange = (newTitle: string) => {
    setProfile(prev => ({
      ...prev,
      sectionConfig: {
        ...prev.sectionConfig,
        title: newTitle
      }
    }))
  }

  const handleVisibilityChange = useCallback((checked: boolean) => {
    setProfile(prev => ({
      ...prev,
      sectionConfig: {
        ...prev.sectionConfig,
        isShow: checked
      }
    }))
  }, [])

  const handleAvatarChange = useCallback((url: string) => {
    setProfile(prev => ({
      ...prev,
      pictureConfig: {
        ...prev.pictureConfig,
        url
      }
    }))
  }, [])

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

  const renderField = (fieldConfig: { key: string; label: string; icon?: string }) => {
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
            content={profile[key as keyof Profile] as string}
            onChange={handleChange(key as keyof Profile)}
            className="min-h-[200px]"
          />
        ) : (
          <Input
            type={key === 'email' ? 'email' : 'text'}
            value={profile[key as keyof Profile] as string}
            onChange={handleChange(key as keyof Profile)}
            placeholder={`输入${label}`}
          />
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <EditableLabel
          label={profile.sectionConfig.title}
          variant="title"
          onSave={handleTitleChange}
          className={cn(
            "transition-colors flex-1",
            !profile.sectionConfig.isShow && "text-muted-foreground"
          )}
        />
        <div className="flex items-center gap-4">
          <Switch
            checked={profile.sectionConfig.isShow}
            onCheckedChange={handleVisibilityChange}
            className={cn(
              "data-[state=checked]:bg-green-500",
              "data-[state=unchecked]:bg-muted",
              "transition-colors"
            )}
          />
          <ConfigActions section="profile" />
        </div>
      </div>

      <div className="relative bg-card p-4">
        <div className="grid gap-6">
          {profile.pictureConfig.isShow && (
            <div className="flex justify-center">
              <AvatarUpload
                value={profile.pictureConfig.url}
                onChange={handleAvatarChange}
              />
            </div>
          )}

          <div className="grid gap-4">
            {profile.labelConfig
              ?.filter(field => field.key !== 'summary')
              ?.reduce((groups, field, index, array) => {
                if (index % 2 === 0) {
                  groups.push(array.slice(index, index + 2))
                }
                return groups
              }, [] as { key: string; label: string; icon?: string }[][])
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
              const summaryField = profile.labelConfig?.find(f => f.key === 'summary')
              return summaryField && renderField(summaryField)
            })()}
          </div>
        </div>
      </div>
    </div>
  )
} 