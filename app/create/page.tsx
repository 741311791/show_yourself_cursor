import { MainLayout } from "@/components/layout/MainLayout"

export default function CreateResumePage() {
  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">创建简历</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 模板选择区域 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-4">选择模板</h2>
            {/* 模板列表 */}
          </div>
          
          {/* 预览区域 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-4">预览</h2>
            {/* 预览内容 */}
          </div>
        </div>
      </div>
    </MainLayout>
  )
} 