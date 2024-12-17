"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/MainLayout"
import { ResumeContainer } from "@/components/resume/traditional/ResumeContainer"
import { PageTitle } from "@/components/shared/PageTitle"
import { Button } from "@/components/ui/button"
import { LayoutGrid, List, Plus, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

type ViewMode = "grid" | "list"

export default function TraditionalResumePage() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid")

  return (
    <MainLayout>
      <div className="container max-w-6xl py-6">
        <PageTitle
          icon={FileText}
          title="传统简历"
          description="管理你的传统格式简历"
        >
          <div className="flex items-center gap-2">
            <div className="bg-muted rounded-lg p-1 mr-2">
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

            <Button>
              <Plus className="h-4 w-4 mr-2" />
              新建简历
            </Button>
          </div>
        </PageTitle>

        <ResumeContainer viewMode={viewMode} />
      </div>
    </MainLayout>
  )
} 