export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">登录 ShowYourself</h1>
          <p className="text-gray-600">开始创建您的专业简历</p>
        </div>
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">邮箱</label>
            <input 
              type="email" 
              className="w-full border rounded-lg p-2"
              placeholder="请输入邮箱"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">密码</label>
            <input 
              type="password" 
              className="w-full border rounded-lg p-2"
              placeholder="请输入密码"
            />
          </div>
          <button className="w-full bg-[#FF4D4F] text-white py-2 rounded-lg">
            登录
          </button>
        </form>
      </div>
    </div>
  )
} 