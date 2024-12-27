import { ResumeBuilderClient } from "@/components/resume/builder/ResumeBuilderClient"

interface PageProps {
  params: {
    id: string
  }
}

// 服务端组件
export default async function Page({ params }: PageProps) {
  return <ResumeBuilderClient id={params.id} />
} 