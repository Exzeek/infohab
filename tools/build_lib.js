// Бібліотека інтерактивів → /vse/index.html (статичні картки + фільтри; стан фільтрів у адресі ?k=8&t=env&w=s&q=)
const fs=require('fs');
const d=require('/tmp/res.json'),C=require('/home/claude/infohab/tools/data/codes.json');
const esc=s=>String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const strip=s=>String(s??'').replace(/<[^>]+>/g,'');
const U={};Object.entries(C).sort((a,b)=>a[0].length-b[0].length||a[0].localeCompare(b[0])).forEach(([c,v])=>{if(!(v.url in U))U[v.url]=c});
const CN={2:'2 клас',3:'3 клас',4:'4 клас',5:'5 клас',6:'6 клас',7:'7 клас',8:'8 клас',9:'9 клас',10:'10–11 клас',12:'Математика',1:'Читання',0:'Інструменти'};
const CC={2:'#d98a00',3:'#1e8fd6',4:'#7a4fd8',5:'#c2255c',6:'#2f9e4f',7:'#364fc7',8:'#e0661b',9:'#0f8a8a',10:'#495057',12:'#2b8a3e',1:'#9c36b5',0:'#495057'};
const ORDER=[2,3,4,5,6,7,8,9,10,12,1,0];
const TYPE=k=>/Середовище|Лабораторія|Тренажер|Інструмент/.test(k)?'env':/Гра|Квест|Пульт|Екран|Тренування/.test(k)?'game':/Проєкт|Практична|Творчий/.test(k)?'proj':/Слайди/.test(k)?'slides':/Урок|Картки|Тест|Читанка/.test(k)?'ex':'other';
const TN={ex:['📘','Уроки й вправи'],game:['🎮','Ігри'],env:['🧪','Середовища'],proj:['🛠️','Проєкти й практичні'],slides:['🖥️','Презентації'],other:['📎','Матеріали']};
const ENVI=t=>{const R=[[/Git/,'🌿','#2f9e44'],[/HTML|CSS/,'🌐','#e8590c'],[/Python/,'🐍','#1971c2'],[/сортуван/i,'📶','#7048e8'],[/Бджілка/,'🐝','#f59f00'],[/Браузер/,'🧭','#1c7ed6'],[/Вектор/,'✏️','#7048e8'],[/баз[аи]|БазаЛаб/i,'🗄️','#0c8599'],[/Дизайн/,'🎨','#d6336c'],[/Документ/,'📄','#1864ab'],[/Scratch/,'🐱','#f76707'],[/Логічн/,'🔀','#5f3dc4'],[/Micro:?Bit/i,'🔌','#2b8a3e'],[/блок-схем/i,'🔷','#1971c2'],[/Маленький комп/,'💻','#495057'],[/Малювалка/,'🖍️','#f08c00'],[/Мереж/,'🕸️','#0b7285'],[/Мишка/,'🖱️','#5c7cfa'],[/ПК/,'🖥️','#1c7ed6'],[/Пошт/,'✉️','#c2255c'],[/Презентац/,'🎞️','#e8590c'],[/Провідник/,'📁','#f59f00'],[/Рандом/,'🎲','#ae3ec9'],[/читання/i,'📖','#9c36b5'],[/кавомашин/i,'☕','#8d5524'],[/Таблиц/,'📊','#2b8a3e'],[/середовища й інструменти/,'🧰','#495057']];for(const [re,e,c] of R)if(re.test(t))return[e,c];return['🧪','#2b8a3e']};
const CTA={ex:'Почати урок →',game:'▶ Грати',env:'Відкрити середовище →',proj:'Почати проєкт →',slides:'Слайди →',other:'Відкрити →'};
const FMT=lb=>{lb=String(lb);let m=lb.match(/^([^:]{3,40}):\s*розминка/i);if(m)return m[1].trim();m=lb.match(/^розминка,\s*\d+\s*вправ,\s*(.{3,40})$/i);return m?m[1].trim().replace(/^./,c=>c.toUpperCase()):''};
const FI=f=>/Детектив/i.test(f)?'🕵️':/Квест/i.test(f)?'🗝️':/Симулятор|Кібер/i.test(f)?'🖥️':/Аркада|Спідран|на час/i.test(f)?'⏱️':/Рольова|тікет|Служба/i.test(f)?'🎧':/Майстерня|Конструктор/i.test(f)?'🧩':/Пісочниця|PRIMM|передбач/i.test(f)?'🔬':/Дослідн/i.test(f)?'🔎':/пар|водій/i.test(f)?'👥':'🎯';
const secName=(k,r)=>{const s=(d.sect[k]||[]).find(x=>String(x[0])===String(r));if(!s)return '';return typeof s[0]==='number'?`Р${s[0]}. ${s[1]}`:s[1]};
const items=d.res.filter(r=>r.kind!=='Архів'&&r.url);
const fnv=s=>{let h=0x811c9dc5;for(const ch of Buffer.from(s,'utf8')){h^=ch;h=Math.imul(h,0x01000193)>>>0}return h.toString(36)};
const CAT=[];
const cnt={},kc={};
let body='';
for(const k of ORDER){
  const rs=items.filter(r=>r.k==k);if(!rs.length)continue;
  body+=`<section data-k="${k}" style="--cc:${CC[k]}"><h2>${CN[k]}</h2><div class="grid">`;
  const secs=(d.sect[k]||[]).map(s=>String(s[0]));
  const TR={ex:0,env:1,game:2,proj:3,other:4,slides:5};rs.sort((a,b)=>{const ia=secs.indexOf(String(a.r)),ib=secs.indexOf(String(b.r));return ((ia<0?99:ia)-(ib<0?99:ib))||(TR[TYPE(a.kind)]-TR[TYPE(b.kind)])});
  const groups=[],GI={};
  for(const r of rs){
    const t=TYPE(r.kind),w=r.who==='t'?'t':'s';
    const key=[r.r,r.t,strip(r.title),t,w].join('|');
    if(!(key in GI)){GI[key]=groups.length;groups.push({t,w,r0:r,items:[]})}
    groups[GI[key]].items.push(r);
  }
  for(const g of groups){
    const {t,w,r0}=g;cnt[t]=(cnt[t]||0)+1;kc[k]=(kc[k]||0)+1;
    const sec=secName(k,r0.r),tt=strip(r0.title);
    const topic=r0.t&&!/^(Середовище|Проєкт|Підсумок)$/.test(r0.t)&&r0.t!==r0.kind?`${strip(r0.t)} · `:'';
    const kinds=[...new Set(g.items.map(x=>x.kind))],kd=kinds.length===1?kinds[0]:(t==='ex'?'Уроки':TN[t][1]);
    const L=g.items.map(r=>{const ext=/^https?:/.test(r.url),href=ext?r.url:'/'+r.url,code=U['/'+r.url]||'',lb=strip(r.label||r.kind);
      CAT.push({i:fnv(r.url),k,y:t,n:r.kind,ti:tt,l:lb,u:href,c:code,w,s:sec});return {ext,href,code,lb,kind:r.kind}});
    const q=(tt+' '+kd+' '+sec+' '+L.map(x=>x.lb+' '+x.code+' '+x.kind).join(' ')).toLowerCase();
    const top=`<span class="top"><span class="kd">${TN[t][0]} ${esc(kd)}</span>${w==='t'?'<span class="tch">вчителю</span>':''}${L.length===1&&L[0].code?`<span class="kc">${L[0].code}</span>`:''}</span>`;
    const foot=sec||topic?`<small>${esc(topic)}${esc(sec)}</small>`:'';
    if(L.length===1){const x=L[0];
      const f=t==='ex'?FMT(x.lb):'';const lbh=f?`<span class="fmt">${FI(f)} ${esc(f)}</span>`:`<span class="lb">${esc(x.lb)}</span>`;
      const ei=t==='env'?ENVI(tt):null;
      body+=`<a class="c t-${t}"${ei?` style="--tc:${ei[1]}"`:''} href="${esc(x.href)}"${x.ext?' target="_blank" rel="noopener"':''} data-t="${t}" data-w="${w}" data-q="${esc(q)}"><i class="wm" aria-hidden="true">${ei?ei[0]:TN[t][0]}</i>${(ei?top.replace(TN.env[0],'<span class="ei">'+ei[0]+'</span>'):top)}<b>${esc(tt)}</b>${lbh}${foot}<span class="cta">${CTA[t]}</span></a>`;}
    else{
      const ej=t==='env'?ENVI(tt):null;
      body+=`<div class="c multi t-${t}"${ej?` style="--tc:${ej[1]}"`:''} data-t="${t}" data-w="${w}" data-q="${esc(q)}"><i class="wm" aria-hidden="true">${ej?ej[0]:TN[t][0]}</i>${ej?top.replace(TN.env[0],'<span class="ei">'+ej[0]+'</span>'):top}<b>${esc(tt)}</b><span class="sets">${L.map(x=>`<a href="${esc(x.href)}"${x.ext?' target="_blank" rel="noopener"':''}><span>${esc(kinds.length>1&&!x.lb.includes(x.kind)?x.kind+': '+x.lb:x.lb)}</span>${x.code?`<span class="kc">${x.code}</span>`:''}</a>`).join('')}</span>${foot}</div>`;}
  }
  body+='</div></section>';
}
fs.writeFileSync('/home/claude/infohab/site/stats.json',JSON.stringify(cnt));
const total=Object.values(kc).reduce((a,b)=>a+b,0);
const kChips=`<button data-k="" aria-pressed="true">Усі класи</button>`+ORDER.filter(k=>kc[k]).map(k=>`<button data-k="${k}" aria-pressed="false" style="--cc:${CC[k]}">${CN[k]}</button>`).join('');
const tChips=`<button data-t="" aria-pressed="true">Усе</button>`+Object.keys(TN).filter(t=>cnt[t]).map(t=>`<button data-t="${t}" aria-pressed="false">${TN[t][0]} ${TN[t][1]} <i>${cnt[t]}</i></button>`).join('');
const html=`<!DOCTYPE html><html lang="uk"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Бібліотека інтерактивів з інформатики 2–11 клас — уроки, ігри, середовища | urokinfo</title>
<meta name="description" content="${total} інтерактивних матеріалів з інформатики за підручниками Біос: уроки з вправами, ігри на великий екран, середовища (таблиці, документи, Git, пошта), проєкти й презентації. Фільтри за класом і типом, коди для швидкого входу.">
<link rel="canonical" href="https://urokinfo.com.ua/vse/"><link rel="icon" href="/favicon.svg" type="image/svg+xml">
<meta property="og:title" content="Бібліотека інтерактивів з інформатики 2–11 клас"><meta property="og:locale" content="uk_UA"><meta property="og:url" content="https://urokinfo.com.ua/vse/">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@700;800&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">
<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"CollectionPage","name":"Бібліотека інтерактивів з інформатики","url":"https://urokinfo.com.ua/vse/","inLanguage":"uk","about":"Інформатика 2–11 клас","numberOfItems":total})}</script>
<style>
:root{--bg:#f6f7fb;--s:#fff;--ink:#1b1e28;--mut:#5c6375;--line:#e3e6ee;--acc:#c2255c}
@media (prefers-color-scheme:dark){:root{--bg:#12141b;--s:#1b1e28;--ink:#eef0f5;--mut:#a3a9b8;--line:#2c3040;--acc:#f06595}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.45 Nunito,system-ui,sans-serif}
.hd{max-width:1200px;margin:0 auto;padding:20px 14px 4px}h1{font:800 clamp(22px,4.5vw,32px)/1.15 Unbounded,sans-serif;margin:0 0 6px}.hd p{margin:0;color:var(--mut);max-width:780px}
.fl{position:sticky;top:51px;z-index:5;background:var(--bg);border-bottom:1px solid var(--line)}
.fl>div{max-width:1200px;margin:0 auto;padding:8px 14px;display:grid;gap:6px}
.row{display:flex;gap:6px;overflow-x:auto;scrollbar-width:thin;padding-bottom:2px}
.row button{flex:none;border:1px solid var(--line);background:var(--s);color:var(--ink);border-radius:999px;padding:6px 12px;font:700 14px Nunito,sans-serif;cursor:pointer}
.row button i{font-style:normal;color:var(--mut);font-weight:700}
.row button[aria-pressed=true]{background:var(--ink);border-color:var(--ink);color:var(--bg)}.row button[style][aria-pressed=true]{background:var(--cc);border-color:var(--cc);color:#fff}.row button[aria-pressed=true] i{color:#ffffffcc}
.sr{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.sr input{flex:1;min-width:180px;padding:8px 12px;border-radius:12px;border:1px solid var(--line);background:var(--s);color:var(--ink);font:15px Nunito,sans-serif}
.sr label{font-weight:700;font-size:14px;color:var(--mut);display:flex;gap:6px;align-items:center}.sr select{font:700 14px Nunito,sans-serif;padding:6px 8px;border-radius:10px;border:1px solid var(--line);background:var(--s);color:var(--ink)}
#n{font-weight:800;color:var(--mut);font-size:14px}
main{max-width:1200px;margin:0 auto;padding:6px 14px 40px}
section h2{font:800 20px Unbounded,sans-serif;color:var(--cc);margin:22px 0 10px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:10px}
.c{display:flex;flex-direction:column;gap:3px;background:var(--s);border:1px solid var(--line);border-top:4px solid var(--cc);border-radius:14px;padding:10px 12px;color:var(--ink);text-decoration:none;min-height:110px}
.c:hover,.c:focus-visible{border-color:var(--cc);box-shadow:0 4px 14px #0000000f}
.c .top{display:flex;gap:6px;align-items:center;font-size:12px;font-weight:800;color:var(--mut)}.c .kd{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.c .kc{font:700 12px ui-monospace,Menlo,monospace;padding:1px 7px;border-radius:7px;background:color-mix(in srgb,var(--cc) 14%,transparent);color:var(--cc)}
.c .tch{padding:1px 7px;border-radius:7px;background:#ffb02033;color:inherit}
.c b{font-size:15.5px;line-height:1.25}.c .sets{display:grid;gap:5px;margin:4px 0 2px}.c .sets a{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:6px 9px;border:1px solid var(--line);border-radius:10px;color:var(--ink);text-decoration:none;font-size:14px;font-weight:700}.c .sets a:hover{border-color:var(--cc)}.c.multi:hover{box-shadow:none}.c .lb{font-size:14px;color:var(--mut)}.c small{margin-top:auto;font-size:12px;color:var(--mut)}
.c{position:relative;overflow:hidden}.c>*{position:relative}.c .wm{position:absolute;right:-6px;bottom:-14px;font-style:normal;font-size:78px;line-height:1;opacity:.09;pointer-events:none;transform:rotate(-12deg)}
.c .cta{font:800 13px Nunito,sans-serif;color:var(--tc,var(--cc));margin-top:4px}.c.multi .cta{display:none}
.c .fmt{align-self:flex-start;font-size:13px;font-weight:800;padding:2px 9px;border-radius:999px;background:color-mix(in srgb,var(--cc) 12%,transparent);color:var(--cc)}
.c.t-ex{border-top-width:4px}
.c.t-game{--tc:#e8590c;border:0;border-top:0;background:linear-gradient(140deg,color-mix(in srgb,var(--tc) 16%,var(--s)),color-mix(in srgb,var(--cc) 14%,var(--s)));box-shadow:inset 0 0 0 2px color-mix(in srgb,var(--tc) 35%,transparent)}
.c.t-game .wm{opacity:.22;font-size:92px}.c.t-game .cta{align-self:flex-start;background:var(--tc);color:#fff;border-radius:999px;padding:4px 12px}
.c.t-env{border:2px solid var(--tc);border-radius:12px;padding-top:30px;background:linear-gradient(var(--tc) 0 22px,var(--s) 22px)}
.c.t-env::before{content:"● ● ●";position:absolute;top:3px;left:10px;font-size:10px;letter-spacing:2px;color:#ffffffd0}.c.t-env::after{content:"тренажер";position:absolute;top:3px;right:10px;font:800 10px ui-monospace,Menlo,monospace;color:#ffffffd0;letter-spacing:.08em}.c.t-env .kd{color:var(--tc)}
.c.t-env .sets a{font-family:ui-monospace,Menlo,monospace;font-size:13px}
.c.t-proj{--tc:#1971c2;border:2px dashed color-mix(in srgb,var(--tc) 55%,var(--line));border-top:2px dashed color-mix(in srgb,var(--tc) 55%,var(--line));background:repeating-linear-gradient(0deg,transparent 0 19px,color-mix(in srgb,var(--tc) 7%,transparent) 19px 20px),repeating-linear-gradient(90deg,transparent 0 19px,color-mix(in srgb,var(--tc) 7%,transparent) 19px 20px),var(--s)}
.c.t-proj .kd::after{content:" · окрема оцінка";font-weight:700}.c.t-proj .kd{color:var(--tc)}
.c.t-slides{min-height:auto;border-top-width:2px;background:color-mix(in srgb,var(--s) 70%,var(--bg))}.c.t-slides b{font-size:14.5px}.c.t-slides .wm{font-size:56px}
@media (prefers-color-scheme:dark){.c .wm{opacity:.14}.c.t-env::before,.c.t-env::after{color:#0b1a10}}
.c.t-env{--tc:#2b8a3e}.c.t-env .wm{opacity:.28;font-size:84px}.c .ei{display:inline-grid;place-items:center;width:26px;height:26px;border-radius:8px;background:color-mix(in srgb,var(--tc) 18%,transparent);font-size:16px;margin-right:2px;vertical-align:middle}
:root{--dk:#000}@media (prefers-color-scheme:dark){:root{--dk:#fff}}
section h2{color:color-mix(in srgb,var(--cc) 72%,var(--dk))!important}.c .cta{color:color-mix(in srgb,var(--tc,var(--cc)) 72%,var(--dk))}.c.t-game .cta{background:color-mix(in srgb,var(--tc) 80%,#000);color:#fff}
.c .kc,.c .fmt,.c .kd{color:color-mix(in srgb,var(--tc,var(--cc)) 70%,var(--dk))}.c.t-env .kd{color:color-mix(in srgb,var(--tc) 70%,var(--dk))}
@media (prefers-color-scheme:dark){.c .kc,.c .fmt,.c .kd,.c .cta,section h2{color:color-mix(in srgb,var(--tc,var(--cc)) 45%,#fff)!important}.c.t-game .cta{color:#fff!important}}
.hide{display:none!important}.empty{padding:30px;text-align:center;color:var(--mut)}
</style></head><body>
<div class="hd"><h1>Бібліотека інтерактивів</h1><p style="margin:0 0 6px"><a href="/konstruktor/" style="color:var(--acc);font-weight:800">🧩 Зібрати свій урок з цих блоків →</a></p><p>Усі уроки, ігри, середовища й проєкти з інформатики 2–11 клас за підручниками Біос. Обери клас і тип, клацни картку — відкриється одразу, без реєстрації. Число на картці — код для учнів.</p></div>
<div class="fl"><div>
 <div class="row" id="fk" aria-label="Клас">${kChips}</div>
 <div class="row" id="ft" aria-label="Тип">${tChips}</div>
 <div class="sr"><input type="search" id="q" placeholder="Пошук: тема, слово або код…" aria-label="Пошук"><label>Для кого <select id="w"><option value="s">учням</option><option value="t">вчителю</option><option value="">усе</option></select></label><span id="n"></span></div>
</div></div>
<main>${body}<p class="empty hide" id="none">Нічого не знайдено. Спробуй інше слово або зніми фільтр.</p></main>
<script>
const $=s=>document.querySelector(s),cards=[...document.querySelectorAll('.c')],secs=[...document.querySelectorAll('section')];
const st={k:'',t:'',w:'s',q:''};
try{const p=new URLSearchParams(location.search);['k','t','w','q'].forEach(x=>{if(p.has(x))st[x]=p.get(x)});if(st.t==='slides'&&!p.has('w'))st.w=''}catch(e){}
function ap(){const q=st.q.trim().toLowerCase();let n=0;
 cards.forEach(c=>{const s=c.closest('section').dataset.k;const ok=(!st.k||s===st.k)&&(!st.t||c.dataset.t===st.t)&&(!st.w||c.dataset.w===st.w)&&(!q||c.dataset.q.includes(q));c.classList.toggle('hide',!ok);if(ok)n++});
 secs.forEach(s=>s.classList.toggle('hide',!s.querySelector('.c:not(.hide)')));
 $('#n').textContent=n+' з ${total}';$('#none').classList.toggle('hide',n>0);
 document.querySelectorAll('#fk button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.k===st.k));
 document.querySelectorAll('#ft button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.t===st.t));
 $('#w').value=st.w;$('#q').value!==st.q&&($('#q').value=st.q);
 const p=new URLSearchParams();if(st.k)p.set('k',st.k);if(st.t)p.set('t',st.t);if(st.w!=='s')p.set('w',st.w);if(st.q)p.set('q',st.q);
 history.replaceState(null,'',location.pathname+(p+''?'?'+p:''))}
$('#fk').onclick=e=>{const b=e.target.closest('button');if(b){st.k=b.dataset.k;ap()}};
$('#ft').onclick=e=>{const b=e.target.closest('button');if(b){st.t=b.dataset.t;if(st.t==='slides'&&st.w==='s')st.w='';ap()}};
$('#w').onchange=e=>{st.w=e.target.value;ap()};$('#q').oninput=e=>{st.q=e.target.value;ap()};ap();
</script>
<script src="/site/nav.js" defer></script>
</body></html>`;
fs.writeFileSync('/home/claude/infohab/vse/index.html',html);
{const seen=new Set(),out=CAT.filter(x=>!seen.has(x.i)&&seen.add(x.i));fs.writeFileSync('/home/claude/infohab/site/catalog.json',JSON.stringify(out));console.log('catalog',out.length,CAT.length)}console.log(total,cnt);
