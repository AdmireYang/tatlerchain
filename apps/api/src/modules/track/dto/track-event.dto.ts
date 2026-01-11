import { IsString, IsEnum, IsOptional, IsInt, IsObject, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export enum TrackEventType {
  EXPOSURE = 'EXPOSURE',   // 曝光
  LEAVE = 'LEAVE',         // 离开
  CLICK = 'CLICK',         // 点击
}

export class TrackEventDto {
  @IsString()
  code: string;  // 功能点标识码

  @IsEnum(TrackEventType)
  type: TrackEventType;  // 事件类型

  @IsString()
  pagePath: string;  // 页面路径

  @IsOptional()
  @IsString()
  pageTitle?: string;  // 页面标题

  @IsOptional()
  @IsString()
  referrer?: string;  // 来源页面

  // 设备信息
  @IsOptional()
  @IsString()
  deviceId?: string;  // 设备唯一标识

  @IsOptional()
  @IsString()
  deviceType?: string;  // mobile/tablet/desktop

  @IsOptional()
  @IsString()
  os?: string;  // 操作系统

  @IsOptional()
  @IsString()
  osVersion?: string;  // 系统版本

  @IsOptional()
  @IsString()
  browser?: string;  // 浏览器

  @IsOptional()
  @IsString()
  browserVersion?: string;  // 浏览器版本

  @IsOptional()
  @IsInt()
  screenWidth?: number;  // 屏幕宽度

  @IsOptional()
  @IsInt()
  screenHeight?: number;  // 屏幕高度

  // 用户信息
  @IsOptional()
  @IsString()
  userId?: string;  // 登录用户ID

  @IsOptional()
  @IsString()
  sessionId?: string;  // 会话ID

  // 扩展数据
  @IsOptional()
  @IsObject()
  extra?: Record<string, any>;  // 额外数据

  @IsOptional()
  @IsInt()
  duration?: number;  // 停留时长（离开事件用）
}

// 批量上报 DTO
export class BatchTrackEventDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TrackEventDto)
  events: TrackEventDto[];
}

