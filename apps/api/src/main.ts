import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 启用 CORS
  app.enableCors();
  
  // 全局前缀
  app.setGlobalPrefix('api');
  
  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  console.log(`🚀 API 服务运行在: http://localhost:${port}`);
}

bootstrap();
