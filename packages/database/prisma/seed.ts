import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 开始初始化数据库...');

  // 创建默认管理员用户
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@port.com' },
    update: {},
    create: {
      email: 'admin@port.com',
      password: adminPassword,
      name: '管理员',
      role: Role.ADMIN,
    },
  });
  console.log('✅ 创建管理员用户:', admin.email);

  // 创建默认编辑用户
  const editorPassword = await bcrypt.hash('editor123', 10);
  const editor = await prisma.user.upsert({
    where: { email: 'editor@port.com' },
    update: {},
    create: {
      email: 'editor@port.com',
      password: editorPassword,
      name: '编辑',
      role: Role.EDITOR,
    },
  });
  console.log('✅ 创建编辑用户:', editor.email);

  // 创建一些默认标签
  const tags = ['科技', '生活', '艺术', '设计', '摄影'];
  for (const tagName of tags) {
    const slug = tagName.toLowerCase();
    await prisma.tag.upsert({
      where: { slug },
      update: {},
      create: {
        name: tagName,
        slug,
      },
    });
  }
  console.log('✅ 创建默认标签:', tags.join(', '));

  console.log('🎉 数据库初始化完成！');
  console.log('\n📝 默认账号信息:');
  console.log('  管理员: admin@port.com / admin123');
  console.log('  编辑员: editor@port.com / editor123');
}

main()
  .catch((e) => {
    console.error('❌ 初始化失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

