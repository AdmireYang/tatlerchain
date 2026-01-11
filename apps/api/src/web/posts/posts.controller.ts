import { Controller, Get, Param, Query } from '@nestjs/common';
import { PostsService } from '@/shared/services/posts.service';
import { QueryPostDto } from './dto/query-post.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';

@Controller('web/posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  /**
   * 获取已发布推文列表
   * GET /api/web/posts
   */
  @Get()
  async findAll(@Query() query: QueryPostDto) {
    return this.postsService.findPublished({
      page: query.page,
      pageSize: query.pageSize,
      category: query.category,
    });
  }

  /**
   * 获取相关文章
   * GET /api/web/posts/:id/related
   * 优先返回同分类文章，不足则按发布日期填充
   */
  @Get(':id/related')
  async findRelated(
    @Param('id') id: string,
    @Query() query: PaginationDto,
  ) {
    return this.postsService.findRelated({
      postId: id,
      page: query.page,
      pageSize: query.pageSize || 6,
    });
  }

  /**
   * 获取推文详情
   * GET /api/web/posts/:slug
   */
  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    return this.postsService.findBySlug(slug);
  }
}

