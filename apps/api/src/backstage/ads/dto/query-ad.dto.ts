import { IsOptional, IsEnum, IsString } from 'class-validator';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { AdStatus } from '@port/database';

export class QueryAdDto extends PaginationDto {
  @IsOptional()
  @IsEnum(AdStatus)
  status?: AdStatus;

  @IsOptional()
  @IsString()
  category?: string;
}

