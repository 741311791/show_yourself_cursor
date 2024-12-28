import { prisma } from './prisma'

export async function getCurrentUser() {
  // TODO: 实现实际的用户认证逻辑
  // 现在先返回测试用户
  const user = await prisma.user.findUnique({
    where: { email: 'test@example.com' }
  })
  
  return user
} 