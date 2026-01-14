import { Module } from '@nestjs/common'
import { VisitorController } from './visitor.controller'
import { VisitorService } from './visitor.service'
import { DatabaseModule } from '@/database/database.module'

@Module({
  imports: [DatabaseModule],
  controllers: [VisitorController],
  providers: [VisitorService],
  exports: [VisitorService],
})
export class VisitorModule {}


