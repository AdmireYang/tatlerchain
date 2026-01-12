import { IsOptional, IsString, IsEnum } from 'class-validator'
import { PaginationDto } from '@/common/dto/pagination.dto'
import { PostStatus } from '@port/database'

export class QueryPostDto extends PaginationDto {
  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus

  @IsOptional()
  @IsString()
  search?: string
}
