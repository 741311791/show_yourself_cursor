import { MainLayout } from "@/components/layout/MainLayout"
import { LanguageSettings } from "@/components/settings/LanguageSettings"
import { ProfileSettings } from "@/components/settings/ProfileSettings"

export default function SettingsPage() {
  return (
    <MainLayout>
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">设置</h1>
          
          <div className="space-y-6">
            {/* 个人信息设置 */}
            <div id="profile" className="bg-white p-6 rounded-lg shadow scroll-mt-6">
              <h2 className="text-lg font-medium mb-4">个人信息</h2>
              <ProfileSettings />
            </div>

            {/* 语言设置 */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-medium mb-4">语言</h2>
              <LanguageSettings />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
} 