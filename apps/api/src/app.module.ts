import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { DatabaseModule } from '@/database/database.module'
import { SharedModule } from '@/shared/shared.module'
import { LogModule } from '@/common/log.module'
import { LoggingInterceptor } from '@/common/interceptors/logging.interceptor'
import { TrackModule } from '@/modules/track/track.module'
import { WebModule } from '@/web/web.module'
import { BackstageModule } from '@/backstage/backstage.module'

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // 数据库模块
    DatabaseModule,

    // 日志模块
    LogModule,

    // 共享服务模块
    SharedModule,

    // 公共模块 - 埋点 (/api/track/*)
    TrackModule,

    // 前台应用模块 (/api/web/*)
    WebModule,

    // 后台应用模块 (/api/backstage/*)
    BackstageModule,
  ],
  providers: [
    // 全局日志拦截器
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
