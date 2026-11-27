
const fs=require('fs');const out={};
for(const d of process.argv.slice(2)){const h=fs.readFileSync(d+'/index.html','utf8');const i=h.indexOf('const PIC={');if(i<0)continue;
 let j=h.indexOf('{',i),dep=0,k=j,inS=null,esc=false;
 for(;k<h.length;k++){const c=h[k];if(inS){if(esc)esc=false;else if(c==='\\')esc=true;else if(c===inS)inS=null;continue}
  if(c==='"'||c==="'"||c==='`'){inS=c;continue}if(c==='{')dep++;else if(c==='}'){dep--;if(!dep)break}}
 const SH=[];let T='';{const m=h.match(/const T="[^"]*";/);if(m)T=eval(m[0].slice(8,-1))}try{Object.assign(out,eval('('+h.slice(j,k+1)+')'))}catch(e){console.error(d,e.message)}}
process.stdout.write(JSON.stringify(out));