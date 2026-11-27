import re,glob
OK={'Unbounded','Nunito','JetBrains+Mono'}
n=0
for p in glob.glob('/home/claude/infohab/**/*.html',recursive=True):
  if '/tools/' in p:continue
  s=open(p,errors='ignore').read();o=s
  def rep(m):
    fams=set(re.findall(r'family=([^:&]+)',m.group(1)))
    return '<link rel="stylesheet" href="/site/fonts.css">' if fams and fams<=OK else m.group(0)
  s=re.sub(r'<link[^>]*href="(https://fonts\.googleapis\.com/css2\?[^"]+)"[^>]*>',rep,s)
  if 'fonts.googleapis.com/css2' not in s:
    s=re.sub(r'<link rel="preconnect" href="https://fonts\.(googleapis|gstatic)\.com"( crossorigin)?>','',s)
  if s!=o:open(p,'w').write(s);n+=1
print('fonts',n)
