import { IsOptional, IsEnum } from 'class-validator'
import { PaginationDto } from '@/common/dto/pagination.dto'
import { Role } from '@port/database'

export class QueryUserDto extends PaginationDto {
  @IsOptional()
  @IsEnum(Role)
  role?: Role
}
