"use client"

import { cn } from "@/lib/utils"

interface IconProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number
}

export function Icon({ size = 24, className, ...props }: IconProps) {
  return (
    <div
      className={cn("flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-full"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    </div>
  )
} 