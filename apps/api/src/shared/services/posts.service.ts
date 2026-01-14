import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '@/database/prisma.service'
import { Prisma, PostStatus } from '@port/database'
import { PaginatedResult } from '@/common/dto/pagination.dto'
import { sanitizeRichContent } from '@/common/utils/sanitize.util'

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  /**
   * 获取已发布的推文列表（前台使用）
   * 只返回列表展示必要的字段，不返回 content 等大字段
   */
  async findPublished(options: { page?: number; pageSize?: number; category?: string }) {
    const { page = 1, pageSize = 10, category } = options
    const skip = (page - 1) * pageSize

    const where: Prisma.PostWhereInput = {
      status: PostStatus.PUBLISHED,
      ...(category && { category }),
    }

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { publishedAt: 'desc' },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          category: true,
          coverImage: true,
          // 返回有效的广告
          advertisements: {
            where: {
              advertisement: {
                status: 'ACTIVE',
              },
            },
            select: {
              sortOrder: true,
              advertisement: {
                select: {
                  id: true,
                  title: true,
                  category: true,
                  imageUrl: true,
                  linkUrl: true,
                },
              },
            },
            orderBy: { sortOrder: 'asc' },
          },
        },
      }),
      this.prisma.post.count({ where }),
    ])

    return new PaginatedResult(posts, total, page, pageSize)
  }

  /**
   * 根据 slug 获取推文详情（前台使用）
   */
  async findBySlug(slug: string) {
    const post = await this.prisma.post.findUnique({
      where: { slug },
      include: {
        author: {
          select: { id: true, name: true },
        },
        // 获取有效的广告
        advertisements: {
          where: {
            advertisement: {
              status: 'ACTIVE',
            },
          },
          include: {
            advertisement: true,
          },
          orderBy: { sortOrder: 'asc' },
        },
      },
    })

    if (!post || post.status !== PostStatus.PUBLISHED) {
      throw new NotFoundException('推文不存在')
    }

    // 增加浏览次数
    await this.prisma.post.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } },
    })

    return post
  }

  /**
   * 获取所有推文列表（后台使用）
   */
  async findAll(options: {
    page?: number
    pageSize?: number
    status?: PostStatus
    search?: string
    category?: string
  }) {
    const { page = 1, pageSize = 10, status, search, category } = options
    const skip = (page - 1) * pageSize

    const where: Prisma.PostWhereInput = {
      ...(status && { status }),
      ...(category && { category }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { excerpt: { contains: search, mode: 'insensitive' } },
        ],
      }),
    }

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: { id: true, name: true },
          },
          // 后台需要展示关联的广告
          advertisements: {
            include: {
              advertisement: {
                select: {
                  id: true,
                  title: true,
                  category: true,
                  imageUrl: true,
                  linkUrl: true,
                  status: true,
                },
              },
            },
            orderBy: { sortOrder: 'asc' },
          },
        },
      }),
      this.prisma.post.count({ where }),
    ])

    return new PaginatedResult(posts, total, page, pageSize)
  }

  /**
   * 根据 ID 获取推文详情（后台使用）
   */
  async findById(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true },
        },
        advertisements: {
          include: {
            advertisement: true,
          },
          orderBy: { sortOrder: 'asc' },
        },
      },
    })

    if (!post) {
      throw new NotFoundException('推文不存在')
    }

    return post
  }

  /**
   * 创建推文
   */
  async create(data: {
    title: string
    slug: string
    content: any
    excerpt: string
    category: string
    coverImage: string
    detailImage?: { url: string; authorName?: string; authorLink?: string }
    authorId: string
    advertisements?: { advertisementId: string; sortOrder?: number }[]
  }) {
    const { advertisements, content, detailImage, authorId, ...postData } = data

    // 清洗富文本内容，防止 XSS 攻击
    const sanitizedContent = sanitizeRichContent(content)

    return this.prisma.post.create({
      data: {
        ...postData,
        content: sanitizedContent,
        ...(detailImage && { detailImage: detailImage as any }),
        author: { connect: { id: authorId } },
        ...(advertisements && {
          advertisements: {
            create: advertisements.map((ad) => ({
              advertisement: { connect: { id: ad.advertisementId } },
              sortOrder: ad.sortOrder || 0,
            })),
          },
        }),
      },
      include: {
        author: {
          select: { id: true, name: true },
        },
        advertisements: {
          include: {
            advertisement: true,
          },
          orderBy: { sortOrder: 'asc' },
        },
      },
    })
  }

  /**
   * 更新推文
   */
  async update(
    id: string,
    data: {
      title?: string
      slug?: string
      content?: any
      excerpt?: string
      category?: string
      coverImage?: string
      detailImage?: { url: string; authorName?: string; authorLink?: string }
      status?: PostStatus
      advertisements?: { advertisementId: string; sortOrder?: number }[]
    }
  ) {
    const { advertisements, content, detailImage, ...postData } = data

    // 如果有更新广告，先删除旧的关联
    if (advertisements) {
      await this.prisma.postAdvertisement.deleteMany({
        where: { postId: id },
      })
    }

    // 清洗富文本内容，防止 XSS 攻击
    const sanitizedContent = content ? sanitizeRichContent(content) : undefined

    return this.prisma.post.update({
      where: { id },
      data: {
        ...postData,
        ...(sanitizedContent !== undefined && { content: sanitizedContent }),
        ...(detailImage !== undefined && { detailImage: detailImage as any }),
        ...(advertisements && {
          advertisements: {
            create: advertisements.map((ad) => ({
              advertisement: { connect: { id: ad.advertisementId } },
              sortOrder: ad.sortOrder || 0,
            })),
          },
        }),
      },
      include: {
        author: {
          select: { id: true, name: true },
        },
        advertisements: {
          include: {
            advertisement: true,
          },
          orderBy: { sortOrder: 'asc' },
        },
      },
    })
  }

  /**
   * 发布推文
   */
  async publish(id: string) {
    return this.prisma.post.update({
      where: { id },
      data: {
        status: PostStatus.PUBLISHED,
        publishedAt: new Date(),
      },
    })
  }

  /**
   * 删除推文
   */
  async delete(id: string) {
    return this.prisma.post.delete({
      where: { id },
    })
  }

  /**
   * 获取推文统计数据
   */
  async getStats() {
    const [total, published, draft, totalViews] = await Promise.all([
      this.prisma.post.count(),
      this.prisma.post.count({ where: { status: PostStatus.PUBLISHED } }),
      this.prisma.post.count({ where: { status: PostStatus.DRAFT } }),
      this.prisma.post.aggregate({
        _sum: { viewCount: true },
      }),
    ])

    // 获取最近 7 天的发布趋势
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const trendData = await this.prisma.post.groupBy({
      by: ['publishedAt'],
      where: {
        status: PostStatus.PUBLISHED,
        publishedAt: {
          gte: sevenDaysAgo,
        },
      },
      _count: true,
    })

    // 格式化趋势数据
    const trend = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]

      const count = trendData.filter((item) => {
        if (!item.publishedAt) return false
        const itemDate = new Date(item.publishedAt).toISOString().split('T')[0]
        return itemDate === dateStr
      }).length

      trend.push({
        date: dateStr,
        count,
      })
    }

    // 获取最受欢迎的推文（按浏览量排序）
    const topPosts = await this.prisma.post.findMany({
      where: {
        status: PostStatus.PUBLISHED,
      },
      orderBy: {
        viewCount: 'desc',
      },
      take: 10,
      select: {
        id: true,
        title: true,
        viewCount: true,
        publishedAt: true,
      },
    })

    return {
      total,
      published,
      draft,
      totalViews: totalViews._sum.viewCount || 0,
      trend,
      topPosts,
    }
  }

  /**
   * 获取相关文章
   * 优先返回同分类的文章，不足则按发布日期填充
   */
  async findRelated(options: { postId: string; page?: number; pageSize?: number }) {
    const { postId, page = 1, pageSize = 6 } = options
    const skip = (page - 1) * pageSize

    // 获取当前文章
    const currentPost = await this.prisma.post.findUnique({
      where: { id: postId },
    })

    if (!currentPost) {
      throw new NotFoundException('推文不存在')
    }

    // 相关文章只需要展示的基础字段
    const relatedSelect = {
      id: true,
      title: true,
      slug: true,
      category: true,
      coverImage: true,
    }

    // 1. 先查找同分类的文章
    let sameCategoryPosts: any[] = []
    if (currentPost.category) {
      sameCategoryPosts = await this.prisma.post.findMany({
        where: {
          id: { not: postId },
          status: PostStatus.PUBLISHED,
          category: currentPost.category,
        },
        orderBy: { publishedAt: 'desc' },
        select: relatedSelect,
      })
    }

    // 2. 计算需要填充的数量
    const totalNeeded = skip + pageSize
    const sameCategoryCount = sameCategoryPosts.length

    let allRelatedPosts = sameCategoryPosts

    // 3. 如果同分类文章不够，按发布日期填充
    if (sameCategoryCount < totalNeeded) {
      const excludeIds = [postId, ...sameCategoryPosts.map((p) => p.id)]
      const fillCount = totalNeeded - sameCategoryCount

      const fillPosts = await this.prisma.post.findMany({
        where: {
          id: { notIn: excludeIds },
          status: PostStatus.PUBLISHED,
        },
        orderBy: { publishedAt: 'desc' },
        take: fillCount,
        select: relatedSelect,
      })

      allRelatedPosts = [...sameCategoryPosts, ...fillPosts]
    }

    // 4. 分页处理
    const paginatedPosts = allRelatedPosts.slice(skip, skip + pageSize)
    const total = allRelatedPosts.length

    return new PaginatedResult(paginatedPosts, total, page, pageSize)
  }
}
