import zxcvbn from 'zxcvbn'

export function validatePassword(password: string) {
  const result = zxcvbn(password)
  
  if (password.length < 8) {
    return {
      isValid: false,
      message: '密码长度至少为8位'
    }
  }

  if (result.score < 3) {
    return {
      isValid: false,
      message: '密码强度不够，请包含大小写字母、数字和特殊字符'
    }
  }

  return {
    isValid: true,
    message: ''
  }
} 