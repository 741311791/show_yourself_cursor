import { NextResponse } from 'next/server'
import Credential, { Config } from '@alicloud/credentials'

export async function GET() {
  try {
    const config: Config = {
      type: 'ram_role_arn',
      accessKeyId: process.env.OSS_ACCESS_KEY_ID!,
      accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET!,
      roleArn: process.env.OSS_ROLE_ARN!,
      roleSessionName: 'show-yourself-session',
      policy: JSON.stringify({
        'Statement': [{
          'Action': [
            'oss:PutObject',
            'oss:GetObject',
            'oss:ListObjects',
            'oss:DeleteObject'
          ],
          'Effect': 'Allow',
          'Resource': [
            `acs:oss:*:*:${process.env.NEXT_PUBLIC_OSS_BUCKET}/*`,
            `acs:oss:*:*:${process.env.NEXT_PUBLIC_OSS_BUCKET}`
          ]
        }],
        'Version': '1'
      }),
      roleSessionExpiration: 3600,
      disableIMDSv1: false,
      oidcProviderArn: '',
      oidcTokenFilePath: '',
      toMap: () => ({})
    }

    const cred = new Credential(config)
    const credentials = await cred.getCredential()

    return NextResponse.json({
      AccessKeyId: credentials.accessKeyId,
      AccessKeySecret: credentials.accessKeySecret,
      SecurityToken: credentials.securityToken,
      Expiration: new Date(Date.now() + 3600 * 1000).toISOString()
    })
  } catch (error) {
    console.error('获取 STS Token 失败:', error)
    return NextResponse.json(
      { error: '获取上传凭证失败' },
      { status: 500 }
    )
  }
} 