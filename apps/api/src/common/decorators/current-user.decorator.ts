import { createParamDecorator, ExecutionContext } from '@nestjs/common'

/**
 * 获取当前登录用户信息
 * @example
 * @Get('profile')
 * getProfile(@CurrentUser() user: User) {
 *   return user;
 * }
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    const user = request.user

    if (data) {
      return user?.[data]
    }

    return user
  }
)
