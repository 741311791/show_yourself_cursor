"use client"

import { useState, useEffect } from 'react'

export function useBreakpoint() {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }

    // 初始检查
    checkIsDesktop()

    // 添加监听器
    window.addEventListener('resize', checkIsDesktop)

    // 清理
    return () => window.removeEventListener('resize', checkIsDesktop)
  }, [])

  return { isDesktop }
} 