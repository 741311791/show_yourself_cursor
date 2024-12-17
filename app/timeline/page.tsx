"use client"

import { motion } from "framer-motion"
import { 
  User, GraduationCap, Briefcase, Folder, 
  BookMarked, Heart, Languages, Award, Medal,
  BookOpen, Globe, Plus
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { MainLayout } from "@/components/layout/MainLayout"

interface ConfigCard {
  icon: typeof User
  title: string
  description: string
  href: string
  color: string
}

const configCards: ConfigCard[] = [
  {
    icon: User,
    title: "个人信息",
    description: "添加你的基本信息，如姓名、联系方式等",
    href: "/timeline/profile",
    color: "from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30"
  },
  {
    icon: GraduationCap,
    title: "教育经历",
    description: "记录你的学习历程和教育背景",
    href: "/timeline/education",
    color: "from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30"
  },
  {
    icon: Briefcase,
    title: "工作经历",
    description: "展示你的职业发展和工作经验",
    href: "/timeline/work",
    color: "from-orange-500/20 to-red-500/20 hover:from-orange-500/30 hover:to-red-500/30"
  },
  {
    icon: Folder,
    title: "项目经历",
    description: "展示你参与过的重要项目",
    href: "/timeline/project",
    color: "from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30"
  },
  {
    icon: BookMarked,
    title: "科研经历",
    description: "记录你的研究成果和学术贡献",
    href: "/timeline/research",
    color: "from-yellow-500/20 to-amber-500/20 hover:from-yellow-500/30 hover:to-amber-500/30"
  },
  {
    icon: Heart,
    title: "兴趣爱好",
    description: "展示你的个性和生活态度",
    href: "/timeline/hobby",
    color: "from-rose-500/20 to-pink-500/20 hover:from-rose-500/30 hover:to-pink-500/30"
  },
  {
    icon: Languages,
    title: "语言能力",
    description: "展示你的语言掌握程度",
    href: "/timeline/languages",
    color: "from-sky-500/20 to-blue-500/20 hover:from-sky-500/30 hover:to-blue-500/30"
  },
  {
    icon: Award,
    title: "技能特长",
    description: "展示你的专业技能和特长",
    href: "/timeline/skills",
    color: "from-violet-500/20 to-purple-500/20 hover:from-violet-500/30 hover:to-purple-500/30"
  },
  {
    icon: Medal,
    title: "获奖经历",
    description: "展示你获得的荣誉和认可",
    href: "/timeline/awards",
    color: "from-teal-500/20 to-emerald-500/20 hover:from-teal-500/30 hover:to-emerald-500/30"
  },
  {
    icon: BookOpen,
    title: "证书资质",
    description: "展示你的专业资格认证",
    href: "/timeline/certificates",
    color: "from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30"
  },
  {
    icon: Globe,
    title: "出版物",
    description: "展示你的文章和出版作品",
    href: "/timeline/publications",
    color: "from-indigo-500/20 to-blue-500/20 hover:from-indigo-500/30 hover:to-blue-500/30"
  },
  {
    icon: Plus,
    title: "自定义模块",
    description: "添加自定义的简历内容模块",
    href: "/timeline/custom",
    color: "from-gray-500/20 to-slate-500/20 hover:from-gray-500/30 hover:to-slate-500/30"
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

export default function TimelinePage() {
  return (
    <MainLayout>
      <div className="container max-w-6xl py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">简历配置</h1>
          <p className="text-muted-foreground mt-2">
            从下面的模块开始，逐步完善你的简历信息
          </p>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {configCards.map((card) => (
            <motion.div key={card.href} variants={item}>
              <Link href={card.href}>
                <div className={cn(
                  "group p-6 rounded-xl bg-gradient-to-br shadow-sm",
                  "border border-border/50",
                  "transition-all duration-300",
                  card.color
                )}>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="p-2 rounded-lg bg-background/80 group-hover:bg-background transition-colors">
                      <card.icon className="w-5 h-5 text-foreground/80" />
                    </div>
                    <h2 className="text-lg font-semibold">{card.title}</h2>
                  </div>
                  <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors">
                    {card.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </MainLayout>
  )
} 