"""Makes a single-file copy of the site: every <script src="..."> in index.html is put inline.
The result (dist/spine-pain-guide.html) opens anywhere as one file and is the version used for hosting.
Usage:  python3 tools/bundle.py
"""
import os, re, json

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
html = open(os.path.join(ROOT, 'index.html'), encoding='utf-8').read()


def inline(m):
    src = m.group(1)
    js = open(os.path.join(ROOT, src), encoding='utf-8').read()
    js = js.replace('</script', '<\\/script').replace('<!--', '<\\!--')
    return f'<script data-src="{src}">\n{js}\n</script>'


out, n = re.subn(r'<script src="([^"]+)"></script>', inline, html)
os.makedirs(os.path.join(ROOT, 'dist'), exist_ok=True)
dest = os.path.join(ROOT, 'dist', 'spine-pain-guide.html')
open(dest, 'w', encoding='utf-8').write(out)
print(f'inlined {n} scripts -> {dest} ({os.path.getsize(dest) // 1024} KB)')
# hosting copy: a folder whose only file is index.html (drag this folder onto Netlify Drop, or upload it to GitHub Pages)
web = os.path.join(ROOT, 'dist', 'web'); os.makedirs(web, exist_ok=True)
open(os.path.join(web, 'index.html'), 'w', encoding='utf-8').write(out)
print('hosting copy ->', os.path.join(web, 'index.html'))

# offline worker for the installed app: list every file it must keep, and a cache name that changes with the content
import hashlib
scripts = re.findall(r'<script src="([^"]+)"></script>', html)
files = ['./', 'index.html', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/apple-touch-icon.png', 'icons/favicon-32.png'] + scripts
h = hashlib.sha1()
for f in files[1:]: h.update(open(os.path.join(ROOT, f), 'rb').read())
sw_path = os.path.join(ROOT, 'sw.js'); sw = open(sw_path, encoding='utf-8').read()
sw = re.sub(r"const CACHE = '[^']*';", "const CACHE = 'spg-%s';" % h.hexdigest()[:10], sw)
sw = re.sub(r"const FILES = \[[^\]]*\];", "const FILES = " + json.dumps(files) + ";", sw)
open(sw_path, 'w', encoding='utf-8').write(sw)
print('offline worker updated:', len(files), 'files, cache', 'spg-' + h.hexdigest()[:10])
# the single-file hosting copy gets its own manifest, icons and a small offline worker
import shutil
shutil.copy(os.path.join(ROOT, 'manifest.webmanifest'), web)
os.makedirs(os.path.join(web, 'icons'), exist_ok=True)
for f in files:
    if f.startswith('icons/'): shutil.copy(os.path.join(ROOT, f), os.path.join(web, f))
wfiles = [f for f in files if not f.endswith('.js')]
open(os.path.join(web, 'sw.js'), 'w', encoding='utf-8').write(re.sub(r"const FILES = \[[^\]]*\];", "const FILES = " + json.dumps(wfiles) + ";", sw))
print('hosting copy has manifest, icons and offline worker')
