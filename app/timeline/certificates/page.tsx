import { CertificateTimeline } from "@/components/timeline/certificate"
import { MainLayout } from "@/components/layout/MainLayout"

export default function CertificatesPage() {
  return (
    <MainLayout>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">证书</h1>
          </div>
          <CertificateTimeline />
        </div>
      </div>
    </MainLayout>
  )
} 