/**
 * 全局环境变量配置
 * 根据 NODE_ENV 自动加载对应的 .env 文件
 * - 开发环境：.env.development
 * - 生产环境：.env.production 或 .env
 */
import { config as dotenvConfig } from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// 根据环境加载对应的 .env 文件
function loadEnv() {
  const nodeEnv = process.env.NODE_ENV || 'development'
  const envFile = nodeEnv === 'production' ? '.env' : `.env.${nodeEnv}`

  // 可能的路径（按优先级）
  const possiblePaths = [
    resolve(process.cwd(), envFile),
    resolve(process.cwd(), '.env'), // 回退到 .env
    resolve(process.cwd(), '../../', envFile),
    resolve(process.cwd(), '../../.env'),
    resolve(__dirname, '../../', envFile),
    resolve(__dirname, '../../.env'),
  ]

  for (const envPath of possiblePaths) {
    const result = dotenvConfig({ path: envPath })
    if (!result.error) {
      console.log(`✅ 已加载环境配置: ${envPath}`)
      break
    }
  }
}

// 立即加载
loadEnv()

// 服务端口
export const ports = {
  api: Number(process.env.API_PORT) || 3001,
  web: Number(process.env.WEB_PORT) || 3003,
  admin: Number(process.env.ADMIN_PORT) || 5173,
}

// API 配置
export const apiConfig = {
  baseUrl: process.env.API_BASE_URL || 'http://localhost:3001',
  get apiUrl() {
    return `${this.baseUrl}/api`
  },
}

// 数据库配置
export const databaseConfig = {
  url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/tatlerchain?schema=public',
}

// JWT 配置
export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
}

// 文件上传配置
export const uploadConfig = {
  dir: process.env.UPLOAD_DIR || './uploads',
  maxSize: Number(process.env.MAX_FILE_SIZE) || 10485760,
}

// 导出所有配置
export const config = {
  ports,
  api: apiConfig,
  database: databaseConfig,
  jwt: jwtConfig,
  upload: uploadConfig,
}

export default config



