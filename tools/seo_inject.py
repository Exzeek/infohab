import json,re,html,sys
M=json.load(open('/tmp/meta.json'))
E=lambda s:html.escape(s,quote=True)
n=0
for i,m in M.items():
  p=f'a/{i}/index.html';s=open(p,encoding='utf8').read()
  s=re.sub(r'\s*<!--seo-->.*?<!--/seo-->\n*','',s,flags=re.S)
  s=re.sub(r'<meta[^>]+name=["\']description["\'][^>]*>\s*','',s,flags=re.I)
  s=re.sub(r'<link[^>]+rel=["\']canonical["\'][^>]*>\s*','',s,flags=re.I)
  ld={"@context":"https://schema.org","@type":"LearningResource","name":m['name'],"description":m['desc'],"url":m['url'],"inLanguage":"uk","isAccessibleForFree":True,"educationalLevel":[x for x in m['lvl'] if x],"about":"Інформатика","learningResourceType":"інтерактивний урок","publisher":{"@type":"Organization","name":"Інтерактивні уроки інформатики","url":"https://urokinfo.com.ua/"}}
  block=('<!--seo-->\n<link rel="icon" href="/favicon.svg" type="image/svg+xml">\n<link rel=\"manifest\" href=\"/manifest.webmanifest\"><meta name=\"theme-color\" content=\"#5b3cc4\"><link rel=\"apple-touch-icon\" href=\"/site/apple-touch-icon.png\"><script src="/site/app.js" defer></script>\n<meta name="description" content="%s">\n<link rel="canonical" href="%s">\n%s<meta property="og:type" content="website">\n<meta property="og:site_name" content="Інтерактивні уроки інформатики">\n<meta property="og:locale" content="uk_UA">\n<meta property="og:title" content="%s">\n<meta property="og:description" content="%s">\n<meta property="og:url" content="%s">\n<script type="application/ld+json">%s</script>\n<script>(function(){var t=%s;addEventListener("load",function(){setTimeout(function(){document.title=t},300)});try{var u=location.pathname+location.search,h=JSON.parse(localStorage.getItem("ui-hist")||"[]").filter(function(x){return x.u!==u});h.unshift({u:u,t:t,ts:Date.now()});localStorage.setItem("ui-hist",JSON.stringify(h.slice(0,40)))}catch(e){}})();</script>\n<!--/seo-->\n'%(E(m['desc']),m['url'],'<meta name="robots" content="noindex,follow">\n' if m['noindex'] else '',E(m['title']),E(m['desc']),m['url'],json.dumps(ld,ensure_ascii=False).replace('</','<\\/'),json.dumps(m['title'],ensure_ascii=False)))
  if re.search(r'<title>.*?</title>',s,flags=re.S): s=re.sub(r'<title>.*?</title>','<title>'+E(m['title'])+'</title>\n'+block.replace('\\','\\\\'),s,count=1,flags=re.S)
  else: s=re.sub(r'(<head[^>]*>)',lambda mm:mm.group(1)+'\n<title>'+E(m['title'])+'</title>\n'+block,s,count=1,flags=re.I)
  _m=re.search(r'<html\b[^>]*>',s)
  if _m and 'lang=' not in _m.group(0): s=s[:_m.start()]+'<html lang="uk"'+s[_m.start()+5:]
  open(p,'w',encoding='utf8').write(s);n+=1
print(n)
