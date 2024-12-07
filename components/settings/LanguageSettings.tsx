"use client"

import { useLanguage } from "@/hooks/useLanguage"

export function LanguageSettings() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setLanguage('zh')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            language === 'zh'
              ? 'bg-[#FF4D4F] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          简体中文
        </button>
        <button
          onClick={() => setLanguage('en')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            language === 'en'
              ? 'bg-[#FF4D4F] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          English
        </button>
      </div>
    </div>
  )
} 