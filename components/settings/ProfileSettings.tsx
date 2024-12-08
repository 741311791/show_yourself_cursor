"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AvatarUpload } from "@/components/shared/AvatarUpload"

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
    <div className="space-y-6">
      {/* 头像上传 */}
      <div className="flex justify-center">
        <AvatarUpload
          value={mockProfile.avatar}
          onChange={(url) => console.log('Avatar updated:', url)}
        />
      </div>

      <div className="grid gap-4">
        <div className="space-y-2">
          <Label>用户名</Label>
          <Input
            type="text"
            defaultValue={mockProfile.name}
            placeholder="请输入用户名"
          />
        </div>
        
        <div className="space-y-2">
          <Label>邮箱</Label>
          <Input
            type="email"
            defaultValue={mockProfile.email}
            placeholder="请输入邮箱"
          />
        </div>
      </div>
    </div>
  )
} 