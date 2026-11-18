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
    if (MENU.flow) Object.keys(MENU.flow).forEach(function (k) { SITE.flow[k] = MENU.flow[k]; });
    (MENU.cards || []).forEach(function (c) {
      var d = { order: 99, note: "", icon: "video", status: "검토중", before: "", picNote: "", followup: false, flowSet: "", banner: "", after: [], copyMsg: "", photo: false };
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
    nav.hidden = false;
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
    draw: '<path d="M5 27l3-9L22 4l5 5-14 14-8 4z"/><path d="M18 8l5 5"/>',
    photo: '<rect x="4" y="6" width="24" height="20" rx="3"/><circle cx="11" cy="13" r="2.5"/><path d="M4 23l7-6 5 4 5-5 7 6"/>',
    song: '<path d="M12 23V7l14-3v16"/><circle cx="8.5" cy="23" r="3.5"/><circle cx="22.5" cy="20" r="3.5"/>',
    video: '<rect x="4" y="6" width="24" height="20" rx="3"/><path d="M13 11.5v9l8-4.5z"/>',
    write: '<path d="M8 4h12l6 6v18H8z"/><path d="M20 4v6h6"/><path d="M12 16h10M12 21h10"/>',
    ask: '<path d="M5 6h22v16H15l-6 5v-5H5z"/><path d="M13 12a3 3 0 1 1 4.5 2.6c-1 .6-1.5 1.1-1.5 2.1"/><path d="M16 19.6v.2"/>',
    learn: '<path d="M11 21a8 8 0 1 1 10 0v3H11z"/><path d="M12 28h8"/><path d="M16 24v-6"/>'
  };
  function iconHtml(id) {
    return ICONS[id] ? '<span class="mrow-ico" aria-hidden="true"><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + ICONS[id] + "</svg></span>" : "";
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
    $("#view").innerHTML = html;
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
  function renderLearn(topicId) {
    var L = MENU.learn;
    renderTop({ id: "learn", title: L.title, href: "#/cat/learn" }, topicId ? {} : null);
    hideDock();
    var back = cardById(ss("lastCard"));
    var t = topicId && L.topics.filter(function (x) { return x.id === topicId; })[0];
    var html;
    if (!t) {
      html = '<h1 class="lead">' + esc(L.title) + '</h1><p class="sub">궁금한 것부터 골라 보세요. 순서는 없어요.</p><ul class="mlist">' +
        L.topics.map(function (x) {
          return rowHtml("#/learn/" + x.id, esc(x.q), x.ready ? "" : (x.cards.length ? "연습 " + x.cards.length + "가지" : "설명 준비 중"));
        }).join("") + "</ul>";
    } else {
      html = '<a class="back" href="#/cat/learn">' + esc(L.title) + ' 목록으로</a><h1 class="lead">' + esc(t.q) + "</h1>";
      if (t.ready) {
        html += '<p class="learn-lead">' + esc(t.lead) + '</p><h2 class="sec">' + esc(t.caseTitle) + '</h2><div class="cases">' +
          t.cases.map(function (c) {
            return '<div class="case"><b>' + esc(c.label) + '</b><p class="case-say">' + esc(c.text) + '</p><p class="case-note">' + esc(c.note) + "</p></div>";
          }).join("") + '</div><h2 class="sec">' + esc(t.doTitle) + '</h2><ul class="dos">' +
          t.dos.map(function (d) { return "<li>" + esc(d) + "</li>"; }).join("") + "</ul>";
      } else {
        html += '<p class="learn-lead">이 주제의 설명은 내용을 확인한 뒤에 넣을 예정이에요.' + (t.cards.length ? " 아래 연습은 지금 해 볼 수 있어요." : "") + "</p>";
      }
      if (t.cards.length) {
        html += '<h2 class="sec">AI에서 직접 해 보기</h2><ul class="mlist cards-list">' + t.cards.map(function (cid) {
          var k = cardById(cid);
          return k ? rowHtml("#/card/" + k.id, esc(k.title), "") : "";
        }).join("") + "</ul>";
      }
      if (back) html += '<a class="resume" href="#/card/' + back.id + '"><span>하던 활동으로 돌아가기</span><b>' + esc(back.title) + "</b></a>";
    }
    $("#view").innerHTML = html;
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
    if (changedKey && !REDUCE && !edited) {
      box.querySelectorAll('mark[data-k="' + changedKey + '"]').forEach(function (mk) { mk.classList.add("flash"); });
    }
  }

  function updatePicked(card, changedKey) {
    var tn = $("#typedNote");
    if (tn) tn.hidden = !(card.groups.some(function (g) { var p = groupShort(g); return p && p.typed; }) || (state.edited !== null && state.edited !== undefined));
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
    var common = SITE.picCaption ? "<b>" + esc(SITE.picCaption) + "</b>" : "";
    var own = card.picNote ? " " + esc(card.picNote) : "";
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
    var typedNote = (SITE.typedNote && card.groups.some(function (g) { return isInput(g) || hasTyping(g); }))
      ? '<p class="typed-note" id="typedNote" hidden>' + esc(SITE.typedNote) + "</p>" : "";
    var openName = card.followup ? "" : ((MENU ? aiPick(apps) : (apps.length > 1 ? "AI" : apps[0])) + " 사이트 열기");
    var step3 = card.photo && card.flowSet === "영상"
      ? "글자 칸 위 <strong>시작</strong> 칸을 눌러 사진을 고르고, 글자 칸을 꾹 눌러 <strong>붙여넣기</strong>"
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
