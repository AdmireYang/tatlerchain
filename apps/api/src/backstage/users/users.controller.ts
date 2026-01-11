import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { UsersService } from '@/shared/services/users.service';
import { Roles } from '@/common/decorators';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';

@Controller('backstage/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * 获取用户列表
   * GET /api/backstage/users
   */
  @Get()
  @Roles('ADMIN')
  async findAll(@Query() query: QueryUserDto) {
    return this.usersService.findAll({
      page: query.page,
      pageSize: query.pageSize,
      role: query.role,
    });
  }

  /**
   * 获取用户详情
   * GET /api/backstage/users/:id
   */
  @Get(':id')
  @Roles('ADMIN')
  async findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  /**
   * 创建用户
   * POST /api/backstage/users
   */
  @Post()
  @Roles('ADMIN')
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /**
   * 更新用户
   * PUT /api/backstage/users/:id
   */
  @Put(':id')
  @Roles('ADMIN')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * 删除用户
   * DELETE /api/backstage/users/:id
   */
  @Delete(':id')
  @Roles('ADMIN')
  async remove(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}

