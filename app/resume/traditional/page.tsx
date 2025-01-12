"use client"

import { MainLayout } from "@/components/layout/MainLayout"
import { ResumeContainer } from "@/components/resume/traditional/ResumeContainer"
import { PageTitle } from "@/components/shared/PageTitle"

export default function TraditionalResumePage() {
  return (
    <MainLayout>
      <div className="container max-w-6xl py-6">
        <PageTitle title="我的简历" />
        <ResumeContainer />
      </div>
    </MainLayout>
  )
} 