import json,re
D=json.load(open('/tmp/topics.json'));T=D['T']
M=json.load(open('/tmp/meta.json'))
SIZES={5:[5,6,5,8,5],6:[5,5,5,8,5],7:[5,4,5,8,5],8:[7,8,5,6,6,4],9:[4,6,5,7,9]}
KD={2:'2',3:'3',4:'4',5:'5',6:'6',7:'7',8:'8',9:'9',10:'0',12:'1',1:'1',0:'1'}
clean=lambda s:re.sub(r'<[^>]+>','',str(s or '')).strip()
def local(u):
  m=re.match(r'a/([A-Za-z0-9]+)/(.*)$',u or '')
  if m: return (m.group(1),m.group(2))
  m=re.match(r'seredovyshcha/([a-z\-]+)/(.*)$',u or '')
  return ('sr-'+m.group(1),m.group(2)) if m else (None,None)
codes={};byurl={};seq={};lessons={}
def add(code,t,r,url):
  assert code not in codes,(code,t['title'])
  codes[code]=dict(url='/'+url,title=clean(t['title']),label=clean(r.get('label') or r.get('kind')),kind=r.get('kind'),k=t['k'],r=t.get('r'),t=t.get('t'))
  byurl.setdefault(url,code)
# pass1 lessons
order10=0;seq3={3:0,4:0}
import functools
def lnum(r):
  m=re.search(r'(\d+)',r.get('kind',''));return int(m.group(1)) if m else 1
T10=sorted([t for t in T if t['k']==10 and isinstance(t.get('r'),int)],key=lambda t:t['r'])
for t in T10:
  for r in sorted([x for x in t.get('res',[]) if x.get('who')!='t' and x.get('kind','').startswith('Урок') and local(x.get('url'))[0]],key=lnum):
    order10+=1;add('0%02d'%order10,t,r,r['url']);r['_c']=1
for t in T:
  k=t['k'];studs=[r for r in t.get('res',[]) if not (r.get('url') or '').startswith('seredovyshcha/') and r.get('who')!='t' and r.get('kind')!='Архів' and local(r.get('url'))[0] and not M.get(local(r['url'])[0],{}).get('noindex')]
  if not studs: continue
  num=None
  tt=str(t.get('t') or '')
  m=re.match(r'^Т(\d+)$',tt)
  if k in SIZES and isinstance(t.get('r'),int) and m:
    num=sum(SIZES[k][:t['r']-1])+int(m.group(1))
  elif k==10 and isinstance(t.get('r'),int):
    pass
  elif k in (3,4) and t.get('r')=='a':
    seq3[k]+=1;num=seq3[k]
  if k==10 and isinstance(t.get('r'),int): continue
  if num:
    r=next((x for x in studs if x.get('kind','').startswith('Урок') or x.get('kind') in('Квест','Тренажер')),studs[0])
    code=KD[k]+'%02d'%num
    if code in codes: continue
    add(code,t,r,r['url']);r['_c']=1
# pass2 others (4-digit)
for t in T:
  k=t['k']
  for r in t.get('res',[]):
    if r.get('_c') or r.get('who')=='t' or r.get('kind')=='Архів': continue
    if (r.get('url') or '').startswith('seredovyshcha/'): continue
    i,_=local(r.get('url'))
    if not i or M.get(i,{}).get('noindex'): continue
    if r['url'] in byurl: continue
    p=KD[k];seq[p]=seq.get(p,100)+1
    add(p+'%03d'%seq[p],t,r,r['url'])
# pass3 environments (appended so older codes stay stable)
for t in T:
  for r in t.get('res',[]):
    u=r.get('url') or ''
    if not u.startswith('seredovyshcha/') or u in byurl: continue
    p=KD[t['k']];seq[p]=seq.get(p,100)+1
    add(p+'%03d'%seq[p],t,r,u)
# закріплення: уже видані коди не змінюються; нові адреси отримують наступні вільні номери
P=json.load(open('/home/claude/infohab/tools/data/codes_pinned.json'))
urlP={v['url']:k for k,v in P.items()}
final={k:dict(v) for k,v in P.items()}
cand=[]
for k,v in codes.items():
  if v['url'] in urlP: final[urlP[v['url']]]=v
  else: cand.append((k,v))
for k,v in cand:
  if k not in final: final[k]=v;continue
  p=KD[v['k']];nums=[int(x[len(p):]) for x in final if len(x)==4 and x.startswith(p)]
  final[p+'%03d'%(max(nums+[100])+1)]=v
codes=final
json.dump(codes,open('/home/claude/infohab/tools/data/codes_pinned.json','w'),ensure_ascii=False,indent=0)
json.dump(codes,open('/home/claude/infohab/tools/data/codes.json','w'),ensure_ascii=False,indent=0)
import collections
print(len(codes),collections.Counter(len(c) for c in codes))
for c in ['827','831','501','529','620','720','935','001','020','301','401']:
  print(c,codes.get(c,{}).get('title'),codes.get(c,{}).get('label'))
