'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Alert } from '@/components/ui/alert'
import logo from '@/public/logo.svg'
import { useState, useEffect } from 'react'

interface AuthPageTemplateProps {
  children: React.ReactNode
  message?: string | null
  quote: {
    content: string
    author: string
  }
}

export function AuthPageTemplate({ children, message, quote }: AuthPageTemplateProps) {
  const images = [
    'https://picsum.photos/1200/800?random=1',
    'https://picsum.photos/1200/800?random=2',
    'https://picsum.photos/1200/800?random=3',
  ]

  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-3 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r col-span-2 overflow-hidden">
        <div className="absolute inset-0 bg-zinc-900/30 z-20" />
        
        {/* 预加载图片 */}
        <div className="hidden">
          {images.map(src => (
            <img key={src} src={src} alt="preload" />
          ))}
        </div>

        {/* 背景图片切换 */}
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={currentImageIndex}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src={images[currentImageIndex]}
              alt="Background"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Logo */}
        <div className="relative z-30 flex items-center text-lg font-medium">
          <img src={logo.src} alt="Logo" className="h-16 w-16 mr-2" />
          ShowYourself
        </div>
        
        {/* 引用语 */}
        <div className="relative z-30 mt-auto">
          <motion.blockquote 
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-lg">{quote.content}</p>
            <footer className="text-sm">{quote.author}</footer>
          </motion.blockquote>
        </div>
      </div>

      {/* 右侧内容区域 */}
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          {message && (
            <Alert className="mb-4">{message}</Alert>
          )}
          {children}
        </div>
      </div>
    </div>
  )
}