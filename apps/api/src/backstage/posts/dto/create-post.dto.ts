import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsUrl,
  IsInt,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PostAdvertisementDto {
  @ApiProperty({ description: '广告 ID' })
  @IsString()
  @IsNotEmpty()
  advertisementId: string;

  @ApiPropertyOptional({ description: '排序', default: 0 })
  @IsOptional()
  @IsInt()
  sortOrder?: number;
}

export class DetailImageDto {
  @ApiProperty({ description: '图片 URL', example: 'https://example.com/detail.jpg' })
  @IsUrl({}, { message: '请输入有效的图片 URL' })
  @IsNotEmpty({ message: '图片 URL 不能为空' })
  url: string;

  @ApiPropertyOptional({ description: '作者名称', example: '张三' })
  @IsOptional()
  @IsString()
  authorName?: string;

  @ApiPropertyOptional({ description: '作者链接', example: 'https://example.com/author' })
  @IsOptional()
  @IsUrl({}, { message: '请输入有效的作者链接' })
  authorLink?: string;
}

export class CreatePostDto {
  @ApiProperty({ description: '标题', maxLength: 50, example: '文章标题' })
  @IsString()
  @IsNotEmpty({ message: '标题不能为空' })
  @MaxLength(50, { message: '标题不能超过50个字符' })
  title: string;

  @ApiProperty({ description: 'URL 路径', example: 'my-article' })
  @IsString()
  @IsNotEmpty({ message: 'slug 不能为空' })
  slug: string;

  @ApiProperty({ description: '富文本内容' })
  @IsNotEmpty({ message: '内容不能为空' })
  content: any;

  @ApiProperty({ description: '摘要', example: '这是文章摘要...' })
  @IsString()
  @IsNotEmpty({ message: '摘要不能为空' })
  excerpt: string;

  @ApiProperty({ description: '封面图片 URL', example: 'https://example.com/cover.jpg' })
  @IsUrl({}, { message: '请输入有效的封面图片 URL' })
  @IsNotEmpty({ message: '封面图片不能为空' })
  coverImage: string;

  @ApiPropertyOptional({ description: '详情首图', type: DetailImageDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => DetailImageDto)
  detailImage?: DetailImageDto;

  @ApiProperty({ description: '分类', example: '科技' })
  @IsString()
  @IsNotEmpty({ message: '分类不能为空' })
  category: string;

  @ApiPropertyOptional({ description: '关联广告列表', type: [PostAdvertisementDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PostAdvertisementDto)
  advertisements?: PostAdvertisementDto[];
}

