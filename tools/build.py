#!/usr/bin/env python3
"""בניית האתר: src/*.html  ←  site/
- כל <script> שבתוך הדף יוצא לקובץ js/<דף>-N.js באותו מקום, כדי שה-CSP בשרת יוכל לאסור קוד בתוך הדף (script-src 'self').
- site.html נשמר בשם index.html.
הרצה: python3 tools/build.py
"""
import re, pathlib, hashlib
root = pathlib.Path(__file__).resolve().parent.parent
src, out = root / 'src', root / 'site'
(out / 'js').mkdir(parents=True, exist_ok=True)
for old in (out / 'js').glob('*.js'):
    old.unlink()
for f in sorted(src.glob('*.html')):
    name = 'index' if f.stem == 'site' else f.stem
    html = f.read_text(encoding='utf-8')
    n = 0
    def ext(m):
        global n
        n += 1
        code = m.group(1).strip() + '\n'
        h = hashlib.sha1(code.encode()).hexdigest()[:8]
        fn = f'{name}-{n}.js'
        (out / 'js' / fn).write_text(code, encoding='utf-8')
        return f'<script src="js/{fn}?v={h}"></script>'
    html = re.sub(r'<script>(.*?)</script>', ext, html, flags=re.S)
    assert '<script>' not in html
    (out / f'{name}.html').write_text(html, encoding='utf-8')
    print(f'{name}.html  ({n} קבצי קוד)')
