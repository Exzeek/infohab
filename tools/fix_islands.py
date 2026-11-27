import re,glob
OLD=re.compile(r'const pts=\(innerWidth<700&&innerHeight>innerWidth\)\?Array\.from\(\{length:st\.length\+1\},\(_,i\)=>\[i%2\?70:30,30\+i\*\(57/st\.length\)\]\):')
NEW=("const SM=(innerWidth<=900||innerHeight<=600),T0=innerWidth<600?310:185,MH=Math.max(document.querySelector('main').clientHeight,T0+60+st.length*118);"
     "s.style.height=SM?MH+'px':'';const pts=SM?Array.from({length:st.length+1},(_,i)=>[i%2?72:28,(T0+i*118)/MH*100]):")
CSS='''<style id="mfix">
html,body{touch-action:manipulation}
.screen.on{overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch}
@media (max-width:900px),(max-height:600px){
 main{overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch}
 #map.screen.on{bottom:auto;overflow:visible}
 #mapRobot{display:none!important}
 .chip{touch-action:none}
 .gframe{touch-action:pan-y}
 .scene .it{font-size:min(4rem,10vw)!important}
}
</style>'''
n=0;bad=[]
for f in glob.glob('/home/claude/infohab/a/*/t[0-9]*.html'):
  s=open(f,encoding='utf8').read()
  if 'function openMap()' not in s: continue
  if 'id="mfix"' in s: continue
  s2,k=OLD.subn(NEW,s,count=1)
  if not k: bad.append(f);continue
  s2=s2.replace('</head>',CSS+'</head>',1)
  open(f,'w',encoding='utf8').write(s2);n+=1
print('patched',n,'bad',bad)
