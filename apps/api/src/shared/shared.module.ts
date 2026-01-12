import { Module } from '@nestjs/common'
import { PostsService } from './services/posts.service'
import { AdsService } from './services/ads.service'
import { UsersService } from './services/users.service'

@Module({
  providers: [PostsService, AdsService, UsersService],
  exports: [PostsService, AdsService, UsersService],
})
export class SharedModule {}
