import { IsString, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class BindUserDto {
  @ApiProperty({ description: '用户 ID' })
  @IsString()
  @IsNotEmpty({ message: '用户 ID 不能为空' })
  userId: string
}


