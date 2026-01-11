import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { LogService } from '../services/log.service';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private logService: LogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const startTime = Date.now();

    // 获取用户信息
    const user = (request as any).user;

    // 基础日志数据
    const baseLogData = {
      method: request.method,
      path: request.url,
      userId: user?.id,
      userEmail: user?.email,
      ip: this.getClientIp(request),
      userAgent: request.headers['user-agent'],
      requestBody: this.shouldLogBody(request.method) ? request.body : undefined,
    };

    return next.handle().pipe(
      tap(() => {
        // 成功响应
        this.logService.create({
          ...baseLogData,
          statusCode: response.statusCode,
          duration: Date.now() - startTime,
        });
      }),
      catchError((error) => {
        // 错误响应
        this.logService.create({
          ...baseLogData,
          statusCode: error.status || 500,
          duration: Date.now() - startTime,
          errorMessage: error.message,
        });
        throw error;
      }),
    );
  }

  /**
   * 获取客户端 IP
   */
  private getClientIp(request: Request): string {
    const forwarded = request.headers['x-forwarded-for'];
    if (forwarded) {
      return (typeof forwarded === 'string' ? forwarded : forwarded[0]).split(',')[0];
    }
    return request.ip || request.socket.remoteAddress || '';
  }

  /**
   * 是否记录请求体（只记录写操作）
   */
  private shouldLogBody(method: string): boolean {
    return ['POST', 'PUT', 'PATCH'].includes(method);
  }

}

