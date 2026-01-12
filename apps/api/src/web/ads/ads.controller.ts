import { Controller, Get, Post, Param } from '@nestjs/common'
import { AdsService } from '@/shared/services/ads.service'

@Controller('web/ads')
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  /**
   * 获取有效广告列表
   * GET /api/web/ads
   */
  @Get()
  async findActive() {
    return this.adsService.findActive()
  }

  /**
   * 记录广告点击
   * POST /api/web/ads/:id/click
   */
  @Post(':id/click')
  async recordClick(@Param('id') id: string) {
    return this.adsService.recordClick(id)
  }
}
