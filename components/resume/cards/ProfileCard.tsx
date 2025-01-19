"use client"

import { ProfileSection } from "@/types/section"
import { AvatarUpload } from "@/components/shared/AvatarUpload"
import { AIRichTextEditor } from "@/components/shared/AIRichTextEditor"
import { CustomFieldsSection } from "@/components/resume/shared/CustomFieldsSection"
import { Input } from "@/components/ui/input"
import { User, Briefcase, Mail, Phone, MapPin, Globe, Calendar, GraduationCap, Building, Users } from "lucide-react"

interface ProfileCardProps {
  section: ProfileSection
  onUpdate: (updates: Partial<ProfileSection>) => void
}

interface LabelInputProps {
  label: string
  value: string
  icon: React.ReactNode
  onChange: (value: string) => void
  type?: string
  placeholder?: string
}

function LabelInput({ label, value, icon, onChange, type = "text", placeholder }: LabelInputProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="text-gray-400">{icon}</div>
        <label className="text-sm font-medium text-gray-700">{label}</label>
      </div>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        placeholder={placeholder}
      />
    </div>
  )
}

interface SectionTitleProps {
  children: React.ReactNode
}

function SectionTitle({ children }: SectionTitleProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-1 h-6 bg-[#FF7875] rounded-full" />
      <h3 className="text-base font-semibold text-gray-800">{children}</h3>
    </div>
  )
}

export function ProfileCard({ section, onUpdate }: ProfileCardProps) {
  return (
    <div className="space-y-8">
      {/* 头像上传 */}
      <div className="flex justify-center">
        <AvatarUpload
          value={section.avatar}
          onChange={(url) => onUpdate({ avatar: url })}
        />
      </div>

      {/* 个人信息 */}
      <div className="space-y-4">
        <SectionTitle>个人信息</SectionTitle>
        <div className="grid grid-cols-2 gap-4">
          <LabelInput
            label={section.labelConfig.find(label => label.key === 'name')?.label ?? '姓名'}
            value={section.name}
            icon={<User className="h-4 w-4" />}
            onChange={(value) => onUpdate({ name: value })}
            placeholder="请输入姓名"
          />
          <LabelInput
            label={section.labelConfig.find(label => label.key === 'title')?.label ?? '职位'}
            value={section.title}
            icon={<Briefcase className="h-4 w-4" />}
            onChange={(value) => onUpdate({ title: value })}
            placeholder="请输入职位"
          />
          <LabelInput
            label={section.labelConfig.find(label => label.key === 'email')?.label ?? '邮箱'}
            value={section.email}
            icon={<Mail className="h-4 w-4" />}
            onChange={(value) => onUpdate({ email: value })}
            type="email"
            placeholder="请输入邮箱"
          />
          <LabelInput
            label={section.labelConfig.find(label => label.key === 'phone')?.label ?? '电话'}
            value={section.phone}
            icon={<Phone className="h-4 w-4" />}
            onChange={(value) => onUpdate({ phone: value })}
            type="tel"
            placeholder="请输入电话"
          />
          <LabelInput
            label={section.labelConfig.find(label => label.key === 'location')?.label ?? '所在地'}
            value={section.location}
            icon={<MapPin className="h-4 w-4" />}
            onChange={(value) => onUpdate({ location: value })}
            placeholder="请输入所在地"
          />
          <LabelInput
            label={section.labelConfig.find(label => label.key === 'website')?.label ?? '个人网站'}
            value={section.website ?? ''}
            icon={<Globe className="h-4 w-4" />}
            onChange={(value) => onUpdate({ website: value })}
            type="url"
            placeholder="请输入个人网站"
          />
          <LabelInput
            label={section.labelConfig.find(label => label.key === 'birthday')?.label ?? '生日'}
            value={section.birthday ?? ''}
            icon={<Calendar className="h-4 w-4" />}
            onChange={(value) => onUpdate({ birthday: value })}
            type="date"
          />
        </div>
      </div>

      {/* 自定义字段 */}
      <div className="space-y-4">
        <SectionTitle>自定义字段</SectionTitle>
        <CustomFieldsSection
          fields={section.customFields}
          onChange={(fields) => onUpdate({ customFields: fields })}
        />
      </div>

      {/* 个人总结 */}
      <div className="space-y-4">
        <SectionTitle>个人总结</SectionTitle>
        <AIRichTextEditor
          content={section.summary ?? ""}
          onChange={(content) => onUpdate({ summary: content })}
          className="min-h-[200px]"
        />
      </div>
    </div>
  )
} 