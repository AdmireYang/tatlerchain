import { PrismaClient, Role, PostStatus, AdStatus } from '@prisma/client'
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

  // 创建示例广告
  const adsData = [
    {
      title: 'Luxury Watch Collection',
      category: 'FASHION',
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
      linkUrl: 'https://example.com/watches',
      status: AdStatus.ACTIVE,
      publishedAt: new Date('2024-01-01'),
    },
    {
      title: 'Premium Skincare',
      category: 'BEAUTY',
      imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400',
      linkUrl: 'https://example.com/skincare',
      status: AdStatus.ACTIVE,
      publishedAt: new Date('2024-01-05'),
    },
    {
      title: 'Designer Sunglasses',
      category: 'FASHION',
      imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400',
      linkUrl: 'https://example.com/sunglasses',
      status: AdStatus.ACTIVE,
      publishedAt: new Date('2024-01-10'),
    },
    {
      title: 'Art Gallery Exhibition',
      category: 'ART',
      imageUrl: 'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=400',
      linkUrl: 'https://example.com/exhibition',
      status: AdStatus.ACTIVE,
      publishedAt: new Date('2024-01-15'),
    },
    {
      title: 'Music Festival 2024',
      category: 'MUSIC',
      imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400',
      linkUrl: 'https://example.com/festival',
      status: AdStatus.ACTIVE,
      publishedAt: new Date('2024-01-20'),
    },
    {
      title: 'Camera Equipment Sale',
      category: 'FILM',
      imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400',
      linkUrl: 'https://example.com/camera',
      status: AdStatus.ACTIVE,
      publishedAt: new Date('2024-01-25'),
    },
  ]

  const createdAds: { id: string; category: string }[] = []
  for (const adData of adsData) {
    const existingAd = await prisma.advertisement.findFirst({
      where: { title: adData.title },
    })

    if (!existingAd) {
      const ad = await prisma.advertisement.create({
        data: adData,
      })
      createdAds.push({ id: ad.id, category: ad.category })
      console.log(`✅ 创建广告: ${ad.title}`)
    } else {
      createdAds.push({ id: existingAd.id, category: existingAd.category })
      console.log(`⏭️ 广告已存在: ${adData.title}`)
    }
  }

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
    {
      title: 'The Golden Age of Jazz: A Modern Perspective',
      slug: 'golden-age-jazz-modern',
      category: 'MUSIC',
      excerpt: '从 Coltrane 到 Kamasi Washington，爵士乐如何在当代重新焕发生机。',
      coverImage: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800',
      detailImage: {
        url: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=1200',
        authorName: 'Jens Thekkeveettil',
        authorLink: 'https://unsplash.com/@jensth',
      },
      content: `
<h2>爵士乐的复兴</h2>
<p>当人们以为爵士乐已经成为历史时，新一代音乐家正在用自己的方式重新定义这种艺术形式。<strong>Kamasi Washington</strong>、<strong>Robert Glasper</strong> 和 <strong>Thundercat</strong> 等艺术家将爵士与嘻哈、电子和灵魂乐融合。</p>

<blockquote>
  <p>"爵士乐从来不是关于过去，它一直是关于现在和未来。" — <cite>Kamasi Washington</cite></p>
</blockquote>

<h2>必听专辑</h2>
<ul>
  <li><strong>The Epic</strong> - Kamasi Washington</li>
  <li><strong>Black Radio</strong> - Robert Glasper Experiment</li>
  <li><strong>Drunk</strong> - Thundercat</li>
  <li><strong>In My Element</strong> - Robert Glasper</li>
</ul>

<p>这些专辑证明，爵士乐不仅仅是博物馆里的展品，它依然是一种活生生的、不断演化的音乐形式。</p>
      `,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date('2024-02-15'),
    },
    {
      title: 'Contemporary Sculpture: Beyond Bronze',
      slug: 'contemporary-sculpture-beyond-bronze',
      category: 'ART',
      excerpt: '当代雕塑家如何突破传统材料的限制，用新媒介表达艺术观念。',
      coverImage: 'https://images.unsplash.com/photo-1544413660-299165566b1d?w=800',
      detailImage: {
        url: 'https://images.unsplash.com/photo-1544413660-299165566b1d?w=1200',
        authorName: 'Europeana',
        authorLink: 'https://unsplash.com/@europeana',
      },
      content: `
<h2>材料的革命</h2>
<p>从 <strong>Anish Kapoor</strong> 的镜面不锈钢到 <strong>Olafur Eliasson</strong> 的冰块装置，当代雕塑家正在彻底改变我们对雕塑的认知。他们使用的材料包括：</p>

<ul>
  <li>LED 灯光</li>
  <li>可编程投影</li>
  <li>有机材料（植物、冰、水）</li>
  <li>回收塑料</li>
  <li>声波与空气</li>
</ul>

<h2>代表作品</h2>
<p><strong>Cloud Gate</strong>（云门）是 Anish Kapoor 在芝加哥千禧公园创作的标志性雕塑。这件作品由 168 块不锈钢板无缝焊接而成，表面如液态水银般反射周围的城市景观。</p>

<blockquote>
  <p>"我对物质性不感兴趣，我感兴趣的是物质之外的东西——空间、光线、反射。" — <cite>Anish Kapoor</cite></p>
</blockquote>
      `,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date('2024-02-20'),
    },
    {
      title: 'Sustainable Fashion: The New Luxury',
      slug: 'sustainable-fashion-new-luxury',
      category: 'FASHION',
      excerpt: '可持续时尚不再是妥协，而是新的奢侈品定义。探索引领变革的品牌与设计师。',
      coverImage: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800',
      detailImage: {
        url: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1200',
        authorName: 'Hannah Morgan',
        authorLink: 'https://unsplash.com/@hannahmorgan',
      },
      content: `
<h2>奢侈品的重新定义</h2>
<p>在一个资源有限的星球上，真正的奢侈不是浪费，而是<strong>责任</strong>。越来越多的高端品牌开始将可持续发展作为核心价值。</p>

<h2>领先品牌</h2>
<ul>
  <li><strong>Stella McCartney</strong> - 从不使用皮革和皮草</li>
  <li><strong>Patagonia</strong> - 回收材料的先驱</li>
  <li><strong>Eileen Fisher</strong> - 衣物回收计划</li>
  <li><strong>Reformation</strong> - 碳中和时尚</li>
</ul>

<h2>消费者的力量</h2>
<p>研究显示，超过 70% 的 Z 世代消费者愿意为可持续产品支付更高价格。这种需求正在推动整个行业的转型。</p>

<blockquote>
  <p>"买得更少，选得更好，用得更久。" — <cite>Vivienne Westwood</cite></p>
</blockquote>
      `,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date('2024-02-25'),
    },
    {
      title: 'The Art of Music Videos: Visual Storytelling',
      slug: 'art-music-videos-visual-storytelling',
      category: 'FILM',
      excerpt: '从 Michel Gondry 到 Hiro Murai，探索音乐视频如何成为独立的艺术形式。',
      coverImage: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800',
      detailImage: {
        url: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=1200',
        authorName: 'Denise Jans',
        authorLink: 'https://unsplash.com/@dmjans',
      },
      content: `
<h2>当音乐遇见电影</h2>
<p>音乐视频不仅仅是歌曲的视觉配菜，它已经发展成为一种独特的艺术形式。最优秀的 MV 导演能够在三四分钟内讲述一个完整的故事。</p>

<h2>传奇导演</h2>
<ul>
  <li><strong>Michel Gondry</strong> - 《Around the World》《Star Guitar》</li>
  <li><strong>Spike Jonze</strong> - 《Weapon of Choice》《Sabotage》</li>
  <li><strong>Hiro Murai</strong> - 《This Is America》《Bonfire》</li>
  <li><strong>Chris Cunningham</strong> - 《Come to Daddy》《All Is Full of Love》</li>
</ul>

<blockquote>
  <p>"音乐视频是我们这个时代最自由的艺术形式之一。没有规则，只有可能性。" — <cite>Michel Gondry</cite></p>
</blockquote>

<h2>改变游戏规则的作品</h2>
<p>Childish Gambino 的《This Is America》是近年来最具影响力的音乐视频之一。导演 Hiro Murai 用一个长镜头创造了一个充满象征意义的视觉寓言，引发了全球范围的讨论。</p>
      `,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date('2024-03-01'),
    },
    {
      title: 'Impressionism in the Digital Age',
      slug: 'impressionism-digital-age',
      category: 'ART',
      excerpt: '数字工具如何让印象派的光影美学在 21 世纪获得新生。',
      coverImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800',
      detailImage: {
        url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1200',
        authorName: 'Birmingham Museums Trust',
        authorLink: 'https://unsplash.com/@birminghammuseumstrust',
      },
      content: `
<h2>莫奈会用 iPad 吗？</h2>
<p>如果印象派大师生活在今天，他们会如何利用数字工具？这个问题激发了一批新锐艺术家的创作灵感。他们用数字画板和 AI 算法，探索光与色彩的无限可能。</p>

<h2>数字印象派工具</h2>
<ul>
  <li><strong>Procreate</strong> - iPad 上的画笔模拟</li>
  <li><strong>Adobe Fresco</strong> - 实时水彩效果</li>
  <li><strong>Rebelle</strong> - 专业水彩/油画模拟</li>
  <li><strong>AI 生成工具</strong> - Midjourney、DALL-E</li>
</ul>

<blockquote>
  <p>"技术改变了媒介，但艺术的本质——捕捉光线、表达情感——从未改变。" — <cite>数字艺术家 David McLeod</cite></p>
</blockquote>

<h2>争议与思考</h2>
<p>AI 艺术的兴起引发了关于创作权和艺术本质的讨论。当算法可以模仿莫奈的笔触时，我们该如何定义艺术？</p>
      `,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date('2024-03-05'),
    },
    {
      title: 'Indie Music Scene: Underground to Mainstream',
      slug: 'indie-music-underground-mainstream',
      category: 'MUSIC',
      excerpt: '独立音乐如何从地下走向主流，以及这对音乐产业意味着什么。',
      coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
      detailImage: {
        url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200',
        authorName: 'Austin Neill',
        authorLink: 'https://unsplash.com/@arstyy',
      },
      content: `
<h2>独立音乐的崛起</h2>
<p>流媒体时代打破了传统唱片公司的垄断。Spotify、Bandcamp 和 SoundCloud 让独立音乐人能够直接触达全球听众。</p>

<h2>成功案例</h2>
<ul>
  <li><strong>Billie Eilish</strong> - 卧室制作走向格莱美</li>
  <li><strong>Chance the Rapper</strong> - 不签约也能成功</li>
  <li><strong>Tame Impala</strong> - 一人乐队的奇迹</li>
  <li><strong>日本City Pop 复兴</strong> - 网络让老歌重生</li>
</ul>

<blockquote>
  <p>"现在是做独立音乐最好的时代。你不需要任何人的许可就能发行你的音乐。" — <cite>Chance the Rapper</cite></p>
</blockquote>

<h2>挑战与机遇</h2>
<p>虽然门槛降低了，但在海量内容中脱颖而出变得更加困难。独立音乐人需要同时身兼词曲创作、制作、市场营销等多重角色。</p>
      `,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date('2024-03-10'),
    },
    {
      title: 'Documentary Photography: Truth in the Frame',
      slug: 'documentary-photography-truth',
      category: 'FILM',
      excerpt: '纪实摄影如何在社交媒体时代保持真实与力量。',
      coverImage: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800',
      detailImage: {
        url: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1200',
        authorName: 'Jessy Smith',
        authorLink: 'https://unsplash.com/@jessysmith',
      },
      content: `
<h2>真相的力量</h2>
<p>在这个图片可以轻易被 PS 的时代，纪实摄影的价值反而更加凸显。它提醒我们：有些瞬间是真实的，有些故事需要被讲述。</p>

<h2>当代纪实摄影师</h2>
<ul>
  <li><strong>James Nachtwey</strong> - 战争与人道主义危机</li>
  <li><strong>Lynsey Addario</strong> - 女性与冲突</li>
  <li><strong>Sebastião Salgado</strong> - 人类与环境</li>
  <li><strong>Steve McCurry</strong> - 文化与人像</li>
</ul>

<blockquote>
  <p>"一张照片可以改变世界。但首先，它必须触动人心。" — <cite>James Nachtwey</cite></p>
</blockquote>

<h2>伦理边界</h2>
<p>纪实摄影师面临着复杂的伦理问题：何时按下快门？是否应该干预？如何尊重被摄者的尊严？这些问题没有标准答案，但值得每一位摄影师深思。</p>
      `,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date('2024-03-15'),
    },
  ]

  // 定义哪些推文需要关联广告（根据 slug 和分类匹配广告）
  const postAdMapping: Record<string, string[]> = {
    'art-of-minimalism-fashion': ['FASHION'], // 关联 FASHION 类广告
    'behind-scenes-radiohead': ['MUSIC'], // 关联 MUSIC 类广告
    'abstract-expressionism-today': ['ART'], // 关联 ART 类广告
    'revival-film-photography': ['FILM'], // 关联 FILM 类广告
    'golden-age-jazz-modern': ['MUSIC'], // 关联 MUSIC 类广告
    'sustainable-fashion-new-luxury': ['FASHION', 'BEAUTY'], // 关联多个类别广告
    'art-music-videos-visual-storytelling': ['MUSIC', 'FILM'], // 关联多个类别广告
    'impressionism-digital-age': ['ART'], // 关联 ART 类广告
    'indie-music-underground-mainstream': ['MUSIC'], // 关联 MUSIC 类广告
    'documentary-photography-truth': ['FILM'], // 关联 FILM 类广告
  }

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

      // 关联广告
      const adCategories = postAdMapping[postData.slug]
      if (adCategories && adCategories.length > 0) {
        const matchingAds = createdAds.filter((ad) => adCategories.includes(ad.category))
        for (let i = 0; i < matchingAds.length; i++) {
          await prisma.postAdvertisement.create({
            data: {
              postId: post.id,
              advertisementId: matchingAds[i].id,
              sortOrder: i,
            },
          })
        }
        if (matchingAds.length > 0) {
          console.log(`  📎 关联 ${matchingAds.length} 个广告`)
        }
      }
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
