import json,re,os,html,datetime
os.chdir('/home/claude/infohab')
C=json.load(open('/home/claude/infohab/tools/data/codes.json'))
h=open('index.html').read()
codes={c:v['url'] for c,v in C.items()};urlc={}
for c,v in sorted(C.items()): urlc.setdefault(v['url'][1:],c)
h=re.sub(r'const CODES=\{.*?\},URLCODE=\{.*?\};','const CODES='+json.dumps(codes,ensure_ascii=False,separators=(',',':'))+',URLCODE='+json.dumps(dict(sorted(urlc.items())),ensure_ascii=False,separators=(',',':'))+';',h,count=1,flags=re.S)
open('index.html','w').write(h)
n=0
for c,v in C.items():
  p=f'{c}/index.html'
  if os.path.exists(p): continue
  u=v['url'];t=html.escape(v['title'])
  os.makedirs(c,exist_ok=True);n+=1
  open(p,'w').write(f'<!DOCTYPE html><html lang="uk"><head><meta charset="utf-8"><title>Код {c}: {t}</title><meta name="robots" content="noindex"><link rel="canonical" href="https://urokinfo.com.ua{u.split("?")[0]}"><meta http-equiv="refresh" content="0;url={u}"><script>location.replace("{u}"+location.hash)</script></head><body><p><a href="{u}">{t}</a></p></body></html>')
k=open('kody/index.html').read();add=0
for c,v in sorted(C.items()):
  if f'href="/{c}/"' in k: continue
  kk=v['k'];row=f'<tr class="l{len(c)}"><td><a href="/{c}/"><b>{c}</b></a></td><td>{html.escape(v["title"])}</td><td>{html.escape(v["kind"]+": "+v["label"])}</td></tr>'
  m=re.search(rf'<h2 id="k{kk}">.*?</tbody>',k,re.S)
  if not m: print('no section',c);continue
  k=k[:m.end()-8]+row+k[m.end()-8:];add+=1
open('kody/index.html','w').write(k)
s=open('sitemap.xml').read();d=datetime.date.today().isoformat();sm=0
for u in ['seredovyshcha/','vchyteliu/','konstruktor/','yak-korystuvatysia/','pro-proekt/','infobytva/']+sorted({v['url'][1:].split('?')[0] for v in C.values() if v['url'].startswith('/seredovyshcha/')}):
  loc=f'https://urokinfo.com.ua/{u}'
  if f'<loc>{loc}</loc>' in s: continue
  s=s.replace('</urlset>',f'<url><loc>{loc}</loc><lastmod>{d}</lastmod><priority>0.8</priority></url>\n</urlset>');sm+=1
open('sitemap.xml','w').write(s)
print('redirects',n,'kody',add,'sitemap',sm)
json.dump(codes,open('site/codes.json','w'),ensure_ascii=False,separators=(',',':'))
