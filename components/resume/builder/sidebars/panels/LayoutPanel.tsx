"use client"

import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"

interface LayoutPanelProps {
  spacing?: number
  onSpacingChange?: (value: number) => void
  showDates?: boolean
  onShowDatesChange?: (checked: boolean) => void
  showIcons?: boolean
  onShowIconsChange?: (checked: boolean) => void
}

export function LayoutPanel({
  spacing = 1,
  onSpacingChange,
  showDates = true,
  onShowDatesChange,
  showIcons = true,
  onShowIconsChange
}: LayoutPanelProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label>间距</Label>
        <Slider
          min={0.8}
          max={2}
          step={0.1}
          value={[spacing]}
          onValueChange={([value]) => onSpacingChange?.(value)}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="show-dates">显示日期</Label>
          <Switch
            id="show-dates"
            checked={showDates}
            onCheckedChange={onShowDatesChange}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="show-icons">显示图标</Label>
          <Switch
            id="show-icons"
            checked={showIcons}
            onCheckedChange={onShowIconsChange}
          />
        </div>
      </div>
    </div>
  )
} 