import {
  IsString,
  IsNotEmpty,
  IsUrl,
  IsEnum,
  IsOptional,
  MaxLength,
  IsDateString,
} from 'class-validator';
import { AdStatus } from '@port/database';

export class CreateAdDto {
  @IsString()
  @IsNotEmpty({ message: '广告标题不能为空' })
  @MaxLength(50, { message: '广告标题不能超过50个字符' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: '分类不能为空' })
  category: string;

  @IsUrl({}, { message: '请输入有效的图片 URL' })
  @IsNotEmpty({ message: '图片 URL 不能为空' })
  imageUrl: string;

  @IsUrl({}, { message: '请输入有效的链接 URL' })
  @IsNotEmpty({ message: '链接 URL 不能为空' })
  linkUrl: string;

  @IsOptional()
  @IsEnum(AdStatus)
  status?: AdStatus;

  @IsOptional()
  @IsDateString({}, { message: '请输入有效的发布时间' })
  publishedAt?: string;
}

