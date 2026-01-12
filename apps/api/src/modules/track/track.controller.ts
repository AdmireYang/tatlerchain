import { Controller, Post, Get, Body, Query, Req } from '@nestjs/common'
import { Request } from 'express'
import { TrackService } from './track.service'
import { TrackEventDto, BatchTrackEventDto } from './dto/track-event.dto'

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  /**
   * 单个埋点上报
   * POST /api/track
   */
  @Post()
  track(@Body() dto: TrackEventDto, @Req() req: Request) {
    const ip = this.getClientIp(req)
    this.trackService.track(dto, ip)
    return { success: true }
  }

  /**
   * 批量埋点上报
   * POST /api/track/batch
   */
  @Post('batch')
  batchTrack(@Body() dto: BatchTrackEventDto, @Req() req: Request) {
    const ip = this.getClientIp(req)
    this.trackService.batchTrack(dto.events, ip)
    return { success: true, count: dto.events.length }
  }

  /**
   * 获取埋点统计
   * GET /api/track/stats
   */
  @Get('stats')
  async getStats(
    @Query('code') code?: string,
    @Query('type') type?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    return this.trackService.getStats({
      code,
      type,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    })
  }

  /**
   * 获取埋点列表
   * GET /api/track
   */
  @Get()
  async findAll(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('code') code?: string,
    @Query('type') type?: string,
    @Query('pagePath') pagePath?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    return this.trackService.findAll({
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 20,
      code,
      type,
      pagePath,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    })
  }

  private getClientIp(request: Request): string {
    const forwarded = request.headers['x-forwarded-for']
    if (forwarded) {
      return (typeof forwarded === 'string' ? forwarded : forwarded[0]).split(',')[0]
    }
    return request.ip || request.socket.remoteAddress || ''
  }
}
