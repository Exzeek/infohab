import re,glob,html
B='https://urokinfo.com.ua'
IMG=B+'/site/og.png'
for p in glob.glob('/home/claude/infohab/**/index.html',recursive=True)+['/home/claude/infohab/index.html']:
  rel=p[len('/home/claude/infohab'):].replace('index.html','')
  if re.match(r'^/\d{3,5}/$',rel):continue
  s=open(p,errors='ignore').read();o=s
  if 'noindex' in s[:6000] or '</head>' not in s:continue
  s=re.sub(r'<!--og-->.*?<!--/og-->','',s,flags=re.S)
  t=re.search(r'<title>(.*?)</title>',s,re.S);d=re.search(r'<meta name="description" content="([^"]*)"',s)
  add=''
  if 'og:title' not in s and t:
    add+=f'<meta property="og:title" content="{html.escape(html.unescape(t.group(1).strip()))}"><meta property="og:type" content="website"><meta property="og:locale" content="uk_UA"><meta property="og:url" content="{B}{rel}">'
    if d:add+=f'<meta property="og:description" content="{d.group(1)}">'
  if 'og:image' not in s:add+=f'<meta property="og:image" content="{IMG}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:card" content="summary_large_image">'
  if rel=='/' and 'WebSite' not in s:
    add+='<script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"WebSite","name":"urokinfo","url":"https://urokinfo.com.ua/","inLanguage":"uk","potentialAction":{"@type":"SearchAction","target":"https://urokinfo.com.ua/vse/?q={q}","query-input":"required name=q"}},{"@type":"EducationalOrganization","name":"urokinfo — інтерактивні уроки інформатики","url":"https://urokinfo.com.ua/","logo":"https://urokinfo.com.ua/site/icon-512.png"}]}</script>'
  if add:s=s.replace('</head>','<!--og-->'+add+'<!--/og--></head>',1)
  if s!=o:open(p,'w').write(s)
print('og done')
