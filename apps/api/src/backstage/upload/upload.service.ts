import { Injectable, BadRequestException, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as path from 'path'
import * as fs from 'fs'
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

type UploadStorage = 'local' | 'oss'

@Injectable()
export class UploadService {
  private readonly uploadDir: string
  private readonly logger = new Logger(UploadService.name)
  private readonly s3Client: S3Client | null = null
  private readonly ossBucket: string = ''
  private readonly storageType: UploadStorage

  constructor(private configService: ConfigService) {
    // 判断存储类型
    this.storageType = this.configService.get<UploadStorage>('UPLOAD_STORAGE') || 'local'

    // 初始化 S3 客户端（用于阿里云 OSS）
    if (this.storageType === 'oss') {
      let region = this.configService.get<string>('OSS_REGION')
      const accessKeyId = this.configService.get<string>('OSS_ACCESS_KEY_ID')
      const accessKeySecret = this.configService.get<string>('OSS_ACCESS_KEY_SECRET')
      let bucket = this.configService.get<string>('OSS_BUCKET')

      if (!region || !accessKeyId || !accessKeySecret || !bucket) {
        throw new Error('OSS 配置不完整，请检查环境变量: OSS_REGION, OSS_ACCESS_KEY_ID, OSS_ACCESS_KEY_SECRET, OSS_BUCKET')
      }

      // 清理配置值中可能存在的协议前缀和多余字符
      bucket = bucket.replace(/^https?:\/\//, '').split('.')[0]
      region = region.replace(/^https?:\/\//, '').replace(/\.aliyuncs\.com.*$/, '')

      this.ossBucket = bucket

      // 阿里云 OSS 的 S3 兼容端点
      const endpoint = `https://${region}.aliyuncs.com`

      this.s3Client = new S3Client({
        region,
        endpoint,
        credentials: {
          accessKeyId,
          secretAccessKey: accessKeySecret,
        },
        forcePathStyle: false, // 阿里云 OSS 使用虚拟主机风格
      })

      this.logger.log(`OSS 客户端初始化成功, bucket: ${bucket}, region: ${region}`)
    }

    // 本地存储目录
    const uploadDir = this.configService.get<string>('UPLOAD_DIR')
    if (uploadDir) {
      this.uploadDir = path.isAbsolute(uploadDir)
        ? uploadDir
        : path.resolve(process.cwd(), uploadDir)
    } else {
      this.uploadDir = path.resolve(process.cwd(), 'uploads')
    }

    // 本地存储时确保目录存在
    if (this.storageType === 'local') {
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

    this.logger.log(`存储类型: ${this.storageType}`)
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

    // 根据存储类型上传
    if (this.storageType === 'oss') {
      return this.uploadToOSS(file, filename)
    } else {
      return this.uploadToLocal(file, filename)
    }
  }

  /**
   * 上传到阿里云 OSS（使用 S3 兼容 API）
   */
  private async uploadToOSS(file: Express.Multer.File, filename: string) {
    if (!this.s3Client) {
      throw new BadRequestException('OSS 客户端未初始化')
    }

    try {
      // OSS 存储路径，按日期分目录
      const date = new Date()
      const ossPath = `uploads/${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${filename}`

      // 上传到 OSS
      const command = new PutObjectCommand({
        Bucket: this.ossBucket,
        Key: ossPath,
        Body: file.buffer,
        ContentType: file.mimetype,
        CacheControl: 'max-age=31536000', // 缓存一年
        ACL: 'public-read', // 设置为公共读，允许通过 URL 直接访问
      })

      await this.s3Client.send(command)

      this.logger.log(`文件上传到 OSS 成功: ${ossPath}`)

      // 返回 CDN 域名或 OSS 默认域名
      let cdnDomain = this.configService.get<string>('OSS_CDN_DOMAIN')
      const region = this.configService.get<string>('OSS_REGION')
      
      // 去除 CDN 域名中可能存在的协议前缀
      if (cdnDomain) {
        cdnDomain = cdnDomain.replace(/^https?:\/\//, '')
      }
      
      const url = cdnDomain
        ? `https://${cdnDomain}/${ossPath}`
        : `https://${this.ossBucket}.${region}.aliyuncs.com/${ossPath}`

      return {
        filename,
        url,
        size: file.size,
        mimetype: file.mimetype,
        storage: 'oss',
      }
    } catch (error) {
      this.logger.error(`OSS 上传失败: ${error.message}`, error.stack)
      throw new BadRequestException(`文件上传失败: ${error.message}`)
    }
  }

  /**
   * 上传到本地
   */
  private async uploadToLocal(file: Express.Multer.File, filename: string) {
    const filepath = path.join(this.uploadDir, filename)

    try {
      fs.writeFileSync(filepath, file.buffer)
      this.logger.log(`文件保存成功: ${filepath}`)

      if (!fs.existsSync(filepath)) {
        throw new Error('文件保存后验证失败')
      }
    } catch (error) {
      this.logger.error(`文件保存失败: ${error.message}`, error.stack)
      throw new BadRequestException(`文件保存失败: ${error.message}`)
    }

    const baseUrl = this.configService.get<string>('API_BASE_URL') || 'http://localhost:3001'

    return {
      filename,
      url: `${baseUrl}/uploads/${filename}`,
      size: file.size,
      mimetype: file.mimetype,
      storage: 'local',
    }
  }

  /**
   * 删除图片
   */
  async deleteImage(filename: string) {
    if (this.storageType === 'oss') {
      return this.deleteFromOSS(filename)
    } else {
      return this.deleteFromLocal(filename)
    }
  }

  /**
   * 从 OSS 删除
   */
  private async deleteFromOSS(filename: string) {
    if (!this.s3Client) {
      throw new BadRequestException('OSS 客户端未初始化')
    }

    try {
      // 处理路径
      let ossPath = filename

      // 如果是完整 URL，提取路径部分
      if (filename.startsWith('http')) {
        const url = new URL(filename)
        ossPath = url.pathname.slice(1) // 移除开头的 /
      }

      const command = new DeleteObjectCommand({
        Bucket: this.ossBucket,
        Key: ossPath,
      })

      await this.s3Client.send(command)
      this.logger.log(`OSS 文件删除成功: ${ossPath}`)
      return { message: '删除成功' }
    } catch (error) {
      this.logger.error(`OSS 删除失败: ${error.message}`, error.stack)
      throw new BadRequestException(`文件删除失败: ${error.message}`)
    }
  }

  /**
   * 从本地删除
   */
  private async deleteFromLocal(filename: string) {
    const filepath = path.join(this.uploadDir, filename)

    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath)
      return { message: '删除成功' }
    }

    throw new BadRequestException('文件不存在')
  }
}
