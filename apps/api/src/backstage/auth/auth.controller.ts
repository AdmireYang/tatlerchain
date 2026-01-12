import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { Public, CurrentUser } from '@/common/decorators'
import { JwtAuthGuard } from '@/common/guards'

@Controller('backstage/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 用户登录
   * POST /api/backstage/auth/login
   */
  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto)
  }

  /**
   * 获取当前用户信息
   * GET /api/backstage/auth/me
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@CurrentUser('id') userId: string) {
    return this.authService.getProfile(userId)
  }

  /**
   * 登出（前端清除 token 即可，这里可以做一些额外处理）
   * POST /api/backstage/auth/logout
   */
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout() {
    return { message: '登出成功' }
  }
}
