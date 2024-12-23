"use client"

import { ResumeDetail } from "@/types/resume"
import { cn } from "@/lib/utils"

interface ModernTemplateProps {
  data: ResumeDetail
}

export function ModernTemplate({ data }: ModernTemplateProps) {
  const { profile, education, work, skills } = data

  return (
    <div className="p-8 h-full">
      {/* 个人信息 */}
      {profile && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
          <div className="text-muted-foreground">
            <p>{profile.title}</p>
            <p>{profile.email} · {profile.phone}</p>
            <p>{profile.location}</p>
          </div>
        </div>
      )}

      {/* 教育经历 */}
      {education && education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b">教育经历</h2>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between">
                  <h3 className="font-medium">{edu.school}</h3>
                  <span className="text-muted-foreground">
                    {edu.startDate} - {edu.endDate}
                  </span>
                </div>
                <p>{edu.degree} · {edu.major}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 工作经历 */}
      {work && work.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b">工作经历</h2>
          <div className="space-y-4">
            {work.map((job) => (
              <div key={job.id}>
                <div className="flex justify-between">
                  <h3 className="font-medium">{job.company}</h3>
                  <span className="text-muted-foreground">
                    {job.startDate} - {job.endDate}
                  </span>
                </div>
                <p className="mb-2">{job.title}</p>
                <div className="text-sm text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: job.description }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 技能特长 */}
      {skills && skills.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b">技能特长</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className={cn(
                  "px-3 py-1 rounded-full text-sm",
                  "bg-primary/10 text-primary"
                )}
              >
                {skill.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 