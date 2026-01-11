import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { TrackEventDto } from './dto/track-event.dto';
import { TrackEventType as PrismaTrackEventType } from '@prisma/client';

@Injectable()
export class TrackService {
  private readonly logger = new Logger(TrackService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * 记录单个埋点事件（异步，不阻塞）
   */
  track(data: TrackEventDto, ip?: string): void {
    this.saveEvent(data, ip).catch((error) => {
      this.logger.error('埋点记录失败', error);
    });
  }

  /**
   * 批量记录埋点事件（异步，不阻塞）
   */
  batchTrack(events: TrackEventDto[], ip?: string): void {
    this.saveEvents(events, ip).catch((error) => {
      this.logger.error('批量埋点记录失败', error);
    });
  }

  /**
   * 保存单个事件
   */
  private async saveEvent(data: TrackEventDto, ip?: string): Promise<void> {
    await this.prisma.trackEvent.create({
      data: {
        code: data.code,
        type: data.type as PrismaTrackEventType,
        pagePath: data.pagePath,
        pageTitle: data.pageTitle,
        referrer: data.referrer,
        deviceId: data.deviceId,
        deviceType: data.deviceType,
        os: data.os,
        osVersion: data.osVersion,
        browser: data.browser,
        browserVersion: data.browserVersion,
        screenWidth: data.screenWidth,
        screenHeight: data.screenHeight,
        userId: data.userId,
        sessionId: data.sessionId,
        ip,
        extra: data.extra,
        duration: data.duration,
      },
    });
  }

  /**
   * 批量保存事件
   */
  private async saveEvents(events: TrackEventDto[], ip?: string): Promise<void> {
    await this.prisma.trackEvent.createMany({
      data: events.map((event) => ({
        code: event.code,
        type: event.type as PrismaTrackEventType,
        pagePath: event.pagePath,
        pageTitle: event.pageTitle,
        referrer: event.referrer,
        deviceId: event.deviceId,
        deviceType: event.deviceType,
        os: event.os,
        osVersion: event.osVersion,
        browser: event.browser,
        browserVersion: event.browserVersion,
        screenWidth: event.screenWidth,
        screenHeight: event.screenHeight,
        userId: event.userId,
        sessionId: event.sessionId,
        ip,
        extra: event.extra,
        duration: event.duration,
      })),
    });
  }

  /**
   * 查询埋点统计
   */
  async getStats(options: {
    code?: string;
    type?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const { code, type, startDate, endDate } = options;

    const where: any = {};
    if (code) where.code = code;
    if (type) where.type = type;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const [total, byType, byCode] = await Promise.all([
      this.prisma.trackEvent.count({ where }),
      this.prisma.trackEvent.groupBy({
        by: ['type'],
        where,
        _count: true,
      }),
      this.prisma.trackEvent.groupBy({
        by: ['code'],
        where,
        _count: true,
        orderBy: { _count: { code: 'desc' } },
        take: 20,
      }),
    ]);

    return {
      total,
      byType: byType.map((item) => ({
        type: item.type,
        count: item._count,
      })),
      byCode: byCode.map((item) => ({
        code: item.code,
        count: item._count,
      })),
    };
  }

  /**
   * 查询埋点列表
   */
  async findAll(options: {
    page?: number;
    pageSize?: number;
    code?: string;
    type?: string;
    pagePath?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const { page = 1, pageSize = 20, code, type, pagePath, startDate, endDate } = options;
    const skip = (page - 1) * pageSize;

    const where: any = {};
    if (code) where.code = { contains: code };
    if (type) where.type = type;
    if (pagePath) where.pagePath = { contains: pagePath };
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const [events, total] = await Promise.all([
      this.prisma.trackEvent.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.trackEvent.count({ where }),
    ]);

    return {
      data: events,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }
}

