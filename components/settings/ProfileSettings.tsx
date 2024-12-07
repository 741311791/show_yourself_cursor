"use client"

interface ProfileData {
  name: string
  email: string
  avatar: string
}

const mockProfile: ProfileData = {
  name: "张三",
  email: "zhangsan@example.com",
  avatar: "https://picsum.photos/200"
}

export function ProfileSettings() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            用户名
          </label>
          <input
            type="text"
            defaultValue={mockProfile.name}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            邮箱
          </label>
          <input
            type="email"
            defaultValue={mockProfile.email}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
      </div>
    </div>
  )
} 