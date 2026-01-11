import { IsString, IsOptional, IsArray, IsUrl, IsEnum, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PostStatus } from '@port/database';
import { PostAdvertisementDto, DetailImageDto } from './create-post.dto';

export class UpdatePostDto {
  @ApiPropertyOptional({ description: '标题', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: '标题不能超过50个字符' })
  title?: string;

  @ApiPropertyOptional({ description: 'URL 路径' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ description: '富文本内容' })
  @IsOptional()
  content?: any;

  @ApiPropertyOptional({ description: '摘要' })
  @IsOptional()
  @IsString()
  excerpt?: string;

  @ApiPropertyOptional({ description: '封面图片 URL' })
  @IsOptional()
  @IsUrl({}, { message: '请输入有效的封面图片 URL' })
  coverImage?: string;

  @ApiPropertyOptional({ description: '详情首图', type: DetailImageDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => DetailImageDto)
  detailImage?: DetailImageDto;

  @ApiPropertyOptional({ description: '分类' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: '状态', enum: PostStatus })
  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus;

  @ApiPropertyOptional({ description: '关联广告列表', type: [PostAdvertisementDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PostAdvertisementDto)
  advertisements?: PostAdvertisementDto[];
}

