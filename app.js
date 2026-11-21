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
        (t.img ? '<figure class="lrn-hero"><img src="' + src(t.img, false) + '" alt="" loading="lazy" ' +
          'onerror="this.closest(\'figure\').remove()"></figure>' : "") +
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
  function lrnTodo(n, text) {
    return '<div class="lrn-todo"><i>' + n + "</i><b>" + text + "</b></div>";
  }
  function lrnDone(title, body, wrong) {
    return '<div class="lrn-done' + (wrong ? " lrn-wrong" : "") + '"><i>' + (wrong ? "✕" : "✓") + "</i>" +
      "<span><b>" + title + "</b>" + (body ? "<span>" + body + "</span>" : "") + "</span></div>";
  }
  function lrnShow(title, body) {
    return '<div class="lrn-show"><b>' + title + "</b>" + (body ? "<span>" + body + "</span>" : "") + "</div>";
  }
  function lrnDots(n, total) {
    var h = "";
    for (var k = 0; k < total; k++) h += '<i class="' + (k < n ? "on" : "") + '"></i>';
    return '<div class="lrn-dots">' + h + "</div>";
  }
  function lrnFoot(t, extra) {
    var nx = MENU.learn.topics[t.n % 7];
    return '<div class="lrn-foot">' + (extra || "<span></span>") +
      '<a class="lrn-next" href="#/learn/' + nx.id + '">다음 주제 · ' + esc(nx.q) + ' →</a></div>';
  }
  function lrnSeg(items, id) {
    return '<div class="lrn-seg" role="group" id="' + id + '">' + items + "</div>";
  }
  var LRN = { _t: null };
  function lrnFig(file, cap) {
    return '<figure class="lrn-fig"><img src="' + IMG + file + '" alt="" loading="lazy" onerror="this.closest(\'figure\').remove()">' +
      '<figcaption>' + cap + "</figcaption></figure>";
  }
  /* 1 — 오늘 아침부터 내가 쓴 AI */
  LRN.used = function (w, t) {
    var IT = [
      ["얼굴·지문으로 잠금 풀기", "휴대폰이 내 얼굴인지 지문인지 알아봅니다", "learn_t1_face.jpg"],
      ["유튜브가 골라 주는 영상", "내가 본 것을 보고 다음 영상을 고릅니다", "learn_t1_video.jpg"],
      ["내비게이션이 피해 주는 길", "막히는 길을 미리 알아 다른 길로 돌립니다", "learn_t1_navi.jpg"],
      ["은행 앱의 이상 거래 알림", "평소와 다른 거래인지 살펴봅니다", "learn_t1_bank.jpg"],
      ["사진첩이 모아 주는 얼굴", "같은 사람 사진을 알아서 한곳에 모읍니다", "learn_t1_photo.jpg"]
    ];
    var on = [];
    function paint() {
      var n = on.length;
      w.innerHTML =
        '<div class="lrn-bar"><p class="lrn-status"><span class="lrn-kind">선택해 보기</span></p>' + lrnDots(n ? 1 : 0, 1) + "</div>" +
        (n ? lrnShow("벌써 " + n + "가지를 쓰고 계셨습니다",
              "<b>사람이 하던 판단을 기계가 대신 해 주는 것, 그것을 인공지능이라고 부릅니다.</b><br>" +
              "새로 배우는 것이 아니라, 이미 쓰고 계신 것에 이름을 붙이는 시간입니다.")
           : lrnTodo(1, "써 보신 것을 모두 눌러 보세요")) +
        '<div class="lrn-grid">' + IT.map(function (x, k) {
          var sel = on.indexOf(k) > -1;
          return '<button class="lrn-tile has-pic" aria-pressed="' + sel + '" data-k="' + k + '">' +
            '<img src="' + src(x[2], true) + '" alt="" loading="lazy" onerror="this.remove()">' +
            '<span class="lrn-tile-t"><b>' + esc(x[0]) + "</b><span>" + esc(x[1]) + "</span></span></button>";
        }).join("") + "</div>" +
        '<p class="lrn-note">하나도 안 고르셨어도 괜찮습니다. 오늘부터 보시면 됩니다.</p>' +
        '<details class="lrn-more"><summary>더 알아보기</summary>' +
        '<p>· <b>AI(인공지능)</b>는 사람이 하던 판단·분류·예측·생성의 일부를 컴퓨터가 하는 넓은 범위입니다.</p>' +
        '<p>· 그중 글·그림·음성처럼 <b>새 결과를 만들어 내는 것</b>을 생성형 AI라고 합니다.</p>' +
        '<p>· 그중 말을 다루는 것이 <b>LLM</b>입니다. 챗GPT·제미나이·클로드가 여기에 해당합니다.</p></details>' +
        lrnFoot(t, n ? '<button class="lrn-btn plain" id="lrs">다시 고르기</button>' : "");
      [].slice.call(w.querySelectorAll(".lrn-tile")).forEach(function (b) {
        b.onclick = function () {
          var k = +b.getAttribute("data-k"), i = on.indexOf(k);
          if (i > -1) on.splice(i, 1); else on.push(k);
          paint();
        };
      });
      if ($("#lrs")) $("#lrs").onclick = function () { on = []; paint(); };
    }
    paint();
  };

  /* 2 — 검색과 무엇이 다를까 */
  LRN.search = function (w, t) {
    var seen = {};
    function paint() {
      var both = seen.s && seen.a;
      w.innerHTML =
        '<div class="lrn-bar"><p class="lrn-status"><span class="lrn-kind">비교해 보기</span> · 미리 만든 예시, 실제 실행 아님</p>' + lrnDots((seen.s ? 1 : 0) + (seen.a ? 1 : 0), 2) + "</div>" +
        (both ? lrnShow("검색은 찾아 주고, AI는 만들어 줍니다",
                 "검색은 <b>목록을 보여 주고 내가 골라 읽어야</b> 합니다. AI는 <b>정리해서 답해 주어 그대로 읽으면</b> 됩니다.<br>" +
                 "<b>대신, 틀릴 때가 있습니다.</b> 중요한 것은 원래 글을 한 번 더 봐야 합니다.")
              : lrnTodo(seen.s || seen.a ? 2 : 1, "같은 질문을 두 곳에 넣어 보세요. 아래 두 단추를 모두 눌러 봅니다")) +
        '<div class="lrn-card"><p class="lrn-lab">같은 질문</p><p class="lrn-inp">목포에서 가 볼 만한 곳 알려 줘</p></div>' +
        '<div class="lrn-pick"><button class="lrn-pickb big" id="lbs">검색에 넣어 보기</button>' +
        '<button class="lrn-pickb big" id="lba">AI에 넣어 보기</button></div>' +
        '<div class="lrn-split even">' +
        '<div class="lrn-card"><p class="lrn-lab">검색 결과</p>' +
        (seen.s ? '<ul class="lrn-list"><li>목포 여행 코스 추천 BEST 10 — 블로그</li><li>[목포] 1박 2일 다녀왔어요 — 카페 글</li><li>목포시 문화관광 누리집</li><li>목포 가볼만한곳 총정리 — 블로그</li><li>목포 맛집·숙소 지도</li></ul>' +
            '<p class="lrn-once">목록입니다. 어느 것을 읽을지 내가 골라야 합니다.</p>'
          : '<p class="lrn-ghost">[검색에 넣어 보기]를 누르세요</p>') + "</div>" +
        '<div class="lrn-card"><p class="lrn-lab">AI 답</p>' +
        (seen.a ? '<p class="lrn-inp lrn-plain">목포에서는 유달산 노적봉, 목포근대역사관, 갓바위를 함께 둘러보면 좋습니다. 저녁에는 평화광장 바닷가를 걷고, 해상케이블카에서 시내를 내려다볼 수 있습니다.</p>' +
            '<p class="lrn-once">정리된 글입니다. 그대로 읽으면 됩니다. <b>대신 맞는지는 따로 확인해야 합니다.</b></p>'
          : '<p class="lrn-ghost">[AI에 넣어 보기]를 누르세요</p>') + "</div></div>" +
        '<details class="lrn-more"><summary>더 알아보기</summary>' +
        '<p>· 검색은 <b>있는 자료를 찾아</b> 보여 줍니다. 링크·작성자·날짜를 볼 수 있고 원문을 직접 읽습니다.</p>' +
        '<p>· 생성형 AI는 <b>요청에 맞는 답을 구성</b>합니다. 자연스럽지만 원문 그대로가 아닐 수 있습니다.</p>' +
        '<p>· AI에 검색 기능이 켜져 있어도 <b>링크를 열어 원문을 확인</b>해야 합니다.</p>' +
        '<p>· 업무 원칙: 초안은 생성형 AI로 빠르게, 사실은 원문과 공식 출처로 확인.</p></details>' +
        lrnFoot(t, both ? '<button class="lrn-btn plain" id="lrs">다시 보기</button>' : "");
      $("#lbs").onclick = function () { seen.s = 1; paint(); };
      $("#lba").onclick = function () { seen.a = 1; paint(); };
      if ($("#lrs")) $("#lrs").onclick = function () { seen = {}; paint(); };
    }
    paint();
  };

  /* 3 — AI는 어떻게 답할까 (모으기·익히기·답하기) */
  LRN.how = function (w, t) {
    var ST = [
      ["모으기", "아주 많이 읽었습니다", "신문·책·누리집의 글을 셀 수 없이 많이 읽었습니다."],
      ["익히기", "말의 순서를 익혔습니다", "‘비가 오니’ 다음에는 ‘우산’이 자주 온다는 것을 익혔습니다."],
      ["답하기", "한 글자씩 이어 씁니다", "앞말에 이어질 말을 하나 고르고, 또 고르며 문장을 만듭니다."]
    ];
    var step = 0, guess = null;
    var CAND = [["우산을", 72], ["창문을", 15], ["약속을", 8], ["회의를", 5]];
    function paint() {
      var done = step >= 3 && guess !== null;
      w.innerHTML =
        '<div class="lrn-bar"><p class="lrn-status"><span class="lrn-kind">순서대로 해 보기</span></p>' + lrnDots(step + (guess !== null ? 1 : 0), 4) + "</div>" +
        (done
          ? lrnShow("적어 둔 답을 꺼내는 것이 아닙니다",
              "<b>그때그때 만들어 냅니다.</b> 그래서 같은 질문에도 답이 조금씩 달라집니다.")
          : lrnTodo(step + 1, step < 3 ? ST[step][0] + "를 눌러 보세요" : "AI는 다음에 어떤 말을 고를까요? 하나를 눌러 보세요")) +
        '<div class="lrn-step">' + ST.map(function (x, k) {
          return '<button class="lrn-stepb" aria-pressed="' + (k < step) + '" data-k="' + k + '"' +
            (k > step ? " disabled" : "") + "><i>" + (k + 1) + "</i><span><b>" + esc(x[0]) + "</b>" +
            "<em>" + esc(k < step ? x[2] : x[1]) + "</em></span></button>";
        }).join("") + "</div>" +
        (step >= 3
          ? '<h3 class="lrn-sec">직접 맞혀 보세요</h3>' +
            '<div class="lrn-stage"><p class="lrn-big">오늘 비가 오니 <span class="lrn-slot"></span></p></div>' +
            '<div class="lrn-pick">' + CAND.map(function (c) {
              return '<button class="lrn-pickb big" data-w="' + esc(c[0]) + '">' + esc(c[0]) + "</button>";
            }).join("") + "</div>" +
            (guess !== null
              ? '<div class="lrn-table">' + CAND.map(function (c) {
                  return '<div class="lrn-row"><span class="lrn-rl">' + esc(c[0]) + '</span>' +
                    '<span class="lrn-rt"><span class="lrn-bar2"><i style="width:' + c[1] + '%"></i></span> ' + c[1] + "%</span></div>";
                }).join("") + "</div>" +
                '<p class="lrn-fine">위 숫자는 <b>설명용 가상 수치입니다. 실제 측정값이나 정답 확률이 아닙니다.</b></p>' +
                '<p class="lrn-note">' + (guess === "우산을"
                  ? "대부분 ‘우산’을 떠올립니다. <b>우리도 이미 말의 순서로 다음 말을 예상하고 있습니다.</b> AI는 이것을 훨씬 큰 규모로 반복합니다."
                  : "‘" + esc(guess) + "’도 가능합니다. 다만 ‘우산’이 가장 자주 옵니다. <b>AI도 가장 자주 오는 말을 주로 고릅니다.</b>") + "</p>"
              : "")
          : "") +
        '<details class="lrn-more"><summary>더 알아보기</summary>' +
        '<p>· 위 숫자는 <b>설명을 위한 예시</b>이며 실제 모델의 계산값이 아닙니다.</p>' +
        '<p>· 실제로는 낱말이 아니라 더 작은 <b>말 조각(토큰)</b> 단위로 고릅니다.</p>' +
        '<p>· <b>늘 1위만 고르지는 않습니다.</b> 그래서 같은 질문에도 답이 달라집니다.</p>' +
        '<p>· 자연스러운 문장과 확인된 사실은 다릅니다. 업무에서는 ‘잘 썼는가’와 ‘맞는가’를 따로 봅니다.</p></details>' +
        lrnFoot(t, done ? '<button class="lrn-btn plain" id="lrs">처음부터</button>' : "");
      [].slice.call(w.querySelectorAll(".lrn-stepb")).forEach(function (b) {
        b.onclick = function () { if (+b.getAttribute("data-k") === step) { step++; paint(); } };
      });
      [].slice.call(w.querySelectorAll(".lrn-pickb")).forEach(function (b) {
        b.onclick = function () { guess = b.getAttribute("data-w"); paint(); };
      });
      if ($("#lrs")) $("#lrs").onclick = function () { step = 0; guess = null; paint(); };
    }
    paint();
  };

  /* 4 — AI가 내 말을 안 듣는 이유 (목적·자료·형식·제한) */
  LRN.ask = function (w, t) {
    var P = [
      ["목적", "누구에게 보여 줄 글인지", "상사에게 보고할 자료로 쓸 거야."],
      ["자료", "무엇을 보고 쓸지", "아래 회의메모에 적힌 내용만 써."],
      ["형식", "항목과 분량", "4개 항목으로, 각 3줄 이내로 정리해."],
      ["제한", "추측과 누락 금지", "메모에 없는 내용은 [확인 필요]라고 표시해."]
    ];
    var on = [false, false, false, false];
    function paint() {
      var n = on.filter(Boolean).length, done = n === 4;
      var sent = ["이 회의메모를 정리해 줘."].concat(
        P.filter(function (x, k) { return on[k]; }).map(function (x) { return x[2]; }));
      w.innerHTML =
        '<div class="lrn-bar"><p class="lrn-status"><span class="lrn-kind">조립해 보기</span> · 미리 만든 예시, 실제 실행 아님</p>' + lrnDots(n, 4) + "</div>" +
        (done
          ? lrnShow("AI가 말을 안 듣는 것이 아닙니다",
              "<b>사람이 남긴 빈칸을 AI가 가장 흔한 방식으로 채운 것입니다.</b><br>" +
              "목적·자료·형식·제한 네 가지를 적어 주면 결과를 내가 정할 수 있습니다.")
          : lrnTodo(n + 1, "빠진 것을 눌러 채워 보세요. 네 개를 모두 채웁니다")) +
        '<div class="lrn-grid g4">' + P.map(function (x, k) {
          return '<button class="lrn-tile" aria-pressed="' + on[k] + '" data-k="' + k + '">' +
            "<b>" + esc(x[0]) + "</b><span>" + esc(x[1]) + "</span></button>";
        }).join("") + "</div>" +
        '<div class="lrn-card"><p class="lrn-lab">지금까지 만들어진 부탁</p>' +
        '<p class="lrn-inp">' + esc(sent.join(" ")) + "</p></div>" +
        '<div class="lrn-card"><p class="lrn-lab">AI가 돌려줄 결과</p><p class="lrn-inp lrn-plain">' +
        (n === 0 ? "길거나, 중요한 내용이 빠지거나, 없는 내용을 만들어 낼 수 있습니다."
         : n < 4 ? "조금 나아졌지만 아직 AI가 알아서 정하는 부분이 남아 있습니다."
         : "목적·항목·분량·확인 표시가 모두 정해져, 그대로 보고에 쓸 수 있는 글이 나옵니다.") + "</p></div>" +
        '<p class="lrn-note">“이 회의록 정리해줘”는 틀린 요청이 아닙니다. 다만 <b>누구에게 보여줄지·무엇을 남길지·얼마나 길게·없는 정보는 어떻게 할지</b>를 AI가 정하게 둔 요청입니다.</p>' +
        '<details class="lrn-more"><summary>더 알아보기</summary>' +
        '<p>· 좋은 프롬프트는 길어서 좋은 것이 아니라 <b>판단 기준이 들어 있어</b> 좋습니다.</p>' +
        '<p>· 첫 답은 완성품이 아니라 <b>검토할 초안</b>입니다. 수정 지시를 한 번 더 주는 것이 정상적인 사용입니다.</p></details>' +
        lrnFoot(t, n ? '<button class="lrn-btn plain" id="lrs">다시 하기</button>' : "");
      [].slice.call(w.querySelectorAll(".lrn-tile")).forEach(function (b) {
        b.onclick = function () { var k = +b.getAttribute("data-k"); on[k] = !on[k]; paint(); };
      });
      if ($("#lrs")) $("#lrs").onclick = function () { on = [false, false, false, false]; paint(); };
    }
    paint();
  };

  /* 5 — 왜 답이 매번 다를까 */
  LRN.vary = function (w, t) {
    var A = [
      "유달산에 올라 목포 시내를 내려다보고, 근대역사관을 둘러보세요.",
      "갓바위에서 바닷바람을 쐬고, 저녁에는 평화광장을 걸어 보세요.",
      "해상케이블카로 바다를 건너고, 근대역사거리에서 사진을 남겨 보세요."
    ];
    var R = [
      ["문맥", "앞선 대화와 첨부한 자료가 다릅니다"],
      ["모델", "학습·설정·버전이 다릅니다"],
      ["표현", "질문의 낱말과 순서가 조금만 달라도 바뀝니다"],
      ["생성", "가능성이 높은 여러 표현 중 하나를 고릅니다"]
    ];
    var got = [];
    function paint() {
      var n = got.length, done = n >= 3;
      w.innerHTML =
        '<div class="lrn-bar"><p class="lrn-status"><span class="lrn-kind">비교해 보기</span> · 미리 만든 예시, 실제 실행 아님</p>' + lrnDots(n, 3) + "</div>" +
        (done
          ? lrnShow("세 번 모두 답이 달랐습니다",
              "도구가 달라서가 아닙니다. <b>AI는 가능성이 높은 여러 표현 중 하나를 고릅니다.</b><br>" +
              "첫 답은 완성품이 아니라 <b>검토할 초안</b>입니다.")
          : lrnTodo(n + 1, "같은 질문을 세 번 눌러 보세요")) +
        '<div class="lrn-card"><p class="lrn-lab">같은 질문 (세 번 모두 같음)</p>' +
        '<p class="lrn-inp">목포 여행 한 곳만 추천해 줘</p></div>' +
        '<div class="lrn-pick">' + (done ? "" : '<button class="lrn-pickb big" id="lgo">이 질문 보내기</button>') + "</div>" +
        (n ? '<div class="lrn-table">' + got.map(function (g, k) {
              return '<div class="lrn-row"><span class="lrn-rl">' + (k + 1) + '번째</span><span class="lrn-rt">' + esc(g) + "</span></div>";
            }).join("") + "</div>" : "") +
        (done ? '<h3 class="lrn-sec">답이 달라지는 네 가지 까닭</h3><div class="lrn-grid g4">' +
            R.map(function (x) { return '<div class="lrn-tile flat"><b>' + esc(x[0]) + "</b><span>" + esc(x[1]) + "</span></div>"; }).join("") + "</div>" : "") +
        '<details class="lrn-more"><summary>더 알아보기</summary>' +
        '<p>· 같은 도구·같은 질문이라도 답은 달라질 수 있습니다. 고장이 아닙니다.</p>' +
        '<p>· 답을 고정하고 싶으면 <b>목적·형식·제한을 문장에 적어</b> 선택의 폭을 좁힙니다.</p></details>' +
        lrnFoot(t, n ? '<button class="lrn-btn plain" id="lrs">다시 하기</button>' : "");
      if ($("#lgo")) $("#lgo").onclick = function () { got.push(A[got.length]); paint(); };
      if ($("#lrs")) $("#lrs").onclick = function () { got = []; paint(); };
    }
    paint();
  };

  /* 6 — 자신 있게 틀립니다 */
  LRN.wrong = function (w, t) {
    var Q = [
      ["“이 약은 하루 세 번, 식후 30분에 드시면 됩니다.”", false, "약은 사람과 증상에 따라 다릅니다. 약사나 의사에게 확인해야 합니다."],
      ["“정확한 금액은 확인하지 못했습니다. 시청 누리집에서 보세요.”", true, "모르는 것을 모른다고 하고 확인할 곳을 알려 줍니다."],
      ["“2026년 목포시 지원사업 마감은 3월 15일, 지원금은 500만 원입니다.”", false, "공고를 확인하지 않고 날짜와 금액을 단정했습니다. 원문을 열어 봐야 합니다."],
      ["“세종대왕은 훈민정음을 1443년에 창제하고 1446년에 반포했습니다.”", true, "공식 기록과 연도·사건이 일치합니다."],
      ["“이 계약서는 법적으로 전혀 문제가 없습니다.”", false, "법은 상황에 따라 다릅니다. 전문가에게 확인해야 합니다."],
      ["“제가 찾은 자료로는 이렇습니다. 링크를 열어 확인해 주세요.”", true, "근거를 보여 주고 확인을 권합니다."]
    ];
    var i = 0, ans = null, score = 0;
    function paint() {
      var o = Q[i], last = i === Q.length - 1;
      w.innerHTML =
        '<div class="lrn-bar"><p class="lrn-status"><span class="lrn-kind">문제 풀기</span> · ' + (i + 1) + " / " + Q.length + " · 맞힌 개수 " + score + '</p>' + lrnDots(i + (ans !== null ? 1 : 0), Q.length) + "</div>" +
        (ans === null
          ? lrnTodo(i + 1, "그대로 믿어도 되는 답일까요?")
          : lrnDone(ans === o[1] ? "맞았습니다" : "다시 보세요",
              o[2] + (last ? '<br><b>' + Q.length + "문제 중 " + score + "문제를 맞히셨습니다.</b>" : ""),
              ans !== o[1])) +
        '<div class="lrn-stage"><p class="lrn-big">' + esc(o[0]) + "</p></div>" +
        (ans === null
          ? '<div class="lrn-pick"><button class="lrn-pickb big" data-v="1">믿어도 됩니다</button>' +
            '<button class="lrn-pickb big" data-v="0">확인이 필요합니다</button></div>'
          : '<div class="lrn-pick">' + (last
              ? '<button class="lrn-pickb big" id="lrs">처음부터 다시</button>'
              : '<button class="lrn-pickb big" id="lnx">다음 문제 →</button>') + "</div>") +
        '<p class="lrn-note"><b>약 · 돈 · 법 · 병원</b> 이야기는 AI가 아무리 자신 있게 말해도 <b>반드시 다시 확인</b>합니다.</p>' +
        '<div class="lrn-check"><b>쓰기 전 네 번 확인</b><ol>' +
        '<li><b>질문</b> — 무엇이 사실이어야 하는가</li>' +
        '<li><b>출처</b> — 공식 문서나 원문이 있는가</li>' +
        '<li><b>대조</b> — 날짜·금액·이름이 맞는가</li>' +
        '<li><b>표시</b> — 확인 못 한 곳을 구분해 두었는가</li></ol></div>' +
        '<details class="lrn-more"><summary>더 알아보기</summary>' +
        '<p>· 모르는 것을 모른다고 하지 않고 그럴듯하게 채우는 것을 <b>환각</b>이라고 부릅니다.</p>' +
        '<p>· “출처를 보여 줘”로 끝내지 않습니다. 링크를 열어 원문에서 다시 확인합니다.</p></details>' +
        lrnFoot(t, "");
      [].slice.call(w.querySelectorAll("[data-v]")).forEach(function (b) {
        b.onclick = function () {
          ans = b.getAttribute("data-v") === "1";
          if (ans === o[1]) score++;
          paint();
        };
      });
      if ($("#lnx")) $("#lnx").onclick = function () { i++; ans = null; paint(); };
      if ($("#lrs")) $("#lrs").onclick = function () { i = 0; ans = null; score = 0; paint(); };
    }
    paint();
  };

  /* 7 — 넣지 말아야 할 것 */
  LRN.safe = function (w, t) {
    var Q = [
      ["주민등록번호를 그대로 적어 물어보기", false, "주민번호는 절대 넣지 않습니다. 번호 없이 상황만 설명하세요."],
      ["계좌번호가 찍힌 통장 사진 올리기", false, "계좌번호는 가리고 올리거나, 아예 올리지 않습니다."],
      ["비밀번호를 알려 주고 대신 로그인해 달라고 하기", false, "비밀번호는 어디에도 넣지 않습니다."],
      ["내가 쓴 회의 메모에서 이름을 지우고 정리 부탁하기", true, "이름·연락처를 지운 자료는 넣어도 됩니다."],
      ["아직 공개되지 않은 회사 매출·계약 내용 넣기", false, "미공개 회사 정보는 넣지 않습니다. 회사 규정이 있으면 규정이 먼저입니다."],
      ["친구 사진을 허락 없이 올려 그림으로 바꾸기", false, "사진 속 사람에게 먼저 허락을 받습니다."],
      ["책 한 권을 통째로 붙여 넣고 요약 부탁하기", false, "저작권이 있는 글을 통째로 넣는 것은 피합니다. 내가 쓴 요약이나 일부만 씁니다."],
      ["내 일정과 할 일을 적어 정리 부탁하기", true, "개인정보가 없는 내 메모는 넣어도 됩니다."]
    ];
    var i = 0, ans = null, score = 0;
    function paint() {
      var o = Q[i], last = i === Q.length - 1;
      w.innerHTML =
        '<div class="lrn-bar"><p class="lrn-status"><span class="lrn-kind">문제 풀기</span> · ' + (i + 1) + " / " + Q.length + " · 맞힌 개수 " + score + '</p>' + lrnDots(i + (ans !== null ? 1 : 0), Q.length) + "</div>" +
        (ans === null
          ? lrnTodo(i + 1, "AI에 넣어도 될까요?")
          : lrnDone(ans === o[1] ? "맞았습니다" : "다시 보세요",
              o[2] + (last ? '<br><b>' + Q.length + "문제 중 " + score + "문제를 맞히셨습니다.</b>" : ""),
              ans !== o[1])) +
        '<div class="lrn-stage"><p class="lrn-big">' + esc(o[0]) + "</p></div>" +
        (ans === null
          ? '<div class="lrn-pick"><button class="lrn-pickb big" data-v="1">넣어도 됩니다</button>' +
            '<button class="lrn-pickb big" data-v="0">넣으면 안 됩니다</button></div>'
          : '<div class="lrn-pick">' + (last
              ? '<button class="lrn-pickb big" id="lrs">처음부터 다시</button>'
              : '<button class="lrn-pickb big" id="lnx">다음 문제 →</button>') + "</div>") +
        '<p class="lrn-note"><b>주민등록번호 · 계좌번호 · 비밀번호</b>는 넣지 않습니다. 이것만 지켜도 됩니다.</p>' +
        '<div class="lrn-check"><b>넣기 전 네 가지 질문</b><ol>' +
        '<li><b>사실</b> — 날짜·금액·이름을 원문과 확인했는가</li>' +
        '<li><b>개인정보</b> — 주민번호·연락처·계좌·건강정보가 들어 있는가</li>' +
        '<li><b>회사정보</b> — 미공개 매출·계약·고객·내부 전략이 들어 있는가</li>' +
        '<li><b>저작권</b> — 남의 글을 통째로 복제하거나 출처 없이 쓰는가</li></ol></div>' +
        '<details class="lrn-more"><summary>더 알아보기</summary>' +
        '<p>· 회사 규정이 있으면 그 규정이 먼저입니다. 연습에는 가상 자료나 이름을 지운 자료를 씁니다.</p></details>' +
        lrnFoot(t, "");
      [].slice.call(w.querySelectorAll("[data-v]")).forEach(function (b) {
        b.onclick = function () {
          ans = b.getAttribute("data-v") === "1";
          if (ans === o[1]) score++;
          paint();
        };
      });
      if ($("#lnx")) $("#lnx").onclick = function () { i++; ans = null; paint(); };
      if ($("#lrs")) $("#lrs").onclick = function () { i = 0; ans = null; score = 0; paint(); };
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
            '<span class="mrow-txt"><b>' + (x.n ? x.n + ". " : "") + esc(x.q) + "</b>" +
            (x.sub ? "<span>" + String(x.sub).replace(/<br>/g, " ") + "</span>" : "") +
            (x.ready ? "" : '<span class="need-photo">강사 준비 필요</span>') + "</span>" +
            '<span class="tile-go" aria-hidden="true"></span></a></li>';
        }).join("") + "</ul>";
      return;
    }
    clearInterval(LRN._t);
    $("#view").innerHTML = lrnShell(t, "");
    (LRN[t.id] || function (w) { w.innerHTML = '<p class="lrn-ghost">준비 중입니다.</p>'; })($("#lrnWork"), t);
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
      ? "<strong>+</strong> → <strong>이미지 만들기</strong> → <strong>형식</strong>을 <strong>GIF</strong>로 → 사진 넣기 → 글자 칸을 꾹 눌러 <strong>붙여넣기</strong>"
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
