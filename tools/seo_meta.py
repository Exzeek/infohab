import json,re,os,html
B='https://urokinfo.com.ua/'
D=json.load(open('/tmp/topics.json'));T=D['T'];S=D['S']
arts=json.load(open('/home/claude/infohab/tools/data/site_arts.json'))
def cls(k):
  return {10:'10–11 клас'}.get(k, f'{k} клас' if 2<=k<=9 else None)
def secname(k,r):
  for s in S.get(str(k),[]):
    if str(s[0])==str(r): return s[1]
  return None
uses={}
for t in T:
  for r in t.get('res',[]):
    u=r.get('url','')
    m=re.match(r'a/([A-Za-z0-9]+)/',u)
    if m: uses.setdefault(m.group(1),[]).append((t,r))
def clean(s): return re.sub(r'<[^>]+>','',str(s or '')).strip()
def cut(s,n):
  s=re.sub(r'\s+',' ',s).strip()
  return s if len(s)<=n else s[:n-1].rsplit(' ',1)[0]+'…'
KIND={'Середовище':'інтерактивне середовище','Урок':'інтерактивний урок','Урок 1':'інтерактивний урок','Урок 2':'інтерактивний урок','Уроки':'інтерактивні уроки','Творчий':'творчий практикум','Картки':'картки-білети','Квест':'квест','Архів':'архів','Пульт':'гра на урок','Екран':'гра на урок','Тренування':'тренажер','Гра':'гра на урок','Проєкт':'практичний проєкт','Практична':'практична робота','Слайди':'презентація','Тренажер':'тренажер','Лабораторія':'лабораторія'}
out={}
for i in sorted(os.listdir('a')):
  if not os.path.isfile(f'a/{i}/index.html'): continue
  at=arts.get(i,{}).get('t') or i
  us=uses.get(i,[])
  studs=[x for x in us if x[1].get('who')!='t'] or us
  ks=sorted({x[0]['k'] for x in studs if cls(x[0]['k'])})
  if len(studs)==1 and cls(studs[0][0]['k']):
    t,r=studs[0];k=t['k'];c=cls(k);sn=secname(k,t.get('r'))
    kind=KIND.get(r.get('kind'),(r.get('kind') or 'урок').lower())
    name=clean(t['title'])
    cc='' if c in name else ' '+c
    title=f'{name} — інформатика{cc}, {kind}'
    if len(title)>65: title=cut(f'{name} — інформатика{cc}',70)
    desc=clean(t.get('story')).rstrip('.')+('.' if t.get('story') else '')
    arch=(r.get('kind')=='Архів')
    lead=f'{kind[0].upper()+kind[1:]} з інформатики, {c}'+(f', розділ «{sn}»' if sn else '')+'.'
    desc=cut(f'{lead} {desc} Безкоштовно, без реєстрації.',158)
    lvl=[c]
  else:
    c=(cls(ks[0]) if len(ks)==1 else (f'{ks[0]}–{ks[-1]} клас' if ks else None))
    name=clean(at)
    title=cut(f'{name} — інформатика'+(f' {c}' if c and c not in name else ''),70)
    tl=[clean(x[0]['title']) for x in studs][:4]
    desc=cut(f'{name}: інтерактивні матеріали з інформатики'+(f' для {c}у' if c else '')+'. '+('Теми: '+'; '.join(dict.fromkeys(x for x in tl if x not in name))+'. ' if [x for x in tl if x not in name] else '')+'Безкоштовно, без реєстрації.',158)
    lvl=[cls(k) for k in ks]
  arch=bool(studs) and all(x[1].get('kind')=='Архів' for x in studs)
  out[i]=dict(noindex=arch,title=title,desc=desc,name=name,lvl=lvl,url=f'{B}a/{i}/',_tl=[clean(x[1].get('label')) for x in studs if clean(x[1].get('label'))]+[clean(x[0]['title']) for x in studs])
import collections
cnt=collections.Counter(v['title'] for v in out.values())
for i,v in out.items():
  if cnt[v['title']]>1 and v['_tl']:
    lab=next((x for x in v['_tl'] if x and x!=v['name']),None)
    if lab:v['title']=cut(f"{lab} — {v['name']}",70)
cnt=collections.Counter(v['title'] for v in out.values())
for i,v in out.items():
  if cnt[v['title']]>1: v['title']=cut(v['title'][:60],60)+' · '+i[:4]
for v in out.values(): v.pop('_tl',None)
json.dump(out,open('/tmp/meta.json','w'),ensure_ascii=False,indent=0)
import random
for i in random.sample(sorted(out),8): print(out[i]['title'],'||',out[i]['desc'])
print(len(out), sum(1 for i in out if len(out[i]['title'])>65))
