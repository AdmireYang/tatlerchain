import {
  IsString,
  IsOptional,
  IsUrl,
  IsEnum,
  MaxLength,
  IsDateString,
} from 'class-validator';
import { AdStatus } from '@port/database';

export class UpdateAdDto {
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: '广告标题不能超过50个字符' })
  title?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsUrl({}, { message: '请输入有效的图片 URL' })
  imageUrl?: string;

  @IsOptional()
  @IsUrl({}, { message: '请输入有效的链接 URL' })
  linkUrl?: string;

  @IsOptional()
  @IsEnum(AdStatus)
  status?: AdStatus;

  @IsOptional()
  @IsDateString({}, { message: '请输入有效的发布时间' })
  publishedAt?: string;
}

