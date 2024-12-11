import { LanguageTimeline } from "@/components/timeline/language"
import { MainLayout } from "@/components/layout/MainLayout"

export default function LanguagesPage() {
  return (
    <MainLayout>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">语言技能</h1>
          </div>
          <LanguageTimeline />
        </div>
      </div>
    </MainLayout>
  );
}
