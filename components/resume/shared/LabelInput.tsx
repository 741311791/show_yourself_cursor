"use client"

import { Input } from "@/components/ui/input"

interface LabelInputProps {
  label: string
  value: string
  icon: React.ReactNode
  onChange: (value: string) => void
  type?: string
  placeholder?: string
}

export function LabelInput({ label, value, icon, onChange, type = "text", placeholder }: LabelInputProps) {
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