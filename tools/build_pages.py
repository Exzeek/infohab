import json,re,html,os
D=json.load(open('/tmp/topics.json'));T=D['T'];S=D['S']
M=json.load(open('/tmp/meta.json'))
ROOT='/home/claude/infohab';B='https://urokinfo.com.ua'
E=lambda s:html.escape(str(s),quote=True)
clean=lambda s:re.sub(r'<[^>]+>','',str(s or '')).strip()
CL={0:('instrumenty','Інструменти для уроку'),1:('chytannia','Читання'),2:('2-klas','2 клас'),3:('3-klas','3 клас'),4:('4-klas','4 клас'),5:('5-klas','5 клас'),6:('6-klas','6 клас'),7:('7-klas','7 клас'),8:('8-klas','8 клас'),9:('9-klas','9 клас'),10:('10-11-klas','10–11 клас'),12:('matematyka','Математика')}
ORDER=[2,3,4,5,6,7,8,9,10,12,1,0]
SECSLUG={'g':'ihry','p':'praktychni','a':'uroky','x':'pidsumok'}
def sslug(r): return f'rozdil-{r}' if isinstance(r,int) else SECSLUG.get(r,str(r))
def res_url(u):
  if re.match(r'https?://',u): return u,True
  return '/'+u.lstrip('/'),False
CSS='''<style>:root{--bg:#f7f7fb;--fg:#1d1d2b;--mut:#62657a;--card:#fff;--line:#e3e4ee;--acc:#5b3cc4}@media(prefers-color-scheme:dark){:root{--bg:#14141c;--fg:#ececf3;--mut:#a3a6ba;--card:#1d1d28;--line:#2e2f3d;--acc:#a58cff}}
*{box-sizing:border-box}body{margin:0;font:16px/1.55 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;background:var(--bg);color:var(--fg)}main{max-width:900px;margin:auto;padding:18px 16px 48px}
nav.bc{font-size:14px;color:var(--mut)}nav.bc a{color:var(--acc)}h1{font-size:clamp(24px,4vw,32px);line-height:1.2;margin:10px 0 8px}h2{font-size:20px;margin:26px 0 8px}
p.lead{color:var(--mut);max-width:70ch}a{color:var(--acc)}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:10px}
.card{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:12px 14px}.card h3{margin:0 0 4px;font-size:16px}.card p{margin:0 0 6px;color:var(--mut);font-size:14px}
ul.r{list-style:none;margin:4px 0 0;padding:0}ul.r li{padding:2px 0;font-size:15px}.k{display:inline-block;min-width:92px;font-size:12px;color:var(--mut)}.t{font-size:11px;padding:1px 6px;border-radius:6px;background:#ffb02033}
.cl{display:flex;flex-wrap:wrap;gap:6px;margin:10px 0}.cl a{padding:4px 12px;border-radius:99px;background:var(--card);border:1px solid var(--line);text-decoration:none;color:var(--fg);font-size:14px}.cl a.on{border-color:var(--acc);color:var(--acc);font-weight:700}
footer{margin-top:36px;font-size:14px;color:var(--mut)}</style>'''
def page(path,title,desc,h1,lead,body,crumbs):
  url=B+path
  bl={"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":i+1,"name":n,"item":B+u} for i,(n,u) in enumerate(crumbs)]}
  cp={"@context":"https://schema.org","@type":"CollectionPage","name":h1,"description":desc,"url":url,"inLanguage":"uk","isAccessibleForFree":True}
  bc=' › '.join(f'<a href="{u}">{E(n)}</a>' if j<len(crumbs)-1 else E(n) for j,(n,u) in enumerate(crumbs))
  cls=''.join(f'<a href="/{CL[k][0]}/"{" class=on" if path.startswith("/"+CL[k][0]+"/") else ""}>{CL[k][1]}</a>' for k in ORDER)
  h=f'''<!DOCTYPE html><html lang="uk"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{E(title)}</title><meta name="description" content="{E(desc)}"><link rel="canonical" href="{url}">
<meta property="og:type" content="website"><meta property="og:site_name" content="Інтерактивні уроки інформатики"><meta property="og:locale" content="uk_UA"><meta property="og:title" content="{E(title)}"><meta property="og:description" content="{E(desc)}"><meta property="og:url" content="{url}">
<script type="application/ld+json">{json.dumps(bl,ensure_ascii=False)}</script><script type="application/ld+json">{json.dumps(cp,ensure_ascii=False)}</script>
{CSS}</head><body><main><nav class="bc">{bc}</nav><h1>{E(h1)}</h1><p class="lead">{lead}</p><nav class="cl">{cls}</nav>{body}
<footer>Безкоштовні інтерактивні уроки інформатики для 2–11 класу за підручниками Біос. Відкриваються без реєстрації — посилання можна давати учням. <a href="/vse/">Усі матеріали одним списком</a> · <a href="/">Головна</a></footer></main></body></html>'''
  d=ROOT+path;os.makedirs(d,exist_ok=True);open(d+'index.html','w',encoding='utf8').write(h)
def items(t):
  out=[]
  for r in t.get('res',[]):
    if r.get('kind')=='Архів': continue
    u,ext=res_url(r['url'])
    m=re.match(r'/a/([A-Za-z0-9]+)/',u)
    if m and M.get(m.group(1),{}).get('noindex'): continue
    out.append(f'<li><span class="k">{E(r.get("kind",""))}</span><a href="{E(u)}"{" target=_blank rel=noopener" if ext else ""}>{E(clean(r.get("label") or r.get("kind")))}</a>{" <span class=t>вчителю</span>" if r.get("who")=="t" else ""}</li>')
  return out
pages=[]
for k in ORDER:
  slug,cname=CL[k];tk=[t for t in T if t['k']==k]
  if not tk: continue
  secs=S.get(str(k),[])
  crumbs=[('Головна','/'),(cname,f'/{slug}/')]
  cards='';nl=ng=npj=0
  for sid,sname in secs:
    st=[t for t in tk if str(t.get('r'))==str(sid)]
    if not st: continue
    lst=[]
    for t in st:
      it=items(t)
      if not it: continue
      lst.append(t)
      for r in t.get('res',[]):
        kk=r.get('kind','')
        if kk.startswith('Урок') or kk in('Квест','Тренажер'): nl+=1
        elif kk in('Гра','Пульт','Екран'): ng+=1
        elif kk in('Проєкт','Практична','Творчий'): npj+=1
    if not lst: continue
    ss=sslug(sid);spath=f'/{slug}/{ss}/'
    title_sec=(f'Розділ {sid}. {sname}' if isinstance(sid,int) else sname)
    cards+=f'<div class="card"><h3><a href="{spath}">{E(title_sec)}</a></h3><p>{len(lst)} тем{"и" if 2<=len(lst)%10<=4 and not 12<=len(lst)%100<=14 else ("а" if len(lst)%10==1 and len(lst)%100!=11 else "")}: '+E('; '.join(clean(t['title']) for t in lst[:4]))+('…' if len(lst)>4 else '')+'</p></div>'
    # section page
    body=''
    for t in lst:
      story=clean(t.get('story'))
      body+=f'<div class="card" style="margin:8px 0"><h3>{E((t.get("t")+" · ") if t.get("t") else "")}{E(clean(t["title"]))}</h3>'+(f'<p>{E(story)}</p>' if story else '')+'<ul class="r">'+''.join(items(t))+'</ul></div>'
    names='; '.join(clean(t['title']) for t in lst)
    sh1=f'Інформатика {cname} — {title_sec}' if 2<=k<=10 else f'{cname} — {title_sec}'
    sdesc=f'{title_sec}: інтерактивні уроки, вправи, ігри й практичні роботи з інформатики, {cname}. Теми: {names}'
    sdesc=sdesc if len(sdesc)<=158 else sdesc[:157].rsplit(' ',1)[0]+'…'
    slead=E(f'{len(lst)} тем розділу «{sname}» для {cname}у: інтерактивні сторінки для учнів з вправами й місіями, ігри на великий екран, практичні роботи та презентації для вчителя. Усе відкривається в браузері без реєстрації.') if 2<=k<=10 else E(f'{sname}: матеріали для уроку, що відкриваються в браузері без реєстрації.')
    stitle=(f'{title_sec} — інформатика {cname} | інтерактивні уроки' if 2<=k<=10 else f'{title_sec} — {cname} | інтерактивні уроки')
    page(spath,stitle,sdesc,sh1,slead,body,crumbs+[(title_sec,spath)])
    pages.append(spath)
  if 2<=k<=10:
    desc=f'Інтерактивні уроки інформатики для {cname}у за підручником Біос: вправи з автоперевіркою, квести, ігри на великий екран і практичні проєкти. Безкоштовно, без реєстрації.'
    lead=E(f'Усі матеріали з інформатики для {cname}у: {len(tk)} тем і ресурсів по розділах підручника. Учні відкривають сторінку в браузері — на телефоні чи комп\'ютері — і проходять вправи, місію та картки, а результат надсилають учителю. Для вчителя до тем додано презентації та ігри на великий екран.')
    title=f'Інформатика {cname} — інтерактивні уроки, вправи та ігри'
    h1=f'Інформатика {cname}: інтерактивні уроки'
  else:
    desc=f'{cname}: інтерактивні матеріали й ігри для уроку. Безкоштовно, без реєстрації.';lead=E(desc);title=f'{cname} — інтерактивні матеріали для уроку';h1=cname
  page(f'/{slug}/',title,desc,h1,lead,'<h2>Розділи</h2><div class="grid">'+cards+'</div>',crumbs)
  pages.append(f'/{slug}/')
json.dump(pages,open('/tmp/pages.json','w'))
print(len(pages));print(pages[:12])
