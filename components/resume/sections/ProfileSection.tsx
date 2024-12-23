"use client"

import { useState, useEffect } from "react"
import { Profile } from "@/types/profile"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Phone, MapPin, Globe, User, Briefcase } from "lucide-react"
import { AvatarUpload } from "@/components/shared/AvatarUpload"
import { AIRichTextEditor } from "@/components/shared/AIRichTextEditor"
import { CustomFieldsSection } from "@/components/resume/shared/CustomFieldsSection"
import { CustomField } from "@/types/shared"
import { useToast } from "@/components/ui/use-toast"
import { ConfigActions } from "@/components/resume/shared/ConfigActions"

export function ProfileSection() {
  const [profile, setProfile] = useState<Profile>({
    id: crypto.randomUUID(),
    name: "",
    email: "",
    phone: "",
    location: "",
    title: "",
    summary: "",
    customFields: []
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // 监听 profile 变化,触发外部更新
  useEffect(() => {
    // TODO: 通知父组件 profile 已更新
    console.log("Profile updated:", profile)
  }, [profile])

  const handleChange = (field: keyof Profile) => (
    e: React.ChangeEvent<HTMLInputElement> | string
  ) => {
    setProfile(prev => ({
      ...prev,
      [field]: typeof e === 'string' ? e : e.target.value
    }))
  }

  const handleCustomFieldsChange = (fields: CustomField[]) => {
    setProfile(prev => ({
      ...prev,
      customFields: fields
    }))
  }

  const handleLoadFromConfig = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/resume/profile')
      const data = await response.json()
      setProfile(data)
      toast({
        title: "加载成功",
        description: "已从简历配置中加载个人信息"
      })
    } catch (error: unknown) {
      console.error('加载配置失败:', error)
      toast({
        title: "加载失败",
        description: error instanceof Error ? error.message : "无法从简历配置中加载个人信息",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveToConfig = async () => {
    setIsLoading(true)
    try {
      await fetch('/api/resume/profile', {
        method: 'POST',
        body: JSON.stringify(profile)
      })
      toast({
        title: "保存成功",
        description: "已更新至简历配置"
      })
    } catch (error: unknown) {
      console.error('保存配置失败:', error)
      toast({
        title: "保存失败",
        description: error instanceof Error ? error.message : "无法更新至简历配置",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="relative p-4">
        <ConfigActions
          isLoading={isLoading}
          onLoad={handleLoadFromConfig}
          onSave={handleSaveToConfig}
          className="absolute right-4 top-4"
        />
        
        <div className="grid gap-6">
          {/* 头像上传 */}
          <div className="flex justify-center sm:justify-start">
            <AvatarUpload
              value={profile.avatar}
              onChange={(url) => handleChange("avatar")(url)}
            />
          </div>

          {/* 基本信息表单 */}
          <div className="grid gap-4">
            {/* 姓名和职位在大屏幕并排显示 */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>姓名</Label>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <Input
                    value={profile.name ?? ""}
                    onChange={handleChange("name")}
                    placeholder="输入姓名"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>头衔</Label>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <Input
                    value={profile.title ?? ""}
                    onChange={handleChange("title")}
                    placeholder="个人头衔"
                  />
                </div>
              </div>
            </div>

            {/* 联系方式在大屏幕并排显示 */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>邮箱</Label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <Input
                    type="email"
                    value={profile.email ?? ""}
                    onChange={handleChange("email")}
                    placeholder="输入邮箱"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>电话</Label>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <Input
                    value={profile.phone ?? ""}
                    onChange={handleChange("phone")}
                    placeholder="输入电话"
                  />
                </div>
              </div>
            </div>

            {/* 地址和网站在大屏幕并排显示 */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>地址</Label>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <Input
                    value={profile.location ?? ""}
                    onChange={handleChange("location")}
                    placeholder="输入地址"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>个人网站</Label>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <Input
                    value={profile.website ?? ""}
                    onChange={handleChange("website")}
                    placeholder="输入网址"
                  />
                </div>
              </div>
            </div>
            {/* 自定义字段部分 */}
            <CustomFieldsSection
                title="自定义信息"
                fields={profile.customFields}
                onChange={handleCustomFieldsChange}
            />

            {/* 个人简介占满宽度 */}
            <div className="grid gap-2">
              <Label>个人总结</Label>
              <AIRichTextEditor
                content={profile.summary ?? ""}
                onChange={handleChange("summary")}
                className="min-h-[200px]"
              />
            </div>

            
          </div>
        </div>
      </Card>

      
    </div>
  )
} 