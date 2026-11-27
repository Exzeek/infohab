import json,glob,re
p='vse/index.html';s=open(p,encoding='utf8').read()
s=s.replace(' — Інфо-хаб</title>',' — urokinfo.com.ua</title>').replace('← Інфо-хаб','← Інтерактивні уроки').replace('https://exzeek.github.io/infohab/vse/','https://urokinfo.com.ua/vse/')
links=' · '.join(f'<a href="/{u}">{n}</a>' for u,n in [('2-klas/','2 клас'),('3-klas/','3 клас'),('4-klas/','4 клас'),('5-klas/','5 клас'),('6-klas/','6 клас'),('7-klas/','7 клас'),('8-klas/','8 клас'),('9-klas/','9 клас'),('10-11-klas/','10–11 клас'),('matematyka/','Математика'),('chytannia/','Читання')])
s=s.replace('<p>Інформатика 2–11 клас за підручниками Біос.','<p>Інформатика 2–11 клас за підручниками Біос. За класами: '+links+'.</p><p>',1)
open(p,'w',encoding='utf8').write(s)
C=json.load(open('/home/claude/infohab/tools/data/codes.json'));U={}
for k,v in sorted(C.items(),key=lambda x:(len(x[0]),x[0])): U.setdefault(v['url'],k)
files=glob.glob('*-klas/**/index.html',recursive=True)+glob.glob('matematyka/**/index.html',recursive=True)+glob.glob('chytannia/**/index.html',recursive=True)+glob.glob('instrumenty/**/index.html',recursive=True)
for f in files:
  s=open(f,encoding='utf8').read();s=re.sub(r'<span class="cd">[^<]*</span>','',s)
  def rep(m):
    u=m.group(1);u2='/'+u[3:] if u.startswith('../') else u;c=U.get(u2)
    return m.group(0)+(f'<span class="cd">{c}</span>' if c else '')
  s=re.sub(r'<a href="((?:\.\./|/)a/[^"]+)"[^>]*>.*?</a>',rep,s)
  if '.cd{' not in s: s=s.replace('</style>','.cd{font:700 12px ui-monospace,Menlo,monospace;padding:1px 6px;border-radius:6px;background:#5b3cc420;color:var(--acc);margin-left:6px}</style>',1)
  if 'favicon.svg' not in s: s=s.replace('</title>','</title><link rel="icon" href="/favicon.svg" type="image/svg+xml">',1)
  open(f,'w',encoding='utf8').write(s)
a=json.load(open('/tmp/codes_prev.json'))
print('codes same:',{k:v['url'] for k,v in a.items()}=={k:v['url'] for k,v in C.items()})
