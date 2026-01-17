import { Injectable, BadRequestException, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as path from 'path'
import * as fs from 'fs'

@Injectable()
export class UploadService {
  private readonly uploadDir: string
  private readonly logger = new Logger(UploadService.name)

  constructor(private configService: ConfigService) {
    // 使用绝对路径，确保路径一致性
    const uploadDir = this.configService.get<string>('UPLOAD_DIR')
    if (uploadDir) {
      // 如果配置了环境变量，使用绝对路径
      this.uploadDir = path.isAbsolute(uploadDir)
        ? uploadDir
        : path.resolve(process.cwd(), uploadDir)
    } else {
      // 默认使用相对于工作目录的路径（与 main.ts 中的静态文件路径保持一致）
      // 在 Docker 中 process.cwd() 是 /app，在本地开发是项目根目录
      this.uploadDir = path.resolve(process.cwd(), 'uploads')
    }

    // 确保上传目录存在
    try {
      if (!fs.existsSync(this.uploadDir)) {
        fs.mkdirSync(this.uploadDir, { recursive: true })
        this.logger.log(`创建上传目录: ${this.uploadDir}`)
      }
      this.logger.log(`上传目录: ${this.uploadDir}`)
    } catch (error) {
      this.logger.error(`创建上传目录失败: ${error.message}`, error.stack)
      throw new Error(`无法创建上传目录: ${this.uploadDir}`)
    }
  }

  /**
   * 上传图片
   */
  async uploadImage(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('请选择要上传的文件')
    }

    // 验证文件类型
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('只支持 JPEG、PNG、GIF、WebP 格式的图片')
    }

    // 验证文件大小（最大 5MB）
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      throw new BadRequestException('图片大小不能超过 5MB')
    }

    // 生成唯一文件名
    const ext = path.extname(file.originalname)
    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}${ext}`
    const filepath = path.join(this.uploadDir, filename)

    // 保存文件
    try {
      fs.writeFileSync(filepath, file.buffer)
      this.logger.log(`文件保存成功: ${filepath}`)

      // 验证文件是否真的保存成功
      if (!fs.existsSync(filepath)) {
        throw new Error('文件保存后验证失败')
      }
    } catch (error) {
      this.logger.error(`文件保存失败: ${error.message}`, error.stack)
      throw new BadRequestException(`文件保存失败: ${error.message}`)
    }

    // 返回文件访问 URL
    const baseUrl = this.configService.get<string>('API_BASE_URL') || 'http://localhost:3001'

    return {
      filename,
      url: `${baseUrl}/uploads/${filename}`,
      size: file.size,
      mimetype: file.mimetype,
    }
  }

  /**
   * 删除图片
   */
  async deleteImage(filename: string) {
    const filepath = path.join(this.uploadDir, filename)

    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath)
      return { message: '删除成功' }
    }

    throw new BadRequestException('文件不存在')
  }
}
