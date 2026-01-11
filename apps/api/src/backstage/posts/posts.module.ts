import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { SharedModule } from '@/shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [PostsController],
})
export class BackstagePostsModule {}

