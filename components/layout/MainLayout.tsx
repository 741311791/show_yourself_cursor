"use client"

import { Sidebar } from "./Sidebar"

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 pl-64">
        {children}
      </main>
    </div>
  )
} 