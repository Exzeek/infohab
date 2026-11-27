# python3 add_map_slide.py <map-id> "<label>" <url>  — додає слайди до картки карти року
import sys,re
mid,label,url=sys.argv[1:4]
p='/home/claude/infohab/index.html';s=open(p).read()
if url in s:print('already');sys.exit()
i=s.find('url:A("'+mid+'")');assert i>0
j=s.find(']}',i)
# вставити після останнього Слайди перед Папка, якщо є
blk=s[i:j];k=blk.rfind('{kind:"Слайди"')
if k>=0:
  e=i+blk.find('}',k)+1;s=s[:e]+',\n   {kind:"Слайди",label:"'+label+'",url:"'+url+'",who:"t"}'+s[e:]
else:
  s=s[:j]+',\n   {kind:"Слайди",label:"'+label+'",url:"'+url+'",who:"t"}'+s[j:]
open(p,'w').write(s);print('ok')
