import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { AuthOptions } from 'next-auth'

export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("请输入邮箱和密码")
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user) {
          throw new Error("用户不存在")
        }

        const isValid = await compare(credentials.password, user.password)
        if (!isValid) {
          throw new Error("密码错误")
        }

        return {
          id: user.id,
          email: user.email,
          name: user.username,
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST } 