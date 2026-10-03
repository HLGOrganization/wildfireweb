/* ==========================================================================
   野火整合包 · 渲染逻辑
   --------------------------------------------------------------------------
   这个文件负责把 config.js / data.js 里的内容渲染成页面。
   一般不需要修改；要改内容请去改 config.js 和 data.js。
   依赖：必须先加载 config.js 和 data.js。
   ========================================================================== */

(function () {
  "use strict";

  var S = window.SITE || {};
  var D = window.DATA || {};

  /* ======================= 基础工具 ======================= */

  function $(sel, root) { return (root || document).querySelector(sel); }

  /** HTML 转义：所有来自配置的纯文本都要过一遍，避免引号/尖括号破坏结构 */
  function esc(v) {
    return String(v == null ? "" : v)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  /** 判断一个链接是不是还没填 */
  function isBlank(u) {
    return !u || String(u).trim() === "" || String(u).trim() === "#";
  }

  /** 组装 HTML 字符串 */
  function h(strings) {
    return Array.prototype.join.call(arguments, "");
  }

  /* ---------- 轻提示 ---------- */
  var toastEl = null, toastTimer = null;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "toast";
      toastEl.setAttribute("role", "status");
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    // 强制重排，保证连续点击也能重放动画
    void toastEl.offsetWidth;
    toastEl.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("is-on"); }, 1900);
  }

  /* ---------- 复制到剪贴板（file:// 下 clipboard API 可能不可用，需降级） ---------- */
  function copyText(text, okMsg) {
    function done() { toast(okMsg || "已复制到剪贴板"); }

    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.top = "-1000px";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      var ok = false;
      try {
        if (typeof ta.select === "function") ta.select();
        if (typeof ta.setSelectionRange === "function") ta.setSelectionRange(0, ta.value.length);
        ok = document.execCommand("copy");
      } catch (e) {
        ok = false;
      } finally {
        // 无论成功失败都要把临时节点清掉，避免残留
        if (ta.parentNode) ta.parentNode.removeChild(ta);
      }
      if (ok) done();
      else toast("复制失败，请手动选中复制");
    }

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, fallback);
    } else {
      fallback();
    }
  }

  /* ---------- 生成下载按钮 ---------- */
  function dlBtn(url, label, cls) {
    cls = cls || "btn btn--primary";
    if (isBlank(url)) {
      return '<span class="' + cls + '" aria-disabled="true" title="链接尚未填写：请在 assets/js/data.js 中补上 url">' +
             esc(label) + ' · 待填写</span>';
    }
    return '<a class="' + cls + '" href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' +
           esc(label) + "</a>";
  }

  /* ---------- 官网/项目通用外链 ---------- */
  function extLink(url, label, cls) {
    if (isBlank(url)) return "";
    return '<a class="' + (cls || "") + '" href="' + esc(url) +
           '" target="_blank" rel="noopener noreferrer">' + esc(label) + "</a>";
  }

  /* ---------- 把纯文本里的换行变成 HTML（用于免责声明等自由文本） ---------- */
  function nl2br(v) { return esc(v).replace(/\n/g, "<br>"); }

  /* ======================= 顶栏 ======================= */

  var NAV = [
    { href: "index.html",     label: "首页",           page: "home" },
    { href: "changelog.html", label: "更新日志",        page: "changelog" }
  ];

  /* 「加入 QQ 群」跟在更新日志后面。没填群号时整条不显示，
     免得顶栏出现一个点进去只有空占位框的入口。 */
  function navItems() {
    var items = NAV.slice();
    if (!isBlank(S.qq && S.qq.group)) {
      items.push({ href: "support.html", label: "加入 QQ 群", page: "support" });
    }
    return items;
  }

  /* 页脚要保留完整的站点地图。
     顶栏精简之后，下载页 / 模组列表 / 教程在顶栏都没有入口了，
     页脚是它们唯一的"兜底入口"，所以这份列表不能跟着一起减。 */
  var FOOTER_NAV = [
    { href: "index.html",     label: "首页" },
    { href: "downloads.html", label: "下载中心" },
    { href: "changelog.html", label: "更新日志" },
    { href: "mods.html",      label: "模组列表" },
    { href: "faq.html",       label: "安装教程 / FAQ" },
    { href: "support.html",   label: "赞助 & 加群" }
  ];

  function renderTopbar() {
    var host = $("#site-header");
    if (!host) return;
    var cur = document.body.getAttribute("data-page") || "";

    var links = navItems().map(function (n) {
      var current = n.page === cur ? ' aria-current="page"' : "";
      return '<a class="nav__link" href="' + n.href + '"' + current + ">" + esc(n.label) + "</a>";
    }).join("");

    host.className = "topbar";
    host.innerHTML = h(
      '<div class="wrap topbar__inner">',
        '<a class="brand" href="index.html">',
          '<img class="brand__logo" src="' + esc(S.mark || S.logo || "assets/img/icon.png") + '" alt="' + esc(S.fullName || S.name || "整合包") + ' 图标" width="34" height="34">',
          '<span class="brand__text">',
            '<span class="brand__name">' + esc(S.name || "整合包") + "</span>",
            '<span class="brand__en">' + esc(S.nameEn || "") + "</span>",
          "</span>",
        "</a>",
        '<button class="navtoggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="展开导航菜单">',
          "<span></span><span></span><span></span>",
        "</button>",
        '<nav class="nav" id="site-nav" aria-label="主导航">' + links + "</nav>",
      "</div>"
    );

    // 移动端菜单开关
    var toggle = $(".navtoggle", host);
    var nav = $("#site-nav", host);
    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        var open = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
      // 点击菜单项后自动收起
      nav.addEventListener("click", function (e) {
        if (e.target.closest("a")) {
          nav.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
        }
      });
      // 点击页面其他地方收起
      document.addEventListener("click", function (e) {
        if (!host.contains(e.target) && nav.classList.contains("is-open")) {
          nav.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
        }
      });
      // Esc 收起
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && nav.classList.contains("is-open")) {
          nav.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
          toggle.focus();
        }
      });
    }
  }

  /* ======================= 页脚 ======================= */

  function renderFooter() {
    var host = $("#site-footer");
    if (!host) return;

    var C = S.contact || {};
    var qq = S.qq || {};

    var contactItems = [];
    if (!isBlank(qq.group)) {
      contactItems.push('<li><a href="support.html">QQ 群：' + esc(qq.group) + "</a></li>");
    }
    if (!isBlank(C.bilibili)) contactItems.push("<li>" + extLink(C.bilibili, "哔哩哔哩") + "</li>");
    if (!isBlank(C.github))   contactItems.push("<li>" + extLink(C.github, "GitHub 仓库") + "</li>");
    if (!isBlank(C.email))    contactItems.push('<li><a href="mailto:' + esc(C.email) + '">' + esc(C.email) + "</a></li>");
    if (!contactItems.length) contactItems.push('<li class="muted">联系方式待填写</li>');

    host.className = "site-footer";
    host.innerHTML = h(
      '<div class="wrap">',
        '<div class="footer__grid">',

          "<div>",
            '<div class="footer__brandline">',
              '<img src="' + esc(S.mark || S.logo || "assets/img/icon.png") + '" alt="" width="34" height="34">',
              "<strong>" + esc(S.fullName || S.name || "整合包") + "</strong>",
            "</div>",
            '<p class="muted" style="font-size:14px;max-width:46ch">' + nl2br(S.motto || "") + "</p>",
            '<p class="muted" style="font-size:12.5px;max-width:52ch">' + nl2br(S.disclaimer || "") + "</p>",
          "</div>",

          "<div>",
            '<div class="footer__title">站内导航</div>',
            '<ul class="footer__list">' +
              FOOTER_NAV.map(function (n) {
                return '<li><a href="' + n.href + '">' + esc(n.label) + "</a></li>";
              }).join("") +
            "</ul>",
          "</div>",

          "<div>",
            '<div class="footer__title">联系与支持</div>',
            '<ul class="footer__list">' + contactItems.join("") + "</ul>",
            '<p style="margin-top:14px"><a class="btn btn--ghost btn--sm" href="support.html">赞助 / 加群</a></p>',
          "</div>",

        "</div>",
        '<div class="footer__bottom">',
          "<p>© " + new Date().getFullYear() + " " + esc(S.fullName || S.name || "") +
            "　保留所有权利。</p>",
          S.icp ? "<p>" + esc(S.icp) + "</p>" : "",
        "</div>",
      "</div>"
    );
  }

  /* ======================= 首页 ======================= */

  /** 取某个端「推荐」的版本，没有就取第一条 */
  function pickRecommended(kind) {
    var box = D.downloads && D.downloads[kind];
    if (!box || !box.versions || !box.versions.length) return null;
    for (var i = 0; i < box.versions.length; i++) {
      if (box.versions[i].recommended) return box.versions[i];
    }
    return box.versions[0];
  }

  function renderHero() {
    var copy = $("#hero-copy");
    if (!copy) return;
    var H = S.hero || {};

    var facts = (H.facts || []).map(function (f) {
      return '<li class="hero__fact"><span>' + esc(f.k) + "</span><b>" + esc(f.v) + "</b></li>";
    }).join("");

    copy.innerHTML = h(
      '<p class="hero__en">' + esc(S.nameEn || "") + "</p>",
      H.kicker ? '<p class="hero__kicker head__kicker">' + esc(H.kicker) + "</p>" : "",
      '<h1 class="hero__title">' + (H.title || esc(S.fullName || "")) + "</h1>",
      '<p class="hero__lead">' + nl2br(H.lead || "") + "</p>",
      // 三个按钮：下载摆在正中间（再往下一点就是两张下载卡，视线不用回左边）。
      // 「加入 QQ 群」搬到顶栏去了，原来那一格换成赞助。
      '<div class="hero__actions">',
        '<a class="btn btn--ghost btn--lg" href="faq.html">安装教程</a>',
        '<a class="btn btn--primary btn--lg" href="#pick">下载整合包</a>',
        '<a class="btn btn--ghost btn--lg" href="support.html">赞助</a>',
      "</div>",
      facts ? '<ul class="hero__facts">' + facts + "</ul>" : ""
    );
  }

  function renderHeroArt() {
    var art = $("#hero-art");
    if (!art) return;
    art.innerHTML = '<img class="hero__logo" src="' + esc(S.mark || S.logo || "assets/img/icon.png") +
                    '" alt="' + esc(S.fullName || "整合包") + ' 标志" width="68" height="68">';
  }

  /** 首页的「推荐下载」两张卡 */
  function renderHomeDownloads() {
    var host = $("#home-downloads");
    if (!host) return;

    var kinds = ["client", "server"];
    host.className = "dl-grid";
    host.innerHTML = kinds.map(function (kind) {
      var box = D.downloads && D.downloads[kind];
      if (!box) return "";
      var v = pickRecommended(kind);
      if (!v) return "";

      return h(
        '<article class="card card--hover dl-panel">',
          '<div class="dl-panel__head">',
            '<span class="dl-panel__icon" aria-hidden="true">' + esc(box.icon || "📦") + "</span>",
            "<div>",
              '<h3 class="dl-panel__title">' + esc(box.title) + "下载</h3>",
              '<p class="dl-panel__sub">' + esc(box.sub || "") + "</p>",
            "</div>",
          "</div>",
          '<div class="dl-panel__body">',
            '<div class="tags mb-1">',
              channelTag(v),
              v.recommended ? '<span class="tag tag--ok">推荐</span>' : "",
              '<span class="tag">' + esc(v.version) + "</span>",
            "</div>",
            '<div class="dl-facts mb-1">',
              fact("游戏版本", v.mc),
              fact("加载器", v.loader),
              v.mem ? fact("最低内存", v.mem) : "",
              fact("文件大小", v.size),
              fact("更新日期", v.date),
            "</div>",
            javaWarnHtml(),
            '<p class="dl-file"><span class="dl-file__label">文件名</span>' + esc(v.file || "—") + "</p>",
            '<div class="dl-actions">',
              // 卡片里只留这一颗。全站同时只对外提供一个版本的链接，
              // 所以不放「查看全部版本 / 更多下载方式」之类的岔路。
              dlBtn(v.url, "下载 " + box.title + " " + v.version, "btn btn--primary btn--block"),
            "</div>",
          "</div>",
        "</article>"
      );
    }).join("");
  }

  function fact(k, v) {
    return '<div><div class="meta__k">' + esc(k) + '</div><div class="meta__v">' + esc(v || "—") + "</div></div>";
  }

  /** 下载卡里的硬提醒（例如「必须用 Java 21」）。没配就不占位置。 */
  function javaWarnHtml() {
    var t = D.downloads && D.downloads.javaWarn;
    return t ? '<p class="dl-note dl-note--warn">⚠️ ' + nl2br(t) + "</p>" : "";
  }

  function channelTag(v) {
    if (v.channel === "beta") return '<span class="tag tag--warn">测试版</span>';
    return '<span class="tag tag--fire">正式版</span>';
  }

  /** 首页三张快捷入口 */
  function renderQuick() {
    var host = $("#home-quick");
    if (!host) return;
    var hasQQ = !isBlank(S.qq && S.qq.group);

    var items = [
      { icon: "⬇️", title: "下载中心", desc: "客户端和服务端的最新公测版，都在这一页。", href: "downloads.html", go: "去下载 →" },
      { icon: "📖", title: "安装教程", desc: "不会装？从 Java 到导入整合包，一步一步照着做就行。", href: "faq.html", go: "看教程 →" },
      { icon: "🧩", title: "模组列表", desc: "整合包里有啥、都是谁做的，全部列出来并致谢原作者。", href: "mods.html", go: "看清单 →" },
      { icon: "💛", title: hasQQ ? "赞助 & 加群" : "赞助我们", desc: "想一起玩就进群，想支持我们就点这里。", href: "support.html", go: "前往 →" }
    ];

    host.className = "quick";
    host.innerHTML = items.map(function (it) {
      return h(
        '<a class="card card--hover quick__item" href="' + it.href + '">',
          '<span class="quick__icon" aria-hidden="true">' + it.icon + "</span>",
          '<span class="quick__title">' + esc(it.title) + "</span>",
          '<span class="quick__desc">' + esc(it.desc) + "</span>",
          '<span class="quick__go">' + esc(it.go) + "</span>",
        "</a>"
      );
    }).join("");
  }

  /** 首页更新日志预览（最新 2 条，每版只列前 5 条改动） */
  function renderHomeChangelog() {
    var host = $("#home-changelog");
    if (!host) return;
    var list = (D.changelog || []).slice(0, 2);
    host.innerHTML = list.length
      ? logListHtml(list, { max: 5 })
      : '<div class="empty">暂无更新记录</div>';
  }

  /* ======================= 下载页 ======================= */

  /** 渲染一个下载面板（单版本，没有「选择版本」下拉） */
  function renderDlPanel(host, kind) {
    if (!host) return;                       // 该页面没有这个容器，直接跳过
    var box = D.downloads && D.downloads[kind];
    if (!box) return;

    // 只渲染推荐的那一条。全站同时只有一个版本对外提供链接，
    // 下拉框里另一个版本点开也是灰的「待填写」，不如直接不要。
    var v = pickRecommended(kind);
    if (!v) {
      host.innerHTML = '<div class="empty">暂时没有可下载的版本</div>';
      return;
    }

    host.className = "card dl-panel";
    host.innerHTML = h(
      '<div class="dl-panel__head">',
        '<span class="dl-panel__icon" aria-hidden="true">' + esc(box.icon || "📦") + "</span>",
        "<div>",
          '<h2 class="dl-panel__title">' + esc(box.title) + "下载</h2>",
          '<p class="dl-panel__sub">' + esc(box.sub || "") + "</p>",
        "</div>",
      "</div>",
      '<div class="dl-panel__body">',
        '<div id="' + kind + '-detail"></div>',
      "</div>"
    );

    var detail = $("#" + kind + "-detail", host);

    function paint() {
      var mirrors = (v.mirrors || []).filter(function (m) { return m && (m.name || m.url); });
      var mirrorsHtml = mirrors.length
        ? h(
            '<div class="dl-mirrors">',
              '<div class="dl-mirrors__title">备用下载 / 网盘</div>',
              '<div class="dl-mirrors__list">',
                mirrors.map(function (m, mi) {
                  var code = !isBlank(m.code)
                    ? '<span class="dl-mirror__code">提取码 ' + esc(m.code) + "</span>" +
                      '<button class="btn btn--ghost btn--sm" type="button" data-copy="' + esc(m.code) +
                      '" data-copy-msg="提取码已复制">复制</button>'
                    : "";
                  return h(
                    '<div class="dl-mirror">',
                      '<span class="dl-mirror__name">' + esc(m.name || ("备用链接 " + (mi + 1))) + "</span>",
                      code,
                      dlBtn(m.url, "网盘下载", "btn btn--sm"),
                    "</div>"
                  );
                }).join(""),
              "</div>",
            "</div>"
          )
        : "";

      var hashHtml = !isBlank(v.sha1)
        ? h(
            '<div class="dl-hash">',
              '<div class="dl-mirrors__title">文件校验（SHA1）</div>',
              '<div class="urlbox">',
                '<input type="text" readonly value="' + esc(v.sha1) + '" aria-label="SHA1 校验值" onclick="this.select()">',
                '<button class="btn btn--ghost btn--sm" type="button" data-copy="' + esc(v.sha1) +
                '" data-copy-msg="SHA1 已复制">复制</button>',
              "</div>",
              '<p class="dl-note">下载完成后可校验文件是否完整，方法见 <a href="faq.html">常见问题</a>。</p>',
            "</div>"
          )
        : '<div class="dl-hash"><p class="dl-note">本版本未提供校验值。</p></div>';

      detail.innerHTML = h(
        '<div class="tags mb-1">',
          channelTag(v),
          v.recommended ? '<span class="tag tag--ok">推荐下载</span>' : "",
          // 版本号也挂一个标签：下拉框去掉以后，这一页就只剩文件名里能看到版本号了
          '<span class="tag">' + esc(v.version) + "</span>",
        "</div>",
        '<div class="dl-facts">',
          fact("游戏版本", v.mc),
          fact("加载器", v.loader),
          fact("Java 要求", v.java),
          v.mem ? fact("最低内存", v.mem) : "",
          fact("文件大小", v.size),
          fact("更新日期", v.date),
        "</div>",
        javaWarnHtml(),
        '<p class="dl-file"><span class="dl-file__label">文件名</span>' + esc(v.file || "—") + "</p>",
        '<div class="dl-actions">',
          dlBtn(v.url, "主线路下载", "btn btn--primary btn--block btn--lg"),
        "</div>",
        mirrorsHtml,
        hashHtml,
        v.notes ? '<p class="dl-note">📌 ' + nl2br(v.notes) + "</p>" : ""
      );
    }

    paint();
  }

  /* ======================= 更新日志 ======================= */

  var CHANGE_LABEL = { add: "新增", fix: "修复", change: "调整", remove: "移除" };

  /**
   * 渲染一组更新日志条目。
   * opts.max : 每版最多列几条改动（首页预览用，不传 = 全列）。
   * 一版改动动辄几十条，首页全铺出来会变成一大片文字墙。
   */
  function logListHtml(list, opts) {
    var max = (opts && opts.max) || 0;
    return '<div class="log">' + list.map(function (e, i) {
      var tags = (e.tags || []).map(function (t) {
        return '<span class="tag">' + esc(t) + "</span>";
      }).join("");
      if (i === 0) tags = '<span class="tag tag--fire">最新</span>' + tags;

      var all = e.changes || [];
      var shown = max > 0 ? all.slice(0, max) : all;
      var rest = all.length - shown.length;

      var changes = shown.map(function (c) {
        return '<li data-type="' + esc(c.type || "change") + '">' + esc(c.text) + "</li>";
      }).join("");

      var body;
      if (!changes) {
        body = '<p class="log__none">这一版的更新内容还没整理，稍后补上。</p>';
      } else {
        body = '<ul class="log__changes">' + changes + "</ul>";
        if (rest > 0) {
          body += '<p class="log__more">上面是前 ' + shown.length + " 条，还有 " + rest +
                  ' 条在<a href="changelog.html">完整更新日志</a>里。</p>';
        }
      }

      return h(
        '<article class="log__item card">',
          '<div class="log__head">',
            '<span class="log__ver">' + esc(e.version) + "</span>",
            '<span class="log__date">' + esc(e.date) + "</span>",
            tags,
          "</div>",
          e.summary ? '<p class="dim" style="margin-bottom:10px">' + esc(e.summary) + "</p>" : "",
          body,
        "</article>"
      );
    }).join("") + "</div>";
  }

  function renderChangelog() {
    var host = $("#log-list");
    if (!host) return;
    var list = D.changelog || [];
    host.innerHTML = list.length ? logListHtml(list) : '<div class="empty">还没有更新记录</div>';
  }

  /* ======================= 模组列表 ======================= */

  function renderMods() {
    var grid = $("#mod-grid");
    if (!grid) return;

    var modsBox = D.mods || {};
    var all = modsBox.list || [];
    var cats = modsBox.categories || [];
    var chipsHost = $("#mod-chips");
    var countHost = $("#mod-count");
    var search = $("#mod-search");

    var state = { cat: "", q: "" };

    if (chipsHost) {
      chipsHost.className = "chips";
      chipsHost.innerHTML = [{ label: "全部", val: "" }].concat(cats.map(function (c) {
        return { label: c, val: c };
      })).map(function (c) {
        return '<button class="chip" type="button" data-cat="' + esc(c.val) + '" aria-pressed="' +
               (c.val === "" ? "true" : "false") + '">' + esc(c.label) +
               (c.val ? " " + countByCat(all, c.val) : " " + all.length) + "</button>";
      }).join("");

      chipsHost.addEventListener("click", function (e) {
        var btn = e.target.closest(".chip");
        if (!btn) return;
        state.cat = btn.getAttribute("data-cat") || "";
        Array.prototype.forEach.call(chipsHost.querySelectorAll(".chip"), function (b) {
          b.setAttribute("aria-pressed", b === btn ? "true" : "false");
        });
        paint();
      });
    }

    if (search) {
      search.addEventListener("input", function () {
        state.q = search.value.trim().toLowerCase();
        paint();
      });
    }

    function paint() {
      var list = all.filter(function (m) {
        if (state.cat && m.category !== state.cat) return false;
        if (!state.q) return true;
        var hay = [m.name, m.orig, m.author, m.desc, m.category].join(" ").toLowerCase();
        return hay.indexOf(state.q) !== -1;
      });

      if (countHost) {
        countHost.textContent = "共 " + all.length + " 个模组" +
          (list.length === all.length ? "" : "，当前筛选出 " + list.length + " 个") + "。";
      }

      grid.className = "mod-grid";
      grid.innerHTML = list.length ? list.map(function (m) {
        // 没有提供精确地址时，退回到 Modrinth 搜索链接，至少让用户能找到
        var url = m.url && !isBlank(m.url)
          ? m.url
          : "https://modrinth.com/mods?q=" + encodeURIComponent(m.name);

        return h(
          '<article class="mod">',
            '<div class="mod__top">',
              '<strong class="mod__name">' + esc(m.name) + "</strong>",
              m.orig ? '<span class="mod__orig">' + esc(m.orig) + "</span>" : "",
            "</div>",
            '<p class="mod__desc">' + esc(m.desc || "") + "</p>",
            '<div class="mod__foot">',
              '<span class="tag">' + esc(m.category || "未分类") + "</span>",
              '<span class="mod__by">by ' + esc(m.author || "未知") + "</span>",
              '<a class="mod__link" href="' + esc(url) + '" target="_blank" rel="noopener noreferrer" ' +
                'title="在 Modrinth 搜索该项目">项目主页 ↗</a>',
            "</div>",
          "</article>"
        );
      }).join("") : '<div class="empty">没有匹配的模组，换个关键词试试。</div>';
    }

    paint();
  }

  function countByCat(list, cat) {
    var n = 0;
    for (var i = 0; i < list.length; i++) { if (list[i].category === cat) n++; }
    return n;
  }

  /* ======================= 教程与 FAQ ======================= */

  function renderGuide() {
    var map = { "#guide-client": (D.guide || {}).client, "#guide-server": (D.guide || {}).server };
    Object.keys(map).forEach(function (sel) {
      var host = $(sel);
      if (!host) return;
      var steps = map[sel] || [];
      if (!steps.length) { host.innerHTML = '<div class="empty">教程待补充</div>'; return; }
      host.className = "steps";
      host.innerHTML = steps.map(function (s) {
        return h(
          '<div class="step">',
            '<h4 class="step__title">' + esc(s.title) + "</h4>",
            '<div class="step__body">' +
              (s.body || []).map(function (p) { return "<p>" + p + "</p>"; }).join("") +
            "</div>",
          "</div>"
        );
      }).join("");
    });
  }

  function renderFaq() {
    var host = $("#faq-list");
    if (!host) return;
    var list = D.faq || [];
    if (!list.length) { host.innerHTML = '<div class="empty">暂无常见问题</div>'; return; }
    host.className = "accordion";
    host.innerHTML = list.map(function (f, i) {
      return h(
        "<details class=\"acc\"" + (i === 0 ? " open" : "") + ">",
          '<summary class="acc__q">' + esc(f.q) + "</summary>",
          '<div class="acc__a">' + (f.a || "") + "</div>",
        "</details>"
      );
    }).join("");
  }

  /* ======================= 赞助与加群 ======================= */

  /* 二维码区块：未配置时给访客看中性占位，
     具体怎么放图片写在 config.js 注释和 README 里，不要把技术说明暴露给访客。
     caption 传空字符串就只显示二维码、不显示下面那行小字（卡片标题已经写明是哪种方式了）。 */
  function qrBlock(qr, caption, altText, emptyHint) {
    var cap = isBlank(caption) ? "" : '<span class="qr__cap">' + esc(caption) + "</span>";
    if (!isBlank(qr)) {
      return h(
        '<div class="qr">',
          '<img src="' + esc(qr) + '" alt="' + esc(altText || caption) + '" loading="lazy">',
          cap,
        "</div>"
      );
    }
    return h(
      '<div class="qr">',
        '<div class="qr__slot"><b>暂无二维码</b><span>' + esc(caption || emptyHint || "请使用上方号码或链接") + "</span></div>",
        cap ? '<span class="qr__cap">' + esc(emptyHint || "请使用上方号码或链接") + "</span>" : "",
      "</div>"
    );
  }

  function renderSupport() {
    /* --- QQ 群 --- */
    var qqHost = $("#qq-block");
    if (qqHost) {
      var qq = S.qq || {};
      if (isBlank(qq.group)) {
        qqHost.innerHTML = '<div class="empty">QQ 群号还没填写，请在 assets/js/config.js 里补上。</div>';
      } else {
        qqHost.innerHTML = h(
          '<div class="qq-num">',
            '<div>',
              '<div class="qq-num__label">QQ 群号</div>',
              '<div class="qq-num__val">' + esc(qq.group) + "</div>",
            "</div>",
            '<button class="btn btn--primary" type="button" data-copy="' + esc(qq.group) +
              '" data-copy-msg="群号已复制，去 QQ 搜索吧">复制群号</button>',
            !isBlank(qq.joinUrl)
              ? '<a class="btn btn--ghost" href="' + esc(qq.joinUrl) +
                '" target="_blank" rel="noopener noreferrer">一键加群</a>'
              : "",
          "</div>",
          '<div class="qq-qr">',
            qrBlock(qq.qr, "QQ 群二维码", "QQ 群二维码", "也可以直接用群号搜索加群"),
          "</div>",
          qq.tip ? '<p class="dl-note">💡 ' + nl2br(qq.tip) + "</p>" : ""
        );
      }
    }

    /* --- 赞助 --- */
    var dn = S.donate || {};
    var introHost = $("#donate-intro");
    if (introHost) {
      introHost.innerHTML = dn.intro ? "<p>" + nl2br(dn.intro) + "</p>" : "";
      if (!isBlank(dn.afdian)) {
        introHost.innerHTML += h(
          '<p style="margin-top:14px">',
            '<a class="btn btn--primary btn--lg" href="' + esc(dn.afdian) +
            '" target="_blank" rel="noopener noreferrer">前往爱发电支持我们</a>',
          "</p>"
        );
      }
    }

    var methodHost = $("#donate-methods");
    if (methodHost) {
      var methods = dn.methods || [];
      methodHost.className = "pay-methods";
      methodHost.innerHTML = methods.length ? methods.map(function (m) {
        /* 卡片标题已经写了「爱发电」，二维码下面不用再重复一行小字 */
        var body = qrBlock(m.qr, "", m.name + " 收款码", "可先通过上方链接支持");
        var link = !isBlank(m.url)
          ? '<p style="margin:12px 0 0">' + extLink(m.url, "打开" + m.name + "主页 ↗", "btn btn--ghost btn--sm btn--block") + "</p>"
          : "";
        return h(
          '<div class="card">',
            '<h4 style="margin-bottom:10px">' + esc(m.name) + "</h4>",
            body,
            m.desc ? '<p class="muted" style="font-size:13.5px;margin:12px 0 0">' + esc(m.desc) + "</p>" : "",
            link,
          "</div>"
        );
      }).join("") : '<div class="empty">赞助方式待填写</div>';
    }

    var sponsorHost = $("#sponsors");
    if (sponsorHost) {
      var sponsors = (dn.sponsors || []).filter(function (s) { return s && s.name; });
      if (!sponsors.length) {
        sponsorHost.innerHTML = '<div class="empty">赞助者名单待填写</div>';
      } else {
        sponsorHost.className = "sponsors";
        sponsorHost.innerHTML = sponsors.map(function (s) {
          return '<span class="sponsor' + (s.top ? " sponsor--top" : "") + '">' +
                 (s.top ? "★ " : "") + esc(s.name) + "</span>";
        }).join("");
      }
    }

    var noteHost = $("#donate-note");
    if (noteHost) {
      noteHost.innerHTML = dn.note
        ? '<div class="note"><span class="note__icon">💛</span><div>' + nl2br(dn.note) + "</div></div>"
        : "";
    }
  }

  /* ======================= 通用交互 ======================= */

  /** 所有带 data-copy 的按钮统一走这里 */
  function bindCopyButtons() {
    document.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-copy]");
      if (!btn) return;
      e.preventDefault();
      copyText(btn.getAttribute("data-copy"), btn.getAttribute("data-copy-msg"));
      btn.classList.add("copied");
      setTimeout(function () { btn.classList.remove("copied"); }, 400);
    });
  }

  /** 进入视口时淡入 */
  function bindReveal() {
    if (!("IntersectionObserver" in window)) return;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    var targets = document.querySelectorAll(".card, .step, .quick__item, .log__item, .mod");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("is-in");
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });

    Array.prototype.forEach.call(targets, function (t, i) {
      // 首屏内容不做动画，避免闪烁
      if (t.getBoundingClientRect().top < window.innerHeight * 0.9) return;
      t.classList.add("reveal");
      t.style.transitionDelay = Math.min(i % 6, 5) * 45 + "ms";
      io.observe(t);
    });
  }

  /**
   * 根据 config 统一页面标题与标签页图标。
   * 图标在 HTML 里已经写了一份静态链接（这样不开 JS、以及爬虫也能拿到），
   * 这里再按 config 覆盖一次，改图标时只动 config.js 就行，不必改 7 个页面。
   */
  function applyTitle() {
    var page = document.body.getAttribute("data-title");
    var name = S.fullName || S.name || "整合包";
    if (page) document.title = page + " · " + name;
    else if (!document.title) document.title = name;

    var icon = S.favicon;
    if (!isBlank(icon)) {
      var links = document.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"]');
      for (var i = 0; i < links.length; i++) links[i].setAttribute("href", icon);
    }
  }

  /**
   * 把 config.background 应用到 :root 的 CSS 变量上。
   * 不配图片时保持默认值（--bg-image:none / --bg-dim:0），页面回到纯色背景，
   * 不写 JS 也能正常显示 —— 也就是说不开 JS 时不会出现"半透明却没有背景"的怪状。
   */
  function applyBackground() {
    var B = (S.background) || {};
    var root = document.documentElement;
    var img = B.image;

    if (isBlank(img)) return;                       // 用 CSS 里的默认值即可

    // 路径来自自己的配置文件，这里只做最低限度的清理，避免提前闭合 url()
    var safe = String(img).replace(/["'()\\]/g, "");

    // ★ 必须转成绝对地址 ★
    // CSS 自定义属性里的相对 url() 是按"使用它的那条声明所在的样式表"为基准解析的，
    // 也就是 assets/css/style.css 所在目录，于是 "assets/img/x.jpg" 会被解析成
    // "assets/css/assets/img/x.jpg" —— 404，背景图完全不显示（而且不报错，很难发现）。
    // 在这里先按文档地址解析成绝对 URL，就与样式表位置无关了。
    try {
      if (typeof URL === "function") safe = new URL(safe, document.baseURI).href;
    } catch (e) {
      /* 解析失败就保留原值，交给浏览器处理 */
    }

    var blur = Number(B.blur);
    if (!isFinite(blur) || blur < 0) blur = 18;
    blur = Math.min(blur, 80);

    var dim = Number(B.dim);
    if (!isFinite(dim)) dim = 0.34;
    dim = Math.max(0, Math.min(1, dim));

    // 提亮倍数：夜景截图本身太暗，不提亮就完全看不出有背景
    var lift = Number(B.lift);
    if (!isFinite(lift) || lift <= 0) lift = 1;
    lift = Math.min(lift, 6);

    // 对比度：配合 lift 组成一条 gamma 曲线 —— 暗部抬起来、高光不削平
    var contrast = Number(B.contrast);
    if (!isFinite(contrast) || contrast <= 0) contrast = 1;
    contrast = Math.min(contrast, 2);

    root.style.setProperty("--bg-image", 'url("' + safe + '")');
    root.style.setProperty("--bg-blur", blur + "px");
    root.style.setProperty("--bg-lift", String(lift));
    root.style.setProperty("--bg-contrast", String(contrast));
    root.style.setProperty("--bg-dim", String(dim));
    root.setAttribute("data-bg", "on");
  }

  /**
   * 按 config.font 决定要不要挂上像素字体。
   * 这里只写 <html data-font="..."> 一个属性，具体怎么用全在 style.css 里：
   * 关掉字体时属性不存在，样式表里那一整段规则根本不命中，等于从没装过，
   * 不需要再维护第二套字号。
   */
  function applyFont() {
    var F = (S.font) || {};
    if (F.pixel === false) return;                  // 不加属性 = 回到系统字体

    var scope = String(F.scope || "").toLowerCase();
    if (scope !== "all") scope = "display";         // 默认只用于标题和界面字

    document.documentElement.setAttribute("data-font", scope);
  }

  /* ======================= 启动 ======================= */

  function init() {
    if (!window.SITE || !window.DATA) {
      console.warn("[野火] 找不到 SITE / DATA，请确认 config.js 与 data.js 已在 render.js 之前加载。");
    }

    applyTitle();
    applyBackground();
    applyFont();
    renderTopbar();
    renderFooter();

    renderHero();
    renderHeroArt();
    renderHomeDownloads();
    renderQuick();
    renderHomeChangelog();

    renderDlPanel($("#dl-client"), "client");
    renderDlPanel($("#dl-server"), "server");

    renderChangelog();
    renderMods();
    renderGuide();
    renderFaq();
    renderSupport();

    bindCopyButtons();
    bindReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
