"use client"

import { Navbar } from '@/components/shared/Navbar'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
          <div className="flex max-w-[980px] flex-col items-start gap-2">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
              打造专业简历 <br className="hidden sm:inline" />
              展现最好的自己
            </h1>
            <p className="max-w-[700px] text-lg text-muted-foreground">
              ShowYourself 帮助您创建专业的简历，管理个人履历，分享求职经验。
              让您在求职过程中脱颖而出。
            </p>
          </div>
          <div className="flex gap-4">
            <a
              href="/resume/traditional"
              className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              开始制作简历
            </a>
            <a
              href="/examples"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              查看示例
            </a>
          </div>
        </section>
      </main>
    </div>
  )
}
