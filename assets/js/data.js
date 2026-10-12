/* ==========================================================================
   野火整合包 · 内容数据
   --------------------------------------------------------------------------
   这个文件放「列表类内容」：下载版本、更新日志、模组列表、安装教程、FAQ。
   下面所有内容都是示例，请按实际情况替换。
   格式说明写在每一段的注释里，照着现有条目的样子复制一份改就行。
   ========================================================================== */

window.DATA = {

  /* ======================================================================
     一、下载
     ----------------------------------------------------------------------
     url       : 直链地址。留空 "" 时按钮会变成灰色的「待填写」，点不动。
     mirrors   : 备用网盘，可以有任意多个；code 是提取码，没有就留空。
     sha1      : 文件校验值，留空则不显示校验栏（推荐填上，方便用户验完整性）。
     mem       : 最低内存分配，会显示成一行「最低内存」。哪个端填了哪个端才显示，
                 服务端没填就不会出现这一格（服务端的建议写在 notes 里）。
     javaWarn  : 整个下载区共用的一句硬提醒，会显示在两张下载卡的规格格下面。
                 留空 "" 就不显示。适合写「必须用某个版本」这种不照做会出事的话。
     channel   : "release" 正式版 / "beta" 测试版，会显示成不同颜色的标签。
     recommended: true 的版本会出现在首页和下载页顶部的「推荐下载」位置。
     ====================================================================== */
  downloads: {

    /* 下载区共用的一句硬提醒。用户常常跳过教程直接点下载，所以这句直接摆在按钮上方。
       客户端和服务端都要用同一个 Java，所以放在这里一份就够。留空 "" 就不显示。 */
    javaWarn: "必须用 Java 21（64 位）。装 Java 17 能进游戏，但会有一堆 bug。",

    /* ---------- 客户端 ---------- */
    client: {
      title: "客户端",
      icon:  "🎮",
      sub:   "玩家自己玩，选这个",
      versions: [
        {
          version: "0.3.8",
          channel: "beta",
          recommended: true,
          mc: "1.20.1",
          loader: "Forge 47.4.23",
          java: "Java 21（64 位）",
          mem: "8 GB",
          file: "野火整合包-客户端-v0.3.8.zip",
          size: "273 MB",
          date: "2026-10-08",
          url: "https://pan.quark.cn/s/e5a7704fa00d",
          mirrors: [],
          sha1: "",
          notes: "当前公测版。导入方式见「安装教程」，推荐用 PCL2 或 HMCL 直接导入压缩包。"
        },
        {
          version: "0.3.1",
          channel: "beta",
          recommended: false,
          mc: "1.20.1",
          loader: "Forge 47.4.23",
          java: "Java 21（64 位）",
          mem: "8 GB",
          file: "野火整合包-客户端-v0.3.1.zip",
          size: "1.19 GB",
          date: "2025-05-02",
          url: "",
          mirrors: [],
          sha1: "",
          notes: "上一个公测版，仅作留念，新玩家请直接下 0.3.8。"
        }
      ]
    },

    /* ---------- 服务端 ---------- */
    server: {
      title: "服务端",
      icon:  "🖥️",
      sub:   "和朋友联机 / 开服，选这个",
      versions: [
        {
          version: "0.3.8",
          channel: "beta",
          recommended: true,
          mc: "1.20.1",
          loader: "Forge 47.4.23",
          java: "Java 21（64 位）",
          file: "野火整合包-服务端-v0.3.8.zip",
          size: "792 MB",
          date: "2026-10-08",
          url: "https://pan.quark.cn/s/672e3cfc4e19",
          mirrors: [],
          sha1: "",
          notes: "已预配置 server.properties、白名单模板与开服脚本，解压即用。建议 4 核 8G 起步。"
        }
      ]
    }
  },

  /* ======================================================================
     二、更新日志
     ----------------------------------------------------------------------
     一条 = 一个版本，按时间从新到旧排列，第一条会自动打上「最新」标签。
     字段：
       version  版本号，带 v 前缀，例如 "v0.3.8"
       date     发布日期，格式 "2026-10-08"
       tags     小标签数组，例如 ["哑铃", "负重", "矿石"]；初始版写 ["公测", "初始版"]
       summary  一句话说明这一版干了什么（可留空 ""）
       changes  改动清单，一条一行，写法见下面 v0.3.8

     changes 里的每条只有两个字段：
       type  add（新增，绿） / fix（修复，蓝） / change（调整，黄） / remove（移除，红）
       text  这一条要说的话，纯文本，不要写 HTML

     初始版是 v0.3.0。changes 留空 [] 时，页面上会显示「这一版还没整理更新内容」。
     ====================================================================== */
  changelog: [
    {
      version: "v0.3.8",
      date: "2026-10-08",
      tags: ["记忆锻造", "火把", "马匹", "石磨", "投掷", "模组更新"],
      summary: "铁砧的「一键锻造」改成记住你自己敲过的步骤，火把能直接给炉子点火，马匹能用石磨也会躲开岩浆和火，背包袋子帐篷里装的东西开始算重量，矿石粉碎产出提高，各模组的联网检查也一起关掉了。",
      changes: [
        { type: "change", text: "铁砧上的「一键锻造」去掉了，只留「记忆锻造」：不再按世界种子自动算最优顺序（有些配方本来就算不出路径），改成你自己先手动敲一遍记住，之后点按钮就照你上次的步骤重敲。每条配方单独攒经验，攒够 10 点解锁（技艺等级不到 10 级时每低 1 级门槛加 2 点，完全没锻过的新手要 30 点）；每敲一件按品级给经验、完美锻造给 5 点。回放的时候每一击耗 1 点锤子耐久，一件最多记 150 步，自动敲大约每 0.15 秒一下；材料状态和记录对不上会提示。" },
        { type: "add",    text: "铁砧界面顶上多了一条 5 格的「记忆带」：显示上次记录的一小段步骤，中间那格是接下来该敲的一击（下方有黄线，还会伸个箭头指向面板里对应的那个步骤按钮）；你实际敲的和记录不一样时中间那格会变红。锻造手册里的「最短 N 步」也改成了「上次 N 步」。" },
        { type: "fix",    text: "钳子不会再被塞进铁砧：潜行点铁砧时手里的钳子会让开，另一手的工件照常一次放进去；要是另一手也空着，这次点击直接拒绝，免得热金属掉地上烫人。" },

        { type: "add",    text: "点燃的火把现在能当打火器用：潜行拿着它右键，可以点着火塘、木炭炉、高炉、团铁矿炉、烧炭坑和柴堆（生存模式消耗 1 根火把）；熄灭的火把能原地免费重新点着，墙上那支朝向不变。拿着点燃的火把打生物，还能把生物点着 4 秒。" },
        { type: "add",    text: "温度接近的同一种热锭、热模具现在可以叠放（判定标准是这件东西 10 秒自然降温的幅度：铁锭约 14 度、铜锭约 20 度、玻璃模具约 200 度），叠好后温度取两者的中间值。" },

        { type: "add",    text: "森罗物语的石磨现在能绑这 15 个马品种来拉磨：挽用马（比利时、克莱兹代尔、佩尔什、夏尔）转得最快，冰岛马和哈菲林格次之，其余品种再次之，都比群峦原本的普通马快不少。" },
        { type: "add",    text: "「马匹冲撞」这一版正式开起来了：马全速直线疾驰约 1 秒后开始蓄力、3 秒内越撞越重，撞到什么就伤什么，不用你出手挥击；按 Z 随时开关，关掉时快捷栏旁边的计量条也一起藏起来。急转弯或者停下会重置蓄力。" },
        { type: "change", text: "第一人称骑乘时马身不再淡出（半透明马关掉了）。另外冰岛马的「冬毛」「清醒头脑」、美洲野马的「野性本能」「治疗骑手」这四个本领关掉了，其余本领照旧。" },
        { type: "add",    text: "马被岩浆、火焰、甜浆果丛这类不是生物造成的伤害弄疼时会自己小步走开（朝 6 格外走、1.3 倍速度、持续 3 秒，伤害不停就继续走）；你骑在它身上时它还是听你的。仙人掌、溺水、摔落、饥饿这些不在躲避范围内。" },
        { type: "add",    text: "群峦自己的马、驴、骡现在也能按亲密度概率驯服了，和 icy 的 15 个品种同一套曲线。驴和骡背上箱子里的货也计入负重；马车不再限制货物体积——装什么都塞得进，只是太重会拉不动。" },
        { type: "add",    text: "吹马哨召回之前，马会先「放手」：自动卸下马车、请下乘客再朝你过来，不会再拖着车厢满地图跑。" },
        { type: "fix",    text: "箱子和马车里的货物重量现在实时生效，Jade 上的负重读数也跟着对了（以前装货不更新、显示 0）。" },
        { type: "change", text: "马匹刷怪收敛：丘陵、平原、山地、高原的马群出现权重从 6 降到 3、每群最多从 4 匹提到 6 匹；极地的冰岛马和哈菲林格权重降到 1；恶地不再刷阿拉伯马、阿帕卢萨马、美洲野马（去掉了 4 个群系）。" },
        { type: "change", text: "马匹本领的名字重新中文化（平地冲刺、长途奔袭、弹射起步、金戈铁马、避矢、盛装舞步等），屏幕上一眼就能看懂。" },

        { type: "change", text: "投掷武器也能涨集中经验了：命中 10 格以外的生物给 10 点；打靶按红石信号给，信号越强越多、正中靶心给满 5 点，6 格以内不给、6 到 9 格只给一半，每天最多 150 点。" },
        { type: "change", text: "淬火和裂纹补到成品上：斯巴达武器用淬火过的部件合成会继承淬火等级（最高 300）并相应扣一点出厂耐久；破岩锤、开掘铲不再白淬火；纺锤按柄材给加成（藤枝 0、木棍 10、防腐木棍 20、缠柄木棍 30、缠柄防腐木棍 40），其中缠柄防腐木棍纺锤能用 80 次。也修掉了泡过头（淬火值超 300）导致成品一出厂就带 1700 多点损伤、当场碎掉的问题，现在最多 100 点。" },
        { type: "change", text: "西红柿改成只摘果实：植株留在原地、只回退一个生长阶段，不掉种子也不用重新种。" },
        { type: "change", text: "砍树换了模组：小树砍 3 到 5 下、大树砍 7 到 10 下才会整棵倒下，树朝你砍的方向倒；木屑 60 秒后消失，同时最多 4 棵在倒，树上的苹果有 40% 概率被震下来，倒下的树会砸伤碰到的生物。原来那个砍树模组停用了。" },
        { type: "add",    text: "粉碎矿石的产出提高：富集 8、普通 6、贫瘠 4、小块 3 个碎石块，每种再多 5% 概率多出 1 个；另外新增动力压床配方，直接压出 7 / 5 / 3 / 2 个碎石块。助熔石粉碎以前产出一种根本不存在的粉末，现在稳定给 2 个助焊剂。" },
        { type: "change", text: "13 种自制燃料（颗粒、压块、保温块各系列）现在能放进群峦生活的烤炉和熏制炉了，以前只有木料炭块一种进得去；另外这些燃料也能当作篝火的燃料使用。" },
        { type: "add",    text: "炉子这边补了几处：电力燃烧器以前是把热量数值直接换算成温度，现在改用和木炭炉一样的算法，会从常温慢慢升上去，不会一步就到最高温。木炭炉烧到最高那档（2300 度）视作「过热」，可以带动架在上面的锅和搅拌机；最高这一档的炉子也有了自己的外观。风扇加热补上了温度上限，被吹的东西如果本来就已经比这一档能承受的更热，会被直接烧毁。" },
        { type: "change", text: "板模具和棒模具的损坏概率从必坏改成 50%；做「未完成的棒模具」也不再吃掉手里的金属棒。" },
        { type: "change", text: "奶酪布配方削弱：一次只出 1 个（原来 12 个），材料改成高级布料、线、绳子和缝纫针（针有 16 点损耗）。" },
        { type: "change", text: "背包、袋子、帐篷里装的东西现在也算进负重，不过按容器打折：背包内容物按 80% 计，把背包挂到饰品栏上按 60%；袋子 80%，挂到饰品栏 50%；帐篷 70%，背在背上 30%。背包的升级件、过滤器、蓝图这类配件完全不占重量，它们内部装的东西也不计。液体同样计重，一桶算 100 重量。容器套容器最多只往里算 4 层（例如背包里的箱子里再放一个背包）。帐篷本身也能放进背部饰品栏。" },
        { type: "add",    text: "农夫乐事的烹饪锅现在能在铁砧上用锻铁双层板打出来（3 级锻造）。" },
        { type: "change", text: "工业冲压机（金属冲压机）不用重型工程块了，改成用轻型工程块搭建；轻型工程块在攻城工作台上用钢板就能做，所以冲压机比以前能早不少做出来。" },
        { type: "change", text: "Create 的扳手和工程师护目镜改回黄铜：工作台上扳手 = 3 张黄铜板 + 1 个齿轮 + 1 根木棍，工程师护目镜 = 1 张黄铜板 + 2 块玻璃 + 1 根线；它们的高温加工也从金（1060 度）改成了黄铜（930 度）。" },
        { type: "add",    text: "切石机现在也能切群峦的天然花岗岩、闪长岩、安山岩，产出和对应的原版石头完全一样：Create 那一整套切割石头，加上原版的磨制、台阶、楼梯和墙。" },
        { type: "change", text: "斯巴达武器的重量和体积按真实体型补全（薙刀、长枪算特大，长刀、太刀又大又沉，军刀、长棍、矛算大，迅捷剑、投斧、标枪偏轻），未完成的双层锭和双层板也记成大而重——背包负重会明显有差别；安山合金板也补上了「大 / 适中」的尺寸重量。" },
        { type: "fix",    text: "修掉了用小缸、模具的浇筑界面凭空刷金属的漏洞：夹子烫手把热物品丢掉时，那个界面还挂着已经不存在的物品栈继续倒金属；现在丢之前会先把界面关掉。" },
        { type: "fix",    text: "拿着地图时服务端可能被卡住的问题修好了：刷新地图前会先检查这片区域的区块是否都已加载，没加载完就推迟一会儿再刷（表现是地图稍晚一点更新，但服务端不会再卡住）。" },

        { type: "add",    text: "新增聊天界面模组 E33Chat，把原版聊天框做成聊天软件的样子：消息卡片、未读红点、被提到和私聊的通知横幅与提示音、侧边栏（世界频道、在线玩家、查找玩家）、私聊、常用语、表情与颜文字、聊天记录搜索并按世界保存，面板宽度、背景模糊、透明度和动画也都能调。" },
        { type: "change", text: "任务书把「大地捞针」里的 58 个任务单独拆成了一章「我们家鸽鸽要下蛋了！」（仍在主线里），「大地捞针」保留其余 305 个，内容没有删。" },
        { type: "change", text: "小地图的世界内路标点默认显示出来了；实体雷达的高度上限再从 30 格降到 15 格。" },
        { type: "change", text: "这一版把各模组的联网检查都关掉了：光影加速的自动更新、ModernUI 的遥测、小地图的联网与更新提示、沉浸工程的更新公告，以及几个模组启动时的版本校验；野火本体启动时那十几处联网请求也一并拦掉了，启动更干净。" },
        { type: "remove", text: "跑酷指南、铁魔法的指南书、生物交互的百科，这三本书现在一进背包就会被自动删掉，没有任何提示。提醒一句：跑酷指南目前还能在合成台做出来（3 根羽毛加 1 本书），做出来会在半秒内消失，不要误以为是物品丢了。" },
        { type: "remove", text: "工作台上的三个配方去掉了：烈焰人燃烧室（现在完全没有配方能做出来）、电磁炉、轻型与重型工程块（工程块以后在攻城工作台上用钢板做）；生存者乐事的有机堆肥也从合成里去掉。" },
        { type: "change", text: "自定义世界类型「挑战-冻结之地」的温度参数以前写错了（全图温度几乎一样、还贴着冰点），已经修正。" },
        { type: "change", text: "汉化：「黄麻绳索」改名「棉麻绳」；群峦那个「绿豆」其实译错了，改成了「四季豆」（指南书三个语言版本也一起改）；木桶和小缸的十几道加工补上了中文名（玫瑰石英结晶中、南瓜面团发面中、甘蔗汁碱化中、酵母培养中、熊皮鞣制中……）；淬火提示也写清了代价：微裂和龟裂各多 25% 磨损，两个标记互相独立、可以叠加，一次最多多掉 2 点。" },
        { type: "change", text: "模组更新：Icy 的更好马匹升到 2.1.0（补的主要是给未安装模组做的兼容和提示框边框），Sacks 'N Such 升到 2.1.3（矿石袋能装碎石子了，一个按键只会开一个容器），大地上的马驹、野火、属性模组、生存者乐事-肥沃土壤都换了新构建，GeckoLib 升到 4.8.4；任务增强、优化合集、随意优化、星辉机械动力优化也各升了一版，新增了伐木模组 Timber Tales 和 quick-pack，记录者手册又换了一次版本号。停用了「马匹修复」（它修的是光影下半透明渲染的排序，跟马没关系）和原来的砍树模组。" }
      ]
    },
    {
      version: "v0.3.7",
      date: "2026-10-04",
      tags: ["修复","新增"],
      summary: "工具绑定改成按材料单独算，熄灭的炉子只要还有余温就能直接添燃料复燃，马口铁焊接整叠带温、升降温也快了不少；这一版还把马匹整套接了进来。",
      changes: [
        { type: "fix", text: "工具绑定异常绑定修复。" },
        { type: "change", text: "石质工具绑上绑定加固值还按两倍算（只有绑定材料翻倍，柄材照常）。" },

        { type: "add",    text: "阴燃复燃：火塘、营火、烹饪锅、烤架、木炭炉熄灭之后，只要炉温还没完全降下来，直接往里放燃料就能自己重新点着，不用再掏打火器。火塘、营火大约能保持 30 秒，木炭炉大约 115 秒，拉风箱会让降温变慢、这个时间翻倍。" },
        { type: "fix",    text: "用打火石、打火器或火焰弹点烹饪锅时，如果那件东西刚好在点火那一刻用坏，之后 1 秒内潜行空手点锅不会把刚点着的锅端走，避免把自己一起带走。" },

        { type: "fix",    text: "马口铁焊接：以前一叠里只有留在砧上的那一个是热的，其余都是凉的，现在 4 个或者 8 个产物的配方温度一致。" },
        { type: "change", text: "马口铁升降温快了很多（热容 5.357 → 2.8）" },

        { type: "add",    text: "新增「Icy 的更好马匹」：15 个马品种分成五大类——竞速马、矮马、西部马、战马、挽马。类别决定速度、跳跃和血量的高低，也决定特长：西部马走在路上会提速，交情越深加得越多；矮马能直接蹬上两格高、15 格以内摔下来不受伤、还能在细雪上走；战马永不惊慌失控、被击中不会人立；挽马能同时载箱子和两个人，拉满载马车不打折；竞速马跑得最快跳得最高，但血量最低。" },
        { type: "add",    text: "新增「大地上的马驹」把马匹整套接进群峦：马现在有亲密度、性别、生日、怀孕和衰老，负重、战斗反应和掉落也换成群峦那一套。装 Jade 对着马看一眼，就能读到性别、亲密度、能否繁殖、衰老程度和怀孕进度。" },
        { type: "change", text: "驯服不再靠反复上马碰运气：按亲密度算成功率，0、6、18、35 点分别是 1%、5%、20%、90%，超过 35 点必成。力量和技巧合计超过 30 之后，每多 1 点再加 5% 成功率，最多加 50%。" },
        { type: "add",    text: "负重与超载：竞速马 900、矮马 1600、西部马 1800、战马 2000、挽马 4800（群峦原本的马 1700、驴 2500、骡 4000）。骑手本人算 350（骑挽马 250），背包里的东西也算重量，马上了年纪后只剩六成。超载就一路变慢：超一半降到 75% 速度，超一倍降到 50%，超两倍直接走不动；跳跃在超一倍半以上减半、超两倍归零。" },
        { type: "add",    text: "马背上的箱子按体型分大小：比利时挽马 6 行，克莱兹代尔、佩尔什、夏尔、哈菲林格 4 行，其余都是 3 行；养熟之后哈菲林格能扩到 6 行、摩根能扩到 4 行。" },
        { type: "add",    text: "马车也按重量算：空车自重 512，车里的货按六成计，挽马拉车再降到四成；马车可以整台收起来带走。群峦拉车原来那套「被撞倒 / 过载 / 力竭」的惩罚已经取消。" },
        { type: "change", text: "喂马分三种情况：血没满时只回血、不加亲密度；血满而且当天还没喂过才算一顿正餐，加 6 点亲密度、只回 1 点血；已经喂过就不吃，食物也不会被浪费。回血量按食物饱食度算，每点回 2 点血、最少 1 点。" },
        { type: "add",    text: "繁殖跟群峦对齐：要一公一母、双方成年、亲密度到 30、母马没怀孕也不饿才能配，怀孕 19 天生一匹，小马 80 天长大；品种各有一半几率随父母（不同品种就标成混血），属性取双亲里高的那个再上下浮动，毛色随遗传到的品种。icy 的马还能和群峦的驴配种。" },
        { type: "change", text: "衰老不再是「一到老就砍一半」：母马生一胎加 10、公马配一次加 5，攒到 60 进入老龄，速度按比例慢慢降到七成，而不是直接腰斩。" },
        { type: "change", text: "马的脾气和反应都写清楚了：亲密度 0 的马被打会追着你还手 30 秒，有点交情只追 10 秒，到 18 以上完全不还手（换成别的生物打它则一律追 30 秒）；追出 16 格放弃，10 秒内还记得是谁干的。主人挨打时附近的马会冲过去帮忙 5 秒。野马掉到三成血就转身逃跑、跑出 32 格才算脱身，16 格内有同伴死亡会被惊到 10 秒；仙人掌野马会自己躲开，驯服的马只要穿上任何马铠就完全免疫。" },
        { type: "add",    text: "马铠跟着群峦的九种金属走（铜、青铜、铋青铜、黑青铜、锻铁、钢、黑钢、蓝钢、红钢），并按八个体型分别做了贴图；icy 十五个品种的掉落也改成群峦的产出表，跟体型和亲密度挂钩。" },
        { type: "add",    text: "新增马厩手册，认领马匹、亲密度、十五个品种与五大类别、马具、繁殖遗传、马上战斗、步态和按键都在里面，整本已经汉化。" },
        { type: "add",    text: "骑乘体验一起补齐：马哨能叫马、开名册、看资料，可以把马信任给别的玩家，两人能共骑一匹（只有主人能牵缰绳、能打开马背上的箱子，第二位玩家坐在身后）；双击 W 自动骑行，步态分慢步 2 格、快步 4.4、跑步 6.8 和疾驰；骑马时树叶不挡路、水里会自己上浮，第一人称下马身会自动淡出、不挡视线，静止时视角能自由转 90 度，上马也不再被硬拽视角。" },
        { type: "add",    text: "野马按气候地形分布：平原上几乎各种马都有，丘陵是各种挽马、弗里斯兰和美洲野马，山地和极地是冰岛马与哈菲林格（山地还有克莱兹代尔马），高原和恶地是阿拉伯马与阿帕卢萨马（高原还有夸特马、恶地还有美洲野马），一次出现 2 到 4 匹。每个品种还有各自适应的气温，越冷越容易碰到冰岛马、哈菲林格，越热越容易碰到阿拉伯马、夸特马；群峦原本的马已经从常见动物名单里拿掉，野外见到的基本都是这 15 个品种。" },
        { type: "change", text: "顺带调了野生动物分布：野猪、角马和深海蜘蛛蟹变少，企鹅和深海鮟鱇鱼变多，大象从平原搬到了极地。" },
        { type: "remove", text: "要提醒一句：马车的车轮、马车齿轮和马用医疗包齿轮这三个配方被删掉了，现在暂时做不出马车和马用医疗包；马蹄铁做得出来，但功能暂时是关着的。" },

        { type: "fix",    text: "康铜板和康铜棒现在可以直接浇铸出来（板用 200、棒用 50 单位熔融康铜）。" },
        { type: "add",    text: "沙子加上 3 份岩石粉末就能合成沙砾。" },
        { type: "add",    text: "空手右键长熟的西红柿可以直接收割，还会自动补种幼苗；手里拿着东西时不受影响。" },
        { type: "change", text: "智力会影响技巧经验：以 10 级为标准，每高 1 级少 10%，到 20 级就完全拿不到技能经验；低于 10 级则按比例变快，开锁经验也照这个算。" },
        { type: "fix",    text: "手持指南针却解不开「路标点禁用」的问题修好了（以前这个判断没真正生效），顺手把野火简易指南针和地图册也算成能解锁路标的物品。" },
        { type: "change", text: "铬铁矿、辉铋矿、磁铁矿、闪锌矿的富集矿体积从「大」降到「小」，重量不变。" },
        { type: "fix",    text: "补齐了安山合金齿轮的更多信息：应力上限 8192、转速上限 256；法兰小齿轮和大齿轮没有应力上限，转速上限是 256。" },
        { type: "change",    text: "补上鳄鱼皮的贴图；当肥料用的鸟粪也换成了更清楚的新贴图。" },
        { type: "change", text: "幸运多了个下限（默认 0）：幸运为负也不会再拉低战利品、钓鱼、进度奖励、考古和开箱的产出，属性面板上显示的数值还是真实的。" },
        { type: "fix",    text: "职业只能选一次了；同时修好了初始物品只发给第一个选该职业的人、以及用指令改等级会连带改掉别人职业模板的问题，改客户端数据也不能再自定义属性了。" },
        { type: "add",    text: "取暖范围补全：木炭炉现在会往周围散热（10 度、每格衰减 3），另外 16 种炉子也能烤暖人了——群峦的锻铁炉和烤架、群峦生活的各种烤炉、沉浸农艺的火炉、森罗物语的炉灶和旋风烤肉塔、传说生存的加热炉，以及群峦现代化生活的电热烤箱。" },
        { type: "change", text: "精金秘银支撑梁的最大跨距从 20 格缩到 18 格，搭支架、挖矿时留意一下。" },
        { type: "add",    text: "木柱现在能用群峦斧头劈成木材，所有木种都行，一次出 5 份。" },
        { type: "change", text: "走鹃只出现在 8~15 度的气温里；森蚺则要求雨量更高、林子更密。" },
        { type: "change", text: "任务书里「开启劫掠队伍刷新」的奖励挪到了中期，跟「中等结构刷新」一起发，前期不会再刷劫掠队。" },
        { type: "change", text: "群峦默认值调整：塌方变小了，连带掉落的方块概率从 55% 降到 25%，半径波动从 16 降到 4（最大半径从 19 格缩到 7 格）；营养对血量的影响也更宽松，开局那种平均营养下血量不再打折（0.85 提到 1），营养不良时的血量下限从 1.3 提到 1.6。" },
        { type: "add",    text: "新增森罗物语兼容补丁：把森罗物语的食材和刀具跟农夫乐事、沉浸农艺等模组的标签统一，森罗物语的汤菜也能放进农夫乐事的大锅里煮。" },
        { type: "remove", text: "森罗物语的烹饪自动化被撤掉了：以前 Create 的机械臂能自动给汤锅、炒锅、蒸笼和烤肉架投料、盖盖、翻炒、舀成品，还带了教程，这一版整条线一起没了，暂时也没有替代品。想自动做饭得回到机械臂硬搬或者手动那套。" },
      ]
    },
    {
      version: "v0.3.6",
      date: "2026-10-02",
      tags: ["哑铃", "一键锻造", "锭铸模", "大桶", "模组更新", "汉化"],
      summary: "哑铃搬进野火模组并学会投掷，铸造台多了金制和沙塑锭铸模，大桶里最耗时的十几道配方时间砍半，还更新了一批模组和汉化。",
      changes: [
        { type: "add",    text: "石质与铸铁哑铃改由野火模组本体提供，效果不变：250 / 500 负重，体力经验 +25% / +50%。" },
        { type: "add",    text: "哑铃现在能当武器用：挥击速度慢、长按可以蓄力扔出去，砸中会额外造成钝器伤害。" },
        { type: "add",    text: "一键锻造继续优化：新增锻造经验和解锁提示（提示可以在聊天栏开关），补上记忆锻造、完美锻造失败时的原因说明，锻造手册里也会统计已经锻造过多少件。" },
        { type: "add",    text: "原版煤炭以前在动力粉碎、动力研磨、手推磨三种工序里都没有配方，现在都能打出煤粉；褐煤和烟煤的手推磨也一起补上，产出量和木炭一致。" },
        { type: "add",    text: "负重、最大负重、致命一击、伤害减免、护甲穿透、额外坠落距离、体力恢复等属性，现在在属性面板和提示里都能显示中文名。" },

        { type: "add",    text: "铸造台新增两种锭铸模：金制锭铸模，以及黄、白、粉、红、绿、棕、黑七种沙塑锭铸模。石墨模具速度最快而且能浇钢；金模具慢一倍，胜在能反复使用；沙模具最慢，浇一次就报废。金模具和沙模具都浇不了钢。" },
        { type: "add",    text: "金制锭铸模的获得方式：随便拿一个金属锭当模具，在铸造台浇上 200 熔融金，10 秒就能得到。" },
        { type: "add",    text: "铸镍锭和生锰铁锭现在可以直接浇进陶制锭模（耐火锭模也可以），不用再另想办法成型。" },

        { type: "change", text: "大桶里最耗时的十几道密封配方（皮革、生皮、奶酪、糖、醋、胶水、单宁、砂浆、黄麻纤维等）处理时间直接砍半，8 分钟变 4 分钟。" },
        { type: "change", text: "漏斗产量翻倍：一块铜双层板压出 4 个漏斗，原来只有 2 个。" },
        { type: "change", text: "炼药锅改成在铁砧上用一块铸铁双层板打出来；反过来把炼药锅熔掉也只回收 400 铸铁，不再是 1000。" },
        { type: "change", text: "齿轮箱外壳（深色橡木、白桦、红树三种）不能再空手在工作台压出来了，得用卷板机加工，对应的金属板还要先烧到 1200 / 600 / 1200 度。" },
        { type: "change", text: "光速启动回退到 1.2.3（2.0.1 先停用），并恢复模组默认的资源加载方式，进游戏时加载更稳。" },
        { type: "change", text: "模组更新：ExtraLib 升到 3.1.1、生存者乐事升到 3.6.0-alpha；「实地指南」改名叫「记录者手册」，内容不变。" },
        { type: "change", text: "默认设置调整：视距 32 → 12、模拟距离 32 → 14，默认开全屏；小地图路标点按键统一成 L（新建 L、列表 Shift+L、开关 Ctrl+L），进度界面改成 Insert，JEI 等键位也重新排过。" },

        { type: "fix",    text: "温泉水热源：温泉的流体方块没有液面状态，原来按液面高度逐个登记会报错，改成整体登记，热辐射效果不变。" },
        { type: "fix",    text: "黄铜机件：用黄铜棒做序列组装时，产出物品的名字以前写错了，做出来的东西对不上，现在改回正常的黄铜机件。" },
        { type: "fix",    text: "汉化修正：「铋铜棒」改回「铋棒」，另外给新增的各个锭铸模补上了中文名。" },
        { type: "fix",    text: "任务书文案修正：漏斗的说明改成「放下漏斗、用拉杆控制投料，避免投放的原料被吸走」，路标点的提示也统一成按 L。" },

        { type: "add",    text: "任务书补充：手持草布袋右键，可以把袋子里的东西一次性倒出来。" }
      ]
    },
    {
      version: "v0.3.3",
      date: "2026-10-01",
      tags: ["锻造", "筋腱", "背包", "JEI", "木炭炉", "配方"],
      summary: "砧多了一键完美锻造和《锻造手册》，背包界面重做，木炭炉和篝火不再烧家，还补了一批漏掉的配方。",
      changes: [
        { type: "add",    text: "铁砧界面右上角多了一个「一键锻造」按钮，配方解锁后点一下就能直接打出完美成品，每次消耗 10 点锤子耐久。" },
        { type: "add",    text: "一键锻造需要先解锁：每打出一次完美成品都有机会解锁该配方，技艺等级越高机会越大（6 级起才有机会）；等级超过 10 级且同一配方累计完美锻造 20 次必定解锁，解锁时聊天栏会提示。" },
        { type: "add",    text: "《锻造手册》：把一本书放在铁砧当焊接处理就能拿到，右键翻看哪些配方已经解锁、各完美锻造了多少次。" },
        { type: "add",    text: "一键锻造的进度跟着角色存档走，死亡不会丢；用它打造也不会重复触发「完美锻造」成就。" },
        { type: "add",    text: "筋腱在露天连续放 20 分钟没淋到雨就会变成风干的筋腱；淋雨会重新计时，有屋顶挡着就不受影响。" },
        { type: "change", text: "背包界面重做成上面是背包、下面是玩家物品栏，格子数量和实际容量对得上了" },

        { type: "add",    text: "JEI 新增「淘金盘掉落」和「洗矿槽掉落」，可以直接看到能淘出什么、概率多少，按概率从高到低排，算不准的会标「约」。" },
        { type: "change", text: "木炭炉篝火不会再点燃周围的方块了。" },
        { type: "fix",    text: "里昂·S·肯尼迪夹克削弱：护甲由 8 点降到 4 点、韧性由 2 点降到 0 点" },

        { type: "fix",    text: "凿子、锤子、勘探镐、钉头锤现在可以正常淬火了。" },
        { type: "fix",    text: "硫磺、石墨、冰晶石、朱砂、钛铁、钒这 6 种矿现在可以用鼓风机清洗、也能磨粉了。" },
        { type: "fix",    text: "四铜矿掉落修复：之前会掉出不相干的东西。" },
        { type: "fix",    text: "修复水壶侧边皮革的敲制配方：原本图案框外的约束是失效的，怎么敲都能成。" },
        { type: "add",    text: "新增物品「负重石」：放在背包里每块增加 100 负重，同时每块再 +5% 体力经验，可以叠加。" },
        { type: "add",    text: "缺水罗盘现在可以合成：磁铁矿小矿石 + 碗 + 木棍。" },
        { type: "change", text: "熔化的金属和玻璃层现在也能当热源用，冷却之后就不再供热。" },

        { type: "change", text: "木炭炉的超级加热现在模组自带，不再需要额外补丁，火力档 7 和档 8 都能烧到最高温度。" },
        { type: "change", text: "木炭炉模组换成我们自制的版本，以前 JEI 里那 477 个没用的「未完成」金属物品全部消失了。" },

        { type: "add",    text: "原木与木材燃料增强、树苗增强、新增烤种子。" },
        { type: "fix",    text: "修复木材燃料配方、菠萝灌木自动化丢配方、草布袋与部分任务。" },
        { type: "add",    text: "背包和帐篷新增黑名单，防止把不该装的东西塞进去。" },
        { type: "fix",    text: "TFCIE 的内容现在能在服务端正常生成了。" },
        { type: "fix",    text: "机械动力离合器不再需要红石信号就能切换。" },
        { type: "fix",    text: "修复砸碎岩石粉和相关模具的效果。" },
        { type: "change", text: "汉化与生物生成微调，新增「戒备」效果避免开局就被攻击，并锁定整合包默认键位。" },

        { type: "add",    text: "以后的小版本更新可以直接下载补丁包，不用重新下载整个整合包。" }
      ]
    },
    {
      version: "v0.3.2",
      date: "2025-06-18",
      tags: ["公测", "推荐"],
      summary: "公测第三个版本。模组构成、任务线与服务端配置基本定型，欢迎反馈问题。",
      changes: [
        // ← 这一版的更新内容还没整理，暂时留空。
        //    想写的时候照下面这几行的样子加，页面会自动按顺序列出来。
        // { type: "add",    text: "新增 ……" },
        // { type: "add",    text: "新增 ……" },
        // { type: "change", text: "调整 ……" },
        // { type: "fix",    text: "修复 ……" },
        // { type: "remove", text: "移除 ……" }
      ]
    },
    {
      version: "v0.3.1",
      date: "2025-05-02",
      tags: ["公测"],
      summary: "公测第二个版本，重点做性能与稳定性。",
      changes: [
        { type: "add",    text: "加入 FerriteCore、Entity Culling、ModernFix，整合包启动时间缩短约 40%。" },
        { type: "change", text: "Mekanism 的矿石倍率调回 1:3，避免前期过于轻松。" },
        { type: "remove", text: "移除与主线无关的 4 个装饰类模组。" },
        { type: "fix",    text: "修复 JEI 搜索中文模组名时崩溃的问题。" }
      ]
    },
    {
      version: "v0.3.0",
      date: "2025-04-11",
      tags: ["公测", "初始版"],
      summary: "野火对外发布的初始版本。",
      changes: [
        { type: "add",    text: "首个公开版本，确定模组主线：科技（Create / Mekanism / AE2）+ 魔法（Botania / Ars Nouveau）+ 冒险（Twilight Forest）。" },
        { type: "add",    text: "完成基础优化与汉化补全。" },
        { type: "change", text: "补全 Curios、Architectury、Cloth Config 等前置库。" }
      ]
    }
  ],

  /* ======================================================================
     三、模组列表
     ----------------------------------------------------------------------
     category : 必须出现在下面 categories 里，否则筛选不到。
     url      : 留空会自动生成 Modrinth 搜索链接；有精确项目地址就填上覆盖它。
     author   : 原作者，用于致谢，尽量别写错。
     ====================================================================== */
  mods: {
    categories: ["性能优化", "界面交互", "科技", "魔法", "冒险探索", "建筑农业", "辅助便利", "前置库"],
    list: [
      /* --- 性能优化 --- */
      { name: "0Pack2Reload",                       orig: "资源包重载优化", category: "性能优化", author: "Tapio", desc: "重载资源包速度更快，不用干等。" },
      { name: "AcceleratedRecoiling",               orig: "加速碰撞", category: "性能优化", author: "wiyuka", desc: "优化方块碰撞检测，怪多了也不掉帧。" },
      { name: "ByePregen",                          orig: "停止预生成", category: "性能优化", author: "MoePus", desc: "优化地形生成时的方块放置和区块请求，跑图更顺。" },
      { name: "Chloride",                           orig: "氯化物优化", category: "性能优化", author: "SrRapero720", desc: "给钠系渲染优化做的配套调整，帧数和体验都更稳。" },
      { name: "Collections Of Optimizations",       orig: "优化合集", category: "性能优化", author: "Misanthropy", desc: "针对各种模组做的优化补丁合集，卡顿能少一些。" },
      { name: "Connectivity Mod",                   orig: "连接修复", category: "性能优化", author: "Someaddons", desc: "修掉联机掉线和数据包过大造成的卡顿。" },
      { name: "Embeddium",                          orig: "嵌入式优化", category: "性能优化", author: "embeddedt", desc: "重写渲染管线，帧数提升最明显的一个。" },
      { name: "EntityCulling",                      orig: "实体渲染机制优化", category: "性能优化", author: "tr7zw", desc: "看不见的实体和方块实体就不渲染，帧数更稳。" },
      { name: "Fast IP Ping",                       orig: "快速IP延迟", category: "性能优化", author: "Fallen_Breath", desc: "省掉连服务器时那次拖慢进度的域名查询。" },
      { name: "Fast Suite",                         orig: "配方性能优化", category: "性能优化", desc: "多线程加载配方，缩短启动时间。" },
      { name: "Fast Workbench",                     orig: "快速工作台", category: "性能优化", desc: "加速合成表查找，开工作台不再卡一下。" },
      { name: "FastJEI",                            orig: "JEI快速优化", category: "性能优化", author: "Misanthropy", desc: "专门优化 JEI，打开配方界面更快更省内存。" },
      { name: "Ferrite Core",                       orig: "铁氧体核心", category: "性能优化", author: "malte0811", desc: "大幅降低内存占用，多开也不容易爆。" },
      { name: "ImmediatelyFast",                    category: "性能优化", author: "RK_01", desc: "优化即时渲染，帧数和加载都更稳更快。" },
      { name: "Lightspeed",                         category: "性能优化", author: "CCr4ft3r,kltyton", desc: "大幅缩短大型整合包的加载时间，启动快很多。" },
      { name: "Memory Leak Fix",                    orig: "内存泄漏修复", category: "性能优化", author: "FX - PR0CESS", desc: "修掉客户端和服务端的好几处内存泄漏。" },
      { name: "ModernFix",                          orig: "现代化修复", category: "性能优化", author: "embeddedt", desc: "缩短启动时间并修复若干原版内存问题。" },
      { name: "Nowheel",                            orig: "无色-飞轮渲染", category: "性能优化", author: "Lap2ka", desc: "优化机械动力的渲染，帧数更高也不卡顿。" },
      { name: "Observable",                         orig: "可视性能侦测", category: "性能优化", author: "tasgon", desc: "找出到底是哪个方块或实体在拖慢游戏。" },
      { name: "Oculus",                             orig: "光影", category: "性能优化", author: "NanoLive, dima_dencep, coderbot, IMS212, Justsnoopy30, FoundationGames", desc: "Forge 上的光影加载器，装上就能用光影包。" },
      { name: "Oculus Flywheel Compat",             orig: "光影飞轮兼容", category: "性能优化", author: "Leon", desc: "让光影和飞轮的实例化优化能同时开着。" },
      { name: "Photon",                             orig: "光子", category: "性能优化", author: "KilaBash", desc: "给其他模组提供粒子特效系统的渲染支持库。" },
      { name: "quick-pack",                         category: "性能优化", author: "Drex", desc: "加快数据包和资源包的加载速度，减少等待时间。" },
      { name: "Random Optimization",                orig: "随意优化", category: "性能优化", author: "Colinxu", desc: "专注小优化和修 bug，不重写游戏底层。" },
      { name: "Rhenium",                            orig: "铼优化", category: "性能优化", author: "TheFlareStar", desc: "轻量的性能优化模组，帮助提升帧数。" },
      { name: "RuOK Mod",                           orig: "钌", category: "性能优化", author: "MCTeamPotato Awei", desc: "不依赖钠的独立优化与增强模组。" },
      { name: "SaveMyRecipeBook",                   orig: "保存配方书", category: "性能优化", author: "MoePus", desc: "优化配方书的性能，同时保留全部配方展示。" },
      { name: "Smooth Boot (Reloaded)",             orig: "流畅加载重置版", category: "性能优化", author: "AbdElAziz", desc: "优化 CPU 调度，让游戏启动和加载快一些。" },
      { name: "StartupTimeForge",                   orig: "启动时间优化", category: "性能优化", author: "KSmc_brigade", desc: "缩短启动时间，开游戏不用再干等。" },
      { name: "StellarCreateOptimization",          category: "性能优化", author: "StellarVan", desc: "专门给机械动力做优化，减轻动力网络和粒子的开销。" },

      /* --- 界面交互 --- */
      { name: "Better Biome Reblend",               orig: "更好群系过渡", category: "界面交互", author: "FionaTheMortal UTMG AlphaMode", desc: "加大群系之间的颜色过渡范围，接缝处看着自然多了。" },
      { name: "Better Combat Particle",             orig: "更好战斗粒子", category: "界面交互", author: "Malfu", desc: "给更好战斗补上打击粒子特效，砍中目标时有额外反馈。" },
      { name: "Better Ping Display",                orig: "更好延迟显示", category: "界面交互", author: "Quintinity", desc: "玩家列表里直接显示具体延迟数字，不再只有几格信号。" },
      { name: "BiomeSpy",                           orig: "群系间谍", category: "界面交互", author: "MoePus", desc: "在屏幕上显示当前所处群系的名称。" },
      { name: "Cinematic Respawn",                  orig: "电影式重生", category: "界面交互", author: "VoKaP", desc: "重生的时候放一段电影感镜头，不再是硬切。" },
      { name: "CIT Resewn",                         orig: "自定义物品纹理", category: "界面交互", author: "SHsuperCM, Asek3,Tfarcenim", desc: "根据物品名字和属性显示不同的纹理。" },
      { name: "Controlling",                        orig: "按键控制", category: "界面交互", author: "Jaredlll08", desc: "按键设置支持搜索，再也不用翻半天。" },
      { name: "CosmeticArmorReworked",              orig: "装饰盔甲重制", category: "界面交互", author: "zlainsama", desc: "可以外观和实用各穿一套盔甲。" },
      { name: "CustomSkinLoader",                   orig: "自定义皮肤加载器", category: "界面交互", author: "xfl03, JLChnToZ, ZekerZhayard", desc: "从多个皮肤站加载皮肤，离线也能换皮。" },
      { name: "Drip Sounds",                        orig: "滴水声", category: "界面交互", author: "PieKing1215", desc: "水滴粒子落下时会发出声音，下雨天更有感。" },
      { name: "Drippy Loading Screen",              orig: "自定义游戏加载界面", category: "界面交互", author: "Keksuccino", desc: "自定义游戏加载界面的画面和文字。" },
      { name: "Durability Tooltip",                 orig: "耐久提示", category: "界面交互", author: "SuperMartijn642", desc: "直接显示装备还剩多少耐久。" },
      { name: "E33Chat",                            category: "界面交互", author: "E33EPUS", desc: "把原版聊天框做成聊天软件：消息卡片、未读红点、私聊、侧边栏与记录搜索。" },
      { name: "EnchantmentDescriptions",            orig: "附魔描述", category: "界面交互", author: "Darkhax", desc: "在附魔的提示里写明它到底有什么用。" },
      { name: "FancyMenu",                          orig: "精美菜单", category: "界面交互", author: "Keksuccino", desc: "主菜单和界面随便改，做整合包封面很顺手。" },
      { name: "FancyToasts",                        orig: "精美提示", category: "界面交互", author: "Bivrik", desc: "把老式的成就弹窗换成更好看的样式。" },
      { name: "FlickerFix",                         orig: "闪烁修复", category: "界面交互", desc: "夜视效果快结束时画面不再闪烁。" },
      { name: "Immersive Melodies",                 orig: "沉浸旋律", category: "界面交互", author: "Luke100000", desc: "能拿各种乐器弹曲子，联机时表演给朋友听。" },
      { name: "ItemPhysic",                         orig: "物品物理掉落", category: "界面交互", author: "CreativeMD", desc: "掉在地上的物品会转、会躺平，物理感更真实。" },
      { name: "Jade",                               orig: "玉石信息显示", category: "界面交互", author: "Snownee", desc: "准星指哪就显示那个方块/生物的信息。" },
      { name: "Jade Addons",                        orig: "玉石附加", category: "界面交互", author: "Snownee", desc: "让玉石能显示更多模组方块的信息。" },
      { name: "Just Enough Characters",             orig: "角色百科", category: "界面交互", author: "Towdium, yzl210, Death-123, vfyjxf_", desc: "让 JEI 支持拼音搜索，找物品更快。" },
      { name: "Just Enough Effects Descriptions",   orig: "效果百科", category: "界面交互", author: "MehVahdJukaar", desc: "查物品时能直接看到药水效果的说明。" },
      { name: "Just Enough Immersive Multiblocks",  orig: "JEI多方块结构", category: "界面交互", author: "sguest", desc: "在 JEI 里就能查沉浸工程多方块怎么搭。" },
      { name: "Just Enough Items",                  orig: "JEI物品管理器", category: "界面交互", author: "mezz", desc: "查合成表、查用途，玩模组必备。" },
      { name: "LookInMyEyes",                       orig: "看着我的眼睛", category: "界面交互", author: "Kall", desc: "跟眼睛有关的模组，具体表现看游戏里。" },
      { name: "Mouse Tweaks",                       orig: "鼠标调整", category: "界面交互", author: "Ivan Molodetskikh (YaLTeR)", desc: "鼠标拖拽整理背包，效率翻倍。" },
      { name: "Net Music Mod",                      orig: "网络音乐机", category: "界面交互", author: "TartaricAcid, IMG, 郝南村, 琥珀酸, 帕金伊, SQwatermark", desc: "在游戏里放网络音乐，边玩边听歌。" },
      { name: "Particular Reforged",                orig: "粒子重制", category: "界面交互", author: "Leclowndu93150", desc: "一堆手绘风格的粒子和环境特效，氛围更好。" },
      { name: "Punchy",                             orig: "击退", category: "界面交互", author: "Punchy", desc: "重做第一人称的手部动画，挥砍挖矿更有手感。" },
      { name: "Raw's Visual Keybinder",             orig: "可视化按键绑定", category: "界面交互", author: "rawlxxxviii", desc: "把键盘鼠标画出来，一眼看清按键冲突。" },
      { name: "Shoulder Surfing Reloaded",          orig: "越肩视角重制", category: "界面交互", author: "Exopandora", desc: "高度可配置的越肩第三人称视角。" },
      { name: "Tab Stats",                          orig: "Tab统计", category: "界面交互", author: "black_dog20", desc: "在玩家列表里显示在线时长等统计数据。" },
      { name: "TFC Support Indicator",              orig: "群峦支撑指示器", category: "界面交互", author: "Flowey", desc: "在 Jade 提示里显示方块有没有横梁支撑。" },
      { name: "TFC Vessel Tooltip",                 orig: "群峦容器提示", category: "界面交互", author: "HermitOwO", desc: "鼠标悬停就能看到群峦容器里装了什么。" },
      { name: "Tooltip Overhaul",                   orig: "提示框大修", category: "界面交互", author: "Xylonity, ModderG", desc: "把物品提示框重新排版，更现代更清楚。" },
      { name: "Visual Workbench",                   orig: "可视化工作台", category: "界面交互", author: "Fuzs", desc: "合成后材料留在台面上，摆的东西也能看见。" },
      { name: "Wakes",                              orig: "水面尾迹", category: "界面交互", author: "Leclowndu93150", desc: "船开过水面会留下尾迹，水面看着真实不少。" },
      { name: "Xaero's Minimap",                    orig: "Xaero小地图", category: "界面交互", author: "xaero96", desc: "小地图与路径点，探索和找家全靠它。" },
      { name: "Xaero's World Map",                  orig: "Xaero世界地图", category: "界面交互", author: "xaero96", desc: "边走边自动画的全屏大地图，小地图的好搭档。" },
      { name: "YDM's Weapon Master",                orig: "YDM的武器大师", category: "界面交互", author: "YourDailyModder", desc: "把快捷栏物品挂在角色身上显示，盾牌背包各有位置。" },
      { name: "Yukami Sophisticated Backpack Tab",  orig: "背包标签", category: "界面交互", author: "Yukami", desc: "在物品栏里加一页背包，开背包更方便。" },

      /* --- 科技 --- */
      { name: "Applied Energistics 2",              orig: "应用能源2", category: "科技", desc: "数字化存储与自动合成，中后期仓储核心。" },
      { name: "Create",                             orig: "机械动力", category: "科技", author: "simibubi", desc: "用齿轮、传送带和蒸汽搭出会动的机械。" },
      { name: "Create Bits 'n' Bobs",               orig: "机械动力：零碎", category: "科技", author: "Cake, Kipti, NormalGuy, Astral, Spydnel", desc: "机械动力的装饰和机械小补充，零碎但都挺实用。" },
      { name: "Create Encased",                     orig: "机械动力：封装工艺", category: "科技", author: "iglee42", desc: "给机械动力的机器加上封装外壳，工厂看着更整齐。" },
      { name: "Create Enchantment Industry",        orig: "机械动力：附魔工业", category: "科技", author: "MarbleGateKeeper & LimonBlaze", desc: "配合机械动力做自动附魔，附魔也能流水线化。" },
      { name: "Create FluidLogistics",              orig: "机械动力：流体包裹", category: "科技", author: "Yision", desc: "给机械动力加了流体包裹运输，液体也能走物流。" },
      { name: "Create Hypertube",                   orig: "机械动力：超管道", category: "科技", author: "Rok", desc: "加了条超导管道，能在里面加速滑行赶路。" },
      { name: "Create Picky Wheels",                orig: "机械动力：挑剔车轮", category: "科技", author: "zeh", desc: "让水车必须挨着大片水域、看群系才能转，更讲究选址。" },
      { name: "Create Prismatic Shine",             orig: "机械动力：棱镜光泽", category: "科技", author: "adonis", desc: "强化机械动力的流体运输和加工，管道玩法更丰富。" },
      { name: "Create Utilities",                   orig: "机械动力：实用工具", category: "科技", author: "Duquee_", desc: "给机械动力补上一批实用工具和小装置。" },
      { name: "Create: Compatible Storage",         orig: "机械动力：兼容存储", category: "科技", author: "Dadamalda", desc: "让各种模组的箱子容器能装在机械动力装置上一起动。" },
      { name: "Create: Connected",                  orig: "机械动力：连接", category: "科技", author: "Lysine", desc: "补上机械动力里本该有的那些顺手方块。" },
      { name: "Create: Diesel Generators",          orig: "机械动力：柴油动力", category: "科技", author: "George VI", desc: "加了柴油发电机、原油和化工玩意，工厂能烧油发电。" },
      { name: "Create: Metallurgy",                 orig: "机械动力：冶金", category: "科技", author: "Luc_Creeper74", desc: "扩展矿石加工链，加了冶金设备和一整套自动化流程。" },
      { name: "Create: Steam 'n' Rails",            orig: "机械动力：汽鸣铁道", category: "科技", author: "The Railways Team", desc: "扩展机械动力的铁路和蒸汽系统，火车能玩出更多花样。" },
      { name: "Create: Vintage Improvements",       orig: "机械动力：复古改进", category: "科技", author: "Negodya1", desc: "带点复古风味的机械动力扩展，多了不少实用机器。" },
      { name: "Create:Entity Control",              orig: "机械动力：实体控制", category: "科技", author: "Pink_Cats", desc: "给移动装置加了更多参数，能避免一些穿模和卡住的毛病。" },
      { name: "Firma: Civilization",                orig: "群峦-航海文明", category: "科技", author: "alekiponi", desc: "给群峦传说补上发展文明所需的技术内容。" },
      { name: "Immersive Engineering",              orig: "沉浸工程", category: "科技", author: "BluSunrize and Damien A.W. Hazard", desc: "重型工业风的多方块结构，视觉表现极佳。" },
      { name: "Immersive_Aircraft_Modernization",   category: "科技", author: "交错次元", desc: "给沉浸式飞机加超频导航模块，能编航线自动飞。" },
      { name: "Liquid Fuels",                       orig: "液体燃料", category: "科技", author: "交错次元", desc: "把各种流体当燃料烧，还有三种油桶随身带。" },
      { name: "More Create Burners",                orig: "更多燃烧器", category: "科技", author: "Dragon Egg", desc: "给机械动力加了更多燃烧器，能用各种能源替代烈焰燃烧器。" },
      { name: "Multiblocked2",                      orig: "多方块机器2", category: "科技", author: "KilaBash", desc: "用来定义和搭建大型多方块机器结构。" },
      { name: "Petrol's Parts",                     orig: "零件", category: "科技", author: "petrolpark", desc: "给机械动力补上一批新奇的动力零件和传动装置。" },
      { name: "TFC + IE Crossover",                 orig: "群峦沉浸工程交叉", category: "科技", author: "NMagpie and maintained by HermitOwO", desc: "让群峦和沉浸工程的机器、材料互相兼容。" },
      { name: "TFC Artisanal",                      orig: "群峦工艺", category: "科技", author: "MrHiTech", desc: "给群峦加上一整套化学工艺流程。" },
      { name: "TFC Casting with Channels",          orig: "群峦通道铸造", category: "科技", author: "lJuanGB, Uncandango", desc: "用通道把坩埚里的金属液引出来铸造。" },
      { name: "TFC Modern Life",                    orig: "群峦现代化生活", category: "科技", author: "交错次元", desc: "给群峦后期加了电烤箱、温室空调和冷库。" },
      { name: "Tfc-Freezer",                        orig: "群峦冰箱", category: "科技", author: "10MeV", desc: "给群峦加个冷藏柜，食物能保存得更久。" },
      { name: "Wooden Cog: Wildfire",               category: "科技", author: "Baldus_Maximus, DeltaAnto", desc: "用机械动力自动化群峦的合金、熔炼和加工流程。" },

      /* --- 魔法 --- */
      { name: "Eidolon:Repraised",                  orig: "死灵术：重赞", category: "魔法", author: "elucent up to 0.3.0, currently maintained by Alexthw", desc: "有点阴森的死灵魔法模组，能召亡灵也会点神圣法术。" },
      { name: "EnchantingWithTFC",                  orig: "群峦附魔", category: "魔法", author: "Mrthomas20121", desc: "重新开放附魔台，并加入群峦专属附魔。" },
      { name: "Iron's Spells 'n Spellbooks",        orig: "Iron的法术与魔法书", category: "魔法", author: "Iron431, Lab3", desc: "经典 RPG 那味的法术与魔法书，学法术丢火球。" },

      /* --- 冒险探索 --- */
      { name: "Ad Astra",                           orig: "星际探索", category: "冒险探索", author: "Alex Nijjar", desc: "造火箭飞向月球火星，建空间站还能在别的星球安家。" },
      { name: "Adds medieval siege machines",       orig: "攻城机器", category: "冒险探索", author: "Magistu", desc: "加入中世纪的攻城器械，能造出来打仗。" },
      { name: "Ageing Spawners",                    orig: "刷怪笼老化", category: "冒险探索", author: "Mrbysco, ShyNieke", desc: "刷怪笼有使用次数上限，刷够就报废。" },
      { name: "aleki's Nifty Ships",                orig: "精巧船只", category: "冒险探索", author: "alekiponi", desc: "能真正开起来的船，船上有甲板、箱子和炮。" },
      { name: "Alex's Caves",                       orig: "的洞穴", category: "冒险探索", author: "Alexthe668, Noonyeyz", desc: "在地下藏了一批稀有洞穴群系和专属生物。" },
      { name: "Alex's Mobs",                        orig: "的生物", category: "冒险探索", author: "Alexthe668, Carro1001, Paint_Ninja", desc: "往世界里塞了一大堆造型漂亮、行为有趣的生物。" },
      { name: "Alex's Mobs Interaction",            orig: "生物交互", category: "冒险探索", author: "The Crimson,Reimainder,Drullkus", desc: "给 Alex 的生物加了更多互动和行为。" },
      { name: "Better Combat",                      orig: "更好战斗", category: "冒险探索", author: "Daedelus", desc: "把地下城的战斗手感搬进来，挥砍动作又帅又爽。" },
      { name: "Better Mob Combat",                  orig: "更好怪物战斗", category: "冒险探索", author: "Thelnfamous1", desc: "让更好战斗那套挥砍手感也能用在人形怪物身上。" },
      { name: "Born in Chaos",                      orig: "混沌而生", category: "冒险探索", author: "Mongoose_artist, MCreator", desc: "加了一堆性格各异的敌对怪物，生存更难。" },
      { name: "Call of Yucatán",                    orig: "尤卡坦的呼唤", category: "冒险探索", author: "Furti_Two, Sweetygamer", desc: "丛林里多了两座玛雅风地牢，有机关和神明。" },
      { name: "Dungeons and Taverns Pillager Outpost Rework", orig: "地下城与酒馆：前哨重制", category: "冒险探索", author: "NovaWostra", desc: "把掠夺者前哨站整个翻新，变成像样的据点。" },
      { name: "Field Guide",                        orig: "记录者手册", category: "冒险探索", author: "Evan, Kobber", desc: "用望远镜观察动植物，记进自己的图鉴。" },
      { name: "Illager Invasion",                   orig: "灾厄村民入侵", category: "冒险探索", author: "Dricky, Safro, Zeckemith, Fuzs", desc: "灾厄村民卷土重来，多了好几种新敌人要打。" },
      { name: "Illagers Wear Armor",                orig: "灾厄村民穿盔甲", category: "冒险探索", author: "TallestEgg", desc: "灾厄村民会穿上盔甲，打起来更费劲。" },
      { name: "Immersive Aircraft",                 orig: "沉浸飞机", category: "冒险探索", author: "Luke100000", desc: "做几架朴实的飞机和飞艇，用来赶路运货到处逛。" },
      { name: "It Takes A Pillage",                 orig: "掠夺者来袭", category: "冒险探索", author: "izofar", desc: "扩充掠夺者阵营的内容，让它们更像一个文明。" },
      { name: "Legendary Survival Overhaul",        orig: "传说生存", category: "冒险探索", author: "Sfiomn", desc: "给生存加上口渴、体温这些硬核设定，难度自调。" },
      { name: "Majrusz's Progressive Difficulty Continued", category: "冒险探索", author: "Majrusz (original creator), Draupnir (maintainer)", desc: "随着游戏进程慢慢提高难度，怪物会越来越难缠。" },
      { name: "Mobs Use Shields",                   orig: "怪物使用盾牌", category: "冒险探索", author: "vomiter", desc: "怪物也会举盾格挡，打起来更费劲了。" },
      { name: "More Attributes",                    category: "冒险探索", author: "Mantodea, Jason", desc: "给群峦传说补上更多属性，数值定制的空间更大。" },
      { name: "Naturalist",                         orig: "自然主义", category: "冒险探索", author: "Starfish Studios", desc: "给主世界增添许多习性各异的野生动物。" },
      { name: "Scorched Guns",                      orig: "焦土枪械", category: "冒险探索", author: "ribs", desc: "一套能自己造枪和子弹的枪械模组。" },
      { name: "Shield Expansion",                   orig: "盾牌扩展", category: "冒险探索", author: "Infernal Studios", desc: "给盾牌分了等级，还能格挡弹反敌人攻击。" },
      { name: "Spartan Weaponry",                   orig: "斯巴达的武器", category: "冒险探索", author: "ObliviousSpartan", desc: "一大堆新武器，剑、长矛、匕首样样都有。" },
      { name: "Spawn",                              orig: "海洋生物", category: "冒险探索", author: "Ninni", desc: "往世界里加了不少有脾气的野生动物，生态更热闹。" },
      { name: "Survivors Arsenal: Essentials",      category: "冒险探索", author: "ogaba, titammods", desc: "求生兵工厂的核心模块，主打战斗和生存玩法。" },
      { name: "TerraFirmaCraft",                    orig: "群峦传说", category: "冒险探索", author: "AlcatrazEscapee", desc: "把生存推倒重来的硬核模组，一切从打石头开始。" },
      { name: "TerraFirmaEarth",                    category: "冒险探索", author: "交错次元", desc: "给群峦传说加了一百多种地形、真实季节和溪流。" },
      { name: "TFE structures",                     orig: "群峦地球结构", category: "冒险探索", author: "交错次元", desc: "让生成的建筑改用当地岩石和木材，更贴合群峦环境。" },
      { name: "Valhelsia Structures",               orig: "Valhelsia结构", category: "冒险探索", author: "Valhelsia Team", desc: "往野外生成废弃建筑和地牢，探索时有东西可逛。" },
      { name: "Wildfires",                          category: "冒险探索", author: "FirstSight", desc: "野火主题的内容模组，给群峦世界添了些新变化。" },

      /* --- 建筑农业 --- */
      { name: "[Let's Do] Bakery",                  orig: "馥郁烘焙", category: "建筑农业", author: "Satisfy", desc: "开一家自己的烘焙坊，烤面包、蛋糕和各式点心。" },
      { name: "[Let's Do] Farm & Charm",            orig: "沉浸农艺", category: "建筑农业", author: "satisfy, jason13", desc: "加了磨肉机、炖锅和新谷物，种田做饭一条龙。" },
      { name: "[Let's Do] TFC Farm Charm",          orig: "群峦农场魅力", category: "建筑农业", author: "Vvxzv, Y_Xiao233, witzig_heidi, awhites, Hanabi_Ren", desc: "把 Let's Do 的农场玩法和装饰搬进群峦。" },
      { name: "ArborFirmaCraft",                    orig: "林海物语", category: "建筑农业", author: "Therighthon", desc: "群峦传说的树木扩展，加了好几种新树和配套木料。" },
      { name: "AstikorCarts Redux",                 orig: "马车", category: "建筑农业", author: "MennoMax, pau101, talhanation, jusipat", desc: "加了能被马或玩家拖着走的马车，运货方便多了。" },
      { name: "Brewin' And Chewin'",                orig: "饮酒作乐", category: "建筑农业", author: "Probleyes, Umpaz, MerchantPug", desc: "给农夫乐事加上发酵玩法，能酿酒、做奶酪和腌菜。" },
      { name: "Building But Better",                orig: "更好建筑", category: "建筑农业", author: "Starfish Studios", desc: "新增一批可自定义的建筑方块，柱子栏杆层板之间还能互相连接。" },
      { name: "Carpeted",                           orig: "地毯", category: "建筑农业", author: "MehVahdJukaar", desc: "给地毯加上楼梯和台阶，铺出层次感。" },
      { name: "CFM Refurbished: Watt About Power?", orig: "家具：电力", category: "建筑农业", author: "Tr3yMix", desc: "用别的模组的电，给家具的电路供上电。" },
      { name: "Construction Wand",                  orig: "建筑魔杖", category: "建筑农业", author: "ThetaDev", desc: "一次放一整排方块，最多能铺一千多个。" },
      { name: "Create Deco",                        orig: "机械动力：装饰", category: "建筑农业", author: "Kayla, Talrey, Ordana, Cassian", desc: "给机械动力工厂添一批装饰方块，工业风装修够用了。" },
      { name: "Create: Copycats+",                  orig: "机械动力：模仿方块", category: "建筑农业", author: "Lysine, Bennyboy1695, Redcat_XVIII", desc: "一个模组收齐各种模仿方块，想伪装成什么材质都行。" },
      { name: "Diagonal Fences",                    orig: "对角栅栏", category: "建筑农业", author: "Fuzs, XFactHD", desc: "让栅栏可以斜着连，围墙转角更自然。" },
      { name: "Every Compat",                       orig: "木材兼容", category: "建筑农业", author: "MehVahdJukaar", desc: "统一各模组的木材，自动补齐台阶、栅栏这些木制方块。" },
      { name: "Farmer's Delight",                   orig: "农夫乐事", category: "建筑农业", author: "vectorwing", desc: "新增大量食材、厨具与料理。" },
      { name: "Firmalife",                          orig: "群峦生活", category: "建筑农业", author: "EERussianguy, Indi, Peffern, Lumintorious", desc: "群峦的农业生活扩展，有温室、酿酒和奶酪。" },
      { name: "Handcrafted",                        orig: "手工装饰", category: "建筑农业", author: "Alex Nijjar, Kekie6", desc: "加了一堆精致的手工家具，摆家里很好看。" },
      { name: "Icy's Better Horses",                category: "建筑农业", author: "Icy", desc: "十五个马品种、五大类别，带繁殖遗传、马具与马上战斗。" },
      { name: "Immersive Paintings",                orig: "沉浸绘画", category: "建筑农业", author: "Luke100000", desc: "可以把自己的图片挂进游戏当画，大小随意调整。" },
      { name: "Kaleidoscope Cookery",               orig: "森罗物语：烹饪", category: "建筑农业", author: "ysbbbbbb, tartaric_acid, Azumic", desc: "加了一整套下厨系统，切菜炒锅做菜都有模有样。" },
      { name: "Kaleidoscope Tavern",                orig: "森罗酒馆", category: "建筑农业", author: "ysbbbbbb, tartaric_acid", desc: "森罗物语系列的补充，围绕酒馆吃喝加了不少内容。" },
      { name: "Kaleidoscope TFC Cookery",           orig: "万花筒群峦烹饪", category: "建筑农业", author: "Vvxzv, witzig_heidi, Hanabi_Ren", desc: "把万花筒烹饪的菜谱和厨具搬进群峦传说。" },
      { name: "kaleidoscopeTFCTavern",              orig: "群峦森罗酒馆", category: "建筑农业", desc: "给群峦添上酒馆风格的饮食和装饰。" },
      { name: "MrCrayfish's Furniture Mod: Refurbished", orig: "家具重制", category: "建筑农业", author: "MrCrayfish", desc: "几百件家具和装饰，还能给家里通电。" },
      { name: "Structure Expansion",                orig: "结构扩展", category: "建筑农业", author: "Sunekaer, LatvianModder", desc: "把结构方块的体积上限提高，方便搭大型建筑。" },
      { name: "Supplementaries",                    orig: "锦致装饰", category: "建筑农业", author: "MehVahdJukaar, Plantkillable", desc: "一堆原版风格的小物件与装饰。" },
      { name: "Survivor's Arsenal: Loot & Decor",   category: "建筑农业", author: "Ogaba, titammods", desc: "求生兵工厂的装饰模块，添了一批装饰和战利品。" },
      { name: "Survivor's Delight",                 orig: "生存者乐事", category: "建筑农业", author: "vomiter", desc: "农夫乐事的料理搬进群峦，能吃上热乎饭。" },
      { name: "Survivor's Rich Soils",              orig: "生存者乐事-肥沃土壤", category: "建筑农业", author: "vomiter", desc: "让乐事的堆肥和沃土也带上群峦的土壤等级。" },
      { name: "Terra's horsies [TFC x icy's horses]", category: "建筑农业", desc: "让群峦的马匹能用上 Icy 马的驯养和装备系统。" },
      { name: "TFC Astikor Carts",                  orig: "群峦马车", category: "建筑农业", author: "MennoMax, pau101, Verph", desc: "给群峦加上能载人拉货的马车。" },
      { name: "TFC: Grooming Station",              orig: "群峦喂食槽", category: "建筑农业", author: "LobsterJonn", desc: "自动照料牲畜，省下时间去做别的事。" },
      { name: "Trotting Wagons",                    orig: "小跑马车", category: "建筑农业", author: "Favouriteless, AbstractPortrait", desc: "给马配上马车，可以载人也能拉货。" },
      { name: "Valhelsia Furniture",                orig: "Valhelsia家具", category: "建筑农业", desc: "一堆风格统一的桌椅柜子，装修房子用得上。" },

      /* --- 辅助便利 --- */
      { name: "AllTheMafuyu",                       orig: "真冬的小东西", category: "辅助便利", author: "Mafuyu404", desc: "和真冬有关的模组，加了一堆相关小内容。" },
      { name: "Barrels 2012",                       orig: "木桶2012", category: "辅助便利", author: "EERussianguy", desc: "群峦传说的木桶扩展，多了几种桶用来存放和加工东西。" },
      { name: "Better Mob Combat Fix",              orig: "怪物战斗修复", category: "辅助便利", author: "UtherHel", desc: "修好怪物战斗模组的兼容问题，攻击动作回来了。" },
      { name: "Block Runner",                       orig: "方块奔跑者", category: "辅助便利", author: "Fuzs", desc: "走在土径上会跑得更快，鼓励你修路。" },
      { name: "Carry On",                           orig: "随身携带", category: "辅助便利", author: "Tschipp, Purplicious_Cow, cy4n", desc: "空手就能搬起箱子、熔炉这类方块。" },
      { name: "Certain Questing Additions",         orig: "任务拓展补充", category: "辅助便利", author: "HollowHorizon", desc: "给 FTB 任务界面做了一批视觉上的美化。" },
      { name: "Client Tweaks",                      orig: "客户端调整", category: "辅助便利", author: "BlayTheNinth", desc: "一堆客户端小调整，用起来顺手不少。" },
      { name: "Corpse",                             orig: "尸体", category: "辅助便利", author: "Max Henkel", desc: "死了之后尸体留在原地，装备都在里面。" },
      { name: "Custom Villager Trades",             orig: "自定义村民交易", category: "辅助便利", author: "SpaceCat97", desc: "用配置文件给村民自定义买卖项目。" },
      { name: "Default Key Setup",                  orig: "默认按键配置", category: "辅助便利", author: "Giant_Salted_Fish", desc: "让整合包能预设默认按键，进游戏就是顺手的键位。" },
      { name: "DespawnTweaker",                     orig: "消失调整", category: "辅助便利", author: "TeamPotato", desc: "可以自己调怪物消失的规则，服务器管理更灵活。" },
      { name: "Easy Anvils",                        orig: "简易铁砧", category: "辅助便利", author: "Fuzs", desc: "铁砧不用再捡东西，命名和操作也更顺手。" },
      { name: "Easy Magic",                         orig: "简易附魔台", category: "辅助便利", author: "Fuzs", desc: "附魔台关掉界面东西还在，还能方便地重摇。" },
      { name: "Exposure",                           orig: "相机", category: "辅助便利", author: "mortuusars", desc: "游戏里的相机，拍照、冲洗胶片一步步来。" },
      { name: "ExtraQuests [FTB Quests]",           orig: "额外任务", category: "辅助便利", author: "Vecoo", desc: "给 FTB 任务系统加上更多任务类型、奖励和功能。" },
      { name: "Farmer's Delight Offhand Cutting Board Interaction", orig: "副手切割", category: "辅助便利", author: "vomiter", desc: "让农夫乐事的砧板也能用副手来操作。" },
      { name: "FTB Quests",                         orig: "FTB任务", category: "辅助便利", author: "FTB Team", desc: "整合包内置任务线，给新手一个方向。" },
      { name: "FTB Quests Precision Localizer",     orig: "FTB任务精准定位", category: "辅助便利", author: "Tim Ermolt", desc: "把 FTB 任务导出成语言文件，方便做汉化。" },
      { name: "Functional Storage",                 orig: "功能存储", category: "辅助便利", author: "Buuz135, Rid", desc: "摆一墙抽屉囤物资，同一格能堆很多同类物品。" },
      { name: "IMBlocker",                          orig: "IM屏蔽器", category: "辅助便利", author: "reserveword, LitnhJacuzzi", desc: "不聊天的时候自动关掉输入法，避免误触打字。" },
      { name: "JEI Copy Recipe Json",               orig: "JEI配方复制", category: "辅助便利", author: "_yi_ran_", desc: "一键复制配方的 JSON，写数据包时省事。" },
      { name: "Kaleidoscope Compat",                orig: "森罗物语：兼容", category: "辅助便利", author: "BmtUltra", desc: "把森罗物语系列的物品统一起来，避免重复和冲突。" },
      { name: "Let Me Feed You!",                   orig: "吃取送食／玩家喂食", category: "辅助便利", author: "Rinko1231", desc: "可以直接把食物喂给旁边的小伙伴。" },
      { name: "Lootr",                              orig: "战利品箱", category: "辅助便利", author: "Noobanidus", desc: "箱子里的战利品按人头算，人人都能拿一份。" },
      { name: "Map Atlases",                        orig: "地图册", category: "辅助便利", author: "MehVahdJukaar, Pepperoni__Jabroni__", desc: "把原版地图订成册子，走到哪画到哪。" },
      { name: "MmmMmmMmmmmm",                       orig: "试验假人", category: "辅助便利", author: "MehVahdJukaar, Bonusboni", desc: "可以对着打来测伤害的试验假人。" },
      { name: "NaNHealthFixer",                     orig: "NaN血量修复", category: "辅助便利", author: "TeamPotato", desc: "修掉实体血量变成 NaN 的 bug，免得打不死怪。" },
      { name: "Night Config Fixes",                 orig: "夜间配置修复", category: "辅助便利", author: "Fuzs", desc: "修掉配置库的一些老毛病，少崩几次。" },
      { name: "OneEnoughEnchantment",               orig: "OEE", category: "辅助便利", author: "MerrySnow", desc: "可以调附魔出现权重，也能直接把某个附魔删掉。" },
      { name: "OneEnoughItem",                      orig: "一个足够的物品", category: "辅助便利", author: "Mafuyu404", desc: "把好几种银、好几种铅这类重复物品统一成一种。" },
      { name: "ParCool!",                           orig: "跑酷！", category: "辅助便利", author: "alRex_U", desc: "能翻滚、蹬墙、翻越的跑酷动作模组。" },
      { name: "ParCool+ / Compatibility Addon",     orig: "跑酷兼容附加", category: "辅助便利", desc: "让跑酷的动作和其他模组不打架。" },
      { name: "PlayerRevive",                       orig: "玩家复活", category: "辅助便利", author: "CreativeMD", desc: "联机时队友倒地没死，可以过去把他扶起来。" },
      { name: "Polymorph",                          orig: "多态合成", category: "辅助便利", author: "Illusive Soulworks", desc: "合成配方冲突时，让你自己挑要哪个产物。" },
      { name: "Ponderer",                           orig: "思索者", category: "辅助便利", author: "Nobodiiiii", desc: "在游戏里直接搭和编辑思索教程场景。" },
      { name: "Quest Enhance",                      orig: "任务增强", category: "辅助便利", author: "hp", desc: "让 FTB 任务编辑能贴图、放视频、显示实体模型。" },
      { name: "Recycling Arrows",                   orig: "回收箭矢", category: "辅助便利", author: "vomiter", desc: "箭会插在怪身上，打死之后还能捡回来。" },
      { name: "Sacks 'N Such: Wildfire",            category: "辅助便利", author: "框框", desc: "群峦的随身口袋，打开时能在背包下方直接看内容。" },
      { name: "Simple Voice Chat",                  orig: "简单的语音聊天", category: "辅助便利", author: "Max Henkel", desc: "游戏里能开麦说话，离得近才听得见的语音。" },
      { name: "SimplyTentsBlackList",               orig: "简易帐篷黑名单", category: "辅助便利", author: "Shinonome Shakusora", desc: "给简易帐篷加黑名单，能禁掉某些地方搭帐篷。" },
      { name: "SimplyTentsREMASTER",                orig: "简易帐篷", category: "辅助便利", author: "SappyEddie", desc: "带几顶能随身带走和搭起来的帐篷。" },
      { name: "Sodium Dynamic Lights",              orig: "钠动态光源", category: "辅助便利", author: "toni, LambdAurora", desc: "举着火把就能照亮周围，兼容钠。" },
      { name: "Sophisticated Backpacks",            orig: "精妙背包", category: "辅助便利", desc: "可升级的背包，能接自动化。" },
      { name: "Sophisticated Item Actions",         orig: "精妙物品操作", category: "辅助便利", desc: "高亮存着某样东西的箱子，还能一键存取。" },
      { name: "SophisticatedSorter",                orig: "精妙分类器", category: "辅助便利", author: "MerrySnow", desc: "把精妙系列的整理搜索功能搬到所有容器上。" },
      { name: "Starter Structure",                  orig: "初始结构", category: "辅助便利", author: "Rick South", desc: "开新世界时在出生点自动生成指定的建筑。" },
      { name: "Structurify",                        orig: "结构调整", category: "辅助便利", author: "Faboslav", desc: "不用写数据包，就能调世界生成的结构。" },
      { name: "Survivor's Abilities",               orig: "生存者能力", category: "辅助便利", author: "vomiter", desc: "给群峦的生存加了新的能力玩法。" },
      { name: "TFC Canes",                          orig: "群峦手杖", category: "辅助便利", author: "redstoneguy10ls", desc: "给群峦加了能拄着走的手杖。" },
      { name: "TFC Scraping Knives",                orig: "群峦刮刀", category: "辅助便利", author: "redstoneguy10ls", desc: "给群峦添了几把新刮刀，处理兽皮更省事。" },
      { name: "TFC Super Hammer",                   orig: "群峦超级锤", category: "辅助便利", author: "Vvxzv", desc: "一次能挖一大片的超级锤和超级铲。" },
      { name: "TFC Textile",                        orig: "群峦-衣物", category: "辅助便利", author: "Atoba Azul, Albatross Feroz", desc: "给群峦的低温生存加了更多衣服选择。" },
      { name: "TFC Water Flasks",                   orig: "群峦水瓶", category: "辅助便利", author: "Gaelmare", desc: "装水的皮革水袋，出门探索不用老跑河边。" },
      { name: "TFCivilization Atlases",             orig: "群峦文明地图集", category: "辅助便利", author: "Yannik, MCreator", desc: "能随身携带、记录探索路线的地图册。" },
      { name: "Timber Tales",                       category: "辅助便利", author: "Pichau", desc: "砍树时整棵树会分段倒下，还能收集掉落的木片。" },
      { name: "WornTear",                           orig: "磨损泪滴", category: "辅助便利", author: "Mafuyu404", desc: "同样是真冬系列的小模组，内容不多。" },
      { name: "Yeetus Experimentus",                orig: "实验删除", category: "辅助便利", author: "Sunekaer", desc: "去掉创建世界时那个实验性设置的弹窗。" },

      /* --- 前置库 --- */
      { name: "[Let's Do] API",                     orig: "Let's Do API", category: "前置库", author: "Cristelknight, BaumeisterJO", desc: "给 Let's Do 系列模组打底的公共前置。" },
      { name: "Architectury",                       orig: "架构API", category: "前置库", author: "shedaniel", desc: "给跨平台模组开发用的中间层公共接口。" },
      { name: "AttributeFix",                       orig: "属性修复", category: "前置库", author: "Darkhax", desc: "放宽属性数值上限，让属性堆得更高。" },
      { name: "Balm",                               orig: "药膏API", category: "前置库", author: "BlayTheNinth", desc: "给 Blay 的跨平台模组搭的一层抽象接口。" },
      { name: "Bookshelf",                          orig: "书架API", category: "前置库", author: "Darkhax", desc: "给各种模组打底的功能库，本身不加内容。" },
      { name: "BornInConfiguration",                orig: "混沌配置库", category: "前置库", author: "The Crimson", desc: "给混沌系列模组用的非官方配置库。" },
      { name: "Botarium",                           orig: "机器人API", category: "前置库", author: "CodexAdrian", desc: "让物品、流体和能量的跨平台传输更好写。" },
      { name: "Caelus API",                         orig: "天空API", category: "前置库", author: "C4", desc: "让模组能读写鞘翅飞行机制的底层接口。" },
      { name: "Citadel",                            orig: "城堡API", category: "前置库", author: "Alexthe666", desc: "Alex 的模组共用的代码库，主要管生物动画。" },
      { name: "Cloth Config v10 API",               orig: "布料配置", category: "前置库", desc: "给模组提供统一配置界面的公共接口。" },
      { name: "Collective",                         orig: "集合库", category: "前置库", author: "Rick South", desc: "Serilum 所有模组共用的公共代码库。" },
      { name: "Configured",                         orig: "配置界面", category: "前置库", author: "MrCrayfish", desc: "给几乎所有模组套上图形化配置界面。" },
      { name: "CreativeCore",                       orig: "创意核心", category: "前置库", author: "CreativeMD", desc: "一个简单但很强的核心库，不少模组要用。" },
      { name: "Cupboard utilities",                 orig: "橱柜工具库", category: "前置库", author: "Someaddon", desc: "给其他模组提供各种实用小工具的库。" },
      { name: "Curios API",                         orig: "饰品API", category: "前置库", author: "C4", desc: "饰品栏位扩展。" },
      { name: "EventJS",                            orig: "事件JS", category: "前置库", author: "Zank", desc: "给 KubeJS 提供可重载的事件监听能力。" },
      { name: "ExtraLib",                           orig: "额外库", category: "前置库", author: "Vecoo", desc: "给其他模组提供支持的额外前置库。" },
      { name: "Framework",                          orig: "框架API", category: "前置库", author: "MrCrayfish", desc: "MrCrayfish 出的库，给开发者提供各种工具。" },
      { name: "FTB Filter System",                  orig: "FTB过滤系统", category: "前置库", author: "FTB Team", desc: "一套可配置的物品过滤系统，带图形化设置界面。" },
      { name: "FTB Library",                        orig: "FTB库", category: "前置库", author: "FTB Team", desc: "FTB 系列模组共用的基础库，装它才能跑起来。" },
      { name: "FTB Teams",                          orig: "FTB队伍", category: "前置库", author: "FTB Team", desc: "创建自己的队伍，任务进度可以一起共享。" },
      { name: "FTB XMod Compat",                    orig: "FTB跨模组兼容", category: "前置库", author: "FTB Team", desc: "让 FTB 的模组和其他模组之间能互相联动。" },
      { name: "GeckoLib 4",                         orig: "动画API", category: "前置库", author: "Gecko, Eliot, AzureDoom, DerToaster, Tslat, Witixin", desc: "让模组里的生物和方块动起来的动画引擎。" },
      { name: "GuideME",                            orig: "指南", category: "前置库", desc: "给整合包做图文指南书的框架。" },
      { name: "hotai",                              orig: "布袋类替换", category: "前置库", author: "youyihj", desc: "方便整合包作者给别的模组打补丁。" },
      { name: "Iceberg",                            orig: "冰山API", category: "前置库", author: "Grend", desc: "提供事件和各种小工具的库，方便模组调用。" },
      { name: "Item Filters",                       orig: "物品过滤", category: "前置库", author: "LatvianModder", desc: "给其他模组的设备提供物品过滤条件。" },
      { name: "Jupiter",                            orig: "木星库", category: "前置库", author: "IAFEnvoy", desc: "功能很强的配置库，改的设置能自动同步。" },
      { name: "Kiwi Library",                       orig: "奇异果库", category: "前置库", author: "Snownee", desc: "Snownee 系列模组共用的功能支持库。" },
      { name: "Konkrete",                           orig: "混凝土GUI库", category: "前置库", author: "Keksuccino", desc: "主要给模组做界面和图形效果的库。" },
      { name: "kotlinforforge-4.12.0-all",          orig: "Kotlin支持", category: "前置库", desc: "让用 Kotlin 写的模组能在游戏里正常运行。" },
      { name: "KubeJS",                             category: "前置库", author: "LatvianModder", desc: "用 JavaScript 改配方改内容，整合包作者必备。" },
      { name: "KubeJS Addditions (Forge)",          orig: "脚本拓展", category: "前置库", author: "ILIKEPIEFOO2", desc: "给 KubeJS 脚本补上一堆常用功能。" },
      { name: "KubeJS Create",                      orig: "机械动力脚本", category: "前置库", author: "LatvianModder", desc: "让脚本能直接改机械动力的配方和机器，做整合包必备。" },
      { name: "KubeJS TFC",                         orig: "群峦-KJS", category: "前置库", author: "NotEnoughMail", desc: "让 KubeJS 脚本能改群峦的配方和机制。" },
      { name: "LowDragLib",                         orig: "LD库", category: "前置库", author: "KilaBash, WarmthDawn", desc: "给模组提供渲染、界面和粒子效果的库。" },
      { name: "Lychee Tweaker",                     orig: "荔枝", category: "前置库", author: "Snownee", desc: "用数据包定制方块交互和世界合成。" },
      { name: "Mbd2Thread",                         orig: "线程拓展", category: "前置库", author: "Non_coffee", desc: "给 Multiblocked2 的机器加上线程化配方处理。" },
      { name: "Melody",                             orig: "旋律库", category: "前置库", author: "Keksuccino", desc: "负责播放背景音乐的音频库，模组靠它出声。" },
      { name: "Mob Player Animator",                orig: "怪物玩家动画", category: "前置库", author: "Thelnfamous1", desc: "让玩家动作模组的动画也能用在人形怪物上。" },
      { name: "Moonlight Library",                  orig: "月光库", category: "前置库", author: "MehVahdJukaar", desc: "功能挺杂的小型库，动态资源和村民日程都管。" },
      { name: "MoreEventsJS",                       orig: "更多事件JS", category: "前置库", author: "Rain", desc: "给 KubeJS 脚本补上更多可用的游戏事件。" },
      { name: "MoreJS",                             orig: "更多脚本", category: "前置库", author: "AlmostReliable", desc: "给 KubeJS 补上一批额外脚本能力，改配方做整合包时用得上。" },
      { name: "NeuroLib",                           orig: "神经库", category: "前置库", author: "vomiter", desc: "用来调整生物目标和 AI 行为的库。" },
      { name: "OELib",                              orig: "One Enough库", category: "前置库", author: "Flechazo", desc: "为一些模组提供公共支持的库，装上就行。" },
      { name: "Patchouli",                          orig: "百科全书", category: "前置库", author: "Vazkii", desc: "游戏内说明书框架。" },
      { name: "Paxi",                               orig: "数据包加载器", category: "前置库", author: "YUNGNICKYOUNG", desc: "把数据包往里一拖就自动加载，很省事。" },
      { name: "Petrolpark's Library",               orig: "的库", category: "前置库", author: "petrolpark", desc: "Petrolpark 系列模组和机械附属的公共代码库。" },
      { name: "Placebo",                            orig: "安慰剂库", category: "前置库", desc: "一个纯打底的库，自己几乎没什么内容。" },
      { name: "Player Animator",                    orig: "玩家动画库", category: "前置库", author: "KosmX", desc: "让玩家模型能播放自定义动画的库。" },
      { name: "PonderJS",                           category: "前置库", author: "kotakotik22, AlmostReliable", desc: "让 KubeJS 脚本能创建机械动力的思索场景和标签。" },
      { name: "PowerfulJS",                         orig: "PJS", category: "前置库", author: "Prunoideae", desc: "给 KubeJS 补上 Capability 和 API 查询支持。" },
      { name: "Prism",                              orig: "棱镜", category: "前置库", author: "Grend", desc: "只提供颜色相关功能的库，给别的模组当依赖。" },
      { name: "Puzzles Lib",                        orig: "谜题库", category: "前置库", author: "Fuzs", desc: "Fuzs 做的模组都需要装上的公共库。" },
      { name: "Resourceful Lib",                    orig: "资源库", category: "前置库", author: "ThatGravyBoat, Epic_Oreo", desc: "Team Resourceful 系列模组的公共库。" },
      { name: "Resourcefulconfig",                  orig: "资源配置库", category: "前置库", desc: "帮开发者在多个平台创建配置文件的库。" },
      { name: "Rhino",                              orig: "犀牛JS引擎", category: "前置库", author: "latvian.dev, Mozilla", desc: "Mozilla 犀牛脚本引擎的改版，用来跑 JS。" },
      { name: "Searchables",                        orig: "可搜索库", category: "前置库", author: "Jaredlll08", desc: "帮模组加上带自动补全功能的搜索框。" },
      { name: "Sophisticated Core",                 orig: "精妙核心", category: "前置库", desc: "精妙背包等精妙系列模组的基础前置。" },
      { name: "SuperMartijn642's Config Library",   orig: "SM642配置库", category: "前置库", author: "SuperMartijn642", desc: "让模组的配置文件更好写、也更好改。" },
      { name: "Survivor's Arsenal: Lib",            category: "前置库", author: "ogaba, titammods", desc: "求生兵工厂系列模组共用的前置库，需要装它才能用。" },
      { name: "Titanium",                           orig: "钛库", category: "前置库", desc: "给热力系列等模组打底的通用前置库。" },
      { name: "Valhelsia Core",                     orig: "Valhelsia核心", category: "前置库", desc: "Valhelsia 系列模组共用的核心前置库。" },
      { name: "YetAnotherConfigLib",                orig: "又一个配置库", category: "前置库", author: "isXander", desc: "又一个配置库，专门给模组做设置界面。" },
      { name: "YUNG's API",                         category: "前置库", author: "YUNGNICKYOUNG", desc: "YUNG 那些结构模组都需要的公共前置。" }
    ]
  },

  /* ======================================================================
     四、安装教程
     ----------------------------------------------------------------------
     每一段是一张带编号的卡片，steps 数组里一条生成一个数字步骤。
     ====================================================================== */
  guide: {
    client: [
      {
        title: "安装 Java 21",
        body: [
          "野火需要 <b>64 位 Java 21</b>。<b>不要用 Java 17</b>——游戏能进，但跑起来会有一堆 bug。先确认你的系统是 64 位，再下载安装。",
          "推荐用 Adoptium（Eclipse Temurin）或 Azul Zulu 的 JDK 21；只装 JRE 也可以，但 JDK 更保险。",
          "装完在命令行输入 <code>java -version</code>，看到 <code>21.x.x</code> 就说明成功了。"
        ]
      },
      {
        title: "下载并安装启动器",
        body: [
          "推荐 <b>PCL2</b> 或 <b>HMCL</b>，两个都是免费的国产启动器，对整合包导入支持最好。",
          "把启动器解压到一个<b>路径不含中文和空格</b>的目录，例如 <code>D:\\MC\\PCL2</code>。",
          "首次打开启动器，先到「设置」里把 Java 路径指向刚才安装的 Java 21。"
        ]
      },
      {
        title: "导入整合包",
        body: [
          "把下载到的 <code>.zip</code> <b>不要解压</b>，直接拖进启动器窗口，或者用「版本列表 → 安装整合包」选择这个文件。",
          "等启动器解压并识别完成，版本列表里会出现「野火整合包 v0.3.8」。",
          "如果启动器提示「未找到 Forge」，先让它自动补全，或手动安装对应的 Forge 47.4.23。"
        ]
      },
      {
        title: "分配内存",
        body: [
          "在版本设置里把最大内存设为 <b>8192 MB（8 GB）</b>，这是野火的最低要求，再往下会明显卡顿。16G 内存的机器给 8G 就够，32G 的可以给到 10～12G。",
          "最小内存建议与最大内存一致，避免游戏中途反复回收内存导致卡顿。",
          "别忘了在「Java 参数」里保留启动器默认的 GC 参数，不要随手删。"
        ]
      },
      {
        title: "首次启动",
        body: [
          "第一次启动会生成配置、比较慢，通常需要 3～8 分钟，属正常现象，别急着关。",
          "进去后建议先按 <kbd>Esc</kbd> →「选项」调一下视距和图形，机器一般就调「流畅」。",
          "任务书在物品栏左上角（FTB Quests 的书本图标），不知道干嘛就跟着它走。"
        ]
      }
    ],
    server: [
      {
        title: "准备机器",
        body: [
          "建议配置：<b>4 核 CPU / 8G 内存 / 20G 以上 SSD 空间</b>，人越多要求越高。",
          "系统用 Windows Server 或 Linux（Ubuntu 22.04 最省事），Linux 开服更稳、更省资源。",
          "如果是云服务器，记得在安全组里放行 <b>TCP 25565</b> 端口。"
        ]
      },
      {
        title: "安装 Java 21",
        body: [
          "服务端和客户端必须用同一个大版本的 Java，同样装 Java 21。",
          "Linux 上可以用 <code>apt install openjdk-21-jre-headless</code>。"
        ]
      },
      {
        title: "解压并启动",
        body: [
          "把服务端压缩包解压到一个独立目录，Windows 双击 <code>start.bat</code>，Linux 执行 <code>./start.sh</code>。",
          "首次启动会生成世界并自动关闭一次，这是正常的：<b>先同意 EULA</b>。",
          "打开目录里的 <code>eula.txt</code>，把 <code>eula=false</code> 改成 <code>eula=true</code>，保存后重新启动。"
        ]
      },
      {
        title: "配置服务器",
        body: [
          "编辑 <code>server.properties</code>：<code>online-mode</code> 正版服保持 true，离线服改 false（盗版服请自行承担风险）。",
          "建议把 <code>view-distance</code> 调到 6～8，<code>simulation-distance</code> 调到 4～6，能省大量性能。",
          "在 <code>ops.json</code> 或控制台用 <code>op 你的ID</code> 给自己管理员权限。"
        ]
      },
      {
        title: "客户端连进来",
        body: [
          "确认服务端启动完成、控制台出现 <code>Done</code> 字样。",
          "客户端「多人游戏 → 添加服务器」，局域网填内网 IP，公网填服务器公网 IP。",
          "连不上先查三件事：端口有没有放行、防火墙有没有拦、客户端与服务端版本是否完全一致。"
        ]
      }
    ]
  },

  /* ======================================================================
     五、常见问题
     ----------------------------------------------------------------------
     a 字段里可以直接写 HTML，比如 <b>、<code>、<a href="...">。
     ====================================================================== */
  faq: [
    {
      q: "玩这个整合包需要买正版吗？",
      a: "整合包本身完全免费，正版和离线都能玩。但如果你要开<b>公开联机服</b>，建议使用正版验证，" +
         "否则容易被恶意玩家破坏存档。请尽量支持正版游戏。"
    },
    {
      q: "我的电脑需要什么配置？",
      a: "<b>最低</b>：4 核 CPU / 16G 内存（分配 8G）/ 有独显更佳，能跑但视距要调低。<br>" +
         "<b>推荐</b>：6 核以上 CPU / 32G 内存（分配 10～12G）/ GTX 1050 级别以上显卡，可以开中等光影。"
    },
    {
      q: "要装哪个版本的 Java？",
      a: "统一用 <b>Java 21（64 位）</b>。装成 32 位 Java 会直接提示内存不足；<b>装成 Java 17 能进游戏但会有一堆 bug</b>，Java 8 则直接版本不兼容。"
    },
    {
      q: "启动时闪退 / 崩溃，怎么办？",
      a: "按这个顺序排查：<br>" +
         "1. 看 <code>crash-reports</code> 文件夹里最新的报告，最后几行通常写明了是哪个模组。<br>" +
         "2. 确认 Java 是 21（<b>17 不行</b>）、内存分配在 8192MB（8 GB）以上、启动器路径没有中文。<br>" +
         "3. 把整合包完整删除重装一次 —— 一半以上的问题都是导入不完整导致的。<br>" +
         "4. 还不行就带着崩溃报告来 QQ 群问，光说「打不开」没人能帮上忙。"
    },
    {
      q: "进游戏卡顿、帧数很低怎么优化？",
      a: "先调游戏内设置：视距 8 以内、关闭平滑光照、关闭云、粒子调最少。<br>" +
         "再考虑关掉光影；如果装了 Iris，光影包换轻量款（如 Complementary Reimagined 的性能模式）。<br>" +
         "硬件确实吃紧的话，分配内存别超过物理内存的 60%，给太多反而更卡。"
    },
    {
      q: "能自己往整合包里加模组吗？",
      a: "可以，但请自负后果。加模组前建议<b>先备份存档</b>，并且只加与 MC 1.20.1 + Forge 版本匹配的模组，" +
         "同时注意补上它需要的前置库。加了模组之后进不了游戏，把新加的模组删掉通常就能恢复。"
    },
    {
      q: "为什么下载速度这么慢？",
      a: "网盘下载速度受网盘限速影响，人多的时候会慢，可以换个时间再试。" +
         "如果链接失效了，来群里说一声，我们会尽快补档。"
    },
    {
      q: "怎么确认下载的文件没有损坏？",
      a: "下载页写了 SHA1 的话就核对一下：Windows 上在文件所在目录打开 PowerShell，执行 " +
         "<code>Get-FileHash 文件名 -Algorithm SHA1</code>，结果和页面上一致的说明文件完整。" +
         "如果页面没提供校验值，就确认文件大小对得上、能正常解压；解压报错说明文件坏了，重新下载一次。"
    },
    {
      q: "整合包支持 macOS / Linux 吗？",
      a: "支持。macOS 上推荐用 HMCL 或 Prism Launcher，Linux 上推荐 Prism Launcher / HMCL。" +
         "注意 macOS 需要装对应的 ARM64 或 x64 版 Java 21。"
    },
    {
      q: "和朋友联机，除了开服还有别的办法吗？",
      a: "人少（2～3 人）可以用「对局域网开放 + 内网穿透」的方式，例如用联机工具做端口映射。" +
         "但整合包模组多、负载高，人数一多还是老老实实开独立服务端，体验差距很大。"
    },
    {
      q: "存档在哪个目录？换电脑怎么迁移？",
      a: "存档在整合包实例目录下的 <code>saves</code> 文件夹里。整个 <code>saves</code> 文件夹复制过去即可，" +
         "换电脑迁移前请务必关闭游戏，否则可能复制到一半的存档。"
    },
    {
      q: "我想把这个整合包录视频 / 直播，可以吗？",
      a: "完全可以，不需要单独申请，也欢迎在简介里带上本站地址。如果能顺便 @ 我们一下就更好了。"
    }
  ]
};
