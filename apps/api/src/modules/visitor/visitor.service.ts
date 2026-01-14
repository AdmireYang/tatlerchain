import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '@/database/prisma.service'
import { randomUUID, randomBytes } from 'crypto'

@Injectable()
export class VisitorService {
  constructor(private prisma: PrismaService) {}

  /**
   * 生成唯一的游客 ID
   * 格式: v_{timestamp36}_{uuid前8位}_{随机8位hex}
   * 示例: v_m5k2x9a_8f3b2c1d_a1b2c3d4
   */
  private generateVisitorId(): string {
    const timestamp = Date.now().toString(36) // 时间戳 base36
    const uuidPart = randomUUID().replace(/-/g, '').slice(0, 8) // UUID 前8位
    const randomPart = randomBytes(4).toString('hex') // 随机 4 字节 = 8位 hex
    return `v_${timestamp}_${uuidPart}_${randomPart}`
  }

  /**
   * 生成游客 ID（带重试机制确保唯一性）
   */
  async generate(data: { ip?: string; userAgent?: string }) {
    let visitorId: string
    let attempts = 0
    const maxAttempts = 3

    // 重试机制确保唯一性
    while (attempts < maxAttempts) {
      visitorId = this.generateVisitorId()

      try {
        const visitor = await this.prisma.visitor.create({
          data: {
            visitorId,
            ip: data.ip,
            userAgent: data.userAgent,
          },
        })

        return {
          visitorId: visitor.visitorId,
          createdAt: visitor.createdAt,
        }
      } catch (error: unknown) {
        // 唯一约束冲突，重试
        if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
          attempts++
          continue
        }
        throw error
      }
    }

    // 如果多次重试仍失败，使用完整 UUID 作为最后手段
    visitorId = `v_${randomUUID().replace(/-/g, '')}`
    const visitor = await this.prisma.visitor.create({
      data: {
        visitorId,
        ip: data.ip,
        userAgent: data.userAgent,
      },
    })

    return {
      visitorId: visitor.visitorId,
      createdAt: visitor.createdAt,
    }
  }

  /**
   * 获取游客信息
   */
  async getInfo(visitorId: string) {
    const visitor = await this.prisma.visitor.findUnique({
      where: { visitorId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!visitor) {
      throw new NotFoundException('游客 ID 不存在')
    }

    return {
      visitorId: visitor.visitorId,
      userId: visitor.userId,
      user: visitor.user,
      createdAt: visitor.createdAt,
      lastActiveAt: visitor.lastActiveAt,
    }
  }

  /**
   * 绑定用户
   */
  async bindUser(visitorId: string, userId: string) {
    const visitor = await this.prisma.visitor.findUnique({
      where: { visitorId },
    })

    if (!visitor) {
      throw new NotFoundException('游客 ID 不存在')
    }

    const updated = await this.prisma.visitor.update({
      where: { visitorId },
      data: {
        userId,
        lastActiveAt: new Date(),
      },
    })

    return {
      visitorId: updated.visitorId,
      userId: updated.userId,
      bindAt: updated.lastActiveAt,
    }
  }

  /**
   * 更新最后活跃时间
   */
  async updateLastActive(visitorId: string) {
    await this.prisma.visitor.update({
      where: { visitorId },
      data: { lastActiveAt: new Date() },
    })
  }

  /**
   * 验证游客 ID 是否有效
   */
  async isValid(visitorId: string): Promise<boolean> {
    const visitor = await this.prisma.visitor.findUnique({
      where: { visitorId },
    })
    return !!visitor
  }
}
