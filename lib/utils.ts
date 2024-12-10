import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import OSS from 'ali-oss'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

interface UploadOptions {
  directory?: string
  onProgress?: (percent: number) => void
}

export async function uploadToOSS(
  file: File, 
  { directory = 'images', onProgress }: UploadOptions = {}
): Promise<string> {
  // 获取 STS 凭证
  const res = await fetch('/api/oss/sts')
  const credentials = await res.json()
  
  // 初始化 OSS 客户端
  const client = new OSS({
    region: process.env.NEXT_PUBLIC_OSS_REGION,
    accessKeyId: credentials.AccessKeyId,
    accessKeySecret: credentials.AccessKeySecret,
    stsToken: credentials.SecurityToken,
    bucket: process.env.NEXT_PUBLIC_OSS_BUCKET,
    secure: true,
    endpoint: process.env.NEXT_PUBLIC_OSS_ENDPOINT,
    timeout: 60000
  })

  // 生成唯一文件名
  const ext = file.name.split('.').pop()
  const filename = `${directory}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  // 上传文件
  const result = await client.multipartUpload(filename, file, {
    progress: (p) => {
      onProgress?.(Math.floor(p * 100))
    }
  })

  // 返回文件 URL
  return client.signatureUrl(result.name)
}
