import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '@/shared/services/users.service'
import { LoginDto } from './dto/login.dto'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  /**
   * 用户登录
   */
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto

    // 查找用户
    const user = await this.usersService.findByEmail(email)

    if (!user) {
      throw new UnauthorizedException('邮箱或密码错误')
    }

    // 验证密码
    const isPasswordValid = await this.usersService.validatePassword(user, password)

    if (!isPasswordValid) {
      throw new UnauthorizedException('邮箱或密码错误')
    }

    // 生成 JWT Token
    const payload = { sub: user.id, email: user.email }
    const accessToken = this.jwtService.sign(payload)

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    }
  }

  /**
   * 获取当前用户信息
   */
  async getProfile(userId: string) {
    return this.usersService.findById(userId)
  }
}
