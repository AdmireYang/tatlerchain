import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator'
import { Role } from '@port/database'

export class UpdateUserDto {
  @IsOptional()
  @IsEmail({}, { message: '请输入有效的邮箱地址' })
  email?: string

  @IsOptional()
  @IsString()
  @MinLength(6, { message: '密码长度至少6位' })
  password?: string

  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsEnum(Role)
  role?: Role
}
