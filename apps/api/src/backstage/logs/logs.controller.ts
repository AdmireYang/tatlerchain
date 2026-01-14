import { Controller, Get, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { LogService } from '@/common/services/log.service'
import { Roles } from '@/common/decorators'
import { Role } from '@port/database'
import { QueryLogDto } from './dto/query-log.dto'

@ApiTags('backstage/logs')
@ApiBearerAuth('JWT')
@Controller('backstage/logs')
export class LogsController {
  constructor(private readonly logService: LogService) {}

  /**
   * 获取日志列表
   * GET /api/backstage/logs
   */
  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: '获取日志列表（仅管理员）' })
  async findAll(@Query() query: QueryLogDto) {
    return this.logService.findAll({
      page: query.page,
      pageSize: query.pageSize,
      path: query.path,
      method: query.method,
      userId: query.userId,
      startDate: query.startDate,
      endDate: query.endDate,
    })
  }

  /**
   * 获取日志统计
   * GET /api/backstage/logs/stats
   */
  @Get('stats')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: '获取日志统计（仅管理员）' })
  async getStats() {
    return this.logService.getStats()
  }
}

