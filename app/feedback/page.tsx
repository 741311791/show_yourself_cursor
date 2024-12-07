import { MainLayout } from "@/components/layout/MainLayout"

export default function FeedbackPage() {
  return (
    <MainLayout>
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">反馈</h1>
          <div className="bg-white p-6 rounded-lg shadow">
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">反馈类型</label>
                <select className="w-full border rounded-lg p-2">
                  <option>功能建议</option>
                  <option>问题报告</option>
                  <option>其他</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">反馈内容</label>
                <textarea 
                  className="w-full border rounded-lg p-2 h-32" 
                  placeholder="请详细描述您的反馈..."
                />
              </div>
              <button className="bg-[#FF4D4F] text-white px-4 py-2 rounded-lg">
                提交反馈
              </button>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  )
} 