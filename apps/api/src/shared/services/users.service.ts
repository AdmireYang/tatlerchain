import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { PrismaService } from '@/database/prisma.service'
import { Role } from '@port/database'
import * as bcrypt from 'bcryptjs'
import { PaginatedResult } from '@/common/dto/pagination.dto'
import { encrypt, decrypt } from '@/common/utils'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * 根据邮箱查找用户
   */
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    })
  }

  /**
   * 根据 ID 查找用户
   */
  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      throw new NotFoundException('用户不存在')
    }

    return user
  }

  /**
   * 获取所有用户列表
   */
  async findAll(options: { page?: number; pageSize?: number; role?: Role }) {
    const { page = 1, pageSize = 10, role } = options
    const skip = (page - 1) * pageSize

    const where = role ? { role } : {}

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          displayPassword: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: { posts: true },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ])

    // 解密 displayPassword
    const usersWithPassword = users.map((user) => ({
      ...user,
      displayPassword: user.displayPassword ? decrypt(user.displayPassword) : null,
    }))

    return new PaginatedResult(usersWithPassword, total, page, pageSize)
  }

  /**
   * 创建用户
   */
  async create(data: { email: string; password: string; name: string; role?: Role }) {
    // 检查账号是否已存在
    const existing = await this.prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existing) {
      throw new ConflictException('账号已存在')
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(data.password, 10)
    // AES 加密原始密码用于展示
    const encryptedDisplayPassword = encrypt(data.password)

    const user = await this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        displayPassword: encryptedDisplayPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        displayPassword: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return {
      ...user,
      displayPassword: user.displayPassword ? decrypt(user.displayPassword) : null,
    }
  }

  /**
   * 更新用户
   */
  async update(
    id: string,
    data: {
      email?: string
      password?: string
      name?: string
      role?: Role
    }
  ) {
    // 如果更新账号，检查是否已存在
    if (data.email) {
      const existing = await this.prisma.user.findFirst({
        where: {
          email: data.email,
          id: { not: id },
        },
      })

      if (existing) {
        throw new ConflictException('账号已存在')
      }
    }

    // 准备更新数据
    const updateData: any = { ...data }

    // 如果更新密码，同时更新哈希密码和展示密码
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10)
      updateData.displayPassword = encrypt(data.password)
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        displayPassword: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return {
      ...user,
      displayPassword: user.displayPassword ? decrypt(user.displayPassword) : null,
    }
  }

  /**
   * 删除用户
   */
  async delete(id: string) {
    return this.prisma.user.delete({
      where: { id },
    })
  }

  /**
   * 验证用户密码
   */
  async validatePassword(user: { password: string }, password: string) {
    return bcrypt.compare(password, user.password)
  }
}
