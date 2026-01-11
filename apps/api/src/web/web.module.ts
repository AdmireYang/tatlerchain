import { Module } from '@nestjs/common';
import { WebPostsModule } from './posts/posts.module';
import { WebAdsModule } from './ads/ads.module';
import { SharedModule } from '@/shared/shared.module';

@Module({
  imports: [SharedModule, WebPostsModule, WebAdsModule],
})
export class WebModule {}

