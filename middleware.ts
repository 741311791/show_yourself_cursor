import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req })
    
    // 验证 CSRF Token
    if (req.method !== 'GET') {
      const csrfToken = req.headers.get('x-csrf-token')
      if (!csrfToken || csrfToken !== process.env.CSRF_SECRET) {
        return new NextResponse('Invalid CSRF token', { status: 403 })
      }
    }

    if (!token) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
)

export const config = {
  matcher: [
    '/api/protected/:path*',
    '/dashboard/:path*',
    '/resume/:path*'
  ]
} 