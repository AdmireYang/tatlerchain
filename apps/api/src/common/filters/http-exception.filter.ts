import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { Request, Response } from 'express'

// 错误类型（用于前端区分具体原因）
export enum ErrorType {
  TOKEN_EXPIRED = 'TOKEN_EXPIRED', // Token 过期
  TOKEN_INVALID = 'TOKEN_INVALID', // Token 无效
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let message = '服务器内部错误'
    let errorType: string | undefined

    if (exception instanceof HttpException) {
      status = exception.getStatus()
      const exceptionResponse = exception.getResponse()

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse
      } else if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || (exceptionResponse as any).error || message
      }
    } else if (exception instanceof Error) {
      message = exception.message

      // 检查是否是 JWT 相关错误
      if (message.includes('jwt expired')) {
        status = HttpStatus.UNAUTHORIZED
        message = 'Token 已过期，请重新登录'
        errorType = ErrorType.TOKEN_EXPIRED
      } else if (message.includes('invalid token') || message.includes('jwt malformed')) {
        status = HttpStatus.UNAUTHORIZED
        message = 'Token 无效'
        errorType = ErrorType.TOKEN_INVALID
      }

      this.logger.error(exception.message, exception.stack)
    }

    // 检查消息内容判断错误类型
    if (!errorType && status === HttpStatus.UNAUTHORIZED) {
      if (message.includes('expired') || message.includes('过期')) {
        errorType = ErrorType.TOKEN_EXPIRED
      } else if (message.includes('invalid') || message.includes('无效')) {
        errorType = ErrorType.TOKEN_INVALID
      }
    }

    const errorResponse: any = {
      code: status, // 保持标准 HTTP 状态码
      message: Array.isArray(message) ? message[0] : message,
      timestamp: new Date().toISOString(),
      path: request.url,
    }

    // 只在需要区分时添加 errorType
    if (errorType) {
      errorResponse.errorType = errorType
    }

    response.status(status).json(errorResponse)
  }
}
