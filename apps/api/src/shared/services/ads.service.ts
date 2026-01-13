import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '@/database/prisma.service'
import { Prisma, AdStatus } from '@port/database'
import { PaginatedResult } from '@/common/dto/pagination.dto'

@Injectable()
export class AdsService {
  constructor(private prisma: PrismaService) {}

  /**
   * 获取有效广告列表（前台使用）
   */
  async findActive() {
    const where: Prisma.AdvertisementWhereInput = {
      status: AdStatus.ACTIVE,
    }

    const ads = await this.prisma.advertisement.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
    })

    // 增加展示次数
    await this.prisma.advertisement.updateMany({
      where: {
        id: { in: ads.map((ad) => ad.id) },
      },
      data: {
        impressionCount: { increment: 1 },
      },
    })

    return ads
  }

  /**
   * 记录广告点击
   */
  async recordClick(id: string) {
    const ad = await this.prisma.advertisement.findUnique({
      where: { id },
    })

    if (!ad) {
      throw new NotFoundException('广告不存在')
    }

    return this.prisma.advertisement.update({
      where: { id },
      data: {
        clickCount: { increment: 1 },
      },
    })
  }

  /**
   * 获取所有广告列表（后台使用）
   */
  async findAll(options: {
    page?: number
    pageSize?: number
    status?: AdStatus
    category?: string
  }) {
    const { page = 1, pageSize = 10, status, category } = options
    const skip = (page - 1) * pageSize

    const where: Prisma.AdvertisementWhereInput = {
      ...(status && { status }),
      ...(category && { category }),
    }

    const [ads, total] = await Promise.all([
      this.prisma.advertisement.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.advertisement.count({ where }),
    ])

    return new PaginatedResult(ads, total, page, pageSize)
  }

  /**
   * 根据 ID 获取广告详情
   */
  async findById(id: string) {
    const ad = await this.prisma.advertisement.findUnique({
      where: { id },
    })

    if (!ad) {
      throw new NotFoundException('广告不存在')
    }

    return ad
  }

  /**
   * 创建广告
   */
  async create(data: {
    title: string
    category: string
    imageUrl: string
    linkUrl: string
    status?: AdStatus
    publishedAt?: string
  }) {
    const { publishedAt, ...rest } = data
    return this.prisma.advertisement.create({
      data: {
        ...rest,
        ...(publishedAt && { publishedAt: new Date(publishedAt) }),
      },
    })
  }

  /**
   * 更新广告
   */
  async update(
    id: string,
    data: {
      title?: string
      category?: string
      imageUrl?: string
      linkUrl?: string
      status?: AdStatus
      publishedAt?: string
    }
  ) {
    const { publishedAt, ...rest } = data
    return this.prisma.advertisement.update({
      where: { id },
      data: {
        ...rest,
        ...(publishedAt !== undefined && { publishedAt: new Date(publishedAt) }),
      },
    })
  }

  /**
   * 发布广告（设置发布时间为当前时间）
   */
  async publish(id: string) {
    return this.prisma.advertisement.update({
      where: { id },
      data: {
        status: AdStatus.ACTIVE,
        publishedAt: new Date(),
      },
    })
  }

  /**
   * 删除广告
   */
  async delete(id: string) {
    return this.prisma.advertisement.delete({
      where: { id },
    })
  }

  /**
   * 获取广告统计数据
   */
  async getStats() {
    const [total, active, totalClicks, totalImpressions] = await Promise.all([
      this.prisma.advertisement.count(),
      this.prisma.advertisement.count({
        where: { status: AdStatus.ACTIVE },
      }),
      this.prisma.advertisement.aggregate({
        _sum: { clickCount: true },
      }),
      this.prisma.advertisement.aggregate({
        _sum: { impressionCount: true },
      }),
    ])

    const clicks = totalClicks._sum.clickCount || 0
    const impressions = totalImpressions._sum.impressionCount || 0

    // 获取最近 7 天的点击率趋势
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    // 模拟趋势数据（实际应该从日志表获取）
    const trend = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]

      // 这里简化处理，实际应该从日志表查询每天的点击和展示数据
      trend.push({
        date: dateStr,
        ctr: impressions > 0 ? parseFloat(((clicks / impressions) * 100).toFixed(2)) : 0,
      })
    }

    // 获取表现最好的广告（按点击率排序）
    const topAds = await this.prisma.advertisement.findMany({
      where: {
        status: AdStatus.ACTIVE,
        impressionCount: {
          gt: 0,
        },
      },
      orderBy: {
        clickCount: 'desc',
      },
      take: 10,
      select: {
        id: true,
        title: true,
        clickCount: true,
        impressionCount: true,
        publishedAt: true,
      },
    })

    // 计算每个广告的点击率
    const topAdsWithCtr = topAds.map((ad) => ({
      ...ad,
      ctr: ad.impressionCount > 0 ? ((ad.clickCount / ad.impressionCount) * 100).toFixed(2) : '0',
    }))

    return {
      total,
      active,
      totalClicks: clicks,
      totalImpressions: impressions,
      ctr: impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : '0',
      trend,
      topAds: topAdsWithCtr,
    }
  }
}
