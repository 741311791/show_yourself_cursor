"use client"

import { Sidebar } from "./Sidebar"

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-60 flex-1">
        {children}
      </main>
    </div>
  )
} 