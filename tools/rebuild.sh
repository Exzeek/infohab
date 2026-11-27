set -e
python3 /home/claude/infohab/tools/build_ib.py >/dev/null; python3 /home/claude/infohab/tools/build_ib_game.py >/dev/null
cd /home/claude/infohab
node -e '
const fs=require("fs");const h=fs.readFileSync("index.html","utf8");
const sc=[...h.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]).join("\n");
const stub=new Proxy(function(){},{get:(t,k)=>k==Symbol.toPrimitive?()=>"":stub,apply:()=>stub,construct:()=>stub,set:()=>true});
global.document=stub;global.window=global;global.localStorage={getItem:()=>null,setItem(){}};global.location={hash:"",search:"",href:"https://urokinfo.com.ua/",origin:"https://urokinfo.com.ua",pathname:"/"};global.addEventListener=()=>{};global.matchMedia=()=>({matches:false,addEventListener(){}});global.navigator={};global.setTimeout=()=>0;global.setInterval=()=>0;global.history={replaceState(){}};
try{eval(sc+";global.__T=TOPICS;global.__S=SECT;")}catch(e){console.error("ERR",e.message)}
fs.writeFileSync("/tmp/topics.json",JSON.stringify({T:global.__T,S:global.__S}));
const out=[];for(const t of global.__T){for(const r of t.res||[]){out.push({k:t.k,r:t.r,t:t.t,title:t.title,kind:r.kind,label:r.label,url:r.url,who:r.who})}}
fs.writeFileSync("/tmp/res.json",JSON.stringify({res:out,sect:global.__S}));'
python3 /home/claude/infohab/tools/seo_meta.py >/dev/null
python3 /home/claude/infohab/tools/seo_inject.py >/dev/null
cp /home/claude/infohab/tools/data/codes.json /tmp/codes_prev.json
python3 /home/claude/infohab/tools/codes.py >/dev/null
python3 /home/claude/infohab/tools/build_pages.py >/dev/null
node /home/claude/infohab/tools/build_lib.js >/dev/null
python3 /home/claude/infohab/tools/post_pages.py
python3 /home/claude/infohab/tools/codes_apply.py
python3 /home/claude/infohab/tools/nav_apply.py
python3 /home/claude/infohab/tools/env_index.py
python3 /home/claude/infohab/tools/og_apply.py
