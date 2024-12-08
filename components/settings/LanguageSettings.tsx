"use client"

import { useLanguage } from "@/hooks/useLanguage"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const languages = [
  { code: 'zh', label: '简体中文' },
  { code: 'en', label: 'English' }
] as const

export function LanguageSettings() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex flex-wrap gap-4">
      {languages.map(({ code, label }) => (
        <Button
          key={code}
          variant={language === code ? "default" : "outline"}
          onClick={() => setLanguage(code)}
          className={cn(
            "min-w-[100px]",
            language === code && "bg-primary hover:bg-primary/90"
          )}
        >
          {label}
        </Button>
      ))}
    </div>
  )
} 