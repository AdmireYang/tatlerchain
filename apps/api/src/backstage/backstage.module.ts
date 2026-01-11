import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { BackstagePostsModule } from './posts/posts.module';
import { BackstageAdsModule } from './ads/ads.module';
import { BackstageUsersModule } from './users/users.module';
import { UploadModule } from './upload/upload.module';
import { LogsModule } from './logs/logs.module';
import { JwtAuthGuard, RolesGuard } from '@/common/guards';

@Module({
  imports: [
    AuthModule,
    DashboardModule,
    BackstagePostsModule,
    BackstageAdsModule,
    BackstageUsersModule,
    UploadModule,
    LogsModule,
  ],
  providers: [
    // 后台模块全局启用 JWT 认证
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // 后台模块全局启用角色守卫
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class BackstageModule {}

