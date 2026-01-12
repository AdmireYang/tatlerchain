import { PrismaClient, Role, PostStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 开始初始化数据库...')

  // 创建默认管理员用户
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@port.com' },
    update: {},
    create: {
      email: 'admin@port.com',
      password: adminPassword,
      name: '管理员',
      role: Role.ADMIN,
    },
  })
  console.log('✅ 创建管理员用户:', admin.email)

  // 创建默认编辑用户
  const editorPassword = await bcrypt.hash('editor123', 10)
  const editor = await prisma.user.upsert({
    where: { email: 'editor@port.com' },
    update: {},
    create: {
      email: 'editor@port.com',
      password: editorPassword,
      name: '编辑',
      role: Role.EDITOR,
    },
  })
  console.log('✅ 创建编辑用户:', editor.email)

  // 创建示例推文（HTML 富文本格式）
  const posts = [
    {
      title: 'The Art of Minimalism in Modern Fashion',
      slug: 'art-of-minimalism-fashion',
      category: 'FASHION',
      excerpt:
        '探索极简主义如何在当代时尚界重新定义优雅与品味，从 Jil Sander 到 The Row 的设计哲学。',
      coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      detailImage: {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200',
        authorName: 'Tamara Bellis',
        authorLink: 'https://unsplash.com/@tamarabellis',
      },
      content: `
<h2>什么是极简主义时尚？</h2>
<p>极简主义时尚不仅仅是关于穿着更少的衣服，而是关于选择更有意义的单品。它是一种生活方式的选择，强调质量胜于数量，永恒胜于潮流。</p>

<blockquote>
  <p>"Less is more" — Ludwig Mies van der Rohe</p>
</blockquote>

<h2>极简主义的核心原则</h2>
<ul>
  <li>选择中性色调：黑、白、灰、驼色</li>
  <li>注重面料质感与剪裁</li>
  <li>投资经典款式而非追逐潮流</li>
  <li>保持衣橱精简但多功能</li>
</ul>

<p>在这个快时尚泛滥的时代，极简主义提供了一种更可持续、更有品味的替代方案。</p>

<figure>
  <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800" alt="极简主义服装展示" />
  <figcaption>简约而不简单的设计</figcaption>
</figure>

<h2>代表性品牌</h2>
<p>从 <strong>Jil Sander</strong> 的纯粹线条到 <strong>The Row</strong> 的奢华极简，这些品牌证明了简约设计同样可以充满力量和优雅。</p>
      `,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date('2024-01-15'),
    },
    {
      title: 'Behind the Scenes: A Day with Radiohead',
      slug: 'behind-scenes-radiohead',
      category: 'MUSIC',
      excerpt: '独家探访 Radiohead 的录音室，深入了解这支传奇乐队的创作过程与音乐哲学。',
      coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800',
      detailImage: {
        url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200',
        authorName: 'Caught In Joy',
        authorLink: 'https://unsplash.com/@caughtinjoy',
      },
      content: `
<h2>进入创作的圣地</h2>
<p>位于牛津郡的这间录音室看起来并不起眼，但这里诞生了一些摇滚史上最具革新性的专辑。墙上挂满了各种实验性乐器，角落里堆满了效果器和合成器。</p>

<blockquote>
  <p>"我们从不试图重复自己。每张专辑都应该是一次全新的冒险。" — <cite>Thom Yorke</cite></p>
</blockquote>

<h2>创作过程揭秘</h2>
<p><strong>Jonny Greenwood</strong> 展示了他如何将管弦乐编曲与电子音效融合。他说："我们总是在寻找声音的边界，然后试图打破它。"</p>

<p>在整整八个小时的录音过程中，乐队反复尝试同一段旋律的不同版本，追求那种无法用语言描述的"对的感觉"。</p>

<h3>乐队成员的角色</h3>
<ul>
  <li><strong>Thom Yorke</strong> - 主唱、钢琴、吉他</li>
  <li><strong>Jonny Greenwood</strong> - 主音吉他、键盘、弦乐编曲</li>
  <li><strong>Colin Greenwood</strong> - 贝斯</li>
  <li><strong>Ed O'Brien</strong> - 吉他、和声</li>
  <li><strong>Philip Selway</strong> - 鼓</li>
</ul>

<p>这种集体创作的方式让 Radiohead 的音乐始终保持着独特的化学反应。</p>
      `,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date('2024-01-20'),
    },
    {
      title: 'Exploring Abstract Expressionism Today',
      slug: 'abstract-expressionism-today',
      category: 'ART',
      excerpt: '抽象表现主义在当代艺术中的新生命——从 Rothko 的影响到新一代艺术家的诠释。',
      coverImage: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800',
      detailImage: {
        url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1200',
        authorName: 'Steve Johnson',
        authorLink: 'https://unsplash.com/@steve_j',
      },
      content: `
<h2>色彩的力量</h2>
<p><strong>Mark Rothko</strong> 曾说，他的画作能让人落泪。七十年后的今天，新一代艺术家继续探索色彩与情感之间的神秘联系。</p>

<figure>
  <img src="https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800" alt="当代抽象画作" />
  <figcaption>色彩的对话</figcaption>
</figure>

<h2>当代诠释</h2>
<p>在纽约切尔西画廊区，我们采访了三位正在重新定义抽象表现主义的年轻艺术家。他们分享了各自对这一运动的理解与致敬。</p>

<h3>新锐艺术家</h3>
<ul>
  <li><strong>Sarah Chen</strong>：融合东方水墨与西方抽象</li>
  <li><strong>Marcus Webb</strong>：数字时代的抽象表达</li>
  <li><strong>Elena Volkov</strong>：探索物质与空间的边界</li>
</ul>

<blockquote>
  <p>"抽象艺术不是逃避现实，而是用另一种语言来描述它。" — <cite>Sarah Chen</cite></p>
</blockquote>

<p>这些艺术家证明，抽象表现主义远非一个历史概念，它仍然是当代艺术中最具生命力的表达方式之一。</p>
      `,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date('2024-02-01'),
    },
    {
      title: 'The Revival of Film Photography',
      slug: 'revival-film-photography',
      category: 'FILM',
      excerpt: '在数字时代，为什么越来越多的摄影师重新拥抱胶片？探索这场复古运动背后的故事。',
      coverImage: 'https://images.unsplash.com/photo-1495745966610-2a67f2297e5e?w=800',
      detailImage: {
        url: 'https://images.unsplash.com/photo-1495745966610-2a67f2297e5e?w=1200',
        authorName: 'Jakob Owens',
        authorLink: 'https://unsplash.com/@jakobowens1',
      },
      content: `
<h2>胶片的温度</h2>
<p>当数码相机可以即拍即看、无限拍摄时，为什么还有人选择每卷只有 <em>36 张</em>的胶片？答案或许在于那种不可复制的质感和拍摄时的仪式感。</p>

<blockquote>
  <p>"胶片让我放慢脚步，更加珍惜每一次按下快门的瞬间。" — <cite>独立摄影师 李明</cite></p>
</blockquote>

<h2>技术与艺术的平衡</h2>
<p>我们走访了北京三里屯一家专门冲洗胶片的暗房，店主老张已经在这个行业工作了三十年。他说，近几年来店里冲洗胶片的年轻人越来越多。</p>

<p>"他们不是在追求完美，而是在追求真实。胶片的颗粒感、偶然的光晕，这些「缺陷」反而成了他们眼中的美。"</p>

<h3>推荐胶片</h3>
<table>
  <thead>
    <tr>
      <th>胶片类型</th>
      <th>特点</th>
      <th>适合场景</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Kodak Portra 400</td>
      <td>柔和肤色，低对比</td>
      <td>人像摄影</td>
    </tr>
    <tr>
      <td>Fuji C200</td>
      <td>自然色彩，性价比高</td>
      <td>日常记录</td>
    </tr>
    <tr>
      <td>Ilford HP5</td>
      <td>经典黑白，宽容度高</td>
      <td>街头摄影</td>
    </tr>
  </tbody>
</table>
      `,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date('2024-02-10'),
    },
    {
      title: 'Street Style: Tokyo Edition',
      slug: 'street-style-tokyo',
      category: 'FASHION',
      excerpt: '东京原宿街头的时尚狂想曲——从涉谷系到暗黑系，解码日本年轻人的穿搭密码。',
      coverImage: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800',
      content: `
<h2>原宿：时尚实验室</h2>
<p>走在原宿的竹下通，你会发现这里是一个没有规则的时尚实验室。粉色头发配朋克皮衣，洛丽塔裙装搭配军靴，一切皆有可能。</p>

<h2>本季流行趋势</h2>
<ol>
  <li><strong>超大廓形</strong>：宽松剪裁继续主导</li>
  <li><strong>层叠搭配</strong>：多件单品的艺术组合</li>
  <li><strong>复古运动风</strong>：90年代美学回归</li>
  <li><strong>可持续时尚</strong>：古着与环保面料</li>
</ol>

<p>在这里，时尚不是关于追随，而是关于<strong>表达</strong>。每个人都是自己风格的创造者。</p>

<h3>必去地点</h3>
<ul>
  <li><strong>竹下通</strong> - 年轻潮流的发源地</li>
  <li><strong>表参道</strong> - 高端设计师品牌</li>
  <li><strong>里原宿</strong> - 小众独立店铺</li>
  <li><strong>下北沢</strong> - 古着爱好者天堂</li>
</ul>

<blockquote>
  <p>"在东京，你可以成为任何你想成为的人。没有人会评判你。" — <cite>时尚博主 Yuki</cite></p>
</blockquote>
      `,
      status: PostStatus.DRAFT,
    },
  ]

  for (const postData of posts) {
    const existingPost = await prisma.post.findUnique({
      where: { slug: postData.slug },
    })

    if (!existingPost) {
      const post = await prisma.post.create({
        data: {
          ...postData,
          authorId: admin.id,
        },
      })
      console.log(`✅ 创建推文: ${post.title}`)
    } else {
      console.log(`⏭️ 推文已存在: ${postData.title}`)
    }
  }

  console.log('🎉 数据库初始化完成！')
  console.log('\n📝 默认账号信息:')
  console.log('  管理员: admin@port.com / admin123')
  console.log('  编辑员: editor@port.com / editor123')
}

main()
  .catch((e) => {
    console.error('❌ 初始化失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
