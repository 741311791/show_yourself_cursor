import { Metadata } from "next";
import CertificateTimeline from "@/components/timeline/certificate/CertificateTimeline";

export const metadata: Metadata = {
  title: "证书 | Show Yourself",
  description: "展示你的证书成就",
};

export default function CertificatePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">证书</h1>
      <CertificateTimeline />
    </div>
  );
} 