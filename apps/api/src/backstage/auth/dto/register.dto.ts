import { IsNotEmpty, IsString, MinLength, MaxLength, Matches } from 'class-validator'

export class RegisterDto {
  @IsString()
  @IsNotEmpty({ message: '账号不能为空' })
  @MinLength(3, { message: '账号长度至少3位' })
  @MaxLength(50, { message: '账号长度不能超过50位' })
  @Matches(/^[a-zA-Z0-9_-]+$/, { message: '账号只能包含字母、数字、下划线和横线' })
  email: string

  @IsString()
  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(6, { message: '密码长度至少6位' })
  password: string

  @IsString()
  @IsNotEmpty({ message: '姓名不能为空' })
  name: string
}
