import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { PostsService } from '@/shared/services/posts.service';
import { CurrentUser } from '@/common/decorators';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { QueryPostDto } from './dto/query-post.dto';

@ApiTags('backstage/posts')
@ApiBearerAuth('JWT')
@Controller('backstage/posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @ApiOperation({ summary: '获取推文列表' })
  async findAll(@Query() query: QueryPostDto) {
    return this.postsService.findAll({
      page: query.page,
      pageSize: query.pageSize,
      status: query.status,
      search: query.search,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: '获取推文详情' })
  @ApiParam({ name: 'id', description: '推文 ID' })
  async findOne(@Param('id') id: string) {
    return this.postsService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: '创建推文' })
  async create(
    @Body() createPostDto: CreatePostDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.postsService.create({
      ...createPostDto,
      authorId: userId,
    });
  }

  @Put(':id')
  @ApiOperation({ summary: '更新推文' })
  @ApiParam({ name: 'id', description: '推文 ID' })
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Patch(':id/publish')
  @ApiOperation({ summary: '发布推文' })
  @ApiParam({ name: 'id', description: '推文 ID' })
  async publish(@Param('id') id: string) {
    return this.postsService.publish(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除推文' })
  @ApiParam({ name: 'id', description: '推文 ID' })
  async remove(@Param('id') id: string) {
    return this.postsService.delete(id);
  }
}

