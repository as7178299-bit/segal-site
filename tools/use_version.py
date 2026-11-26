#!/usr/bin/env python3
"""בחירת הגרסה של דף הבית, ובנייה מחדש של האתר.
  python3 tools/use_version.py new      ← הפתיחה המשולבת (חמש דוגמאות) + השפה האחידה
  python3 tools/use_version.py classic  ← הדף הקודם
אחרי ההרצה: commit ו-push, והשרת מושך את השינוי תוך דקה.
"""
import sys, pathlib, subprocess, shutil
t = pathlib.Path(__file__).resolve().parent
v = sys.argv[1] if len(sys.argv) > 1 else ''
dst = t.parent / 'src' / 'site.html'
if v == 'new':
    subprocess.run([sys.executable, str(t / 'make_draft.py'), str(dst)], check=True)
elif v == 'classic':
    shutil.copyfile(t / 'site-classic.html', dst)
else:
    sys.exit('use: new | classic')
(t / 'VERSION').write_text(v + '\n')
subprocess.run([sys.executable, str(t / 'build.py')], check=True)
print('גרסה פעילה:', v)
