import { IsNotEmpty, IsString, MinLength, IsEmail } from 'class-validator'

export class RegisterDto {
  @IsEmail({}, { message: '请输入有效的邮箱地址' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  email: string

  @IsString()
  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(6, { message: '密码长度至少6位' })
  password: string

  @IsString()
  @IsNotEmpty({ message: '姓名不能为空' })
  name: string
}




