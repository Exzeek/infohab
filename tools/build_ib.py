# Банк для конструктора Інфо-битви: теми Ігротеки + готові категорії Інфо-битв
import json,re,glob,subprocess,hashlib,os
A='/home/claude/infohab/a/'
cats=[]
ICONS=['💡','🧩','🛠️','🌐','🔒','📊','🎨','🤖','📱','🗂️']
def hid(s): return hashlib.md5(s.encode()).hexdigest()[:6]
for f in sorted(glob.glob(A+'PQn3pcmqXVtVegiS7e1DX6/s*.html')):
  s=open(f,encoding='utf8').read()
  G=json.loads(re.search(r'const G=(\{.*?\});\n',s).group(1));B=json.loads(re.search(r'const BANK=(\[.*?\]);\n',s,re.S).group(1))
  k=G['grade'];r=G['section'];secn=G['title'].split('·',1)[-1].strip()
  for ti,tn in enumerate(G['topics'],1):
    qs=[{'l':x['l'],'q':x['q'].replace('\n',' ').strip(),'o':x['o']} for x in B if x['t']==ti and len(x.get('o',[]))>=2]
    if len(qs)<5: continue
    cats.append({'id':'g'+hid(f'{k}-{r}-{tn}'),'k':k,'r':r,'sec':f'Р{r}. {secn}','n':tn,'ic':ICONS[(ti-1)%len(ICONS)],'src':'igro','qs':qs})
subprocess.run(['node','/home/claude/infohab/tools/ext_cats.js','6tMGXg91YgrC9cQD7Mxr2Z','FsnASq19HJiGWixJaoLTkd','Q3wj23Xa8MaLBTNgj2eb9V','QpQ8oRcCfzF9yRqG3iGbZS'],cwd=A,capture_output=True)
IBK={'6tMGXg91YgrC9cQD7Mxr2Z':(8,'Інфо-битва: загальна (8 клас)'),'FsnASq19HJiGWixJaoLTkd':(8,'Інфо-битва 2.0 (8 клас)'),'Q3wj23Xa8MaLBTNgj2eb9V':(8,'Інфо-битва 3.0'),'QpQ8oRcCfzF9yRqG3iGbZS':(6,'Інфо-битва 6 класу')}
for src in json.load(open('/home/claude/infohab/tools/data/cats.json')):
  k0,secn=IBK[src['src']]
  for c in src['cats']:
    k=int(re.match(r'\d+',c.get('cl') or str(k0)).group(0))
    slots=[s if isinstance(s,list) else [s] for s in c['qs']]
    if len(slots)!=5: continue
    cats.append({'id':'b'+hid(src['src']+c['n']),'k':k,'r':0,'sec':'Готові категорії · '+secn,'n':c['n'],'ic':c.get('ic','⭐'),'src':'ib','slots':slots})
json.dump({'cats':cats},open('/home/claude/infohab/site/ib-bank.json','w'),ensure_ascii=False,separators=(',',':'))
from collections import Counter
print(len(cats),Counter(c['k'] for c in cats),os.path.getsize('/home/claude/infohab/site/ib-bank.json'))
# картинки до питань (PIC) з усіх Інфо-битв
js=r'''
const fs=require('fs');const out={};
for(const d of process.argv.slice(2)){const h=fs.readFileSync(d+'/index.html','utf8');const i=h.indexOf('const PIC={');if(i<0)continue;
 let j=h.indexOf('{',i),dep=0,k=j,inS=null,esc=false;
 for(;k<h.length;k++){const c=h[k];if(inS){if(esc)esc=false;else if(c==='\\')esc=true;else if(c===inS)inS=null;continue}
  if(c==='"'||c==="'"||c==='`'){inS=c;continue}if(c==='{')dep++;else if(c==='}'){dep--;if(!dep)break}}
 const SH=[];let T='';{const m=h.match(/const T="[^"]*";/);if(m)T=eval(m[0].slice(8,-1))}try{Object.assign(out,eval('('+h.slice(j,k+1)+')'))}catch(e){console.error(d,e.message)}}
process.stdout.write(JSON.stringify(out));'''
open('/home/claude/infohab/tools/ext_pic.js','w').write(js)
pics={}
bank=json.load(open('/home/claude/infohab/site/ib-bank.json'))
for d in IBK:
  r=subprocess.run(['node','/home/claude/infohab/tools/ext_pic.js',d],cwd=A,capture_output=True,text=True)
  for k,v in json.loads(r.stdout or '{}').items(): pics[d[:4]+'_'+k]=v
srcmap={}
for src in json.load(open('/home/claude/infohab/tools/data/cats.json')):
  for c in src['cats']: srcmap['b'+hid(src['src']+c['n'])]=src['src'][:4]
for c in bank['cats']:
  if c['src']=='ib':
    for sl in c['slots']:
      for q in sl:
        if q.get('pic'): q['pic']=srcmap[c['id']]+'_'+q['pic']
bank['pics']=pics;print('pics',sorted(pics))
json.dump(bank,open('/home/claude/infohab/site/ib-bank.json','w'),ensure_ascii=False,separators=(',',':'))
