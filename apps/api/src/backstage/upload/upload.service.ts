import { Injectable, BadRequestException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as path from 'path'
import * as fs from 'fs'

@Injectable()
export class UploadService {
  private readonly uploadDir: string

  constructor(private configService: ConfigService) {
    this.uploadDir = this.configService.get<string>('UPLOAD_DIR') || './uploads'

    // 确保上传目录存在
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true })
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
    fs.writeFileSync(filepath, file.buffer)

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
