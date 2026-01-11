import { Module } from '@nestjs/common';
import { LogsController } from './logs.controller';
import { LogModule } from '@/common/log.module';

@Module({
  imports: [LogModule],
  controllers: [LogsController],
})
export class LogsModule {}

