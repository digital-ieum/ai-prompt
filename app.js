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

  function tabById(id) { return SITE.tabs.filter(function (t) { return t.id === String(id); })[0]; }
  function cardsOf(tab) { return SITE.cards.filter(function (c) { return c.tab === tab.id; }); }
  function stageLabel(t) { return t.stage + "단계 " + t.stageName; }
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
    var html = '<span class="stage-chip">' + esc(stageLabel(tab)) + "</span>";
    html += card
      ? '<a href="#/tab/' + tab.id + '">' + esc(tab.title) + "</a>"
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
        ? '<figure class="hero-photo"><img src="' + src(SITE.hero) + '" alt="두 사람이 함께 휴대폰으로 AI를 써 보는 모습. AI로 만든 그림입니다." width="1200" height="800"></figure>'
        : "");
    var apps = Object.keys(SITE.links || {}).filter(function (k) { return SITE.links[k]; });
    var html =
      '<section class="hero hero-v2" aria-labelledby="heroH">' +
      '<img class="hero-mark" src="img/brand/mark_white.png" alt="">' +
      '<p class="eyebrow">디지털이음 AI 실습</p>' +
      '<h1 class="lead" id="heroH">고르기만 하면 AI에게 보낼 문장이 완성돼요</h1>' +
      '<p class="hero-sub">글을 쓰지 않아도 돼요. 질문에 답하듯 고르기만 하세요.</p>' +
      '<ol class="how3"><li><b>1</b>고르기</li><li><b>2</b>복사하기</li><li><b>3</b>붙여넣기</li></ol>' +
      '<a class="hero-start" href="#/tab/' + SITE.tabs[0].id + '">체험 시작하기</a>' +
      photo +
      "</section>" +
      '<ul class="facts" aria-label="체험관 한눈에 보기">' +
      "<li><b>" + SITE.cards.length + "</b><span>실습 카드</span></li>" +
      "<li><b>" + SITE.tabs.length + "</b><span>주제</span></li>" +
      "<li><b>" + apps.length + "</b><span>" + esc(apps.join("·")) + "</span></li></ul>";
    stages.forEach(function (s) {
      html += '<section class="stage" aria-labelledby="st' + s.stage + '">' +
        '<h2 id="st' + s.stage + '">' + s.stage + "단계 " + esc(s.name) + "</h2>" +
        '<ul class="tiles">' + s.tabs.map(function (t) {
          var first = cardsOf(t)[0];
          var pic = first && first.img ? pickFile(first.img, "여") : "";
          return '<li><a class="tile" href="#/tab/' + t.id + '">' +
            (pic
              ? '<span class="tile-ico tile-pic"><img src="' + src(pic, true) + '" alt="" loading="lazy" onerror="this.remove()"></span>'
              : '<span class="tile-ico">' + svg(t.icon) + "</span>") +
            '<span class="tile-txt"><b>' + esc(t.title) + "</b><span>" + esc(t.desc) + "</span></span></a></li>";
        }).join("") + "</ul></section>";
    });
    if (SITE.homeOrgs && SITE.homeOrgs.length) {
      html += '<section class="orgs" aria-labelledby="orgsH"><h2 id="orgsH">' + esc(SITE.homeOrgsTitle || "강의한 곳") + "</h2><ul>" +
        SITE.homeOrgs.map(function (o) { return "<li>" + esc(o) + "</li>"; }).join("") + "</ul>" +
        (SITE.homeOrgsNote ? "<p>" + esc(SITE.homeOrgsNote) + "</p>" : "") + "</section>";
    }
    $("#view").innerHTML = html;
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
    return { file: pickFile(it.img, state.gender), label: it.label };
  }
  function noteHtml(card) {
    var common = SITE.picCaption ? "<b>" + esc(SITE.picCaption) + "</b>" : "";
    var own = card.picNote ? " " + esc(card.picNote) : "";
    return common || own ? '<p class="pic-note">' + common + own + "</p>" : "";
  }
  var ARROW = '<span class="arrow" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h13M13 6l6 6-6 6"/></svg></span>';
  function renderCompare(card) {
    var before = pickFile(card.before, state.gender);
    var a = afterOf(card);
    return '<div class="compare" id="compare">' +
      '<div class="compare-row">' +
      '<figure class="panel before"><button type="button" class="panel-btn" data-zoom="1" aria-label="원본 예시와 변환 예시를 크게 보기">' +
      '<span class="tag">원본 예시</span>' +
      '<div class="thumb"><img src="' + src(before, true) + '" alt="원본 예시 사진 (AI로 만든 가상 사진)"></div></button>' +
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
    img.alt = "변환 예시: " + a.label + " (AI로 만든 가상 사진)";
    cap.textContent = a.label;
    if (!REDUCE) {
      [img, cap].forEach(function (el) { el.classList.remove("swap"); void el.offsetWidth; el.classList.add("swap"); });
    }
  }

  function openZoom(card) {
    var dlg = $("#zoom");
    var before = pickFile(card.before, state.gender);
    var a = afterOf(card);
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
    var video = card.flowSet === "영상";
    var grid = f.items.map(function (it) {
      return "<div><dt>" + esc(it[0]) + "</dt><dd>" + esc(it[1]) + "</dd></div>";
    }).join("");
    var note = f.note ? esc(f.note).replace(/(\d+크레딧)/, "<b>$1</b>") : "";
    var tips = video && SITE.flowTips && SITE.flowTips.length
      ? '<h3 class="fs-sub">무료로 쓰는 팁</h3><ul class="fs-tips">' +
        SITE.flowTips.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>"
      : "";
    return '<section class="flowset" aria-labelledby="fsh">' +
      '<h2 id="fsh">Flow에서 이렇게 맞추세요</h2>' +
      '<p class="fs-lead">붙여넣은 다음, 생성 버튼을 누르기 전에 아래 설정과 같은지 확인하세요.</p>' +
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
    renderTop(t, card);
    if (!state || state.card !== card.id) state = loadState(card);
    var apps = appsOf(card);
    var chips = apps.map(function (a) { return "<li>" + esc(a) + "에 붙여넣기</li>"; }).join("");
    if (card.photo) chips += '<li class="need">사진 넣기 필요</li>';
    chips += card.followup ? '<li class="need">앞 대화에 이어서</li>' : '<li class="fresh">새 대화에서 시작</li>';
    var after = (card.after && card.after.length) ? card.after
      : ((!card.photo && !card.followup && card.app.indexOf("Flow") < 0) ? (SITE.afterDefault || []) : []);
    var typedNote = (SITE.typedNote && card.groups.some(function (g) { return isInput(g) || hasTyping(g); }))
      ? '<p class="typed-note">' + esc(SITE.typedNote) + "</p>" : "";
    var how = card.followup
      ? "<strong>복사하기</strong>를 누른 다음, <strong>답을 받았던 대화</strong>로 돌아가 글자 칸을 꾹 눌러 <strong>붙여넣기</strong> 하세요. 새 대화를 열면 앞의 답이 없어요."
      : card.photo && card.flowSet === "영상"
      ? "<strong>복사하기</strong>를 누르고 아래 <strong>Flow 사이트 열기</strong>를 누른 다음, 글자 칸 위의 <strong>시작</strong> 칸을 눌러 사진을 고르고(휴대폰 사진은 오른쪽 위 <strong>올리기</strong> 버튼) 글자 칸을 꾹 눌러 <strong>붙여넣기</strong> 하세요."
      : card.photo
      ? "<strong>복사하기</strong>를 누르고 아래 <strong>사이트 열기</strong>를 누른 다음, 먼저 <strong>+</strong>를 눌러 사진을 넣고 글자 칸을 꾹 눌러 <strong>붙여넣기</strong> 하세요."
      : "<strong>복사하기</strong>를 누르고 아래 <strong>사이트 열기</strong>를 누른 다음, 글자 칸을 꾹 눌러 <strong>붙여넣기</strong> 하세요.";
    // 사이트 단추로는 휴대폰 앱이 열리지 않는다(2026-11-16 S25·크롬 시험). 앱은 직접 열도록 안내. Flow 앱 화면은 확인 전이라 안내하지 않음
    if (!card.followup && card.app.indexOf("Flow") < 0) {
      how += '<span class="how-app">앱으로 하려면: 휴대폰 화면에서 앱을 직접 눌러 열고, ' +
        (card.photo ? "<strong>+</strong>로 사진을 넣은 뒤 " : "") + '글자 칸을 꾹 눌러 <strong>붙여넣기</strong> 하세요.</span>';
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
      '<a class="back" href="#/tab/' + t.id + '">' + esc(t.title) + " 목록으로</a>" +
      '<h1 class="lead">' + titleHtml(card.title) + "</h1>" +
      (card.banner ? '<p class="banner">' + esc(card.banner) + "</p>" : "") +
      '<ul class="chips">' + chips + "</ul>" +
      (card.note ? '<p class="tip">' + esc(card.note) + "</p>" : "") +
      (hasChoice
        ? '<div class="picked" id="picked"><b>내가 고른 것</b><ul class="picked-list" id="pickedList" aria-live="polite"></ul>' +
          '<button type="button" class="reset" id="resetBtn">다시 고르기</button></div>'
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
      typedNote + '<p class="how">' + how + "</p>" +
      (after.length
        ? '<div class="after-box"><h3>붙여넣은 다음</h3><ol class="after-steps">' +
          after.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ol></div>"
        : "") +
      "</section>" +
      flowBox(card) +
      '<nav class="card-end" aria-label="다른 곳으로 가기">' +
      '<a class="end-btn" href="#/tab/' + t.id + '">' + esc(t.title) + ' 목록으로</a>' +
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
    btn.textContent = "문장 복사하기";
    btn.classList.remove("done");
    if (card && card.followup) {
      $("#dockApps").innerHTML = '<span class="btn-app follow">앞 대화에<br>붙여넣기</span>';
      return;
    }
    $("#dockApps").innerHTML = apps.map(function (a) {
      return '<a class="btn-app" href="' + esc(appHref(SITE.links[a] || "#")) + '" target="_blank" rel="noopener">' + esc(a) + "<br>사이트 열기</a>";
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
      var cc = SITE.cards.filter(function (c) { return c.id === state.card; })[0];
      toast(cc && cc.copyMsg ? cc.copyMsg + " 다 쓰면 휴대폰 [뒤로] 버튼으로 여기로 돌아와요." : "복사했어요. 사이트나 앱을 열고 붙여넣으세요. 다 쓰면 휴대폰 [뒤로] 버튼으로 여기로 돌아와요.", null, null, cc && cc.copyMsg ? 6500 : 5000);
      setTimeout(function () { btn.textContent = "문장 복사하기"; btn.classList.remove("done"); }, 2600);
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
    var y = !isCard && lastWasCard && listPos[key] ? listPos[key] : 0;
    routing = true;
    if (h[0] === "card" && h[1]) {
      renderCard(decodeURIComponent(h[1]));
    } else if (h[0] === "tab" && h[1]) {
      state = null;
      renderTab(h[1]);
    } else {
      state = null;
      renderHome();
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
