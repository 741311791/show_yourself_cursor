import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions)
    console.log('session', session)
    if (!session?.user?.id) {
      return null
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        status: true
      }
    })
    console.log('user', user)

    return user
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}

export async function requireAuth() {
  const user = await getCurrentUser()
  
  if (!user) {
    throw new Error('Unauthorized')
  }
  
  return user
}

export async function checkAuth() {
  const user = await getCurrentUser()
  return {
    isAuthenticated: !!user,
    user
  }
} 