/**
 * 验证邮箱格式
 */
export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

/**
 * 验证密码强度（至少8位，包含字母和数字）
 */
export function validatePassword(password: string): boolean {
  const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
  return re.test(password)
}

/**
 * 验证 URL 格式
 */
export function validateUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}
