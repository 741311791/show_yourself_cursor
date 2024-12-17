"use client"

import { motion } from "framer-motion"
import { 
  FileText, Brain, Rocket, Palette,
  Clock, Share, ArrowRight, Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"

const features = [
  {
    icon: Brain,
    title: "AI 智能助手",
    description: "智能分析和优化简历内容，提供专业建议"
  },
  {
    icon: FileText,
    title: "多种简历模板",
    description: "提供多种专业简历模板，适合不同行业和场景"
  },
  {
    icon: Rocket,
    title: "一键导出",
    description: "支持导出PDF、图片等多种格式"
  },
  {
    icon: Palette,
    title: "个性化定制",
    description: "自由调整布局、颜色、字体等样式"
  },
  {
    icon: Clock,
    title: "实时预览",
    description: "所见即所得，实时预览简历效果"
  },
  {
    icon: Share,
    title: "在线分享",
    description: "生成在线链接，方便分享和更新"
  }
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <div className="container max-w-6xl pt-24 pb-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-muted px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">AI驱动的简历创建工具</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            打造专业简历
            <br />
            <span className="text-primary">展现最好的自己</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            使用 Show Yourself 轻松创建专业的简历，让 AI 助手帮你优化内容，提升求职竞争力
          </p>

          <Button 
            size="lg" 
            className="min-w-[200px] gap-2 text-lg group"
            asChild
          >
            <Link href="/resume/traditional">
              开始免费创建
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>

        {/* Features */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              className={cn(
                "p-6 rounded-xl border bg-card/50 backdrop-blur-sm",
                "hover:shadow-lg hover:scale-[1.02] transition-all duration-300",
                "flex items-start gap-4"
              )}
            >
              <div className="p-2 rounded-lg bg-primary/10">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
