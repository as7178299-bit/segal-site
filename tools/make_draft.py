#!/usr/bin/env python3
"""טיוטת פתיחה משולבת: לוקח את src/site.html ומחליף רק את הפתיחה (סימון, עיצוב וקוד). פלט: הנתיב שניתן."""
import re, sys, pathlib
t = pathlib.Path(__file__).resolve().parent
s = (t.parent / 'src' / 'site.html').read_text(encoding='utf-8')
a = s.index('<main class="herob">'); b = s.index('</main>', a) + len('</main>')
s = s[:a] + (t / 'hero_hx.html').read_text(encoding='utf-8').rstrip() + s[b:]
# הקוד של הפתיחה הישנה הוא בלוק הסקריפט הראשון
m = re.search(r'<script>\s*\{\s*const reduce=.*?const STEPS=.*?</script>', s, flags=re.S)
assert m, 'hero script not found'
s = s[:m.start()] + '<script>\n' + (t / 'hero_hx.js').read_text(encoding='utf-8') + '</script>' + s[m.end():]
i = s.rindex('</style>')
s = s[:i] + (t / 'hero_hx.css').read_text(encoding='utf-8') + (t / 'unify.css').read_text(encoding='utf-8') + (t / 'wow.css').read_text(encoding='utf-8') + s[i:]
j = s.rindex('</body>')
s = s[:j] + '<script>\n' + (t / 'wow.js').read_text(encoding='utf-8') + '</script>\n' + s[j:]
s = s.replace('<title>', '<meta name="robots" content="noindex">\n<title>טיוטה · ', 1)
pathlib.Path(sys.argv[1]).write_text(s, encoding='utf-8')
print('ok')
