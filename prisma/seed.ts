import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 创建测试用户
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      username: 'Test User',
      email: 'test@example.com',
      password: 'hashed_password_here', // 实际应用中需要加密
      salt: 'salt_here',
      role: 'COMMON_USER',
      status: 'ACTIVE',
    }
  })

  // 创建个人信息
  await prisma.profile.create({
    data: {
      userId: user.id,
      name: '张三',
      birthday: '1990-01-01',
      gender: '男',
      title: '高级前端工程师',
      email: 'zhangsan@example.com',
      phone: '13800138000',
      location: '北京',
      summary: '富有经验的前端工程师，专注于用户体验和性能优化'
    }
  })

  // 创建教育经历
  const education = await prisma.education.create({
    data: {
      userId: user.id,
      school: '清华大学',
      degree: '硕士',
      major: '计算机科学与技术',
      startDate: new Date('2010-09-01'),
      endDate: new Date('2014-07-01'),
      gpa: '3.8',
      location: '北京',
      courses: 'Web开发, 算法设计, 数据库系统',
      photos: ['education1.jpg', 'education2.jpg']
    }
  })

  // 创建校园经历
  await prisma.schoolExperience.create({
    data: {
      userId: user.id,
      educationId: education.id,
      name: '学生会技术部',
      organization: '清华大学学生会',
      role: '技术部长',
      startDate: new Date('2011-09-01'),
      endDate: new Date('2013-07-01'),
      description: '负责学生会网站的开发和维护',
      achievement: '成功上线新版学生会网站',
      isCore: true,
      source: 'CLUB',
      order: 1
    }
  })

  // 创建工作经历
  const work = await prisma.work.create({
    data: {
      userId: user.id,
      company: '字节跳动',
      title: '高级前端工程师',
      location: '北京',
      startDate: new Date('2014-07-01'),
      endDate: new Date('2020-06-30'),
      position: 'P6',
      photos: ['work1.jpg', 'work2.jpg'],
      summary: '负责抖音Web版的开发和优化'
    }
  })

  // 创建项目经历
  await prisma.project.create({
    data: {
      userId: user.id,
      workId: work.id,
      name: '抖音Web版重构',
      company: '字节跳动',
      role: '技术负责人',
      startDate: new Date('2019-01-01'),
      endDate: new Date('2019-12-31'),
      description: '对抖音Web版进行全面重构',
      techStack: 'React, TypeScript, Next.js',
      achievements: '性能提升50%',
      isCore: true,
      photos: ['project1.jpg', 'project2.jpg']
    }
  })

  // 创建技能
  await prisma.skill.create({
    data: {
      userId: user.id,
      name: 'React',
      category: '前端开发',
      level: 5,
      photos: ['skill1.jpg'],
      summary: '精通React及其生态系统'
    }
  })

  // 创建获奖经历
  await prisma.award.create({
    data: {
      userId: user.id,
      name: '最佳员工',
      level: '公司级',
      issuer: '字节跳动',
      acquireDate: new Date('2019-12-31'),
      photos: ['award1.jpg'],
      ranking: '1/1000',
      summary: '年度最佳员工评选第一名'
    }
  })

  // 创建研究经历
  const research = await prisma.research.create({
    data: {
      userId: user.id,
      direction: '前端性能优化',
      institution: '清华大学',
      role: '主要研究员',
      startDate: new Date('2013-01-01'),
      endDate: new Date('2013-12-31'),
      photos: ['research1.jpg'],
      summary: '研究前端性能优化方法'
    }
  })

  // 创建研究成果
  await prisma.researchResult.create({
    data: {
      researchId: research.id,
      type: 'PAPER',
      name: '前端性能优化研究',
      role: '第一作者',
      date: new Date('2013-12-31'),
      summary: '发表于计算机学报'
    }
  })

  // 创建证书
  await prisma.certificate.create({
    data: {
      userId: user.id,
      name: 'AWS认证解决方案架构师',
      issuer: 'Amazon',
      date: new Date('2020-01-01'),
      level: '专家级',
      number: 'AWS-123456',
      photos: ['cert1.jpg']
    }
  })

  // 创建语言能力
  await prisma.language.create({
    data: {
      userId: user.id,
      name: '英语',
      level: '精通',
      certificate: 'TOEFL',
      score: '110',
      acquireDate: new Date('2019-01-01'),
      photos: ['lang1.jpg']
    }
  })

  // 创建兴趣爱好
  await prisma.hobby.create({
    data: {
      userId: user.id,
      name: '摄影',
      cover: 'hobby_cover.jpg',
      photos: ['hobby1.jpg', 'hobby2.jpg'],
      description: '专注风光摄影',
      startDate: new Date('2018-01-01')
    }
  })

  console.log('Seed data created successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 