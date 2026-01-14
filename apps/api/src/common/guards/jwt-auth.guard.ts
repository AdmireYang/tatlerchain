import { ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express'
import { IS_PUBLIC_KEY } from '@/common/decorators/public.decorator'

// 公开路径前缀（无需认证）
const PUBLIC_PATH_PREFIXES = ['/api/web', '/api/track', '/api/visitor']

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super()
  }

  canActivate(context: ExecutionContext) {
    // 检查是否标记为公开接口
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) {
      return true
    }

    // 检查请求路径是否为公开路径
    const request = context.switchToHttp().getRequest<Request>()
    const path = request.path

    if (PUBLIC_PATH_PREFIXES.some((prefix) => path.startsWith(prefix))) {
      return true
    }

    return super.canActivate(context)
  }
}
