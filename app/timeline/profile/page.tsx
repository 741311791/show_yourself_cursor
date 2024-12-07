import { MainLayout } from "@/components/layout/MainLayout"
import { ProfileForm } from "@/components/timeline/profile/ProfileForm"

export default function ProfilePage() {
  return (
    <MainLayout>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">个人资料</h1>
          </div>
          <ProfileForm />
        </div>
      </div>
    </MainLayout>
  )
} 