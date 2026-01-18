import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common'
import { AdsService } from '@/shared/services/ads.service'
import { CreateAdDto } from './dto/create-ad.dto'
import { UpdateAdDto } from './dto/update-ad.dto'
import { QueryAdDto } from './dto/query-ad.dto'

@Controller('backstage/ads')
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  /**
   * 获取广告列表
   * GET /api/backstage/ads
   */
  @Get()
  async findAll(@Query() query: QueryAdDto) {
    return this.adsService.findAll({
      page: query.page,
      pageSize: query.pageSize,
      status: query.status,
      category: query.category,
      search: query.search,
    })
  }

  /**
   * 获取广告详情
   * GET /api/backstage/ads/:id
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.adsService.findById(id)
  }

  /**
   * 创建广告
   * POST /api/backstage/ads
   */
  @Post()
  async create(@Body() createAdDto: CreateAdDto) {
    return this.adsService.create(createAdDto)
  }

  /**
   * 更新广告
   * PUT /api/backstage/ads/:id
   */
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateAdDto: UpdateAdDto) {
    return this.adsService.update(id, updateAdDto)
  }

  /**
   * 发布广告
   * PUT /api/backstage/ads/:id/publish
   */
  @Put(':id/publish')
  async publish(@Param('id') id: string) {
    return this.adsService.publish(id)
  }

  /**
   * 删除广告
   * DELETE /api/backstage/ads/:id
   */
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.adsService.delete(id)
  }
}
