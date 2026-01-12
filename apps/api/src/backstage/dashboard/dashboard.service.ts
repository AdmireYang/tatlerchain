import { Injectable } from '@nestjs/common'
import { PostsService } from '@/shared/services/posts.service'
import { AdsService } from '@/shared/services/ads.service'

@Injectable()
export class DashboardService {
  constructor(
    private postsService: PostsService,
    private adsService: AdsService
  ) {}

  /**
   * 获取推文统计数据
   */
  async getPostsStats() {
    return this.postsService.getStats()
  }

  /**
   * 获取广告统计数据
   */
  async getAdsStats() {
    return this.adsService.getStats()
  }

  /**
   * 获取综合统计数据
   */
  async getOverview() {
    const [postsStats, adsStats] = await Promise.all([
      this.postsService.getStats(),
      this.adsService.getStats(),
    ])

    return {
      posts: postsStats,
      ads: adsStats,
    }
  }
}
