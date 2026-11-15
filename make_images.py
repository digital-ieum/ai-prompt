"""그림 원본 폴더(한글 파일명 PNG/JPG)를 사이트용 그림으로 만든다.
사용: python make_images.py <원본 그림 폴더> <사이트 img 폴더>
- 큰 그림: 정사각형 1024px(가로 그림은 가로 1200px) -> img/
- 작은 그림: 정사각형 480px(가로 그림은 가로 720px) -> img/s/
- 파일명은 영문으로 바꾼다(webname.py). 원본은 건드리지 않는다.
- 그림 아래 'AI로 생성한 이미지입니다.' 글자가 잘리지 않게 자르지 않고 크기만 줄인다.
"""
import os
import sys
from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from webname import web_name

src, out = sys.argv[1], sys.argv[2]
os.makedirs(os.path.join(out, "s"), exist_ok=True)
n = 0
for f in sorted(os.listdir(src)):
    if not f.lower().endswith((".png", ".jpg", ".jpeg", ".webp")):
        continue
    im = Image.open(os.path.join(src, f)).convert("RGB")
    name = web_name(f)
    wide = im.width > im.height
    big = im.copy(); big.thumbnail((1200, 1024) if wide else (1024, 1024), Image.LANCZOS)
    big.save(os.path.join(out, name), quality=82, optimize=True, progressive=True)
    sm = im.copy(); sm.thumbnail((720, 480) if wide else (480, 480), Image.LANCZOS)
    sm.save(os.path.join(out, "s", name), quality=80, optimize=True, progressive=True)
    print(f"{f} -> {name}")
    n += 1
print(f"그림 {n}장 완료")
