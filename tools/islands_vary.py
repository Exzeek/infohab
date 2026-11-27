# Урізноманітнює наявні острови: частину sort -> catch, tf -> balloons, choose -> doors
import re,json,glob
MAPS={'N8nWk6s9qJxtMWec8NqHsV':2,'Uwp87XtSAtqkAf14gCRYmR':3,'6Y1an4szqVVtwZXv39sRtr':4}
log=[]
for m,cls in MAPS.items():
  for p in sorted(glob.glob(f'/home/claude/infohab/a/{m}/t[0-9]*.html')):
    n=int(re.search(r't(\d+)\.html',p).group(1));s=open(p,encoding='utf8').read()
    mm=re.search(r'^window\.G = (.*);\s*$',s,re.M);G=json.loads(mm.group(1));ch=[]
    types=[x['type'] for x in G['stages']]
    if any(t in('catch','balloons','doors') for t in types):continue
    def okSort(x):return x['type']=='sort' and not x.get('root') and not x.get('venn') and 2<=len(x.get('baskets',[]))<=3
    if cls==2:
      if n%2==1:
        for x in G['stages']:
          if x['type']=='tf':x['type']='balloons';ch.append('tf→balloons');break
      if n%2==0 or types.count('sort')>1:
        for x in G['stages']:
          if okSort(x):x['type']='catch';ch.append('sort→catch');break
    else:
      if n%2==0:
        for x in G['stages']:
          if x['type']=='choose':x['type']='doors';ch.append('choose→doors');break
      if n%2==1 or types.count('sort')>1:
        for x in G['stages']:
          if okSort(x):x['type']='catch';ch.append('sort→catch');break
      if n%3==0:
        for x in G['stages']:
          if x['type']=='tf':x['type']='balloons';ch.append('tf→balloons');break
    if ch:
      s=s[:mm.start()]+'window.G = '+json.dumps(G,ensure_ascii=False)+';'+s[mm.end():]
      open(p,'w',encoding='utf8').write(s);log.append(f'{cls}кл t{n}: '+', '.join(ch))
print(len(log));print('\n'.join(log))
