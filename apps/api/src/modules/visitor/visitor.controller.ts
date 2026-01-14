import { Controller, Post, Get, Param, Body, Ip, Headers } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { VisitorService } from './visitor.service'
import { BindUserDto } from './dto/bind-user.dto'

@ApiTags('visitor')
@Controller('visitor')
export class VisitorController {
  constructor(private readonly visitorService: VisitorService) {}

  /**
   * 生成游客 ID
   * POST /api/visitor/generate
   */
  @Post('generate')
  @ApiOperation({ summary: '生成游客 ID' })
  async generate(@Ip() ip: string, @Headers('user-agent') userAgent: string) {
    return this.visitorService.generate({ ip, userAgent })
  }

  /**
   * 获取游客信息
   * GET /api/visitor/:visitorId
   */
  @Get(':visitorId')
  @ApiOperation({ summary: '获取游客信息' })
  async getInfo(@Param('visitorId') visitorId: string) {
    return this.visitorService.getInfo(visitorId)
  }

  /**
   * 绑定用户
   * POST /api/visitor/:visitorId/bind
   */
  @Post(':visitorId/bind')
  @ApiOperation({ summary: '绑定用户到游客 ID' })
  async bindUser(@Param('visitorId') visitorId: string, @Body() bindUserDto: BindUserDto) {
    return this.visitorService.bindUser(visitorId, bindUserDto.userId)
  }
}
