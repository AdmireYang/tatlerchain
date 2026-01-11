import { Module } from '@nestjs/common';
import { AdsController } from './ads.controller';
import { SharedModule } from '@/shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [AdsController],
})
export class BackstageAdsModule {}

