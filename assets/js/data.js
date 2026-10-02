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
          version: "0.3.5",
          channel: "beta",
          recommended: true,
          mc: "1.20.1",
          loader: "Forge 47.4.23",
          java: "Java 21（64 位）",
          mem: "8 GB",
          file: "野火整合包-客户端-v0.3.5.zip",
          size: "273 MB",
          date: "2026-10-02",
          url: "",                                   // TODO: 填客户端下载直链
          mirrors: [
            { name: "百度网盘", url: "", code: "" },   // TODO
            { name: "蓝奏云",   url: "", code: "" }    // TODO
          ],
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
          notes: "上一个公测版，仅作留念，新玩家请直接下 0.3.5。"
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
          version: "0.3.5",
          channel: "beta",
          recommended: true,
          mc: "1.20.1",
          loader: "Forge 47.4.23",
          java: "Java 21（64 位）",
          file: "野火整合包-服务端-v0.3.5.zip",
          size: "792 MB",
          date: "2026-10-02",
          url: "",                                   // TODO: 填服务端下载直链
          mirrors: [
            { name: "百度网盘", url: "", code: "" }    // TODO
          ],
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
       version  版本号，带 v 前缀，例如 "v0.3.5"
       date     发布日期，格式 "2026-10-02"
       tags     小标签数组，例如 ["哑铃", "负重", "矿石"]；初始版写 ["公测", "初始版"]
       summary  一句话说明这一版干了什么（可留空 ""）
       changes  改动清单，一条一行，写法见下面 v0.3.5

     changes 里的每条只有两个字段：
       type  add（新增，绿） / fix（修复，蓝） / change（调整，黄） / remove（移除，红）
       text  这一条要说的话，纯文本，不要写 HTML

     初始版是 v0.3.0。changes 留空 [] 时，页面上会显示「这一版还没整理更新内容」。
     ====================================================================== */
  changelog: [
    {
      version: "v0.3.5",
      date: "2026-10-02",
      tags: ["哑铃", "野火模组", "煤炭打粉", "温泉", "属性中文化"],
      summary: "哑铃移入野火模组并加入投掷攻击、补齐煤炭打粉、修复温泉热源报错、属性名中文化。",
      changes: [
        { type: "add",    text: "石质与铸铁哑铃改由野火模组本体提供（原来由 kubejs 注册），效果不变：250 / 500 负重，体力经验 +25% / +50%。" },
        { type: "add",    text: "哑铃现在能当武器用：挥击速度慢、长按可以蓄力扔出去，砸中会额外造成钝器伤害，并配了专属的死亡提示。" },
        { type: "add",    text: "原版煤炭以前在动力粉碎、动力研磨、手推磨三种工序里都没有配方，现在都能打出煤粉；褐煤和烟煤的手推磨也一起补上，产出量和木炭一致。" },
        { type: "add",    text: "负重、最大负重、致命一击、伤害减免、护甲穿透、额外坠落距离、体力恢复等属性，现在在属性面板和提示里都能显示中文名。" },
        { type: "add",    text: "优化自动锻造。" },

        { type: "fix",    text: "温泉水热源：温泉的流体方块没有液面状态，原来按液面高度逐个登记会报错，改成整体登记，热辐射效果不变。" }
      ]
    },
    {
      version: "v0.3.3",
      date: "2026-10-01",
      tags: ["锻造", "筋腱", "背包", "JEI", "木炭炉", "配方"],
      summary: "铁砧多了一键完美锻造和《锻造手册》，筋腱变成正式方块，背包界面重做，木炭炉和篝火不再烧家，还补了一批漏掉的配方。",
      changes: [
        { type: "add",    text: "铁砧界面右上角多了一个「一键锻造」按钮，配方解锁后点一下就能直接打出完美成品，每次消耗 10 点锤子耐久。" },
        { type: "add",    text: "一键锻造需要先解锁：每打出一次完美成品都有机会解锁该配方，锻造等级越高机会越大（6 级起才有机会）；等级超过 10 级且同一配方累计完美锻造 20 次必定解锁，解锁时聊天栏会提示。" },
        { type: "add",    text: "新书《锻造手册》：把一本书放在铁砧左边、右边留空，直接当焊接处理就能拿到，右键翻看哪些配方已经解锁、各完美锻造了多少次。" },
        { type: "add",    text: "一键锻造的进度跟着角色存档走，死亡不会丢；用它打造也不会重复触发「完美锻造」成就。" },
        { type: "add",    text: "用一键锻造时如果没选配方、金属温度不够或手上没锤子，聊天栏会直接告诉你缺什么。" },

        { type: "add",    text: "新增方块「筋腱」和「风干的筋腱」，只能贴在完整方块的顶面，很薄，可以直接走过去。" },
        { type: "change", text: "筋腱怕水：旁边有水就放不下，被水冲到会被冲走并掉落；下面的方块被拆掉也会掉落，不会凭空消失。" },
        { type: "add",    text: "湿筋腱在露天连续放 20 分钟没淋到雨就会变成风干的筋腱；淋雨会重新计时，有屋顶挡着就不受影响。" },

        { type: "change", text: "背包界面重做成上面是背包、下面是玩家物品栏，格子数量和实际容量对得上了（之前 15 格的挎包被画成 18 格）。" },
        { type: "change", text: "打开背包时不再显示护甲格和合成格，护甲与副手槽移到面板外，在普通物品栏界面照样能正常穿脱。" },
        { type: "change", text: "背包面板和标题会跟着背包本身的颜色变化，和物品栏悬浮提示的配色一致。" },
        { type: "remove", text: "移除皮革挎包，皮革背包从 5 款变成 4 款。" },

        { type: "add",    text: "JEI 新增「淘金盘掉落」和「洗矿槽掉落」，可以直接看到能淘出什么、概率多少，按概率从高到低排，算不准的会标「约」。" },

        { type: "change", text: "篝火不会再点燃周围的方块了。" },
        { type: "change", text: "木炭炉也不会再点燃周围方块，但保温结构损坏后自动熄灭的机制保留。" },
        { type: "fix",    text: "里昂·S·肯尼迪夹克削弱：护甲由 8 点降到 4 点、韧性由 2 点降到 0 点（原本比真护甲还强）。" },
        { type: "add",    text: "新增罗盘物品：水浮罗盘与缺水的罗盘。" },

        { type: "fix",    text: "凿子、锤子、勘探镐、钉头锤现在可以正常淬火了（之前漏了这 4 种工具头）。" },
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

        { type: "change", text: "客户端安装包体积从约 1.3 GB 缩小到约 290 MB。" },
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
      { name: "Sodium",          orig: "钠",            category: "性能优化", author: "CaffeineMC",   desc: "重写渲染管线，帧数提升最明显的一个。" },
      { name: "Lithium",         orig: "锂",            category: "性能优化", author: "CaffeineMC",   desc: "优化游戏逻辑与实体运算，不改变原版手感。" },
      { name: "FerriteCore",     orig: "",              category: "性能优化", author: "malte0811",    desc: "大幅降低方块状态占用的内存。" },
      { name: "Entity Culling",  orig: "",              category: "性能优化", author: "tr7zw",        desc: "不渲染视野外的实体，人多时特别有用。" },
      { name: "ModernFix",       orig: "",              category: "性能优化", author: "embeddedt",    desc: "缩短启动时间并修复若干原版内存问题。" },
      { name: "Iris Shaders",    orig: "鸢尾花光影",     category: "性能优化", author: "Iris Team",    desc: "让整合包支持 OptiFine 格式的光影包。" },

      /* --- 界面交互 --- */
      { name: "Just Enough Items", orig: "JEI 物品管理器", category: "界面交互", author: "mezz",       desc: "查合成表、查用途，玩模组必备。" },
      { name: "Jade",            orig: "玉",            category: "界面交互", author: "Snownee",      desc: "准星指哪就显示那个方块/生物的信息。" },
      { name: "AppleSkin",       orig: "",              category: "界面交互", author: "squeek502",    desc: "显示食物的饱食度与饱和度预览。" },
      { name: "Mouse Tweaks",    orig: "",              category: "界面交互", author: "YaLTeR",       desc: "鼠标拖拽整理背包，效率翻倍。" },
      { name: "Controlling",     orig: "",              category: "界面交互", author: "Jaredlll08",   desc: "按键设置支持搜索，再也不用翻半天。" },
      { name: "Xaero's Minimap", orig: "Xaero 小地图",   category: "界面交互", author: "Xaero",        desc: "小地图与路径点，探索和找家全靠它。" },

      /* --- 科技 --- */
      { name: "Create",          orig: "机械动力",       category: "科技",     author: "simibubi",     desc: "用齿轮、传送带和蒸汽搭出会动的机械。" },
      { name: "Mekanism",        orig: "通用机械",       category: "科技",     author: "aidancbrady",  desc: "从矿石处理到核聚变的完整科技树。" },
      { name: "Applied Energistics 2", orig: "应用能源2", category: "科技",    author: "AE2 Team",     desc: "数字化存储与自动合成，中后期仓储核心。" },
      { name: "Powah!",          orig: "",              category: "科技",     author: "owmii",        desc: "入门友好的发电与能量存储方案。" },
      { name: "Immersive Engineering", orig: "沉浸工程", category: "科技",    author: "BluSunrize",   desc: "重型工业风的多方块结构，视觉表现极佳。" },

      /* --- 魔法 --- */
      { name: "Botania",         orig: "植物魔法",       category: "魔法",     author: "Vazkii",       desc: "用花朵产能的魔法科技，全程不消耗燃料。" },
      { name: "Ars Nouveau",     orig: "新生魔艺",       category: "魔法",     author: "baileyholl2",  desc: "自由拼装法术，自己写自己的技能。" },
      { name: "Occultism",       orig: "神秘学",         category: "魔法",     author: "klikli",       desc: "召唤使魔替你自动干活。" },
      { name: "Blood Magic",     orig: "血魔法",         category: "魔法",     author: "WayofTime",    desc: "以生命值为代价换取力量，代价流玩法。" },

      /* --- 冒险探索 --- */
      { name: "Twilight Forest", orig: "暮色森林",       category: "冒险探索", author: "Benimatic",    desc: "经典维度冒险，多个 Boss 与地牢。" },
      { name: "When Dungeons Arise", orig: "",          category: "冒险探索", author: "Aureljz",      desc: "在主世界生成大量大型地牢结构。" },
      { name: "YUNG's Better Dungeons", orig: "",       category: "冒险探索", author: "YUNG",         desc: "重做原版地牢，探索体验好很多。" },
      { name: "Waystones",       orig: "传送石碑",       category: "冒险探索", author: "BlayTheNinth", desc: "解锁过的石碑之间可以互相传送。" },

      /* --- 建筑农业 --- */
      { name: "Farmer's Delight", orig: "农夫乐事",      category: "建筑农业", author: "vectorwing",   desc: "新增大量食材、厨具与料理。" },
      { name: "Supplementaries", orig: "",              category: "建筑农业", author: "MehVahdJukaar", desc: "一堆原版风格的小物件与装饰。" },
      { name: "Macaw's Bridges", orig: "",              category: "建筑农业", author: "sketchmacaw",  desc: "各种材质的桥，造景很出效果。" },

      /* --- 辅助便利 --- */
      { name: "Sophisticated Backpacks", orig: "精致背包", category: "辅助便利", author: "P3pp3rF1y", desc: "可升级的背包，能接自动化。" },
      { name: "Iron Chests",     orig: "铁箱子",         category: "辅助便利", author: "progwml6",     desc: "更多容量的箱子，从铁到钻石。" },
      { name: "FTB Quests",      orig: "FTB 任务",       category: "辅助便利", author: "FTB Team",     desc: "整合包内置任务线，给新手一个方向。" },
      { name: "Nature's Compass", orig: "自然指南针",    category: "辅助便利", author: "Chaosyr",      desc: "找一个指定生物群系在哪。" },

      /* --- 前置库 --- */
      { name: "Cloth Config API", orig: "",             category: "前置库",   author: "shedaniel",    desc: "模组配置界面库。" },
      { name: "Architectury API", orig: "",             category: "前置库",   author: "architectury", desc: "跨加载器开发支撑库。" },
      { name: "GeckoLib",        orig: "",              category: "前置库",   author: "Tslat",        desc: "实体动画引擎，很多模组依赖它。" },
      { name: "Curios API",      orig: "",              category: "前置库",   author: "theillusivec4", desc: "饰品栏位扩展。" },
      { name: "Patchouli",       orig: "帕秋莉手册",      category: "前置库",   author: "Vazkii",       desc: "游戏内说明书框架。" },
      { name: "Kotlin for Forge", orig: "",             category: "前置库",   author: "thedarkcolour", desc: "Kotlin 编写的模组所需的运行时。" }
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
          "等启动器解压并识别完成，版本列表里会出现「野火整合包 v0.3.5」。",
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
      a: "直链带宽有限，人多的时候会慢。可以在下载页用备用网盘链接（百度网盘 / 蓝奏云）。" +
         "如果所有链接都失效了，来群里说一声，我们会尽快补档。"
    },
    {
      q: "怎么确认下载的文件没有损坏？",
      a: "下载页每个版本都提供了 SHA1。Windows 上在文件所在目录打开 PowerShell，执行 " +
         "<code>Get-FileHash 文件名 -Algorithm SHA1</code>，把结果和页面上显示的对比，" +
         "一致就说明文件完整。不一致请重新下载。"
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
