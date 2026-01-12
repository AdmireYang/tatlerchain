import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '@/database/prisma.service'

export interface ApiLogData {
  method: string
  path: string
  statusCode: number
  duration: number
  userId?: string
  userEmail?: string
  ip?: string
  userAgent?: string
  requestBody?: any
  errorMessage?: string
}

/**
 * 日志服务
 * 采用异步写入，不阻塞主请求
 * 后续可扩展为消息队列方式
 */
@Injectable()
export class LogService {
  private readonly logger = new Logger(LogService.name)

  constructor(private prisma: PrismaService) {}

  /**
   * 异步创建日志（不阻塞主流程）
   */
  create(data: ApiLogData): void {
    // 异步执行，不等待结果
    this.saveLog(data).catch((error) => {
      this.logger.error('日志写入失败', error)
    })
  }

  /**
   * 实际保存日志到数据库
   * 后续可替换为消息队列
   */
  private async saveLog(data: ApiLogData): Promise<void> {
    // 过滤敏感信息
    const sanitizedData = this.sanitizeLogData(data)

    await this.prisma.apiLog.create({
      data: {
        method: sanitizedData.method,
        path: sanitizedData.path,
        statusCode: sanitizedData.statusCode,
        duration: sanitizedData.duration,
        userId: sanitizedData.userId,
        userEmail: sanitizedData.userEmail,
        ip: sanitizedData.ip,
        userAgent: sanitizedData.userAgent,
        requestBody: sanitizedData.requestBody,
        errorMessage: sanitizedData.errorMessage,
      },
    })
  }

  /**
   * 过滤敏感信息
   */
  private sanitizeLogData(data: ApiLogData): ApiLogData {
    const sensitiveFields = ['password', 'token', 'accessToken', 'refreshToken', 'secret']

    const sanitize = (obj: any): any => {
      if (!obj || typeof obj !== 'object') return obj

      const result = { ...obj }
      for (const key of Object.keys(result)) {
        if (sensitiveFields.some((field) => key.toLowerCase().includes(field))) {
          result[key] = '***'
        } else if (typeof result[key] === 'object') {
          result[key] = sanitize(result[key])
        }
      }
      return result
    }

    return {
      ...data,
      requestBody: data.requestBody ? sanitize(data.requestBody) : undefined,
    }
  }

  /**
   * 查询日志列表
   */
  async findAll(options: {
    page?: number
    pageSize?: number
    path?: string
    method?: string
    userId?: string
    startDate?: Date
    endDate?: Date
  }) {
    const { page = 1, pageSize = 20, path, method, userId, startDate, endDate } = options
    const skip = (page - 1) * pageSize

    const where: any = {}

    if (path) {
      where.path = { contains: path }
    }
    if (method) {
      where.method = method
    }
    if (userId) {
      where.userId = userId
    }
    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt.gte = startDate
      if (endDate) where.createdAt.lte = endDate
    }

    const [logs, total] = await Promise.all([
      this.prisma.apiLog.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.apiLog.count({ where }),
    ])

    return {
      data: logs,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    }
  }

  /**
   * 获取日志统计
   */
  async getStats() {
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    const [totalLogs, todayLogs, errorLogs] = await Promise.all([
      this.prisma.apiLog.count(),
      this.prisma.apiLog.count({
        where: { createdAt: { gte: todayStart } },
      }),
      this.prisma.apiLog.count({
        where: { statusCode: { gte: 400 } },
      }),
    ])

    return {
      totalLogs,
      todayLogs,
      errorLogs,
    }
  }
}
