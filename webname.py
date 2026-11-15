"""관리표의 한글 그림 파일명을 사이트용 영문 파일명으로 바꾼다.
예) 2-4_명절.jpg -> 2-4_myeongjeol.jpg, 3_K팝.jpg -> 3_kpap.jpg
한글 파일명은 압축을 풀거나 인터넷 주소로 쓸 때 깨지기 쉬워서, 사이트에는 영문 이름만 쓴다.
관리표에는 지금처럼 한글 파일명을 그대로 적으면 된다.
"""
import re

_I = ["g", "kk", "n", "d", "tt", "r", "m", "b", "pp", "s", "ss", "", "j", "jj", "ch", "k", "t", "p", "h"]
_V = ["a", "ae", "ya", "yae", "eo", "e", "yeo", "ye", "o", "wa", "wae", "oe", "yo", "u", "wo", "we", "wi", "yu", "eu", "ui", "i"]
_F = ["", "k", "k", "k", "n", "n", "n", "t", "l", "k", "m", "l", "l", "l", "p", "l", "m", "p", "p", "t", "t", "ng", "t", "t", "k", "t", "p", "t"]


def romanize(text):
    out = []
    for ch in text:
        c = ord(ch)
        if 0xAC00 <= c <= 0xD7A3:
            c -= 0xAC00
            out.append(_I[c // 588] + _V[(c % 588) // 28] + _F[c % 28])
        else:
            out.append(ch)
    return "".join(out)


def web_name(fname):
    """한글 그림 파일명 -> 사이트용 영문 .jpg 파일명 (빈 값은 그대로)"""
    fname = (fname or "").strip()
    if not fname:
        return ""
    stem = re.sub(r"\.(jpe?g|png|webp)$", "", fname, flags=re.I)
    stem = romanize(stem).lower()
    stem = re.sub(r"[^a-z0-9_-]+", "-", stem).strip("-")
    return stem + ".jpg"


def web_names(spec):
    """'여 그림 / 남 그림' 형식도 함께 바꾼다"""
    if not spec:
        return ""
    return " / ".join(web_name(p) for p in str(spec).split("/"))
