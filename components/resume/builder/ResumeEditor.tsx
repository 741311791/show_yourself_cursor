"use client"

import { ResumeDetail } from "@/types/resume"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileSection } from "@/components/resume/sections/ProfileSection"
import { EducationSection } from "@/components/resume/sections/EducationSection"
// import { WorkSection } from "@/components/resume/sections/WorkSection"

interface ResumeEditorProps {
  data: ResumeDetail | null
  onUpdate: (data: Partial<ResumeDetail>) => void
}

export function ResumeEditor({ data, onUpdate }: ResumeEditorProps) {
  if (!data) return null

  return (
    <div className="p-6">
      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">个人信息</TabsTrigger>
          <TabsTrigger value="education">教育经历</TabsTrigger>
          <TabsTrigger value="work">工作经历</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileSection
            data={data.profile}
            onChange={(profile) => onUpdate({ profile })}
          />
        </TabsContent>

        <TabsContent value="education">
          <EducationSection
            data={data.education}
            onChange={(education) => onUpdate({ education })}
          />
        </TabsContent>

        {/* <TabsContent value="work">
          <WorkSection
            data={data.work}
            onChange={(work) => onUpdate({ work })}
          />
        </TabsContent> */}
      </Tabs>
    </div>
  )
} 