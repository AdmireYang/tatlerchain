import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import { join, resolve } from 'path'
import * as fs from 'fs'
import { AppModule } from '@/app.module'
import { HttpExceptionFilter } from '@/common/filters'
import { TransformInterceptor } from '@/common/interceptors'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const configService = app.get(ConfigService)

  // 启用 CORS
  app.enableCors({
    origin: true,
    credentials: true,
  })

  // 全局前缀
  app.setGlobalPrefix('api')

  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  )

  // 全局异常过滤器
  app.useGlobalFilters(new HttpExceptionFilter())

  // 全局响应拦截器
  app.useGlobalInterceptors(new TransformInterceptor())

  // 静态文件服务（上传文件）
  // 使用与 UploadService 相同的路径逻辑
  const uploadDir = configService.get<string>('UPLOAD_DIR')
  let staticAssetsPath: string

  if (uploadDir) {
    // 如果配置了环境变量，使用绝对路径
    staticAssetsPath = uploadDir.startsWith('/') ? uploadDir : resolve(process.cwd(), uploadDir)
  } else {
    // 默认使用相对于工作目录的路径（与 UploadService 保持一致）
    // 在 Docker 中 process.cwd() 是 /app，在本地开发是项目根目录
    staticAssetsPath = resolve(process.cwd(), 'uploads')
  }

  // 确保目录存在
  if (!fs.existsSync(staticAssetsPath)) {
    fs.mkdirSync(staticAssetsPath, { recursive: true })
    console.log(`✅ 创建静态文件目录: ${staticAssetsPath}`)
  }

  console.log(`📁 静态文件目录: ${staticAssetsPath}`)
  app.useStaticAssets(staticAssetsPath, {
    prefix: '/uploads/',
  })

  // Swagger API 文档配置
  const config = new DocumentBuilder()
    .setTitle('Tatlerchain API')
    .setDescription('Tatlerchain 后端 API 文档')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: '请输入 JWT Token',
      },
      'JWT'
    )
    .addTag('web/posts', '前台 - 推文')
    .addTag('web/ads', '前台 - 广告')
    .addTag('backstage/auth', '后台 - 认证')
    .addTag('backstage/posts', '后台 - 推文管理')
    .addTag('backstage/ads', '后台 - 广告管理')
    .addTag('backstage/users', '后台 - 用户管理')
    .addTag('backstage/upload', '后台 - 文件上传')
    .addTag('backstage/dashboard', '后台 - 仪表盘')
    .addTag('backstage/logs', '后台 - 日志')
    .addTag('track', '埋点统计')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
    },
  })

  const port = process.env.PORT || 3001
  await app.listen(port)

  console.log(`🚀 API 服务运行在: http://localhost:${port}`)
  console.log(`📚 API 文档: http://localhost:${port}/docs`)
  console.log(`📖 前台接口: http://localhost:${port}/api/web`)
  console.log(`🔧 后台接口: http://localhost:${port}/api/backstage`)
}

bootstrap()
