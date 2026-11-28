import glob,os
os.chdir('/home/claude/infohab')
TAG='<script src="/site/nav.js" defer></script>'
files=['index.html','404.html','yak-korystuvatysia/index.html','pro-proekt/index.html','offline/index.html','kody/index.html','seredovyshcha/index.html','vse/index.html','progres/index.html','vchyteliu/index.html','konstruktor/index.html','urok/index.html','infobytva/index.html','start/index.html']
for pat in ['*-klas/**/index.html','matematyka/**/index.html','chytannia/**/index.html','instrumenty/**/index.html']:
  files+=glob.glob(pat,recursive=True)
n=0
for f in files:
  if not os.path.exists(f): continue
  s=open(f,encoding='utf8').read()
  if 'manifest.webmanifest' not in s and '</head>' in s: s=s.replace('</head>','<link rel="manifest" href="/manifest.webmanifest"><meta name="theme-color" content="#5b3cc4"><link rel="apple-touch-icon" href="/site/apple-touch-icon.png"></head>',1)
  if TAG in s: open(f,'w',encoding='utf8').write(s);continue
  s=s.replace('</body>',TAG+'</body>',1) if '</body>' in s else s+TAG
  open(f,'w',encoding='utf8').write(s);n+=1
h=open('index.html',encoding='utf8').read()
h=h.replace('.chips{position:sticky;top:0;','.chips{position:sticky;top:51px;')
open('index.html','w',encoding='utf8').write(h)
print('nav added',n,'of',len(files))
