"use client";

import { Resume } from "@/types/resume";
import { ResumeAction } from "@/types/resume";
import { cn } from "@/lib/utils";
import { ResumeCardMedia } from "./ResumeCardMedia";
import { ResumeCardContent } from "./ResumeCardContent";
import { ResumeContextMenu } from "../traditional/ResumeContextMenu";

interface ResumeCardProps {
  title: string;
  thumbnailUrl?: string;
  resume: Resume;
  onAction: (action: ResumeAction) => void;
}

export function ResumeCard({
  title,
  thumbnailUrl,
  resume,
  onAction,
}: ResumeCardProps) {
  if (resume && onAction) {
    return (
      <ResumeContextMenu resume={resume} onAction={onAction}>
        <div
          className={cn(
            "group relative bg-muted/50 hover:bg-muted",
            "aspect-[21/30] flex flex-col"
          )}
        >
          <ResumeCardMedia thumbnailUrl={thumbnailUrl} resume={resume} />
          <ResumeCardContent
            title={title}
            resume={resume}
          />
        </div>
      </ResumeContextMenu>
    );
  }
}
