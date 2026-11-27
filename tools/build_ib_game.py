import re
s=open('/home/claude/infohab/a/Q3wj23Xa8MaLBTNgj2eb9V/index.html',encoding='utf8').read()
body=s[s.index('<!--/seo-->')+len('<!--/seo-->'):]
body=body.replace('</head><body>','',1)
# прибрати старий <title> всередині, назва — динамічна
body=re.sub(r'<title>[^<]*</title>','',body,count=1)
i=body.index('const CATS=[');j=body.index('const FINALS=[');k=body.index('const FQ=')
body=body[:i]+'const CATS=window.IB_CATS;\nconst FINALS=window.IB_FIN;\n'+body[k:]
body=body.replace('const QTIME=30, KEY="quiz8bv3";','const QTIME=30, KEY=window.IB_KEY;')
assert 'KEY=window.IB_KEY' in body
body=body.replace('const PIC={','const PIC=window.IB_PIC||{',1)
body=body.replace('<div class="brand">Інфо-битва 3.0 · 8 клас<small>Теми 7 класу + пройдене у 8-му · правда/фейк, порядок, перехоплення</small></div>',
  '<div class="brand"><span id="ibT">Інфо-битва</span><small id="ibS"></small></div>')
body=body.replace('🏆 Переможці Інфо-битви 3.0','🏆 Переможці Інфо-битви')
a=body.index('<script>\nconst SH=');body=body[:a]+'<script>\nfunction IB_RUN(){\nconst SH='+body[a+len('<script>\nconst SH='):]
z=body.rindex('render();\n</script>');body=body[:z]+'render();\n}\n</script>\n<script src="/infobytva/gra/loader.js"></script>'+body[z+len('render();\n</script>'):]
head='''<!DOCTYPE html><html lang="uk"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Інфо-битва — гра з обраних тем | urokinfo</title><meta name="robots" content="noindex,follow">
<link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="manifest" href="/manifest.webmanifest"><meta name="theme-color" content="#0A1C2B">
<script>if("serviceWorker" in navigator&&(location.protocol==="https:"||location.hostname==="localhost"))navigator.serviceWorker.register("/sw.js").catch(function(){})</script>
</head><body>'''
body=body.replace('done).length} з 30<','done).length} з ${CATS.length*5}<').replace('done).length===30&&','done).length===CATS.length*5&&')
body=body.replace('${30-Object.keys(G.done).length}','${CATS.length*5-Object.keys(G.done).length}')
assert body.count('CATS.length*5')==3
open('/home/claude/infohab/infobytva/gra/index.html','w',encoding='utf8').write(head+body)
print('ok',len(head+body))
