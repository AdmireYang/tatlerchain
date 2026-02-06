import * as crypto from 'crypto'

// AES 加密配置
const ALGORITHM = 'aes-256-cbc'
const IV_LENGTH = 16

/**
 * 获取加密密钥（从环境变量读取，如果没有则使用默认值）
 * 生产环境务必设置 CRYPTO_SECRET_KEY 环境变量
 */
function getSecretKey(): Buffer {
  const key = process.env.CRYPTO_SECRET_KEY || 'tatlerchain-default-secret-key!'
  // 确保密钥长度为 32 字节
  return crypto.scryptSync(key, 'salt', 32)
}

/**
 * AES 加密
 * @param text 明文
 * @returns 加密后的字符串（iv:encrypted 格式）
 */
export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(ALGORITHM, getSecretKey(), iv)
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return `${iv.toString('hex')}:${encrypted}`
}

/**
 * AES 解密
 * @param encryptedText 加密后的字符串
 * @returns 解密后的明文
 */
export function decrypt(encryptedText: string): string {
  try {
    const [ivHex, encrypted] = encryptedText.split(':')
    const iv = Buffer.from(ivHex, 'hex')
    const decipher = crypto.createDecipheriv(ALGORITHM, getSecretKey(), iv)
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
  } catch {
    return ''
  }
}


