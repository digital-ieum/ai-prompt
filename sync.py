"""관리표(구글 시트를 xlsx로 내보낸 파일)를 읽어 사이트 데이터(data.js)를 만든다.
사용: python sync.py 관리표.xlsx data.js

읽는 시트: 탭, 카드, 선택지, 공통 설정, 변경 기록
- 상태가 '보관'인 탭과 카드는 사이트에 넣지 않는다.
- 보관한 탭의 카드도 함께 빠진다.
"""
import json
import re
import os
import sys
from openpyxl import load_workbook

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from webname import web_names  # 한글 그림 파일명 -> 사이트용 영문 파일명

src, out = sys.argv[1], sys.argv[2]
wb = load_workbook(src, data_only=True)


def s(v):
    if v is None:
        return ""
    if isinstance(v, float) and v.is_integer():
        v = int(v)
    return str(v).strip()


def rows(name):
    ws = wb[name]
    it = ws.iter_rows(values_only=True)
    head = [s(h) for h in next(it)]
    for r in it:
        if not r or s(r[0]) == "":
            continue
        yield {head[i]: r[i] for i in range(min(len(head), len(r))) if head[i]}


def col(row, prefix):
    """머리글이 prefix로 시작하는 칸의 값 (머리글에 설명이 붙어 있어도 찾도록)"""
    for k, v in row.items():
        if k.startswith(prefix):
            return v
    return None


warnings = []

# ---- 탭 ----
tabs = []
for r in rows("탭"):
    tid = s(col(r, "탭ID"))
    if not tid.isdigit():
        continue
    if s(col(r, "상태")) == "보관":
        continue
    tabs.append({
        "id": tid,
        "key": s(col(r, "탭 이름")),
        "title": s(col(r, "화면 제목")) or s(col(r, "탭 이름")),
        "stage": int(s(col(r, "단계")) or 99),
        "stageName": s(col(r, "단계 이름")),
        "order": int(s(col(r, "단계 안 순서")) or 99),
        "desc": s(col(r, "한 줄 설명")),
        "icon": s(col(r, "아이콘")) or "chat",
        "guide": s(col(r, "탭 안내")),
        "steps": [x.strip() for x in s(col(r, "탭 순서")).split("|") if x.strip()],
    })
tabs.sort(key=lambda t: (t["stage"], t["order"]))
tab_by_key = {t["key"]: t for t in tabs}

# ---- 선택지 ----
choices = {}
for r in rows("선택지"):
    cid = s(r.get("카드번호"))
    if not re.match(r"^\d+-\d+$", cid):
        continue
    groups = choices.setdefault(cid, [])
    key = s(r.get("빈칸 이름"))
    g = next((x for x in groups if x["key"] == key), None)
    if g is None:
        g = {"key": key, "q": s(r.get("화면 질문")), "mode": s(r.get("고르는 방식")),
             "more": s(col(r, "구분")) == "더 자세히", "items": []}
        g["optional"] = False
        groups.append(g)
    g["items"].append({
        "label": s(r.get("보이는 글")),
        "text": s(r.get("문장에 들어갈 말")),
        "img": web_names(s(r.get("그림 파일명"))),
        "bubble": s(r.get("말풍선 예시")),
        "desc": s(col(r, "설명")),
        "extra": s(col(r, "구분")) == "더 보기",
    })
    _img = g["items"][-1]["img"]
    if _img and "/" not in _img:
        _gif = "gif/" + _img.rsplit(".", 1)[0] + ".gif"  # 같은 이름의 움직이는 그림이 있으면 함께 보여 줌
        if os.path.exists(os.path.join(os.path.dirname(os.path.abspath(out)), "img", _gif)):
            g["items"][-1]["gif"] = _gif
    if g["mode"] in ("직접입력", "긴글입력") and g["items"][0]["text"]:
        g["optional"] = True  # 비우면 '문장에 들어갈 말'이 대신 들어감

# ---- 카드 ----
cards = []
for r in rows("카드"):
    cid = s(r.get("카드번호"))
    if not re.match(r"^\d+-\d+$", cid):
        continue
    if s(r.get("상태")) == "보관":
        continue
    tab = tab_by_key.get(s(r.get("탭")))
    if tab is None:
        warnings.append(f"{cid}: 탭 '{s(r.get('탭'))}'이(가) 「탭」 시트에 없거나 보관 상태라 제외")
        continue
    template = s(col(r, "완성 문장"))
    groups = choices.get(cid, [])
    keys = set(re.findall(r"\{([^}]+)\}", template))
    gkeys = {g["key"] for g in groups}
    if keys - gkeys:
        warnings.append(f"{cid}: 선택지가 없는 빈칸 {sorted(keys - gkeys)}")
    for g in groups:
        if g["mode"] not in ("직접입력", "긴글입력") and len(g["items"]) % 2:
            warnings.append(f"{cid}: '{g['key']}' 선택지가 {len(g['items'])}개(홀수) - 화면에 빈칸이 생김")
        if g["more"] and g["mode"] in ("직접입력", "긴글입력"):
            warnings.append(f"{cid}: 직접입력 질문 '{g['key']}'은(는) '더 자세히'로 둘 수 없음")
    if gkeys - keys:
        warnings.append(f"{cid}: 문장에 없는 선택지 {sorted(gkeys - keys)}")
    cards.append({
        "id": cid,
        "tab": tab["id"],
        "order": int(s(r.get("순서")) or 99),
        "title": s(r.get("카드 제목")),
        "desc": s(r.get("한 줄 설명")),
        "app": s(r.get("사용 앱")),
        "photo": s(r.get("사진 첨부")) == "예",
        "template": template,
        "note": s(r.get("화면에 보일 주의 한 줄")),
        "img": web_names(s(r.get("대표 그림"))),
        "icon": s(r.get("아이콘")),
        "status": s(r.get("상태")),
        "before": web_names(s(col(r, "비교 원본"))),
        "picNote": s(col(r, "그림 아래 설명")),
        "followup": s(col(r, "이어서 쓰기")) == "예",
        "flowSet": s(col(r, "Flow 설정")),
        "banner": s(col(r, "맨 위 안내")),
        "after": [x.strip() for x in s(col(r, "붙여넣은 뒤 할 일")).split("|") if x.strip()],
        "copyMsg": s(col(r, "복사 후 알림")),
        "groups": groups,
    })
tab_rank = {t["id"]: i for i, t in enumerate(tabs)}
cards.sort(key=lambda c: (tab_rank[c["tab"]], c["order"]))
for t in tabs:
    n = sum(1 for c in cards if c["tab"] == t["id"])
    if n > 6:
        warnings.append(f"탭 '{t['title']}' 카드 {n}개: 6개를 넘음")

# ---- 공통 설정 / 버전 ----
common = {s(r.get("항목")): s(r.get("내용")) for r in rows("공통 설정")}
notices = [v for k, v in common.items() if k.startswith("하단 주의") and v]
version = ""
for r in rows("변경 기록"):
    version = s(r.get("버전")) or version

site = {
    "name": common.get("사이트 이름", "AI 프롬프트 체험관"),
    "maker": common.get("만든 사람", ""),
    "links": {
        "제미나이": common.get("제미나이 열기 링크", ""),
        "챗GPT": common.get("챗GPT 열기 링크", ""),
        "Flow": common.get("Flow 열기 링크", ""),
    },
    "notices": notices,
    "makerTitle": common.get("만든 사람 소개", ""),
    "hero": web_names(common.get("홈 대표 그림", "")),
    "picCaption": common.get("그림 아래 공통 설명", ""),
    "brag": {"url": common.get("작품 자랑방 링크", ""), "text": common.get("작품 자랑방 안내", "")},
    "flow": {
        kind: {
            "items": [[x.split(":", 1)[0].strip(), x.split(":", 1)[1].strip()] for x in common.get(f"Flow {kind} 설정", "").split("|") if ":" in x],
            "note": common.get(f"Flow {kind} 크레딧", ""),
        }
        for kind in ("영상", "그림", "복원") if common.get(f"Flow {kind} 설정")
    },
    "flowTips": [x.strip() for x in common.get("Flow 무료 팁", "").split("|") if x.strip()],
    "flowSource": common.get("Flow 설정 출처", ""),
    "version": version,
    "tabs": tabs,
    "cards": cards,
}
with open(out, "w", encoding="utf-8") as f:
    f.write("window.SITE = ")
    json.dump(site, f, ensure_ascii=False, separators=(",", ":"))
    f.write(";\n")
# index.html의 파일 주소에 버전을 붙여, 휴대폰이 예전 파일을 붙잡고 있지 않게 한다
_idx = os.path.join(os.path.dirname(os.path.abspath(out)), "index.html")
if version and os.path.exists(_idx):
    _v = version.lstrip("v").split()[0]
    with open(_idx, encoding="utf-8") as f:
        _h = f.read()
    _h2 = re.sub(r'(href="style\.css|src="data\.js|src="app\.js)(\?v=[^"]*)?"', lambda m: m.group(1) + "?v=" + _v + '"', _h)
    if _h2 != _h:
        with open(_idx, "w", encoding="utf-8") as f:
            f.write(_h2)
print(f"탭 {len(tabs)}개, 카드 {len(cards)}개, 선택지 묶음 {sum(len(c['groups']) for c in cards)}개 -> {out}")
for w in warnings:
    print("확인 필요:", w)
