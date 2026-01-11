import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * 角色装饰器，用于标记接口需要的角色权限
 * @example
 * @Roles('ADMIN')
 * @Get('users')
 * getUsers() {}
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

