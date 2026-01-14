/**
 * 全局环境变量配置
 * 自动加载根目录的 .env 文件，所有子项目共享
 */
import { config as dotenvConfig } from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// 查找并加载根目录的 .env 文件
function loadEnv() {
  const possiblePaths = [
    resolve(process.cwd(), '.env'),
    resolve(process.cwd(), '../../.env'),
    resolve(__dirname, '../../.env'),
  ]

  for (const envPath of possiblePaths) {
    const result = dotenvConfig({ path: envPath })
    if (!result.error) {
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

