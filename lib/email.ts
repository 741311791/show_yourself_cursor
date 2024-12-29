import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  }
})

console.log({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    }
  })

export async function sendResetPasswordEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`

  try {
    await transporter.sendMail({
      from: `"Show Yourself" <${process.env.SMTP_FROM}>`,
      to: email,
      subject: '重置密码',
      html: `
        <h1>重置密码</h1>
        <p>点击下面的链接重置密码：</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>此链接1小时内有效。</p>
      `,
    })
  } catch (error) {
    console.error('Send email error:', error)
    throw new Error('发送邮件失败，请稍后重试')
  }
} 