(function () {
  "use strict";
  var SITE = window.SITE;
  var ICONS = {
    chat: '<path d="M4 5h16v11H9l-5 4z"/>',
    people: '<circle cx="8" cy="9" r="3"/><circle cx="16" cy="9" r="3"/><path d="M3 19c0-3 2.5-5 5-5s5 2 5 5M11 19c0-3 2.5-5 5-5s5 2 5 5"/>',
    envelope: '<rect x="3" y="6" width="18" height="12" rx="1.5"/><path d="M3 7l9 6 9-6"/>',
    map: '<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',
    camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
    shield: '<path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
    check: '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l3 3 5-6"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l5 5"/>',
    pencil: '<path d="M4 20l1-5L16 4l4 4L9 19z"/><path d="M14 6l4 4"/>',
    file: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
    box: '<path d="M3 7l9-4 9 4v10l-9 4-9-4z"/><path d="M3 7l9 4 9-4M12 11v10"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/>',
    news: '<rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="M7 9h10M7 13h6M7 16h8"/>',
    book: '<path d="M4 5c3-1.5 5.5-1.5 8 0v15c-2.5-1.5-5-1.5-8 0z"/><path d="M12 5c2.5-1.5 5-1.5 8 0v15c-3-1.5-5.5-1.5-8 0"/>',
    school: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2.5 9 2.5 12 0v-5M22 9v6"/>',
    phone: '<rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M11 18h2"/>',
    pot: '<path d="M4 10h16v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"/><path d="M2 10h20M9 6c0-1 1-1 1-2M14 6c0-1 1-1 1-2"/>',
    star: '<path d="M12 3l2.7 5.6 6.1.8-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1-4.4-4.3 6.1-.8z"/>',
    gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v8h14v-8M12 8v12M12 8c-1.5-3-5-3.5-5-1.5S10 8 12 8zM12 8c1.5-3 5-3.5 5-1.5S14 8 12 8z"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-8 9"/>',
    music: '<path d="M9 18V5l11-2v13"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/>',
    video: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3z"/>'
  };
  var IMG = "img/", SMALL = "img/s/";
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var esc = function (t) {
    return String(t).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var REDUCE = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var state = null;

  var MENU = window.MENU || null;
  if (MENU) {
    if (MENU.version) SITE.version = MENU.version;
    if (MENU.flow) Object.keys(MENU.flow).forEach(function (k) { SITE.flow[k] = MENU.flow[k]; });
    if (MENU.notices) SITE.notices = MENU.notices;
    (MENU.cards || []).forEach(function (c) {
      var d = { order: 99, note: "", icon: "video", status: "검토중", before: "", picNote: "", followup: false, flowSet: "", banner: "", after: [], copyMsg: "", photo: false, gifFormat: false };
      Object.keys(d).forEach(function (k) { if (c[k] === undefined) c[k] = d[k]; });
      c.groups.forEach(function (g) {
        g.more = !!g.more; g.optional = false;
        g.items = g.items.map(function (it) { return { label: it[0], text: it[1], img: it[2] || "", bubble: "", desc: "", extra: false }; });
      });
      SITE.cards.push(c);
    });
    SITE.cards.forEach(function (c) {
      if (MENU.rename && MENU.rename[c.id]) c.title = MENU.rename[c.id];
      else c.title = c.title.replace(/^[①-⑨]\s*/, "").replace(/^추가 · /, "");
      if (MENU.desc && MENU.desc[c.id]) c.desc = MENU.desc[c.id];
      if (MENU.template && MENU.template[c.id]) c.template = MENU.template[c.id];
      if (MENU.app && MENU.app[c.id]) c.app = MENU.app[c.id];
      var ot = MENU.optText && MENU.optText[c.id];
      if (ot) c.groups.forEach(function (g) { var m = ot[g.key]; if (m) g.items.forEach(function (it) { if (m[it.label] !== undefined) it.text = m[it.label]; }); });
      if (MENU.picNote && MENU.picNote[c.id] !== undefined) c.picNote = MENU.picNote[c.id];
      if (MENU.note && MENU.note[c.id] !== undefined) c.note = MENU.note[c.id];
      if (MENU.cardImg && MENU.cardImg[c.id]) c.img = MENU.cardImg[c.id];
      if (MENU.afterAdd && MENU.afterAdd[c.id]) c.after = (c.after || []).concat(MENU.afterAdd[c.id]);
      var os = MENU.options && MENU.options[c.id];
      (os ? [].concat(os) : []).forEach(function (o) { c.groups.forEach(function (g) {
        if (g.key !== o.key) return;
        var old = g.items;
        g.q = o.q;
        g.items = o.items.map(function (it) {
          var base = typeof it.keep === "number" && old[it.keep] ? old[it.keep] : {};
          return { label: it.label, text: it.text, img: it.img || base.img || "", bubble: "", desc: "", extra: false, g: it.g };
        });
      }); });
    });
  }
  function allCats() { return MENU ? MENU.cats.concat([learnCat()]) : []; }
  function learnCat() {
    var ids = [];
    MENU.learn.topics.forEach(function (t) { t.cards.forEach(function (id) { if (ids.indexOf(id) < 0) ids.push(id); }); });
    return { id: "learn", title: MENU.learn.title, hint: MENU.learn.hint, kind: "text", sections: [{ name: "", cards: ids }] };
  }
  function catById(id) { return allCats().filter(function (c) { return c.id === id; })[0]; }
  function catOf(cardId) {
    return allCats().filter(function (c) { return c.sections.some(function (x) { return x.cards.indexOf(cardId) > -1; }); })[0];
  }
  function cardById(id) { return SITE.cards.filter(function (c) { return c.id === id; })[0]; }
  function listHref(t) { return t.href || "#/tab/" + t.id; }
  function ss(k, v) { try { if (v === undefined) return sessionStorage.getItem(k); if (v === null) sessionStorage.removeItem(k); else sessionStorage.setItem(k, v); } catch (e) {} return null; }
  function aiPick(apps) { var p = ss("aiPick"); return apps.indexOf(p) > -1 ? p : apps[0]; }

  function tabById(id) { return SITE.tabs.filter(function (t) { return t.id === String(id); })[0]; }
  function cardsOf(tab) { return SITE.cards.filter(function (c) { return c.tab === tab.id; }); }
  function stageLabel(t) { return t.stageName || ""; }
  function isInput(g) { return g.mode === "직접입력" || g.mode === "긴글입력"; }
  function isPic(g) { return g.mode === "그림" || g.mode === "그림(여/남)" || g.mode === "그림+직접입력"; }
  function hasTyping(g) { return g.mode === "버튼+직접입력" || g.mode === "그림+직접입력"; }

  function svg(name) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || ICONS.chat) + "</svg>";
  }
  function src(file, small) { return (small ? SMALL : IMG) + encodeURI(file); }
  // 그림이 있으면 그림, 없거나 불러오지 못하면 아이콘. 그림은 잘리지 않게 전체를 보여 준다.
  function thumb(file, icon, alt) {
    var img = file ? '<img src="' + src(file, true) + '" alt="' + esc(alt || "") + '" loading="lazy" onerror="this.remove()" onload="if(this.naturalHeight>this.naturalWidth*1.2)this.classList.add(\'tall\')">' : "";
    return '<div class="thumb"><span class="ico">' + svg(icon) + "</span>" + img + "</div>";
  }
  // 제목 앞의 ①~⑨는 작은 숫자 동그라미로 그림
  function titleHtml(t) {
    var m = /^([\u2460-\u2468])\s*/.exec(t || "");
    if (!m) return esc(t);
    return '<span class="no">' + (m[1].charCodeAt(0) - 0x245F) + "</span>" + esc(t.slice(m[0].length));
  }
  function picThumb(file) {
    var img = file ? '<img src="' + src(file, true) + '" alt="" loading="lazy" onerror="this.remove()">' : "";
    return '<div class="thumb ph" title="' + esc(file || "") + '"><span class="ico">' + svg("image") + "</span>" + img + "</div>";
  }
  function pickFile(spec, gender) {
    // '여 그림 / 남 그림' 형식이면 고른 성별의 그림
    var parts = String(spec || "").split("/").map(function (x) { return x.trim(); });
    return gender === "남" ? (parts[1] || parts[0]) : parts[0];
  }

  // ---------- 고른 것 기억하기 (이 창을 닫기 전까지) ----------
  function storeKey(id) { return "ap-card-" + id; }
  function freshState(card) {
    var st = { card: card.id, sel: {}, custom: {}, gender: "여", moreOpen: false, plain: "", missing: [], edited: null };
    card.groups.forEach(function (g) { st.sel[g.key] = 0; });
    return st;
  }
  function loadState(card) {
    var st = freshState(card);
    try {
      var saved = JSON.parse(sessionStorage.getItem(storeKey(card.id)) || "null");
      if (saved) {
        card.groups.forEach(function (g) {
          var i = saved.sel && saved.sel[g.key];
          if (typeof i === "number" && i >= 0 && i < g.items.length) st.sel[g.key] = i;
          if (saved.custom && typeof saved.custom[g.key] === "string") st.custom[g.key] = saved.custom[g.key];
        });
        if (saved.gender === "남") st.gender = "남";
        st.moreOpen = !!saved.moreOpen;
        if (typeof saved.edited === "string") st.edited = saved.edited;
      }
    } catch (e) {}
    return st;
  }
  function saveState() {
    if (!state) return;
    try {
      sessionStorage.setItem(storeKey(state.card), JSON.stringify({ sel: state.sel, custom: state.custom, gender: state.gender, moreOpen: state.moreOpen, edited: state.edited }));
    } catch (e) {}
  }
  function clearState(id) { try { sessionStorage.removeItem(storeKey(id)); } catch (e) {} }

  // ---------- 상단 ----------
  function renderTop(tab, card) {
    var nav = $("#crumb");
    var menuBtn = $("#menuBtn");
    if (!tab) {
      nav.hidden = true;
      menuBtn.hidden = true;
      return;
    }
    menuBtn.hidden = false;
    nav.hidden = !!MENU;
    var html = stageLabel(tab) ? '<span class="stage-chip">' + esc(stageLabel(tab)) + "</span>" : "";
    html += card
      ? '<a href="' + listHref(tab) + '">' + esc(tab.title) + "</a>"
      : "<b>" + esc(tab.title) + "</b>";
    nav.innerHTML = html;
  }

  // ---------- 홈 (메뉴판) ----------
  var HERO_ART =
    '<svg class="hero-art" viewBox="0 0 600 400" aria-hidden="true" preserveAspectRatio="xMaxYMid slice">' +
    '<defs><radialGradient id="glow" cx="78%" cy="30%" r="60%"><stop offset="0" stop-color="#9cc8f2" stop-opacity=".55"/><stop offset="1" stop-color="#9cc8f2" stop-opacity="0"/></radialGradient></defs>' +
    '<rect width="600" height="400" fill="url(#glow)"/>' +
    '<text x="585" y="300" text-anchor="end" font-size="300" font-weight="800" fill="none" stroke="#ffffff" stroke-opacity=".16" stroke-width="2.5" letter-spacing="-12">AI</text>' +
    '<g stroke="#cfe3fa" stroke-opacity=".35" stroke-width="1.4" fill="none">' +
    '<path d="M330 70 L410 40 L500 92 L560 54"/><path d="M410 40 L440 150 L520 180 L500 92"/><path d="M440 150 L360 210 L420 300 L520 180"/><path d="M360 210 L300 160"/></g>' +
    '<g fill="#ffffff"><circle cx="330" cy="70" r="4" fill-opacity=".55"/><circle cx="410" cy="40" r="5" fill-opacity=".7"/><circle cx="500" cy="92" r="6" fill-opacity=".8"/>' +
    '<circle cx="560" cy="54" r="3.5" fill-opacity=".5"/><circle cx="440" cy="150" r="5" fill-opacity=".6"/><circle cx="520" cy="180" r="4" fill-opacity=".55"/>' +
    '<circle cx="360" cy="210" r="4.5" fill-opacity=".5"/><circle cx="420" cy="300" r="3.5" fill-opacity=".45"/><circle cx="300" cy="160" r="3" fill-opacity=".4"/></g>' +
    "</svg>";

  function renderHome() {
    renderTop(null);
    hideDock();
    var stages = [];
    SITE.tabs.forEach(function (t) {
      var s = stages.filter(function (x) { return x.stage === t.stage; })[0];
      if (!s) { s = { stage: t.stage, name: t.stageName, tabs: [] }; stages.push(s); }
      s.tabs.push(t);
    });
    var works = SITE.homeWorks || [];
    var photo = works.length
      ? '<figure class="hero-works"><ul>' + works.map(function (w) {
          return '<li><span class="hw-pic"><img src="' + src(w[1], true) + '" alt="' + esc(w[0]) + ' 예시. AI로 만든 그림입니다."></span><span class="hw-name">' + esc(w[0]) + "</span></li>";
        }).join("") + "</ul><figcaption>체험관에서 만들 수 있는 것들 · AI로 만든 예시</figcaption></figure>"
      : (SITE.hero
        ? '<figure class="hero-photo"><img src="' + src(SITE.hero) + '" alt="휴대폰 화면을 손가락으로 누르는 어르신의 옆모습. AI로 만든 그림입니다." width="1200" height="800"><figcaption>AI로 만든 그림</figcaption></figure>'
        : "");
    var html =
      '<section class="hero hero-v2' + (photo ? "" : " hero-plain") + (SITE.heroReal ? " hero-real" : "") + '" aria-labelledby="heroH">' +
      '<h1 class="lead" id="heroH">고르기만 하면 AI에게 보낼 문장이 완성돼요</h1>' +
      '<p class="hero-sub">질문에 답하듯 고르기만 하세요.</p>' +
      photo +
      '<ol class="how3"><li><b>1</b>고르기</li><li><b>2</b>복사하기</li><li><b>3</b>붙여넣기</li></ol>' +
      '<a class="hero-start" href="#/tab/' + SITE.tabs[0].id + '">체험 시작하기</a>' +
      "</section>";
    var today = (SITE.today || []).map(function (id) {
      var c = SITE.cards.filter(function (x) { return x.id === id; })[0];
      var tt = !c && tabById(id);
      return c ? { href: "#/card/" + c.id, name: c.title } : (tt ? { href: "#/tab/" + tt.id, name: tt.title } : null);
    }).filter(Boolean);
    if (today.length) {
      html += '<section class="today" aria-labelledby="todayH"><h2 id="todayH">오늘 수업은 여기를 누르세요</h2><ul>' +
        today.map(function (x) { return '<li><a class="today-btn" href="' + x.href + '">' + titleHtml(x.name) + "</a></li>"; }).join("") + "</ul></section>";
    }
    stages.forEach(function (s) {
      html += '<section class="stage" aria-labelledby="st' + s.stage + '">' +
        '<h2 id="st' + s.stage + '">' + esc(s.name) + "</h2>" +
        '<ul class="tiles">' + s.tabs.map(function (t) {
          var first = cardsOf(t)[0];
          var pic = first && first.img ? pickFile(first.img, "여") : "";
          return '<li><a class="tile" href="#/tab/' + t.id + '">' +
            (pic
              ? '<span class="tile-ico tile-pic"><img src="' + src(pic, true) + '" alt="" loading="lazy" onerror="this.remove()"></span>'
              : '<span class="tile-ico">' + svg(t.icon) + "</span>") +
            '<span class="tile-txt"><b>' + esc(t.title) + "</b><span>" + esc(t.desc) + "</span></span>" + '<span class="tile-go" aria-hidden="true"></span></a></li>';
        }).join("") + "</ul></section>";
    });
    if (SITE.homeOrgs && SITE.homeOrgs.length) {
      html += '<section class="orgs" aria-labelledby="orgsH"><h2 id="orgsH">' + esc(SITE.homeOrgsTitle || "강의한 곳") + "</h2><ul>" +
        SITE.homeOrgs.map(function (o) { return "<li>" + esc(o) + "</li>"; }).join("") + "</ul>" +
        (SITE.homeOrgsNote ? "<p>" + esc(SITE.homeOrgsNote) + "</p>" : "") + "</section>";
    }
    $("#view").innerHTML = html;
  }

  // ---------- 새 메뉴 (미리보기) ----------
  function fixBox(card, t) {
    if (!MENU || card.followup) return "";
    var list = MENU.fix[t.kind] || MENU.fix.text;
    return '<details class="fix"><summary>결과가 다르면 · 고쳐 보기</summary>' +
      '<p class="fix-lead">AI가 요청과 다르게 만들 때가 있어요. 고치고 싶은 것을 하나 골라 보세요.</p>' +
      '<div class="fix-btns">' + list.map(function (x) {
        return '<button type="button" class="opt" data-fix="' + esc(x[1]) + '" aria-pressed="false">' + esc(x[0]) + "</button>";
      }).join("") + "</div>" +
      '<div class="fix-out" id="fixOut" hidden><p class="fix-cap">AI에게 이어서 보낼 말</p><p class="sentence" id="fixText"></p>' +
      '<button type="button" class="fix-copy" id="fixCopy">이 문장 복사하기</button>' +
      '<p class="fix-note">결과를 받은 같은 대화에 붙여넣어 보내세요. 다시 해도 꼭 고쳐지는 것은 아니에요.</p></div></details>';
  }
  var ICONS = {
    draw: '<path class="g" d="M6 26l1.8-6.2 4.4 4.4z"/><path d="M9.5 18.5L21 7l4 4-11.5 11.5z"/><path d="M19 9l4 4"/>',
    photo: '<rect x="4.5" y="6.5" width="23" height="19" rx="3"/><circle class="g" cx="11.5" cy="12.5" r="2.6"/><path d="M5 22.5l6.5-5.5 4.5 3.5 4.5-4.5 6.5 6"/>',
    song: '<path d="M12.5 22.5V8l12.5-2.8v14.3"/><circle class="g" cx="9" cy="22.5" r="3.6"/><circle class="g" cx="21.5" cy="19.5" r="3.6"/>',
    video: '<rect x="4.5" y="6.5" width="23" height="19" rx="3.5"/><path class="g" d="M13.2 11.2v9.6l8.3-4.8z"/>',
    write: '<path d="M8.5 4.5h10.5l5.5 5.5v17.5h-16z"/><path d="M19 4.5v5.5h5.5"/><path class="gs" d="M12.5 16h7"/><path d="M12.5 21h7"/>',
    ask: '<path d="M5 6.5h22v15.5H15.5l-6 5v-5H5z"/><path class="gs" d="M13.2 12.3a2.9 2.9 0 1 1 4.3 2.5c-1 .6-1.5 1.1-1.5 2"/><circle class="g" cx="16" cy="19.2" r="1.1"/>',
    gif: '<rect class="gf" x="9.5" y="11.5" width="13" height="9.5" rx="2.5"/><path d="M6.5 16.5a9.5 9.5 0 0 1 14.5-8.1"/><path d="M25.5 15.5a9.5 9.5 0 0 1-14.5 8.1"/><path d="M20.5 4.2v4.4h-4.4"/><path d="M11.5 27.8v-4.4h4.4"/>',
    safe: '<path class="gf" d="M16 4.5l10 3.5v8c0 6.2-4.1 10.1-10 11.5-5.9-1.4-10-5.3-10-11.5v-8z"/><path d="M16 4.5l10 3.5v8c0 6.2-4.1 10.1-10 11.5-5.9-1.4-10-5.3-10-11.5v-8z"/><path d="M11.5 15.8l3.2 3.2 6-6.4"/>',
    learn: '<path class="gf" d="M11.5 20.5a7.5 7.5 0 1 1 9 0v3h-9z"/><path d="M11.5 20.5a7.5 7.5 0 1 1 9 0v3h-9z"/><path d="M12.5 27.5h7"/>'
  };
  function iconHtml(id) {
    return ICONS[id] ? '<span class="mrow-ico" aria-hidden="true"><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' + ICONS[id] + "</svg></span>" : "";
  }
  function rowHtml(href, title, hint, extra, ico) {
    return '<li><a class="mrow' + (ico ? " has-ico" : "") + '" href="' + href + '">' + iconHtml(ico) + '<span class="mrow-txt"><b>' + title + "</b>" +
      (hint ? "<span>" + esc(hint) + "</span>" : "") + "</span>" + (extra || "") + '<span class="tile-go" aria-hidden="true"></span></a></li>';
  }
  function renderHomeMenu() {
    renderTop(null);
    hideDock();
    var last = cardById(ss("lastCard"));
    var html = '<h1 class="lead home-q">' + esc(MENU.title) + "</h1>" +
      '<ul class="mlist">' + MENU.cats.map(function (c) { return rowHtml("#/cat/" + c.id, esc(c.title), c.hint, "", c.id); }).join("") + "</ul>" +
      '<ul class="mlist learn-row">' + rowHtml("#/cat/learn", esc(MENU.learn.title), MENU.learn.hint, "", "learn") + "</ul>" +
      '<a class="first-time" href="#/start">처음 사용해요 · 사용 방법 보기</a>';
    var hv = homeVariant();
    if (hv) {
      var pics = [["11-1", "11_ot_hanbok_yeo.jpg", "옷 갈아입히기"], ["2-1", "2_seutail_suchaehwa.jpg", "그림 그리기"], ["10-1", "10-1_goyangikkamjjak.jpg", "움직이는 그림"], ["4-4", "1_hom_80nyeondaegyeolhonsajin_jeongsagak.jpg", "옛날 사진 복원"], ["2-4", "2-4_saengil.jpg", "축하 카드"], ["4-5", "2-3_halriudeu_nam.jpg", "말하는 영상"], ["3-5", "3_teuroteu.jpg", "노래 만들기"], ["4-7", "4-2_danpung.jpg", "글로 영상"]]
        .filter(function (p) { return cardById(p[0]); });
      var hero = '<section class="play-hero"><h1 class="play-title">오늘은 AI로 <br>무엇을 해 볼까요?</h1>' +
        '<p class="play-kicker">만들고 싶은 것, 궁금한 것을 골라 보세요.</p>' +
        '<div class="play-strip" role="list" aria-label="바로 해 보기">' + pics.map(function (p, i) {
          return '<a class="play-pic p' + (i % 2) + '" role="listitem" href="#/card/' + p[0] + '"><i class="pp-img"><img src="' + src(p[1], true) + '" alt="" loading="lazy"><em>AI로 만든 예시</em></i><span>' + p[2] + "</span></a>";
        }).join("") + '</div></section>';
      var cats = MENU.cats.concat([{ id: "learn", title: MENU.learn.title, hint: MENU.learn.hint }]);
      var TH = { draw: "그림 · 축하 카드", gif: "움짤 · 답장용 표정", safe: "사기 · 가짜 소식 · 개인정보", photo: "옷 · 화보 · 복원", song: "바로 · 가사부터", video: "글로 · 사진으로", write: "문자 · 편지", ask: "궁금한 것 · 사진 글" };
      cats = cats.map(function (c) { return { id: c.id, title: c.title, hint: hv !== "a" && TH[c.id] ? TH[c.id] : c.hint }; });
      if (hv === "c") hero = hero.replace(/<div class="play-strip"[\s\S]*<\/div>(?=<\/section>)/, "");
      var TP = { draw: "2_seutail_suchaehwa.jpg", gif: "10-1_goyangikkamjjak.jpg", safe: "list_9-1.jpg", photo: "11_ot_hanbok_yeo.jpg", song: "3-5_baronorae.jpg", video: "4-3_sonheundeulgi.jpg", write: "1-1_munjabonaegi.jpg", ask: "9-4_gunggeumhaniyagi.jpg" };
      var menu = hv === "c"
        ? '<ul class="play-grid pic-grid">' + cats.map(function (c) {
            return '<li><a class="play-tile pic-tile t-' + c.id + '" href="#/cat/' + c.id + '">' + (TP[c.id] ? '<span class="pic-top"><img src="' + src(TP[c.id], true) + '" alt="" loading="lazy"></span>' : iconHtml(c.id)) + "<b>" + esc(c.title) + "</b><span>" + esc(c.hint) + "</span></a></li>";
          }).join("") + "</ul>"
        : hv === "b"
        ? '<ul class="play-grid">' + cats.map(function (c) {
            return '<li><a class="play-tile t-' + c.id + '" href="#/cat/' + c.id + '">' + iconHtml(c.id) + "<b>" + esc(c.title) + "</b><span>" + esc(c.hint) + "</span></a></li>";
          }).join("") + "</ul>"
        : '<ul class="mlist play-list">' + cats.map(function (c) { return rowHtml("#/cat/" + c.id, esc(c.title), c.hint, "", c.id).replace('class="mrow', 'class="mrow t-' + c.id); }).join("") + "</ul>";
      html = hero + menu + '<a class="first-time" href="#/start">처음 사용해요 · 사용 방법 보기</a>';
    }
    $("#view").innerHTML = html;
    var strip = $(".play-strip");
    clearInterval(stripTimer);
    if (strip) {
      // 마우스로 잡아 끌어 넘기기 (컴퓨터)
      var down = false, sx = 0, sl = 0, moved = false;
      strip.addEventListener("mousedown", function (e) { down = true; moved = false; sx = e.pageX; sl = strip.scrollLeft; strip.classList.add("drag"); });
      window.addEventListener("mouseup", function () { down = false; strip.classList.remove("drag"); });
      strip.addEventListener("mousemove", function (e) { if (!down) return; var dx = e.pageX - sx; if (Math.abs(dx) > 5) moved = true; strip.scrollLeft = sl - dx; e.preventDefault(); });
      strip.addEventListener("click", function (e) { if (moved) { e.preventDefault(); moved = false; } }, true);
      strip.addEventListener("dragstart", function (e) { e.preventDefault(); });
      // 천천히 저절로 넘어가기: 손대면 멈춤
      var stop = function () { clearInterval(stripTimer); };
      ["pointerdown", "touchstart", "wheel", "focusin"].forEach(function (ev) { strip.addEventListener(ev, stop, { passive: true }); });
      if (!REDUCE) stripTimer = setInterval(function () {
        if (!document.body.contains(strip)) return stop();
        var step = strip.querySelector(".play-pic").offsetWidth + 14;
        if (strip.scrollLeft + strip.clientWidth >= strip.scrollWidth - 4) strip.scrollTo({ left: 0, behavior: "smooth" });
        else strip.scrollBy({ left: step, behavior: "smooth" });
      }, 3200);
    }
    if (strip) [].forEach.call(document.querySelectorAll(".play-arrow"), function (b) {
      b.addEventListener("click", function () { clearInterval(stripTimer); strip.scrollBy({ left: Number(b.getAttribute("data-dir")) * Math.max(240, strip.clientWidth * 0.7), behavior: REDUCE ? "auto" : "smooth" }); });
    });
  }
  var stripTimer = 0;
  function homeVariant() {
    var m = /[?&]home=([abc])/.exec(location.search);
    var v = m ? m[1] : (MENU && MENU.home) || "";
    document.body.setAttribute("data-home", v);
    return v;
  }
  function renderCat(id) {
    if (id === "learn") return renderLearn();
    var c = catById(id);
    if (!c) { location.hash = "#/"; return; }
    renderTop({ id: c.id, title: c.title, href: "#/cat/" + c.id });
    hideDock();
    var html = '<h1 class="lead">' + esc(c.title) + "</h1>";
    c.sections.forEach(function (sec) {
      html += (sec.name ? '<h2 class="sec">' + esc(sec.name) + "</h2>" : "") + '<ul class="mlist cards-list">' +
        sec.cards.map(function (cid) {
          var k = cardById(cid);
          if (!k) return "";
          return '<li><a class="mrow has-pic" href="#/card/' + k.id + '">' +
            '<span class="mrow-pic">' + (k.img ? '<img src="' + src(pickFile(k.img, "여"), true) + '" alt="" loading="lazy" onerror="this.remove()">' : "") + "</span>" +
            '<span class="mrow-txt"><b>' + esc(k.title) + "</b>" +
            (k.photo ? '<span class="need-photo">사진 필요</span>' : "") + "</span>" +
            '<span class="tile-go" aria-hidden="true"></span></a></li>';
        }).join("") + "</ul>";
    });
    (c.more || []).forEach(function (m) {
      var mc = catById(m.cat);
      html += '<a class="also" href="#/cat/' + m.cat + '">' + esc(m.text) + " → <b>" + esc(mc.title) + "</b></a>";
    });
    $("#view").innerHTML = html;
  }
  function lrnJosa(w) {
    var c = w.charCodeAt(w.length - 1);
    if (c < 0xAC00 || c > 0xD7A3) return "를";
    return ((c - 0xAC00) % 28) !== 0 ? "을" : "를";
  }
  function lrnShell(t, bodyHtml) {
    return '<div class="lrn">' +
      '<aside class="lrn-side">' +
        '<p class="lrn-brand">AI 이해하기</p>' +
        '<p class="lrn-no">주제 ' + t.n + ' / 7</p>' +
        '<h1 class="lrn-title">' + esc(t.q) + '</h1>' +
        '<p class="lrn-q">' + t.sub + '</p>' +
        '<div class="lrn-sp"></div>' +
        '<nav class="lrn-nav"><a href="#/cat/learn">주제 목록</a>' +
        '<a href="#/learn/' + MENU.learn.topics[t.n % 7].id + '">다음 주제</a></nav>' +
      '</aside>' +
      '<main class="lrn-work" id="lrnWork">' + bodyHtml + '</main></div>';
  }
  function lrnHead(status, head, tools) {
    return '<p class="lrn-status">' + esc(status) + '</p><h2 class="lrn-op">' + esc(head) + '</h2>' +
      '<div class="lrn-bar">' + tools + "</div>";
  }
  function lrnSeg(items, id) {
    return '<div class="lrn-seg" role="group" id="' + id + '">' + items + "</div>";
  }
  var LRN = { _t: null };
  function lrnFig(file, cap) {
    return '<figure class="lrn-fig"><img src="' + IMG + file + '" alt="" loading="lazy" onerror="this.closest(\'figure\').remove()">' +
      '<figcaption>' + cap + "</figcaption></figure>";
  }
  /* 1 — 같은 입력 3번 비교 */
  LRN.how = function (w) {
    w.innerHTML = lrnHead("미리 만든 예시 · 실제 AI 실행 아님", "선택 방법을 바꿔 비교해 보세요",
      lrnSeg('<button type="button" id="lm1" aria-pressed="false">1등만 고르기</button>' +
             '<button type="button" id="lm2" aria-pressed="true">2·3등도 고르기</button>', "lseg") +
      '<div class="lrn-acts"><button class="lrn-btn pri" id="lrun">3번 비교하기</button>' +
      '<button class="lrn-btn plain" id="lrst">다시 보기</button></div>') +
      '<div class="lrn-card"><div class="lrn-split"><div><p class="lrn-lab">같은 입력</p>' +
      '<p class="lrn-inp">오늘 점심에는 <span class="lrn-slot"></span></p>' +
      '<p class="lrn-side-note">빈칸에 들어갈 말을<br>오른쪽에서 고릅니다.</p></div>' +
      '<div><p class="lrn-lab">다음 말 후보</p><div class="lrn-cands">' +
      '<div class="lrn-cand"><span class="lrn-cw">국수를</span><span class="lrn-bar2"><i style="width:55%"></i></span><span class="lrn-pc">55%</span></div>' +
      '<div class="lrn-cand"><span class="lrn-cw">김밥을</span><span class="lrn-bar2"><i style="width:30%"></i></span><span class="lrn-pc">30%</span></div>' +
      '<div class="lrn-cand"><span class="lrn-cw">비빔밥을</span><span class="lrn-bar2"><i style="width:15%"></i></span><span class="lrn-pc">15%</span></div>' +
      '</div><p class="lrn-once">설명용 가상 수치</p></div></div></div>' +
      '<h3 class="lrn-sec">같은 입력으로 3번 비교</h3><div class="lrn-table" id="ltb"></div>' +
      '<p class="lrn-note" id="lnt">가능한 말을 다르게 고르면 답도 달라질 수 있어요.</p>';
    var LAB = ["첫 번째", "두 번째", "세 번째"], MIX = ["국수", "김밥", "비빔밥"], ONE = ["국수", "국수", "국수"];
    var onlyTop = false, shown = false, tb = $("#ltb"), nt = $("#lnt");
    function render(ws) {
      tb.innerHTML = "";
      if (!ws) { tb.innerHTML = '<p class="lrn-ghost">[3번 비교하기]를 누르면 결과가 나옵니다.</p>'; return; }
      ws.forEach(function (x, i) {
        var d = document.createElement("div"); d.className = "lrn-row";
        d.innerHTML = '<span class="lrn-rl">' + LAB[i] + '</span><span class="lrn-rt">오늘 점심에는 <mark>' +
          esc(x) + "</mark>" + lrnJosa(x) + " 먹었어요.</span>";
        tb.appendChild(d);
      });
    }
    function draw() {
      shown = true; render(onlyTop ? ONE : MIX);
      nt.textContent = onlyTop
        ? "1등만 고르게 하면 세 번 모두 같은 말이 나옵니다. 답은 안정되지만 표현이 단조로워집니다."
        : "가능한 말을 다르게 고르면 답도 달라질 수 있어요.";
    }
    function mode(v) {
      onlyTop = v;
      $("#lm1").setAttribute("aria-pressed", v ? "true" : "false");
      $("#lm2").setAttribute("aria-pressed", v ? "false" : "true");
      if (shown) draw();
    }
    $("#lm1").onclick = function () { mode(true); };
    $("#lm2").onclick = function () { mode(false); };
    $("#lrun").onclick = draw;
    $("#lrst").onclick = function () { shown = false; render(null); nt.textContent = "가능한 말을 다르게 고르면 답도 달라질 수 있어요."; };
    render(null);
  };
  /* 2 — 글쓰기 */
  LRN.text = function (w) {
    var PIECES = ["가을이면", "마당의", "감나무가", "붉어집니다.", "아침마다", "떨어진", "잎을", "쓸면서",
      "한 해가", "또", "지났구나", "생각합니다."];
    var FULL = PIECES.join(" ");
    var step = 1, cut = 2, pos = 0;
    function head() {
      return lrnHead("미리 만든 예시 · 실제 AI 실행 아님", "긴 글이 만들어지는 과정을 단계로 나눠 보세요",
        lrnSeg('<button type="button" id="ls1">1. 한 줄씩 나옵니다</button>' +
               '<button type="button" id="ls2">2. 앞 글을 다시 읽습니다</button>' +
               '<button type="button" id="ls3">3. 길어지면 조건을 놓칩니다</button>', "lst") +
        '<div class="lrn-acts" id="lact"></div>');
    }
    function paint() {
      w.innerHTML = head() + '<div id="lbody"></div><p class="lrn-note" id="lnt"></p>';
      $("#ls1").setAttribute("aria-pressed", step === 1 ? "true" : "false");
      $("#ls2").setAttribute("aria-pressed", step === 2 ? "true" : "false");
      $("#ls3").setAttribute("aria-pressed", step === 3 ? "true" : "false");
      $("#ls1").onclick = function () { step = 1; pos = 0; paint(); };
      $("#ls2").onclick = function () { step = 2; cut = 2; paint(); };
      $("#ls3").onclick = function () { step = 3; paint(); };
      var body = $("#lbody"), act = $("#lact"), nt = $("#lnt");
      if (step === 1) {
        act.innerHTML = '<button class="lrn-btn pri" id="lgo">한 글자씩 써 보기</button>' +
          '<button class="lrn-btn plain" id="lall">끝까지 한 번에</button>';
        body.innerHTML = '<div class="lrn-card"><p class="lrn-lab">부탁한 말</p>' +
          '<p class="lrn-inp">가을 마당 이야기를 짧게 써 줘</p>' +
          '<p class="lrn-lab" style="margin-top:18px">AI가 쓰는 모습</p>' +
          '<p class="lrn-inp lrn-plain" id="ltype"><span class="lrn-cur"></span></p></div>';
        nt.innerHTML = "AI는 완성된 글을 어디에서 꺼내 오지 않습니다. <b>앞에서부터 한 조각씩</b> 만들어 붙입니다. 그래서 글이 왼쪽부터 차례로 나타납니다.";
        var tgt = $("#ltype");
        function tick() {
          pos += 1;
          if (!document.body.contains(tgt)) { clearInterval(LRN._t); return; }
          tgt.innerHTML = esc(FULL.slice(0, pos)) + (pos < FULL.length ? '<span class="lrn-cur"></span>' : "");
          if (pos >= FULL.length) clearInterval(LRN._t);
        }
        $("#lgo").onclick = function () { clearInterval(LRN._t); pos = 0; tgt.innerHTML = '<span class="lrn-cur"></span>'; LRN._t = setInterval(tick, 55); };
        $("#lall").onclick = function () { clearInterval(LRN._t); pos = FULL.length; tgt.textContent = FULL; };
      } else if (step === 2) {
        act.innerHTML = '<button class="lrn-btn pri" id="lnx">다음 한 조각</button>' +
          '<button class="lrn-btn plain" id="lrs">처음부터</button>';
        function draw2() {
          var done = PIECES.slice(0, cut).join(" "), next = PIECES[cut] || "";
          body.innerHTML = '<div class="lrn-card"><div class="lrn-split">' +
            '<div><p class="lrn-lab">지금까지 쓴 글<br><span class="lrn-side-note" style="margin:0">매번 처음부터 다시 읽습니다</span></p>' +
            '<p class="lrn-inp lrn-plain" id="ldone">' + (done ? esc(done) : "—") + "</p></div>" +
            '<div><p class="lrn-lab">다음 한 조각</p>' +
            (next ? '<p class="lrn-inp"><mark>' + esc(next) + "</mark></p>"
                  : '<p class="lrn-inp lrn-plain">더 이어 쓸 말이 없다고 판단하면 멈춥니다.</p>') + "</div></div></div>" +
            lrnFig("learn_in_02.jpg", "앞의 글을 전부 다시 읽고 다음 한 조각을 고릅니다 — 설명용 모형");
          nt.innerHTML = cut >= PIECES.length
            ? "조각 " + PIECES.length + "개가 모여 한 문단이 됐습니다. <b>한 조각을 고를 때마다 앞 글 전체를 다시 읽습니다.</b> 그래서 글이 길어질수록 읽어야 할 양도 함께 늘어납니다."
            : "왼쪽 글을 전부 읽고, 거기에 가장 잘 이어질 말 하나를 고릅니다. 이 과정을 글이 끝날 때까지 반복합니다.";
        }
        $("#lnx").onclick = function () { if (cut < PIECES.length) cut++; draw2(); };
        $("#lrs").onclick = function () { cut = 2; draw2(); };
        draw2();
      } else {
        act.innerHTML = "";
        body.innerHTML = '<div class="lrn-card"><p class="lrn-lab">부탁한 말 (두 번 모두 같음)</p>' +
          '<p class="lrn-inp">감나무 이야기를 <mark>3문장으로</mark> 써 줘</p></div>' +
          '<div class="lrn-split even" style="margin-top:4px">' +
          '<div class="lrn-card"><p class="lrn-lab">짧게 쓰게 했을 때</p>' +
          '<p class="lrn-inp lrn-plain">마당에 감나무 한 그루가 있습니다. 가을이면 잎이 붉어집니다. 올해는 감이 많이 달렸습니다.</p>' +
          '<p class="lrn-once">3문장 — 조건을 지켰습니다.</p></div>' +
          '<div class="lrn-card"><p class="lrn-lab">길게 쓰게 했을 때</p>' +
          '<p class="lrn-inp lrn-plain">마당에 감나무 한 그루가 있습니다. 가을이면 잎이 붉게 물듭니다. ' +
          '<mark>감나무는</mark> 해마다 다른 모습을 보여 줍니다. 올해는 감이 유난히 많이 달렸습니다. ' +
          '<mark>감나무를</mark> 보고 있으면 한 해가 지났다는 생각이 듭니다. 내년에도 잘 자랐으면 좋겠습니다.</p>' +
          '<p class="lrn-once">6문장 — 조건을 넘겼고, 같은 말이 반복됩니다.</p></div></div>';
        nt.innerHTML = "글이 길어지면 <b>처음에 준 중요한 조건을 놓칠 수 있고</b>, 같은 표현이 반복되기도 합니다. 긴 글은 한 번에 시키지 말고 <b>나눠서 시키고, 조건은 마지막에 한 번 더</b> 적어 주세요.";
      }
    }
    paint();
  };
  /* 3 — 확산 */
  LRN.image = function (w) {
    w.innerHTML = lrnHead("확산 방식을 단순화한 예시 · 실제 생성 기록 아님", "단계를 넘기며 형태가 드러나는 것을 보세요",
      lrnSeg("", "lsd") +
      '<div class="lrn-acts"><button class="lrn-btn pri" id="lnx">다음 단계</button>' +
      '<button class="lrn-btn plain" id="lag">같은 요청으로 다시</button></div>') +
      lrnFig("learn_in_03.jpg", "확산 방식의 설명용 모형입니다 — 실제 생성 중간 결과는 아닙니다") +
      '<div class="lrn-card"><div class="lrn-split"><div><p class="lrn-lab">같은 요청</p>' +
      '<p class="lrn-inp">둥근 그릇을 그려 줘</p><p class="lrn-side-note">두 번 돌린 결과를<br>나란히 놓았습니다.</p></div>' +
      '<div><p class="lrn-lab">만들어지는 과정</p><div class="lrn-two">' +
      '<div><p class="lrn-capm">첫 번째</p><canvas id="lc1" width="420" height="280"></canvas></div>' +
      '<div><p class="lrn-capm">두 번째</p><canvas id="lc2" width="420" height="280"></canvas></div>' +
      '</div></div></div></div><p class="lrn-note" id="lnt"></p>';
    var S = 0, MAX = 4, s1 = Math.random() * 999, s2 = Math.random() * 999;
    var NAMES = ["무작위 얼룩", "큰 덩어리", "형태", "세부"];
    function rnd(x) { var v = Math.sin(x) * 10000; return v - Math.floor(v); }
    function paintC(id, seed) {
      var c = $("#" + id); if (!c) return;
      var x = c.getContext("2d"), W = c.width, H = c.height, cl = S / MAX;
      x.fillStyle = "#fff"; x.fillRect(0, 0, W, H);
      var pts = Math.round(1300 * (1 - cl) + 50);
      for (var i = 0; i < pts; i++) {
        x.fillStyle = "rgba(27,42,64," + (0.10 + 0.15 * (1 - cl)) + ")";
        x.fillRect(rnd(seed + i * 1.7) * W, rnd(seed + i * 3.1) * H, 2.5, 2.5);
      }
      if (S > 0) {
        var r = 46 + rnd(seed + 9) * 50, cx = W / 2 + (rnd(seed) * 2 - 1) * 46, cy = H / 2 + 8 + (rnd(seed + 4) * 2 - 1) * 22;
        var rot = (rnd(seed + 7) * 2 - 1) * 0.28, sq = 0.48 + rnd(seed + 2) * 0.3;
        x.save(); x.globalAlpha = Math.min(1, cl * 1.15);
        x.beginPath(); x.ellipse(cx, cy, r, r * sq, rot, 0, Math.PI * 2);
        x.fillStyle = rnd(seed + 5) > 0.5 ? "#efe9dc" : "#e4e7ea"; x.fill();
        x.lineWidth = 3; x.strokeStyle = "#1b2a40"; x.stroke();
        x.beginPath(); x.ellipse(cx, cy - r * sq * 0.55, r * 0.92, r * sq * 0.34, rot, 0, Math.PI * 2);
        x.strokeStyle = "rgba(27,42,64,.45)"; x.lineWidth = 2; x.stroke(); x.restore();
      }
    }
    function paint() {
      var sd = $("#lsd"); sd.innerHTML = "";
      NAMES.forEach(function (nm, i) {
        var b = document.createElement("button"); b.type = "button";
        b.setAttribute("aria-pressed", S === i + 1 ? "true" : "false");
        b.textContent = (i + 1) + ". " + nm;
        b.onclick = function () { S = i + 1; paint(); };
        sd.appendChild(b);
      });
      paintC("lc1", s1); paintC("lc2", s2);
      $("#lnt").textContent = S >= MAX
        ? "같은 요청인데 두 그림이 다릅니다. 시작한 얼룩이 달랐기 때문입니다. 사진을 찾아온 것이 아니라 매번 새로 만든 것입니다."
        : "점에서 시작해 단계마다 조금씩 형태를 또렷하게 만듭니다.";
    }
    $("#lnx").onclick = function () { if (S < MAX) { S++; paint(); } };
    $("#lag").onclick = function () { S = 0; s1 = Math.random() * 999; s2 = Math.random() * 999; paint(); };
    paint();
  };
  /* 4 — 조건 조각 */
  LRN.ask = function (w) {
    var OPT = [{ k: "누구에게", v: "환갑잔치에 못 오신 사촌에게" },
               { k: "무슨 일로", v: "안부를 묻는" },
               { k: "말투·길이", v: "서운함 없이 따뜻한 말투로, 3문장" }];
    var OUT = { "000": "안녕하세요. 잘 지내시죠? 연락 한번 드립니다.",
      "100": "안녕하세요, 잘 지내시는지요. 한번 뵙고 싶습니다.",
      "010": "잘 지내시죠? 언제 한번 뵙겠습니다.",
      "001": "그동안 잘 지내셨어요? 늘 고맙습니다. 곧 연락드리겠습니다.",
      "110": "잘 지내셨어요? 오랜만에 안부 여쭙습니다. 건강은 어떠신지 궁금합니다.",
      "101": "형님, 잘 지내셨어요? 늘 마음 쓰고 있습니다. 조만간 찾아뵙겠습니다.",
      "011": "잘 지내셨어요? 오랜만에 소식 여쭙습니다. 조만간 찾아뵐게요.",
      "111": "형님, 그동안 잘 지내셨어요? 환갑 때 못 뵈어 아쉬웠습니다. 날 풀리면 꼭 한번 들르겠습니다." };
    var on = [false, false, false];
    w.innerHTML = lrnHead("미리 만든 예시 · 실제 AI 실행 아님", "조건을 켜고 끄며 결과를 비교해 보세요",
      lrnSeg("", "lsw") + '<div class="lrn-acts"><button class="lrn-btn plain" id="lrst">다시 보기</button></div>') +
      '<div class="lrn-card"><div class="lrn-split"><div><p class="lrn-lab">완성된 요청</p>' +
      '<p class="lrn-inp" id="lreq"></p></div><div><p class="lrn-lab">AI가 돌려준 글</p>' +
      '<p class="lrn-inp lrn-plain" id="lout"></p></div></div></div><p class="lrn-note" id="lnt"></p>';
    var sw = $("#lsw");
    OPT.forEach(function (o, i) {
      var b = document.createElement("button"); b.type = "button";
      b.setAttribute("aria-pressed", "false"); b.textContent = o.k;
      b.onclick = function () { on[i] = !on[i]; b.setAttribute("aria-pressed", on[i] ? "true" : "false"); paint(); };
      sw.appendChild(b);
    });
    function paint() {
      var key = on.map(function (x) { return x ? "1" : "0"; }).join(""), p = [];
      if (on[0]) p.push(OPT[0].v);
      if (on[1]) p.push(OPT[1].v);
      p.push("문자 써 줘");
      if (on[2]) p.push("— " + OPT[2].v);
      $("#lreq").textContent = p.join(" ");
      $("#lout").textContent = OUT[key];
      var c = on.filter(Boolean).length;
      $("#lnt").textContent = c === 0 ? "조건이 없으면 누구에게 쓰는 글인지 알 수 없는 답이 나옵니다."
        : (c === 3 ? "세 조각을 다 넣으니 그대로 보내도 될 만한 글이 됐습니다." : "조각 " + c + "개를 넣었습니다. 더 넣어 보세요.");
    }
    $("#lrst").onclick = function () {
      on = [false, false, false];
      [].slice.call(sw.children).forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
      paint();
    };
    paint();
  };
  /* 5 — 환각 */
  LRN.wrong = function (w) {
    var Q = [{ a: "세종대왕은 훈민정음을 1443년에 창제하고 1446년에 반포했습니다.",
        b: "세종대왕은 훈민정음을 만들며 집현전 학자에게 자판 배열을 맡겼습니다.",
        aw: "공식 기록과 연도·사건이 일치합니다.",
        bw: "그럴듯하지만 사실이 아닙니다. ‘자판 배열’은 현대의 개념입니다." },
      { a: "이 약은 복용법이 사람마다 달라 약사에게 확인하셔야 합니다.",
        b: "이 약은 하루 세 번, 식후 30분에 드시면 됩니다.",
        aw: "신중한 답입니다. 다만 신중한 말투라고 늘 맞는 것은 아닙니다.",
        bw: "단정적이지만 약은 사람과 증상에 따라 다릅니다. 반드시 전문가에게 확인해야 합니다." }];
    var i = 0;
    function paint() {
      var o = Q[i];
      w.innerHTML = lrnHead("설명용 예시", "그대로 믿어도 되는 답은 어느 쪽일까요?",
        lrnSeg('<button type="button" aria-pressed="true">문제 ' + (i + 1) + " / " + Q.length + "</button>", "lsq") +
        '<div class="lrn-acts"><button class="lrn-btn pri" id="lnx">' + (i < Q.length - 1 ? "다음 문제" : "처음으로") + "</button></div>") +
        '<div class="lrn-card"><div class="lrn-split even"><div><p class="lrn-lab">답 ①</p>' +
        '<p class="lrn-inp lrn-plain">' + esc(o.a) + '</p></div><div><p class="lrn-lab">답 ②</p>' +
        '<p class="lrn-inp lrn-plain">' + esc(o.b) + "</p></div></div></div>" +
        '<div class="lrn-pick"><button class="lrn-pickb">① 이 맞다</button>' +
        '<button class="lrn-pickb">② 가 맞다</button>' +
        '<button class="lrn-pickb wide">지금은 판단하기 어려워요</button></div>' +
        '<div class="lrn-why" id="lwhy" hidden></div>';
      [].slice.call(w.querySelectorAll(".lrn-pickb")).forEach(function (b) {
        b.onclick = function () {
          var y = $("#lwhy"); y.hidden = false;
          y.innerHTML = "<b>답 ①</b> — " + esc(o.aw) + "<br><br><b>답 ②</b> — " + esc(o.bw) +
            '<br><br>두 답 모두 자신 있는 말투였습니다. <b>말투만 보고는 가려낼 수 없습니다.</b> 중요한 내용은 공식 자료와 비교하세요.' +
            '<span class="lrn-src">근거: OpenAI, <a href="https://openai.com/index/why-language-models-hallucinate/" target="_blank" rel="noopener">Why language models hallucinate</a></span>';
        };
      });
      $("#lnx").onclick = function () { i = (i + 1) % Q.length; paint(); };
    }
    paint();
  };
  /* 6 — 내 글의 위치 */
  LRN.where = function (w) {
    var ST = [{ t: "체험관에서 고르기", p: "내 기기 안", d: "아직 아무 데도 가지 않았습니다. 고른 내용은 이 화면 안에만 있습니다." },
      { t: "복사하기", p: "내 기기 안", d: "기기의 임시 보관함에 담겼습니다. <b>복사는 전송이 아닙니다.</b>" },
      { t: "AI 앱에 붙여넣기", p: "내 기기 안", d: "앱 입력창에 들어갔습니다. 여기까지도 내 기기 안입니다." },
      { t: "보내기", p: "외부 서비스로", d: "이제 내용이 <b>그 회사의 서버로 전송</b>됩니다. 보관·학습 사용 여부는 서비스와 계정 설정에 따라 다릅니다." }];
    var i = 0;
    w.innerHTML = lrnHead("체험관은 입력한 글을 수집하거나 외부로 보내지 않습니다", "단계를 눌러 내 글의 위치를 확인하세요",
      lrnSeg("", "lsw") + '<div class="lrn-acts"></div>') +
      lrnFig("learn_in_06.jpg", "점선은 외부 서비스로 작업 공간이 바뀌는 경계입니다 — 전송 시점을 보장하는 표시가 아닙니다") +
      '<div class="lrn-card"><div class="lrn-split"><div><p class="lrn-lab">지금 내 글의 위치</p>' +
      '<p class="lrn-inp" id="lpos"></p></div><div><p class="lrn-lab">무슨 일이 일어나는가</p>' +
      '<p class="lrn-inp lrn-plain" id="ldsc"></p></div></div></div><p class="lrn-note" id="lnt"></p>';
    var sw = $("#lsw");
    ST.forEach(function (o, k) {
      var b = document.createElement("button"); b.type = "button";
      b.textContent = (k + 1) + ". " + o.t;
      b.onclick = function () { i = k; paint(); };
      sw.appendChild(b);
    });
    function paint() {
      [].slice.call(sw.children).forEach(function (b, k) { b.setAttribute("aria-pressed", k === i ? "true" : "false"); });
      $("#lpos").textContent = ST[i].p;
      $("#ldsc").innerHTML = ST[i].d;
      $("#lnt").innerHTML = i < 3 ? "여기까지는 <b>내 기기 안</b>입니다."
        : "<b>이 지점부터 외부로 나갑니다.</b> 보내기 전에 주민번호·계좌번호 같은 비밀정보가 없는지 확인하세요.";
    }
    paint();
  };
  /* 7 — 안전 */
  LRN.safe = function (w) {
    var C = [{ q: "주민번호나 비밀번호를 그대로 넣어도 될까요?", ok: false, r: "비밀정보는 빼고 상황만 설명하세요." },
      { q: "이름만 가린 사진이면 보내도 될까요?", ok: false, r: "얼굴·주소·전화번호 같은 다른 정보도 함께 확인하세요." },
      { q: "AI가 자신 있게 답하면 확인 없이 써도 될까요?", ok: false, r: "중요한 사실은 공식 자료와 비교하세요." },
      { q: "마음에 안 들면 조건 하나를 바꿔 다시 부탁해도 될까요?", ok: true, r: "됩니다. 말투나 길이처럼 바꿀 부분을 알려 주세요." },
      { q: "친구 사진을 허락 없이 올려도 될까요?", ok: false, r: "사진 속 사람에게 먼저 허락을 받으세요." },
      { q: "AI가 쓴 글도 보내기 전에 이름·날짜를 확인할까요?", ok: true, r: "네. 실제로 보낼 내용은 내가 마지막으로 확인하세요." }];
    var i = 0;
    function paint() {
      var o = C[i];
      w.innerHTML = lrnHead("점수를 매기지 않습니다. 다시 눌러 보셔도 됩니다", "보내기 전에 한 번씩 확인하세요",
        lrnSeg('<button type="button" aria-pressed="true">질문 ' + (i + 1) + " / " + C.length + "</button>", "lsc") +
        '<div class="lrn-acts"><button class="lrn-btn plain" id="lpv">이전</button>' +
        '<button class="lrn-btn pri" id="lnx">' + (i < C.length - 1 ? "다음 질문" : "처음으로") + "</button></div>") +
        '<div class="lrn-card"><p class="lrn-lab">질문</p><p class="lrn-inp">' + esc(o.q) + "</p></div>" +
        '<div class="lrn-pick"><button class="lrn-pickb">해도 돼요</button>' +
        '<button class="lrn-pickb">안 돼요</button></div>' +
        '<div class="lrn-why" id="lwhy" hidden></div>';
      [].slice.call(w.querySelectorAll(".lrn-pickb")).forEach(function (b) {
        b.onclick = function () {
          var y = $("#lwhy"); y.hidden = false;
          y.innerHTML = "<b>" + (o.ok ? "해도 됩니다" : "하지 않는 것이 좋습니다") + "</b><br>" + esc(o.r);
        };
      });
      $("#lnx").onclick = function () { i = (i + 1) % C.length; paint(); };
      $("#lpv").onclick = function () { i = (i - 1 + C.length) % C.length; paint(); };
    }
    paint();
  };
  function renderLearn(topicId) {
    var L = MENU.learn;
    renderTop({ id: "learn", title: L.title, href: "#/cat/learn" }, topicId ? {} : null);
    hideDock();
    var t = topicId && L.topics.filter(function (x) { return x.id === topicId; })[0];
    if (!t) {
      $("#view").innerHTML = '<h1 class="lead">' + esc(L.title) + '</h1>' +
        '<p class="sub">AI가 어떻게 움직이는지 직접 돌려 보며 확인합니다.</p>' +
        '<ul class="mlist cards-list">' + L.topics.map(function (x) {
          return '<li><a class="mrow has-pic" href="#/learn/' + x.id + '">' +
            '<span class="mrow-pic"><img src="' + src(x.img, true) + '" alt="" loading="lazy" onerror="this.remove()"></span>' +
            '<span class="mrow-txt"><b>' + esc(x.q) + "</b>" +
            (x.ready ? "" : '<span class="need-photo">강사 준비 필요</span>') + "</span>" +
            '<span class="tile-go" aria-hidden="true"></span></a></li>';
        }).join("") + "</ul>";
      return;
    }
    clearInterval(LRN._t);
    $("#view").innerHTML = lrnShell(t, "");
    (LRN[t.id] || function (w) { w.innerHTML = '<p class="lrn-ghost">준비 중입니다.</p>'; })($("#lrnWork"));
  }
  function renderStart() {
    renderTop({ id: "start", title: "처음 사용해요", href: "#/start" });
    hideDock();
    var steps = [
      ["하고 싶은 것을 골라요", "그림, 노래, 글처럼 만들고 싶은 것을 누르고, 질문에 답하듯 단추를 골라요."],
      ["① 문장 복사하기를 눌러요", "AI에게 보낼 문장을 휴대폰이 잠시 기억해 두는 거예요. 화면에는 아무 변화가 없어도 괜찮아요."],
      ["② AI 열기를 눌러요", "챗GPT나 제미나이 같은 AI 화면이 새로 열려요. 이 체험관은 그대로 남아 있어요."],
      ["글자 칸을 꾹 눌러 붙여넣기", "AI 화면 아래쪽 글자 칸을 손가락으로 1초쯤 누르고 있으면 '붙여넣기'가 나와요. 그것을 누르면 문장이 들어가요."],
      ["보내기(↑)를 눌러요", "화살표 단추를 누르면 AI가 답을 만들기 시작해요. 사진이 필요한 활동은 보내기 전에 사진도 넣어요."]
    ];
    $("#view").innerHTML = '<h1 class="lead">처음 사용해요</h1><p class="sub">이 다섯 가지만 하면 돼요. 틀려도 괜찮아요. 언제든 다시 할 수 있어요.</p>' +
      '<ol class="start-steps">' + steps.map(function (x) { return "<li><b>" + esc(x[0]) + "</b><span>" + esc(x[1]) + "</span></li>"; }).join("") + "</ol>" +
      '<a class="hero-start start-go" href="#/card/5-1">연습해 보기 · AI에게 처음 말 걸기</a>';
  }

  // ---------- 탭 ----------
  function renderTab(id) {
    var t = tabById(id);
    if (!t) { location.hash = "#/"; return; }
    renderTop(t);
    hideDock();
    var list = cardsOf(t);
    var idx = SITE.tabs.indexOf(t);
    var next = SITE.tabs[idx + 1];
    $("#view").innerHTML =
      '<img class="page-art" src="img/brand/mark_navy.png" alt="">' +
      '<h1 class="lead">' + esc(t.title) + "</h1>" +
      '<p class="sub">' + esc(t.desc) + "</p>" +
      ((t.guide || (t.steps && t.steps.length))
        ? '<section class="after-box tab-guide"><h3>만드는 순서</h3>' +
          (t.guide ? '<p class="tab-guide-lead">' + esc(t.guide) + "</p>" : "") +
          (t.steps && t.steps.length ? '<ol class="after-steps">' + t.steps.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ol>" : "") +
          "</section>"
        : "") +
      '<ul class="cards' + (list.length === 6 ? " six" : "") + '">' + list.map(function (c) {
        return '<li><a class="card-link" href="#/card/' + c.id + '">' +
          thumb(c.img, c.icon || t.icon) +
          "<h3>" + titleHtml(c.title) + "</h3><p>" + esc(c.desc) + "</p></a></li>";
      }).join("") + "</ul>" +
      (list.length ? "" : '<p class="sub">아직 준비 중인 카드예요.</p>') +
      '<nav class="next" aria-label="다음 순서">' +
      (next
        ? '<a href="#/tab/' + next.id + '"><span>다음 순서</span><b>' + esc(next.title) + "</b></a>"
        : '<a href="#/"><span>다 둘러보셨어요</span><b>처음 화면으로</b></a>') +
      "</nav>";
  }

  // ---------- 카드 ----------
  function appsOf(card) { return card.app.indexOf("·") > -1 ? card.app.split("·") : [card.app]; }

  function groupValue(g) {
    if (isInput(g)) {
      var typed = (state.custom[g.key] || "").trim();
      if (typed) return typed;
      return g.optional ? g.items[0].text : null;
    }
    if (hasTyping(g)) {
      var c = (state.custom[g.key] || "").trim();
      if (c) return c;
    }
    var it = g.items[state.sel[g.key]] || g.items[0];
    return it.text || it.label;
  }

  // 화면 위 '내가 고른 것'에 보일 짧은 글
  function groupShort(g) {
    var typed = (state.custom[g.key] || "").trim();
    if (isInput(g) || (hasTyping(g) && typed)) {
      if (!typed) return null;
      return { text: typed.length > 10 ? typed.slice(0, 10) + "…" : typed, typed: true };
    }
    var it = g.items[state.sel[g.key]] || g.items[0];
    return { text: it.label, typed: false };
  }

  function buildSentence(card) {
    var html = "", plain = "", last = 0, re = /\{([^}]+)\}/g, m, missing = [];
    var t = card.template;
    while ((m = re.exec(t))) {
      var g = card.groups.filter(function (x) { return x.key === m[1]; })[0];
      var v = g ? groupValue(g) : m[0];
      html += esc(t.slice(last, m.index));
      plain += t.slice(last, m.index);
      if (v === null) {
        missing.push(g.key);
        html += '<mark class="empty" data-k="' + esc(m[1]) + '">[' + esc(g.q) + "]</mark>";
        plain += "[" + g.q + "]";
      } else {
        html += '<mark data-k="' + esc(m[1]) + '">' + esc(v) + "</mark>";
        plain += v;
      }
      last = re.lastIndex;
    }
    html += esc(t.slice(last));
    plain += t.slice(last);
    return { html: html, plain: plain, missing: missing };
  }

  // 카드별 규칙: 1-1 위로·조문이면 '유쾌하게' 말투는 고를 수 없게
  function applyRules(card) {
    if (card.id !== "1-1") return;
    var sit = card.groups.filter(function (g) { return g.key === "상황"; })[0];
    var tone = card.groups.filter(function (g) { return g.key === "말투"; })[0];
    if (!sit || !tone) return;
    var mourning = sit.items[state.sel["상황"]].label.indexOf("위로") > -1;
    var funIdx = -1;
    tone.items.forEach(function (it, i) { if (it.label.indexOf("유쾌") > -1) funIdx = i; });
    if (funIdx < 0) return;
    var btn = document.querySelector('[data-g="말투"][data-i="' + funIdx + '"]');
    if (btn) btn.disabled = mourning;
    if (mourning && state.sel["말투"] === funIdx) {
      state.sel["말투"] = 1;
      syncPressed("말투");
    }
  }

  function syncPressed(key) {
    var typed = (state.custom[key] || "").trim() !== "";
    $$('[data-g="' + key + '"]').forEach(function (b) {
      b.setAttribute("aria-pressed", String(!typed && +b.getAttribute("data-i") === state.sel[key]));
    });
  }

  function updateSentence(card, changedKey) {
    if (MENU && changedKey !== undefined && state && ss("undo:" + state.card)) { ss("undo:" + state.card, null); var ub = $("#undoBtn"); if (ub) ub.remove(); }
    var dk = $("#dock"), cb = $("#copyBtn");
    if (dk && dk.classList.contains("copied")) { dk.classList.remove("copied"); if (cb) { cb.textContent = "① 문장 복사하기"; cb.classList.remove("done"); } }
    var s = buildSentence(card);
    state.plain = s.plain;
    state.missing = s.missing;
    var box = $("#sentence");
    var edited = state.edited !== null && state.edited !== undefined;
    box.classList.toggle("edited", edited);
    box.innerHTML = edited ? esc(state.edited).replace(/\n/g, "<br>") : s.html;
    var eb = $("#editBtn"); if (eb) eb.textContent = edited ? "✏️ 고친 문장 다시 고치기" : "✏️ 문장 직접 고치기";
    var en = $("#editNote"); if (en) en.hidden = !edited;
    updateTypedNote(card);
    if (changedKey && !REDUCE && !edited) {
      box.querySelectorAll('mark[data-k="' + changedKey + '"]').forEach(function (mk) { mk.classList.add("flash"); });
    }
  }

  function updateTypedNote(card) {
    var tn = $("#typedNote");
    if (tn && state) tn.hidden = !(card.groups.some(function (g) { var p = groupShort(g); return p && p.typed; }) || (state.edited !== null && state.edited !== undefined));
  }
  function updatePicked(card, changedKey) {
    updateTypedNote(card);
    var list = $("#pickedList");
    if (!list) return;
    list.innerHTML = card.groups.map(function (g) {
      var p = groupShort(g);
      if (!p) return "";
      return '<li data-k="' + esc(g.key) + '"' + (p.typed ? ' class="typed"' : "") + ">" + esc(p.text) + "</li>";
    }).join("");
    if (changedKey && !REDUCE) {
      var li = list.querySelector('li[data-k="' + changedKey + '"]');
      if (li) {
        li.classList.add("pop");
        if (li.scrollIntoView && list.scrollWidth > list.clientWidth) {
          list.scrollLeft = li.offsetLeft - list.offsetLeft - 8;
        }
      }
    }
  }

  function updateMoreNow(card) {
    var now = $("#moreNow");
    if (!now) return;
    var parts = card.groups.filter(function (g) { return g.more; }).map(function (g) {
      var p = groupShort(g);
      return p ? p.text : "";
    }).filter(Boolean);
    now.textContent = "지금: " + parts.join(", ");
  }

  // ---------- 원본 예시 → 변환 예시 ----------
  function compareGroup(card) {
    return card.groups.filter(isPic)[0];
  }
  function afterOf(card) {
    var g = compareGroup(card);
    var it = g.items[state.sel[g.key]] || g.items[0];
    return { file: pickFile(it.img, state.gender), label: it.label, g: it.g };
  }
  function noteHtml(card) {
    var solo = card.picNote && card.picNote.charAt(0) === "!";
    var common = SITE.picCaption && !solo ? "<b>" + esc(SITE.picCaption) + "</b>" : "";
    var own = card.picNote ? (solo ? "<b>" + esc(card.picNote.slice(1)) + "</b>" : " " + esc(card.picNote)) : "";
    return common || own ? '<p class="pic-note">' + common + own + "</p>" : "";
  }
  var ARROW = '<span class="arrow" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h13M13 6l6 6-6 6"/></svg></span>';
  function renderCompare(card) {
    var a = afterOf(card);
    var before = pickFile(card.before, a.g || state.gender);
    return '<div class="compare" id="compare">' +
      '<div class="compare-row">' +
      '<figure class="panel before"><button type="button" class="panel-btn" data-zoom="1" aria-label="원본 예시와 변환 예시를 크게 보기">' +
      '<span class="tag">원본 예시</span>' +
      '<div class="thumb"><img id="beforeImg" src="' + src(before, true) + '" alt="원본 예시 사진 (AI로 만든 가상 사진)"></div></button>' +
      "<figcaption>바꾸기 전</figcaption></figure>" +
      ARROW +
      '<figure class="panel after"><button type="button" class="panel-btn" data-zoom="1" aria-label="원본 예시와 변환 예시를 크게 보기">' +
      '<span class="tag">변환 예시</span>' +
      '<div class="thumb"><img id="afterImg" src="' + src(a.file, true) + '" alt="변환 예시: ' + esc(a.label) + ' (AI로 만든 가상 사진)"></div></button>' +
      '<figcaption id="afterCap">' + esc(a.label) + "</figcaption></figure>" +
      "</div>" +
      '<p class="zoom-hint">그림을 누르면 크게 볼 수 있어요.</p>' +
      "</div>";
  }
  function updateCompare(card) {
    var img = $("#afterImg");
    if (!img) return;
    var a = afterOf(card);
    var cap = $("#afterCap");
    img.src = src(a.file, true);
    var bi = $("#beforeImg"); if (bi) bi.src = src(pickFile(card.before, a.g || state.gender), true);
    img.alt = "변환 예시: " + a.label + " (AI로 만든 가상 사진)";
    cap.textContent = a.label;
    if (!REDUCE) {
      [img, cap].forEach(function (el) { el.classList.remove("swap"); void el.offsetWidth; el.classList.add("swap"); });
    }
  }

  function openZoom(card) {
    var dlg = $("#zoom");
    var a = afterOf(card);
    var before = pickFile(card.before, a.g || state.gender);
    $("#zoomH").textContent = card.title + " 예시 크게 보기";
    $("#zoomBody").className = "zoom-body";
    $("#zoomBody").innerHTML =
      '<figure class="before"><img src="' + src(before) + '" alt="원본 예시 사진 (AI로 만든 가상 사진)">' +
      '<figcaption><span class="tag">원본 예시</span>바꾸기 전</figcaption></figure>' +
      '<figure class="after"><img src="' + src(a.file) + '" alt="변환 예시: ' + esc(a.label) + ' (AI로 만든 가상 사진)">' +
      '<figcaption><span class="tag">변환 예시</span>' + esc(a.label) + "</figcaption></figure>" +
      noteHtml(card);
    if (typeof dlg.showModal === "function") {
      dlg.showModal();
      try { history.pushState({ zoom: 1 }, ""); } catch (e) {}
      $("#zoomClose").focus();
    } else {
      window.open(src(a.file), "_blank");
    }
  }

  // 고친 문장이 있는데 고른 것을 바꾸면: 고친 문장은 그대로 두고 알려 준다
  function editedNotice(card) {
    toast("고른 것은 바뀌었지만, 직접 고친 문장은 그대로예요.", "새 문장으로", function () {
      state.edited = null; updateSentence(card); saveState();
    });
  }

  // ---------- 움직이는 예시(GIF) ----------
  function hasGif(g) { return g.items.some(function (it) { return it.gif; }); }
  function motionInner(g) {
    var it = g.items[state.sel[g.key]];
    if (!it || !it.gif) return '<p class="motion-h">위에서 고르면 <b>움직이는 예시</b>가 여기에 나와요</p>';
    return '<p class="motion-h">움직이는 예시: 「' + esc(it.label) + '」</p>' +
      '<div class="motion-box"><img src="' + IMG + encodeURI(it.gif) + '" alt="' + esc(it.label) + ' 움직이는 예시 (AI로 만든 그림)"></div>' +
      '<p class="motion-note">AI로 만든 예시예요. 만들 때마다 모습이 조금씩 달라요.</p>';
  }
  function updateMotion(card, key) {
    var box = document.getElementById("motion-" + key);
    if (!box) return;
    var g = card.groups.filter(function (x) { return x.key === key; })[0];
    if (g) box.innerHTML = motionInner(g);
  }

  function typeBox(g) {
    return '<p class="or">원하는 것이 없으면 직접 쓰세요</p>' +
      '<input class="field" type="text" data-input="' + esc(g.key) + '" placeholder="직접 쓰기" value="' + esc(state.custom[g.key] || "") + '" aria-label="' + esc(g.q) + ' 직접 쓰기">';
  }

  function renderGroup(card, g, n) {
    var head = '<legend><span class="n">' + n + "</span><span>" + esc(g.q) +
      (g.optional ? ' <small class="opt-note">비워도 돼요</small>' : "") + "</span>";
    if (g.mode === "그림(여/남)") {
      head += '<span class="gender" role="group" aria-label="예시 그림">' +
        ["여", "남"].map(function (x) {
          return '<button type="button" data-gender="' + x + '" aria-pressed="' + (state.gender === x) + '">' + (x === "여" ? "여성" : "남성") + "</button>";
        }).join("") + "</span>";
    }
    head += "</legend>";
    var body = "";
    if (g.mode === "직접입력") {
      body = '<input class="field" type="text" data-input="' + esc(g.key) + '" placeholder="' + esc(g.items[0].label) + '" value="' + esc(state.custom[g.key] || "") + '" aria-label="' + esc(g.q) + '">';
    } else if (g.mode === "긴글입력") {
      body = '<textarea class="field area" rows="4" data-input="' + esc(g.key) + '" placeholder="' + esc(g.items[0].label) + '" aria-label="' + esc(g.q) + '">' + esc(state.custom[g.key] || "") + "</textarea>";
    } else if (g.mode === "말풍선") {
      body = '<div class="bubbles">' + g.items.map(function (it, i) {
        return '<button type="button" class="bubble" data-g="' + esc(g.key) + '" data-i="' + i + '" aria-pressed="' + (state.sel[g.key] === i) + '">' +
          '<span class="who">' + esc(it.label) + '</span><span class="say">' + esc(it.bubble) + "</span></button>";
      }).join("") + "</div>";
    } else if (isPic(g)) {
      var withDesc = g.items.some(function (it) { return it.desc; });
      var isCompare = !!card.before && g === compareGroup(card);
      var nI = g.items.length;
      var cls = "opts pics n" + nI + (withDesc ? " desc" : isCompare && nI <= 4 ? " c4" : (nI === 3 || nI === 6) ? " c3" : "");
      var picBtn = function (it, i) {
        return '<button type="button" class="opt opt-pic" data-g="' + esc(g.key) + '" data-i="' + i + '" aria-pressed="' + (state.sel[g.key] === i) + '">' +
          picThumb(pickFile(it.img, state.gender)) + '<span class="cap">' + esc(it.label) + "</span>" +
          (it.desc ? '<span class="desc">' + esc(it.desc) + "</span>" : "") + "</button>";
      };
      var main = [], extra = [];
      g.items.forEach(function (it, i) { (it.extra ? extra : main).push(picBtn(it, i)); });
      if (extra.length) cls = cls.replace(/ n\d+/, " n" + main.length);
      var extraOpen = g.items[state.sel[g.key]] && g.items[state.sel[g.key]].extra;
      body = (isCompare ? renderCompare(card) : "") +
        '<div class="' + cls + '">' + main.join("") + "</div>" +
        (extra.length
          ? '<details class="more-pics"' + (extraOpen ? " open" : "") + '><summary>' + (g.key === "노래" ? "스타일" : "선택지") + " 더 보기 (" + extra.length + "개)</summary>" +
            '<div class="' + cls.replace(/ n\d+/, " n" + extra.length) + '">' + extra.join("") + "</div></details>"
          : "") +
        (g === compareGroup(card) && (card.before || card.picNote) ? noteHtml(card) : "") +
        (g.mode === "그림+직접입력" ? typeBox(g) : "") +
        (hasGif(g) ? '<div class="motion" id="motion-' + esc(g.key) + '">' + motionInner(g) + "</div>" : "");
    } else {
      body = '<div class="opts btns">' + g.items.map(function (it, i) {
        return '<button type="button" class="opt" data-g="' + esc(g.key) + '" data-i="' + i + '" aria-pressed="' + (state.sel[g.key] === i) + '">' + esc(it.label) + "</button>";
      }).join("") + "</div>";
      if (g.mode === "버튼+직접입력") body += typeBox(g);
    }
    return '<fieldset class="q">' + head + body + "</fieldset>";
  }

  function flowBox(card) {
    var f = card.flowSet && SITE.flow && SITE.flow[card.flowSet];
    if (!f) return "";
    var video = card.flowSet.indexOf("영상") >= 0;
    var grid = f.items.map(function (it) {
      return "<div><dt>" + esc(it[0]) + "</dt><dd>" + esc(it[1]) + "</dd></div>";
    }).join("");
    var note = f.note ? esc(f.note).replace(/(\d+크레딧)/, "<b>$1</b>") : "";
    var tips = video && SITE.flowTips && SITE.flowTips.length
      ? '<details class="fs-more"><summary>무료로 쓰는 팁 보기</summary><ul class="fs-tips">' +
        SITE.flowTips.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></details>"
      : "";
    return '<section class="flowset" aria-labelledby="fsh">' +
      '<h2 id="fsh">Flow에서 이렇게 맞추세요</h2>' +
      '<p class="fs-lead">만들기 전에 아래와 같은지 확인하세요.</p>' +
      '<dl class="fs-grid">' + grid + "</dl>" +
      (note ? '<p class="fs-note">' + note + "</p>" : "") +
      tips +
      (video && SITE.flowSource ? '<p class="fs-src">' + esc(SITE.flowSource) + "</p>" : "") +
      "</section>";
  }

  function renderCard(id) {
    var card = SITE.cards.filter(function (c) { return c.id === id; })[0];
    if (!card) { location.hash = "#/"; return; }
    var t = tabById(card.tab);
    if (MENU) { var cc0 = catOf(card.id); if (cc0) t = { id: cc0.id, title: cc0.title, href: "#/cat/" + cc0.id, kind: cc0.kind }; }
    ss("lastCard", card.id);
    renderTop(t, card);
    if (!state || state.card !== card.id) state = loadState(card);
    var apps = appsOf(card);
    var chips = (MENU && apps.length > 1)
      ? '<li class="ai-pick"><span>사용할 AI</span>' + apps.map(function (a) {
          return '<button type="button" data-ai="' + esc(a) + '" aria-pressed="' + (aiPick(apps) === a) + '">' + esc(a) + "</button>";
        }).join("") + "</li>"
      : "<li>사용할 AI: " + esc(apps.join(" 또는 ")) + "</li>";
    if (card.photo) chips += '<li class="need">사진 넣기 필요</li>';
    chips += card.followup ? '<li class="need">앞 대화에 이어서</li>' : '<li class="fresh">새 대화에서 시작</li>';
    var after = (card.after && card.after.length) ? card.after
      : ((!card.photo && !card.followup && card.app.indexOf("Flow") < 0) ? (SITE.afterDefault || []) : []);
    var typedNote = SITE.typedNote
      ? '<p class="typed-note" id="typedNote" hidden>' + esc(SITE.typedNote) + "</p>" : "";
    var openName = card.followup ? "" : ((MENU ? aiPick(apps) : (apps.length > 1 ? "AI" : apps[0])) + " 사이트 열기");
    var step3 = card.photo && card.flowSet === "영상"
      ? "글자 칸 위 <strong>시작</strong> 칸을 눌러 사진을 고르고, 글자 칸을 꾹 눌러 <strong>붙여넣기</strong>"
      : card.gifFormat
      ? "<strong>+</strong>에서 <strong>이미지 만들기</strong>를 켜고 <strong>형식</strong>을 <strong>GIF</strong>로 바꾼 뒤, 사진을 넣고 글자 칸을 꾹 눌러 <strong>붙여넣기</strong>"
      : card.photo
      ? "<strong>+</strong>를 눌러 사진을 넣고, 글자 칸을 꾹 눌러 <strong>붙여넣기</strong>"
      : "글자 칸을 꾹 눌러 <strong>붙여넣기</strong>";
    var how = '<ol class="how-steps">' +
      "<li>아래 <strong>① 문장 복사하기</strong>를 눌러요</li>" +
      (card.followup
        ? "<li><strong>답을 받았던 대화</strong>로 돌아가요 (새 대화 아님)</li>"
        : "<li>그 옆 <strong>② " + esc(openName) + "</strong>를 눌러요</li>") +
      "<li>" + step3 + " → 보내기(↑)</li></ol>";
    // 사이트 단추로는 휴대폰 앱이 열리지 않는다(2026-11-16 S25·크롬 시험). 앱은 직접 열도록 안내. Flow 앱 화면은 확인 전이라 안내하지 않음
    if (!card.followup && card.app.indexOf("Flow") < 0) {
      how += '<details class="how-more"><summary>앱으로 하려면</summary><p>휴대폰 화면에서 앱을 직접 눌러 열고, ' +
        (card.photo ? "<strong>+</strong>로 사진을 넣은 뒤 " : "") + '글자 칸을 꾹 눌러 <strong>붙여넣기</strong> 하세요.</p></details>';
    }
    var main = card.groups.filter(function (g) { return !g.more; });
    var more = card.groups.filter(function (g) { return g.more; });
    var n = 0;
    var qs = main.map(function (g) { return renderGroup(card, g, ++n); }).join("");
    if (more.length) {
      qs += '<details class="more" id="more"' + (state.moreOpen ? " open" : "") + ">" +
        '<summary><span>더 자세히 고르기<span class="more-now" id="moreNow"></span></span></summary>' +
        '<div class="more-body">' + more.map(function (g) { return renderGroup(card, g, ++n); }).join("") + "</div></details>";
    }
    var hasChoice = card.groups.length > 0;
    $("#view").innerHTML =
      '<a class="back" href="' + listHref(t) + '">' + esc(t.title) + " 목록으로</a>" +
      '<h1 class="lead">' + titleHtml(card.title) + "</h1>" +
      (card.banner ? '<p class="banner">' + esc(card.banner) + "</p>" : "") +
      '<ul class="chips">' + chips + "</ul>" +
      (card.note ? '<p class="tip">' + esc(card.note) + "</p>" : "") +
      (hasChoice
        ? '<div class="picked" id="picked"><b>내가 고른 것</b><ul class="picked-list" id="pickedList" aria-live="polite"></ul>' +
          '<button type="button" class="reset" id="resetBtn">다시 고르기</button>' +
          (MENU && ss("undo:" + card.id) ? '<button type="button" class="reset undo" id="undoBtn">되돌리기</button>' : "") + "</div>"
        : "") +
      qs +
      '<section class="result" aria-labelledby="rh"><h2 id="rh">완성된 문장</h2>' +
      '<p class="sentence" id="sentence"></p>' +
      '<p class="edit-note" id="editNote" hidden>직접 고친 문장이에요. 복사하면 이 문장이 복사돼요.</p>' +
      '<div class="edit-row" id="editRow"><button type="button" class="edit-btn" id="editBtn">✏️ 문장 직접 고치기</button></div>' +
      '<div class="edit-box" id="editBox" hidden>' +
      '<label class="edit-label" for="editArea">문장을 손가락으로 눌러 고치세요</label>' +
      '<textarea class="field area edit-area" id="editArea" rows="7"></textarea>' +
      '<div class="edit-actions"><button type="button" class="edit-done" id="editDone">다 고쳤어요</button>' +
      '<button type="button" class="edit-undo" id="editUndo">처음 문장으로</button></div></div>' +
      typedNote + '<div class="how"><h3>이렇게 하세요</h3>' + how + "</div>" +
      (after.length
        ? '<details class="after-more"><summary>잘 안 될 때 보기</summary><ul>' +
          after.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></details>"
        : "") +
      fixBox(card, t) +
      "</section>" +
      (MENU && apps.length > 1 && aiPick(apps) !== "Flow" ? "" : flowBox(card)) +
      '<nav class="card-end" aria-label="다른 곳으로 가기">' +
      '<a class="end-btn" href="' + listHref(t) + '">' + esc(t.title) + ' 목록으로</a>' +
      '<a class="end-btn home" href="#/">처음 화면으로</a></nav>';
    showDock(apps, card);
    applyRules(card);
    updateSentence(card);
    updatePicked(card);
    updateMoreNow(card);

    var moreEl = $("#more");
    if (moreEl) moreEl.addEventListener("toggle", function () { state.moreOpen = moreEl.open; saveState(); });

    var view = $("#view");
    view.onclick = function (e) {
      if (e.target.closest("#editBtn")) {
        $("#editArea").value = state.edited !== null && state.edited !== undefined ? state.edited : state.plain;
        $("#editBox").hidden = false; $("#editRow").hidden = true;
        $("#editArea").focus();
        return;
      }
      if (e.target.closest("#editDone")) {
        var v = $("#editArea").value.trim();
        state.edited = v && v !== state.plain ? v : null;
        $("#editBox").hidden = true; $("#editRow").hidden = false;
        updateSentence(card); saveState();
        if (state.edited !== null) toast("고친 문장을 저장했어요. 복사하면 고친 문장이 복사돼요.");
        return;
      }
      if (e.target.closest("#editUndo")) {
        state.edited = null;
        $("#editBox").hidden = true; $("#editRow").hidden = false;
        updateSentence(card); saveState();
        toast("처음 문장으로 돌렸어요.");
        return;
      }
      if (e.target.closest("#resetBtn")) {
        var before = JSON.parse(JSON.stringify(state));
        clearState(card.id);
        state = freshState(card);
        if (MENU) {
          ss("undo:" + card.id, JSON.stringify(before));
          var y0 = window.scrollY;
          renderCard(card.id);
          window.scrollTo(0, y0);
          toast("처음 상태로 돌렸어요. '되돌리기'를 누르면 다시 살아나요.");
          return;
        }
        var y = window.scrollY;
        renderCard(card.id);
        window.scrollTo(0, y);
        toast("처음 상태로 돌렸어요.", "되돌리기", function () {
          state = before;
          saveState();
          var y3 = window.scrollY;
          renderCard(card.id);
          window.scrollTo(0, y3);
          toast("고른 것을 다시 살렸어요.");
        });
        return;
      }
      if (e.target.closest("#undoBtn")) {
        try { state = JSON.parse(ss("undo:" + card.id)); } catch (er) {}
        ss("undo:" + card.id, null);
        saveState();
        var yu = window.scrollY;
        renderCard(card.id);
        window.scrollTo(0, yu);
        toast("고른 것을 다시 살렸어요.");
        return;
      }
      var ab = e.target.closest("[data-ai]");
      if (ab) {
        ss("aiPick", ab.getAttribute("data-ai"));
        var ya = window.scrollY;
        renderCard(card.id);
        window.scrollTo(0, ya);
        return;
      }
      var fb = e.target.closest("[data-fix]");
      if (fb) {
        var box = $("#fixOut");
        box.hidden = false;
        $("#fixText").textContent = fb.getAttribute("data-fix");
        $$("[data-fix]").forEach(function (x) { x.setAttribute("aria-pressed", x === fb); });
        box.scrollIntoView({ block: "nearest", behavior: REDUCE ? "auto" : "smooth" });
        return;
      }
      if (e.target.closest("#fixCopy")) {
        copyText($("#fixText").textContent).then(function () {
          toast("복사했어요. 결과를 받은 같은 대화에 붙여넣어 보내세요.", null, null, 6000);
        }, function () { toast("복사가 안 됐어요. 문장을 꾹 눌러 직접 복사하세요."); });
        return;
      }
      if (e.target.closest("[data-zoom]")) { openZoom(card); return; }
      var gb = e.target.closest("[data-gender]");
      if (gb) {
        state.gender = gb.getAttribute("data-gender");
        saveState();
        var y2 = window.scrollY;
        renderCard(card.id);
        window.scrollTo(0, y2);
        return;
      }
      var b = e.target.closest("[data-g]");
      if (!b || b.disabled) return;
      var key = b.getAttribute("data-g");
      state.sel[key] = +b.getAttribute("data-i");
      var inp = view.querySelector('[data-input="' + key + '"]');
      if (inp && inp.value) { inp.value = ""; state.custom[key] = ""; }
      syncPressed(key);
      if (!REDUCE) { b.classList.remove("snap"); void b.offsetWidth; b.classList.add("snap"); }
      applyRules(card);
      updateSentence(card, key);
      updatePicked(card, key);
      updateMoreNow(card);
      var cg = compareGroup(card);
      if (card.before && cg && cg.key === key) updateCompare(card);
      updateMotion(card, key);
      if (state.edited !== null && state.edited !== undefined) editedNotice(card);
      saveState();
    };
    view.oninput = function (e) {
      if (e.target.id === "editArea") {
        var ev = e.target.value.trim();
        state.edited = ev && ev !== state.plain ? ev : null;
        saveState();
        return;
      }
      var k = e.target.getAttribute("data-input");
      if (!k) return;
      state.custom[k] = e.target.value;
      syncPressed(k);
      updateSentence(card);
      updatePicked(card);
      updateMoreNow(card);
      saveState();
    };
  }

  // ---------- 하단 고정 바 ----------
  function showDock(apps, card) {
    $("#dock").hidden = false;
    document.body.classList.add("has-dock");
    var btn = $("#copyBtn");
    btn.textContent = "① 문장 복사하기";
    btn.classList.remove("done");
    $("#dock").classList.remove("copied");
    if (card && card.followup) {
      $("#dockApps").innerHTML = '<span class="btn-app follow">앞 대화에<br>붙여넣기</span>';
      return;
    }
    if (MENU && apps.length > 1) apps = [aiPick(apps)];
    $("#dockApps").innerHTML = apps.map(function (a) {
      return '<a class="btn-app" href="' + esc(appHref(SITE.links[a] || "#")) + '" target="_blank" rel="noopener"><span class="app-no">②</span> ' + esc(a) + "<br>사이트 열기</a>";
    }).join("");
  }
  function hideDock() {
    $("#dock").hidden = true;
    document.body.classList.remove("has-dock");
  }

  var toastTimer;
  function toast(msg, actionLabel, action, ms) {
    var t = $("#toast");
    t.textContent = msg;
    t.classList.toggle("has-action", !!action);
    if (action) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "toast-btn";
      b.textContent = actionLabel;
      b.onclick = function () { t.classList.remove("show"); action(); };
      t.appendChild(b);
    }
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, ms || (action ? 6000 : 3500));
  }

  // 예전 방식(execCommand)을 먼저 누른 순간에 바로 시도하고, 안 되면 새 방식(Clipboard API)을 시도한다.
  // 카카오톡 같은 앱 안 브라우저는 새 방식을 막는 경우가 많아서, 새 방식만 쓰면 복사가 실패한다.
  function legacyCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.cssText = "position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;font-size:16px";
    document.body.appendChild(ta);
    var ok = false;
    try {
      ta.focus({ preventScroll: true });
      ta.select();
      ta.setSelectionRange(0, text.length);
      ok = document.execCommand("copy");
    } catch (e) { ok = false; }
    document.body.removeChild(ta);
    var btn = $("#copyBtn"); if (btn) btn.focus({ preventScroll: true });
    return ok;
  }
  function copyText(text) {
    if (legacyCopy(text)) return Promise.resolve();
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return Promise.reject(new Error("copy failed"));
  }

  $("#copyBtn").addEventListener("click", function () {
    var btn = this;
    var useEdited = state.edited !== null && state.edited !== undefined && state.edited !== "";
    if (!useEdited && state.missing && state.missing.length) {
      var f = document.querySelector('[data-input="' + state.missing[0] + '"]');
      toast("빈칸을 먼저 채워 주세요.");
      if (f) {
        f.scrollIntoView({ block: "center", behavior: "smooth" });
        setTimeout(function () { f.focus({ preventScroll: true }); }, 350);
      }
      return;
    }
    copyText(useEdited ? state.edited : state.plain).then(function () {
      btn.textContent = "복사했어요";
      btn.classList.add("done");
      $("#dock").classList.add("copied");
      var cc = SITE.cards.filter(function (c) { return c.id === state.card; })[0];
      var nextMsg = cc && cc.followup ? "복사했어요. 답을 받았던 대화로 돌아가 붙여넣으세요." : "복사했어요. 이제 ② 단추를 눌러 AI를 여세요";
      toast(cc && cc.copyMsg ? cc.copyMsg : nextMsg, null, null, 6000);
    }, function () {
      toast("복사가 안 됐어요. 완성된 문장을 꾹 눌러 직접 복사하세요.");
    });
  });

  // ---------- 주소 이동 ----------
  // 목록·처음 화면에서 보던 자리를 기억했다가, 카드에서 돌아오면 그 자리로
  var listPos = {}, lastWasCard = false, routing = false, curKey = "#/";
  try { history.scrollRestoration = "manual"; } catch (e) {}
  window.addEventListener("scroll", function () {
    if (!routing && !lastWasCard) listPos[curKey] = window.scrollY;
  }, { passive: true });
  // 키보드가 올라와 있을 때만 아래 고정 막대를 숨겨 글자 칸을 가리지 않게.
  // 키보드를 내리면(휴대폰 [뒤로]) 글자 칸에 커서가 남아 있어도 막대가 다시 보인다.
  var fullH = 0, fullW = 0;
  function viewH() { return window.visualViewport ? window.visualViewport.height : window.innerHeight; }
  function checkKeyboard() {
    if (window.innerWidth !== fullW) { fullW = window.innerWidth; fullH = 0; }
    fullH = Math.max(fullH, window.innerHeight, viewH());
    var a = document.activeElement;
    var inField = !!(a && a.matches && a.matches("input.field, textarea.field"));
    document.body.classList.toggle("typing", inField && viewH() < fullH - 150);
  }
  document.addEventListener("focusin", function () { setTimeout(checkKeyboard, 300); });
  document.addEventListener("focusout", function () { setTimeout(checkKeyboard, 50); });
  window.addEventListener("resize", checkKeyboard);
  if (window.visualViewport) window.visualViewport.addEventListener("resize", checkKeyboard);
  checkKeyboard();

  function route() {
    var zd = $("#zoom"); if (zd && zd.open) zd.close();
    var tt = $("#toast"); if (tt) { clearTimeout(toastTimer); tt.classList.remove("show"); }
    var key = location.hash || "#/";
    var h = location.hash.replace(/^#\/?/, "").split("/");
    var isCard = h[0] === "card";
    var isHome = !h[0];
    document.body.setAttribute("data-page", h[0] || "home");
    var fn = $("#footNotice"); if (fn) fn.open = isHome;
    if (MENU) homeVariant();
    var y = !isCard && lastWasCard && listPos[key] ? listPos[key] : 0;
    routing = true;
    if (h[0] === "card" && h[1]) {
      renderCard(decodeURIComponent(h[1]));
    } else if (MENU && h[0] === "cat" && h[1]) {
      state = null;
      renderCat(h[1]);
    } else if (MENU && h[0] === "learn" && h[1]) {
      state = null;
      renderLearn(h[1]);
    } else if (MENU && h[0] === "start") {
      state = null;
      renderStart();
    } else if (h[0] === "tab" && h[1]) {
      state = null;
      var ot = MENU && tabById(h[1]);
      var oc = ot && cardsOf(ot)[0] && catOf(cardsOf(ot)[0].id);
      if (oc) { location.replace("#/cat/" + oc.id); return; }
      renderTab(h[1]);
    } else {
      state = null;
      if (MENU) renderHomeMenu(); else renderHome();
    }
    window.scrollTo(0, y);
    requestAnimationFrame(function () { if (y) window.scrollTo(0, y); routing = false; });
    lastWasCard = isCard;
    curKey = key;
    $("#view").focus({ preventScroll: true });
  }

  // ---------- 카카오톡 안에서 열렸을 때 ----------
  // 카카오톡 인앱 브라우저에서는 구글 로그인이 막히거나 AI 앱으로 넘어가지 않을 수 있어
  // 앱 열기 버튼을 외부 브라우저로 보내고, 위쪽에 안내를 보여 준다.
  var UA = navigator.userAgent.toLowerCase();
  var IN_KAKAO = UA.indexOf("kakaotalk") > -1;
  var IS_IOS = /iphone|ipad|ipod/.test(UA);
  function openExternal(url) { return "kakaotalk://web/openExternal?url=" + encodeURIComponent(url); }
  function appHref(url) { return IN_KAKAO && /^https?:/.test(url) ? openExternal(url) : url; }

  if (IN_KAKAO) {
    var hidden = false;
    try { hidden = sessionStorage.getItem("inappClosed") === "1"; } catch (e) {}
    if (!hidden) $("#inapp").hidden = false;
    $("#inappBtn").addEventListener("click", function (e) {
      e.preventDefault();
      location.href = openExternal(location.href);
    });
    $("#inappHelp").textContent = IS_IOS
      ? "버튼이 안 되면: 화면 오른쪽 아래 공유 버튼 → Safari"
      : "버튼이 안 되면: 화면 오른쪽 아래 ⋮ → 다른 브라우저로 열기";
    $("#inappClose").addEventListener("click", function () {
      $("#inapp").hidden = true;
      try { sessionStorage.setItem("inappClosed", "1"); } catch (e) {}
    });
  }

  // ---------- 크게 보기 닫기 ----------
  var zoom = $("#zoom");
  // 크게 보기는 기록을 하나 남겨서, 휴대폰 [뒤로]를 누르면 그림부터 닫히게 한다
  function closeZoom() {
    if (!zoom.open) return;
    if (history.state && history.state.zoom) history.back(); else zoom.close();
  }
  $("#zoomClose").addEventListener("click", closeZoom);
  zoom.addEventListener("click", function (e) { if (e.target === zoom) closeZoom(); });
  zoom.addEventListener("cancel", function (e) { e.preventDefault(); closeZoom(); });
  window.addEventListener("popstate", function () { if (zoom.open) zoom.close(); });

  // ---------- 바닥 ----------
  $("#notices").innerHTML = SITE.notices.map(function (n) { return "<li>" + esc(n) + "</li>"; }).join("");
  if (SITE.brag && SITE.brag.url) {
    $("#brag").hidden = false;
    $("#bragText").textContent = SITE.brag.text;
    $("#bragBtn").href = appHref(SITE.brag.url);
  }
  $("#footWho").textContent = SITE.makerTitle || SITE.maker;
  $("#credit").textContent = SITE.name + (SITE.version ? " " + SITE.version : "");
  window.addEventListener("hashchange", route);
  route();
})();
