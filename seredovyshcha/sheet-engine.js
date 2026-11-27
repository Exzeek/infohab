/* Рушій електронної таблиці: формули (укр/англ назви функцій), посилання з $, діапазони. */
(function(){
const COLS=10,ROWS=25;
const colName=i=>String.fromCharCode(65+i);
const colIdx=c=>c.toUpperCase().charCodeAt(0)-65;
function parseRef(s){const m=/^(\$?)([A-Za-z])(\$?)(\d+)$/.exec(s);if(!m)return null;return{ca:!!m[1],c:colIdx(m[2]),ra:!!m[3],r:+m[4]-1}}
const refStr=(c,r)=>colName(c)+(r+1);
const ERR=e=>({err:e});
const isErr=v=>v&&typeof v==="object"&&"err" in v;
const FN={};
function alias(names,f){names.split(",").forEach(n=>FN[n]=f)}
const flat=a=>a.flat(Infinity);
const nums=a=>flat(a).filter(v=>typeof v==="number");
function crit(c){
  if(typeof c==="number")return v=>v===c;
  const m=/^(<=|>=|<>|<|>|=)?(.*)$/.exec(String(c));const op=m[1]||"=",raw=m[2];const n=raw!==""&&!isNaN(+raw.replace(",","."))?+raw.replace(",","."):null;
  return v=>{const x=(n!=null&&typeof v==="number")?v:(typeof v==="string"?v.toLowerCase():v),y=(n!=null&&typeof v==="number")?n:raw.toLowerCase();
    switch(op){case"=":return x===y||(n!=null&&+v===n);case"<>":return x!==y;case"<":return x<y;case">":return x>y;case"<=":return x<=y;case">=":return x>=y}};
}
alias("SUM,СУМ,СУММ",(...a)=>nums(a).reduce((s,x)=>s+x,0));
alias("AVERAGE,СЕРЕДНЄ,СРЗНАЧ",(...a)=>{const n=nums(a);return n.length?n.reduce((s,x)=>s+x,0)/n.length:ERR("#ДІЛ/0!")});
alias("MAX,МАКС",(...a)=>{const n=nums(a);return n.length?Math.max(...n):0});
alias("MIN,МІН,МИН",(...a)=>{const n=nums(a);return n.length?Math.min(...n):0});
alias("COUNT,РАХУНОК,СЧЁТ,СЧЕТ",(...a)=>nums(a).length);
alias("COUNTA,РАХУНОКЗНАЧ,СЧЁТЗ",(...a)=>flat(a).filter(v=>v!==""&&v!=null).length);
alias("COUNTIF,РАХУНОКЯКЩО,СЧЁТЕСЛИ",(r,c)=>{const f=crit(c);return flat([r]).filter(f).length});
alias("SUMIF,СУМЯКЩО,СУММЕСЛИ",(r,c,s)=>{const f=crit(c),a=flat([r]),b=s?flat([s]):a;let t=0;a.forEach((v,i)=>{if(f(v)&&typeof b[i]==="number")t+=b[i]});return t});
alias("AVERAGEIF,СЕРЕДНЄЯКЩО",(r,c,s)=>{const f=crit(c),a=flat([r]),b=s?flat([s]):a;let t=0,n=0;a.forEach((v,i)=>{if(f(v)&&typeof b[i]==="number"){t+=b[i];n++}});return n?t/n:ERR("#ДІЛ/0!")});
alias("IF,ЯКЩО,ЕСЛИ",(c,a,b)=>c?(a===undefined?true:a):(b===undefined?false:b));
alias("AND,І,И",(...a)=>flat(a).every(Boolean));
alias("OR,АБО,ИЛИ",(...a)=>flat(a).some(Boolean));
alias("NOT,НЕ",a=>!a);
alias("ROUND,ОКРУГЛ",(x,d)=>{const p=Math.pow(10,d||0);return Math.round(x*p)/p});
alias("ABS",x=>Math.abs(x));
alias("CONCATENATE,ЗЧЕПИТИ,СЦЕПИТЬ,CONCAT",(...a)=>flat(a).map(v=>v==null?"":String(v)).join(""));
alias("POWER,СТЕПІНЬ",(a,b)=>Math.pow(a,b));
alias("SQRT,КОРІНЬ",a=>a<0?ERR("#ЧИСЛО!"):Math.sqrt(a));

function tokenize(s){
  const t=[];let i=0;
  while(i<s.length){const ch=s[i];
    if(/\s/.test(ch)){i++;continue}
    if(ch==='"'){let j=i+1,v="";while(j<s.length&&s[j]!=='"'){v+=s[j++]}t.push({k:"str",v});i=j+1;continue}
    let m=/^\$?[A-Za-z]\$?\d+(:\$?[A-Za-z]\$?\d+)?/.exec(s.slice(i));
    if(m&&!/^[A-Za-zА-Яа-яІіЇїЄєҐґЁё_(]/.test(s.slice(i+m[0].length))){t.push({k:"ref",v:m[0]});i+=m[0].length;continue}
    m=/^\d+(\.\d+)?/.exec(s.slice(i));if(m){t.push({k:"num",v:+m[0]});i+=m[0].length;continue}
    m=/^[A-Za-zА-Яа-яІіЇїЄєҐґЁё_][A-Za-zА-Яа-яІіЇїЄєҐґЁё_0-9.]*/.exec(s.slice(i));if(m){t.push({k:"id",v:m[0].toUpperCase()});i+=m[0].length;continue}
    m=/^(<=|>=|<>|[-+*/^&=<>(),;:%])/.exec(s.slice(i));if(m){t.push({k:"op",v:m[0]});i+=m[0].length;continue}
    throw new Error("Незрозумілий символ «"+ch+"»");
  }return t;
}
function parse(src){
  const t=tokenize(src);let p=0;const peek=()=>t[p],nx=()=>t[p++];
  const isOp=v=>peek()&&peek().k==="op"&&peek().v===v;
  function cmp(){let a=cat();while(peek()&&peek().k==="op"&&["=","<>","<",">","<=",">="].includes(peek().v)){const o=nx().v;a={op:o,a,b:cat()}}return a}
  function cat(){let a=add();while(isOp("&")){nx();a={op:"&",a,b:add()}}return a}
  function add(){let a=mul();while(isOp("+")||isOp("-")){const o=nx().v;a={op:o,a,b:mul()}}return a}
  function mul(){let a=pw();while(isOp("*")||isOp("/")){const o=nx().v;a={op:o,a,b:pw()}}return a}
  function pw(){let a=un();while(isOp("^")){nx();a={op:"^",a,b:un()}}return a}
  function un(){if(isOp("-")){nx();return{op:"neg",a:un()}}if(isOp("+")){nx();return un()}let a=prim();if(isOp("%")){nx();a={op:"/",a,b:{k:"num",v:100}}}return a}
  function prim(){const x=nx();if(!x)throw new Error("Формула обірвалася");
    if(x.k==="num"||x.k==="str")return x;
    if(x.k==="ref")return x;
    if(x.k==="id"){
      if(["TRUE","ІСТИНА","ИСТИНА"].includes(x.v))return{k:"num",v:true};
      if(["FALSE","ХИБНІСТЬ","ЛОЖЬ"].includes(x.v))return{k:"num",v:false};
      if(!isOp("("))throw new Error("Невідоме ім'я «"+x.v+"»");
      nx();const args=[];if(!isOp(")")){args.push(cmp());while(isOp(";")||isOp(",")){nx();args.push(cmp())}}
      if(!isOp(")"))throw new Error("Бракує дужки «)»");nx();
      if(!FN[x.v])throw new Error("Невідома функція «"+x.v+"»");
      return{k:"fn",n:x.v,args};
    }
    if(x.k==="op"&&x.v==="("){const e=cmp();if(!isOp(")"))throw new Error("Бракує дужки «)»");nx();return e}
    throw new Error("Неочікуване «"+x.v+"»");
  }
  const e=cmp();if(p<t.length)throw new Error("Зайве «"+t[p].v+"»");return e;
}
function Sheet(){this.raw={};this.bold={};this.cache={};}
Sheet.prototype.get=function(ref){return this.raw[ref]||""};
Sheet.prototype.set=function(ref,v){if(v===""||v==null)delete this.raw[ref];else this.raw[ref]=String(v);this.cache={}};
Sheet.prototype.value=function(ref,stack){
  if(ref in this.cache)return this.cache[ref];
  stack=stack||{};if(stack[ref])return ERR("#ЦИКЛ");
  const r=this.get(ref);let v;
  if(r==="")v="";
  else if(r[0]==="="){stack[ref]=1;try{v=this.evalNode(parse(r.slice(1)),stack)}catch(e){v=isErr(e)?e:ERR("#ПОМИЛКА")}delete stack[ref]}
  else{const n=r.trim().replace(/\s/g,"").replace(",",".");v=(n!==""&&!isNaN(+n)&&/^-?\d*\.?\d+%?$|^-?\d+\.?\d*$/.test(n))?+n:(/^-?\d+([.,]\d+)?%$/.test(r.trim())?parseFloat(r.replace(",","."))/100:r)}
  this.cache[ref]=v;return v;
};
Sheet.prototype.range=function(s,stack){const[a,b]=s.split(":").map(parseRef);const out=[];
  for(let r=Math.min(a.r,b.r);r<=Math.max(a.r,b.r);r++){const row=[];for(let c=Math.min(a.c,b.c);c<=Math.max(a.c,b.c);c++){row.push(this.value(refStr(c,r),stack))}out.push(row)}return out};
Sheet.prototype.evalNode=function(n,st){
  const ev=x=>this.evalNode(x,st);
  if(n.k==="num"||n.k==="str")return n.v;
  if(n.k==="ref"){if(n.v.includes(":"))return this.range(n.v.replace(/\$/g,""),st);const v=this.value(n.v.replace(/\$/g,"").toUpperCase(),st);if(isErr(v))throw v;return v===""?0:v}
  if(n.k==="fn"){const a=n.args.map(ev);const r=FN[n.n](...a);if(isErr(r))throw r;return r}
  const num=v=>{if(typeof v==="boolean")return v?1:0;if(v===""||v==null)return 0;if(typeof v==="number")return v;const x=+String(v).replace(",",".");if(isNaN(x))throw ERR("#ЗНАЧ!");return x};
  switch(n.op){
    case"neg":return-num(ev(n.a));
    case"+":return num(ev(n.a))+num(ev(n.b));case"-":return num(ev(n.a))-num(ev(n.b));
    case"*":return num(ev(n.a))*num(ev(n.b));
    case"/":{const d=num(ev(n.b));if(d===0)throw ERR("#ДІЛ/0!");return num(ev(n.a))/d}
    case"^":return Math.pow(num(ev(n.a)),num(ev(n.b)));
    case"&":return String(ev(n.a))+String(ev(n.b));
    default:{const a=ev(n.a),b=ev(n.b);const A=typeof a==="string"?a.toLowerCase():a,B=typeof b==="string"?b.toLowerCase():b;
      switch(n.op){case"=":return A===B;case"<>":return A!==B;case"<":return A<B;case">":return A>B;case"<=":return A<=B;case">=":return A>=B}}
  }
};
Sheet.prototype.evalSafe=function(ref){const v=this.value(ref);if(isErr(v))return v;try{if(this.get(ref)[0]==="=")parse(this.get(ref).slice(1))}catch(e){return ERR("#ПОМИЛКА")}return v};
function shift(formula,dc,dr){
  return formula.replace(/("[^"]*")|(\$?)([A-Za-z])(\$?)(\d+)(?![A-Za-zА-Яа-яІіЇїЄє(])/g,(m,str,ca,c,ra,r)=>{
    if(str)return str;let ci=colIdx(c),ri=+r-1;if(!ca)ci+=dc;if(!ra)ri+=dr;
    if(ci<0||ri<0||ci>=COLS||ri>=ROWS)return"#ПОСИЛ!";return ca+colName(ci)+ra+(ri+1)});
}
function errText(e){return e.err}
window.SHEET={Sheet,parse,shift,parseRef,refStr,colName,colIdx,COLS,ROWS,isErr,FN,errText};
})();
