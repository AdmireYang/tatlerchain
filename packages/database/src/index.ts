import { PrismaClient } from '@prisma/client';

// 创建 Prisma 客户端实例
const prisma = new PrismaClient();

export default prisma;
export * from '@prisma/client';
