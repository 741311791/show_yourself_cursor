"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/MainLayout"
import { ResumeContainer } from "@/components/resume/traditional/ResumeContainer"
import { PageTitle } from "@/components/shared/PageTitle"
import { Button } from "@/components/ui/button"
import { LayoutGrid, List } from "lucide-react"
import { cn } from "@/lib/utils"

type ViewMode = "grid" | "list"

export default function TraditionalResumePage() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid")

  return (
    <MainLayout>
      <div className="container max-w-6xl py-6">
        <PageTitle title="我的简历">
          <div className="bg-muted rounded-lg p-1">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8",
                viewMode === "grid" && "bg-background shadow-sm"
              )}
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8",
                viewMode === "list" && "bg-background shadow-sm"
              )}
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </PageTitle>

        <ResumeContainer viewMode={viewMode} />
      </div>
    </MainLayout>
  )
} 