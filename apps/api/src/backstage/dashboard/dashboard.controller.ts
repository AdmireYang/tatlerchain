import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('backstage/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  /**
   * 获取综合统计数据
   * GET /api/backstage/dashboard
   */
  @Get()
  async getOverview() {
    return this.dashboardService.getOverview();
  }

  /**
   * 获取推文统计数据
   * GET /api/backstage/dashboard/posts
   */
  @Get('posts')
  async getPostsStats() {
    return this.dashboardService.getPostsStats();
  }

  /**
   * 获取广告统计数据
   * GET /api/backstage/dashboard/ads
   */
  @Get('ads')
  async getAdsStats() {
    return this.dashboardService.getAdsStats();
  }
}

