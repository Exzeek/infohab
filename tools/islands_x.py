# Вставляє нові механіки (tools/xstages.js) у рушій островів 2–4 класу
import re,glob
X=open('/home/claude/infohab/tools/xstages.js',encoding='utf8').read()
MAPS=['N8nWk6s9qJxtMWec8NqHsV','Uwp87XtSAtqkAf14gCRYmR','6Y1an4szqVVtwZXv39sRtr']
n=0
for m in MAPS:
  for p in glob.glob(f'/home/claude/infohab/a/{m}/t*.html'):
    s=open(p,encoding='utf8').read();o=s
    s=re.sub(r'\n?/\*XST\*/.*?/\*/XST\*/\n?','\n',s,flags=re.S)
    mm=re.search(r'const STAGE_FN=\{[^}]*\};',s)
    if not mm:print('NO STAGE_FN',p);continue
    s=s[:mm.end()]+'\n/*XST*/\n'+X.replace('\\','\\\\').replace('\\\\','\\')+'\n/*/XST*/\n'+s[mm.end():]
    if s!=o:open(p,'w',encoding='utf8').write(s);n+=1
print('islands_x',n)
