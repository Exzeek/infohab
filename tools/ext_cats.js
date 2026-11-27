const fs=require('fs');const out=[];
for(const d of process.argv.slice(2)){const h=fs.readFileSync(d+'/index.html','utf8');
 const i=h.indexOf('const CATS=[');if(i<0){console.log(d,'no CATS');continue}
 // find end: matching bracket
 let j=h.indexOf('[',i),dep=0,k=j,inS=null,esc=false;
 for(;k<h.length;k++){const c=h[k];if(inS){if(esc)esc=false;else if(c==='\\')esc=true;else if(c===inS)inS=null;continue}
  if(c==='"'||c==="'"||c==='`'){inS=c;continue}if(c==='[')dep++;else if(c===']'){dep--;if(!dep)break}}
 const src=h.slice(j,k+1);let C;try{C=eval('('+src+')')}catch(e){console.log(d,'eval fail',e.message);continue}
 const t=(h.match(/<h1>([^<]*)/)||[])[1];const fin=h.indexOf('const FINALS');
 console.log(d,t,C.length,C.map(c=>c.n+'['+(c.cl||'')+']:'+c.qs.length+'x'+c.qs.map(s=>s.length).join('')).join(' | '),'VALS',(h.match(/const VALS=\[[^\]]*\]/)||[''])[0],'FIN',fin>0);
 out.push({src:d,title:t,cats:C});}
fs.writeFileSync('/home/claude/infohab/tools/data/cats.json',JSON.stringify(out));
