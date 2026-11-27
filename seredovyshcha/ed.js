/* Спільний векторний редактор для ВекторЛаб і ДизайнЛаб: сторінки, об'єкти SVG, шари, вирівнювання, групи, ефекти, прототип, експорт PNG. */
(function(){
const $=s=>document.querySelector(s),esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[c]);
const FONTS=[["Nunito","Nunito, sans-serif"],["Unbounded","Unbounded, sans-serif"],["JetBrains Mono","'JetBrains Mono', monospace"],["Georgia","Georgia, serif"],["Comic","'Comic Sans MS', 'Comic Neue', cursive"]];
const FF=n=>(FONTS.find(f=>f[0]===n)||FONTS[0])[1];
const ED={};let C,D,pg=0,sel=[],uid=1,mode="edit",onChange=()=>{};
const nid=()=>"o"+(uid++);
ED.FONTS=FONTS;
/* ---------- геометрія ---------- */
function bb(o){if(o.type==="group"){const B=o.children.map(bb);const x=Math.min(...B.map(b=>b.x)),y=Math.min(...B.map(b=>b.y));return{x,y,w:Math.max(...B.map(b=>b.x+b.w))-x,h:Math.max(...B.map(b=>b.y+b.h))-y}}
 if(o.type==="text"){const L=String(o.text||"").split("\n"),m=Math.max(1,...L.map(l=>l.length));return{x:o.x,y:o.y,w:Math.max(20,m*o.size*.56+(o.ls||0)*m),h:L.length*o.size*(o.lh||1.2)}}
 return{x:o.x,y:o.y,w:o.w,h:o.h}}
function moveO(o,dx,dy){if(o.type==="group")o.children.forEach(c=>moveO(c,dx,dy));else{o.x+=dx;o.y+=dy}}
function scaleO(o,ox,oy,sx,sy){if(o.type==="group"){o.children.forEach(c=>scaleO(c,ox,oy,sx,sy));return}
 o.x=ox+(o.x-ox)*sx;o.y=oy+(o.y-oy)*sy;if(o.type==="text"){o.size=Math.max(6,Math.round(o.size*Math.min(sx,sy)))}else{o.w=Math.max(4,o.w*sx);o.h=Math.max(4,o.h*sy)}}
function flat(list){return list.flatMap(o=>o.type==="group"?[o,...flat(o.children)]:[o])}
ED.flat=flat;ED.bb=bb;
/* ---------- рендер ---------- */
function starPts(o,n,inner){const cx=o.x+o.w/2,cy=o.y+o.h/2,R=Math.min(o.w,o.h)/2;let p=[];for(let i=0;i<n*(inner?2:1);i++){const a=-Math.PI/2+i*Math.PI*2/(n*(inner?2:1)),r=inner&&i%2?R*inner:R;p.push((cx+r*Math.cos(a)*o.w/2/R).toFixed(1)+","+(cy+r*Math.sin(a)*o.h/2/R).toFixed(1))}return p.join(" ")}
function paint(o,defs){let f=o.fill||"none";if(o.grad&&o.fill!=="none"){const g="g_"+o.id;defs.push(`<linearGradient id="${g}" x1="0" y1="0" x2="${o.grad.dir==="h"?1:0}" y2="${o.grad.dir==="h"?0:1}"><stop offset="0" stop-color="${o.fill}"/><stop offset="1" stop-color="${o.grad.to}"/></linearGradient>`);f=`url(#${g})`}
 let fl="";if(o.shadow||o.blur){const fid="f_"+o.id;defs.push(`<filter id="${fid}" x="-30%" y="-30%" width="160%" height="160%">${o.blur?`<feGaussianBlur stdDeviation="${o.blur}" result="b"/>`:""}${o.shadow?`<feDropShadow dx="4" dy="6" stdDeviation="5" flood-opacity=".35"/>`:""}</filter>`);fl=` filter="url(#${fid})"`}
 return` fill="${f}" stroke="${o.stroke||"none"}" stroke-width="${o.sw||0}" opacity="${o.op??1}"${fl}`}
function rot(o){if(!o.rot)return"";const b=bb(o);return` transform="rotate(${o.rot} ${b.x+b.w/2} ${b.y+b.h/2})"`}
function svgO(o,defs,prev){if(o.hidden)return"";const id=` data-id="${o.id}"`,lk=prev&&o.link?' style="cursor:pointer" data-link="'+o.link+'"':"";
 switch(o.type){
  case"rect":return`<rect${id}${lk} x="${o.x}" y="${o.y}" width="${o.w}" height="${o.h}" rx="${o.rx||0}"${paint(o,defs)}${rot(o)}/>`;
  case"ellipse":return`<ellipse${id}${lk} cx="${o.x+o.w/2}" cy="${o.y+o.h/2}" rx="${o.w/2}" ry="${o.h/2}"${paint(o,defs)}${rot(o)}/>`;
  case"line":return`<line${id}${lk} x1="${o.x}" y1="${o.y}" x2="${o.x+o.w}" y2="${o.y+o.h}" stroke="${o.stroke||"#000"}" stroke-width="${o.sw||4}" stroke-linecap="round" opacity="${o.op??1}"${rot(o)}/>`;
  case"tri":return`<polygon${id}${lk} points="${o.x+o.w/2},${o.y} ${o.x+o.w},${o.y+o.h} ${o.x},${o.y+o.h}"${paint(o,defs)}${rot(o)}/>`;
  case"star":return`<polygon${id}${lk} points="${starPts(o,5,.45)}"${paint(o,defs)}${rot(o)}/>`;
  case"poly":return`<polygon${id}${lk} points="${starPts(o,o.n||6,0)}"${paint(o,defs)}${rot(o)}/>`;
  case"text":{const L=String(o.text||"").split("\n"),a=o.align||"left",x=a==="center"?o.x+bb(o).w/2:a==="right"?o.x+bb(o).w:o.x,an=a==="center"?"middle":a==="right"?"end":"start";
   return`<text${id}${lk} x="${x}" y="${o.y}" font-family="${esc(FF(o.font))}" font-size="${o.size}" font-weight="${o.bold?800:500}" letter-spacing="${o.ls||0}" text-anchor="${an}" dominant-baseline="hanging"${paint(Object.assign({},o,{stroke:o.stroke||"none"}),defs)}${rot(o)}>${L.map((l,i)=>`<tspan x="${x}" dy="${i?o.size*(o.lh||1.2):0}">${esc(o.upper?l.toUpperCase():l)||" "}</tspan>`).join("")}</text>`}
  case"img":return`<g${id}${lk}${rot(o)} opacity="${o.op??1}"${o.shadow||o.blur?paint({id:o.id,shadow:o.shadow,blur:o.blur,fill:"none"},defs).replace(/ fill="none" stroke="none" stroke-width="0" opacity="[^"]*"/,""):""}><rect x="${o.x}" y="${o.y}" width="${o.w}" height="${o.h}" rx="${o.rx||0}" fill="${o.bg||"#e7f5ff"}"/><text x="${o.x+o.w/2}" y="${o.y+o.h/2}" font-size="${Math.min(o.w,o.h)*.62}" text-anchor="middle" dominant-baseline="central">${o.emoji}</text></g>`;
  case"frame":return o.photo?`<g${id}${lk}${rot(o)}><rect x="${o.x}" y="${o.y}" width="${o.w}" height="${o.h}" rx="${o.rx||0}" fill="${o.photo.bg}"/><text x="${o.x+o.w/2}" y="${o.y+o.h/2}" font-size="${Math.min(o.w,o.h)*.6}" text-anchor="middle" dominant-baseline="central">${o.photo.e}</text>${o.sw?`<rect x="${o.x}" y="${o.y}" width="${o.w}" height="${o.h}" rx="${o.rx||0}" fill="none" stroke="${o.stroke}" stroke-width="${o.sw}"/>`:""}</g>`
     :`<g${id}${rot(o)}><rect x="${o.x}" y="${o.y}" width="${o.w}" height="${o.h}" rx="${o.rx||0}" fill="#f1f3f5" stroke="#adb5bd" stroke-width="3" stroke-dasharray="10 8"/><text x="${o.x+o.w/2}" y="${o.y+o.h/2}" font-size="${Math.min(o.w,o.h)*.12+10}" fill="#868e96" text-anchor="middle" dominant-baseline="central" font-family="Nunito,sans-serif">＋ фото</text></g>`;
  case"group":return`<g${id}${lk}${rot(o)} opacity="${o.op??1}">${o.children.map(c=>svgO(c,defs,false)).join("")}</g>`}return""}
function pageSVG(p,prev,extra){const defs=[];const body=p.objs.map(o=>svgO(o,defs,prev)).join("");
 return`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${p.w} ${p.h}" width="${p.w}" height="${p.h}"><defs>${defs.join("")}</defs><rect width="${p.w}" height="${p.h}" fill="${p.bg}"/>${p.bg2?`<rect width="${p.w}" height="${p.h}" fill="url(#pbg)"/>`:""}${p.bg2?`<defs><linearGradient id="pbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.bg}"/><stop offset="1" stop-color="${p.bg2}"/></linearGradient></defs>`:""}${body}${extra||""}</svg>`}
ED.pageSVG=pageSVG;
function P(){return D.pages[pg]}
function find(id,list){for(const o of list||P().objs){if(o.id===id)return o;if(o.type==="group"){const r=find(id,o.children);if(r)return r}}return null}
function top(id){return P().objs.find(o=>o.id===id||(o.type==="group"&&flat(o.children).some(c=>c.id===id)))}
function selO(){return sel.map(id=>P().objs.find(o=>o.id===id)).filter(Boolean)}
/* ---------- малюємо інтерфейс ---------- */
function ui(){const h=`<div class="ed">
 <div class="etb">${C.tools.map(t=>`<button data-tool="${t[0]}" title="${t[2]}">${t[1]} <span>${t[2]}</span></button>`).join("")}<span class="sep"></span>
  <button data-a="group" title="Згрупувати (2+ об'єкти)">⧉ Групувати</button><button data-a="ungroup">Розгрупувати</button>
  <span class="sep"></span><span class="al">${[["l","⇤","ліворуч"],["c","⇔","по центру"],["r","⇥","праворуч"],["t","⤒","вгору"],["m","⇕","посередині"],["b","⤓","донизу"],["dh","↔","розподілити по горизонталі"],["dv","↕","розподілити по вертикалі"]].map(a=>`<button data-al="${a[0]}" title="Вирівняти: ${a[2]}">${a[1]}</button>`).join("")}</span>
  <span class="sep"></span><button data-a="dup" title="Дублювати">⧉ Копія</button><button data-a="del" title="Видалити">🗑</button><button data-a="undo" title="Скасувати">↩️</button>
  <span class="sp"></span>${C.proto?`<button data-a="preview" class="pri">▶ Перегляд</button>`:""}<button data-a="png" class="pri">⬇ PNG</button></div>
 <div class="ebody"><div class="epages" id="ePages"></div><div class="ecan" id="eCan"></div><div class="eside"><div class="eprops" id="eProps"></div><div class="elayers"><h4>Шари</h4><ul id="eLayers"></ul></div></div></div></div>
 <div class="eprev" id="ePrev"><div id="ePrevBox"></div><button class="btn" data-a="closeprev">✕ Закрити перегляд</button></div>
 <div class="edlg" id="eDlg"><div id="eDlgBox"></div></div>`;
 C.mount.innerHTML=h;
 C.mount.addEventListener("click",onClick);C.mount.addEventListener("input",onInput);C.mount.addEventListener("change",onInput)}
let hist=[];function snap(){hist.push(JSON.stringify(D));if(hist.length>40)hist.shift()}
function commit(){onChange(D);draw()}
function draw(){drawPages();drawCanvas();drawProps();drawLayers()}
function drawPages(){$("#ePages").innerHTML=D.pages.map((p,i)=>`<div class="ep${i===pg?" cur":""}" data-pg="${i}"><div class="eth">${pageSVG(p)}</div><input value="${esc(p.name)}" data-pname="${i}" aria-label="Назва сторінки"></div>`).join("")+(C.addPage?`<button data-a="addpage">＋ ${C.pageWord||"Сторінка"}</button>`:"")}
function drawCanvas(){const p=P(),ex=selO().map(o=>{const b=bb(o);return`<rect class="hl" x="${b.x-3}" y="${b.y-3}" width="${b.w+6}" height="${b.h+6}" fill="none" stroke="#1c7ed6" stroke-width="${p.w/300}" stroke-dasharray="${p.w/80} ${p.w/160}" pointer-events="none"/>`+(sel.length===1?`<rect class="hd" data-h="1" x="${b.x+b.w-p.w/70}" y="${b.y+b.h-p.w/70}" width="${p.w/35}" height="${p.w/35}" fill="#1c7ed6"/>`:"")+(o.link?`<text x="${b.x+b.w}" y="${b.y-6}" font-size="${p.w/30}" text-anchor="end" pointer-events="none">🔗</text>`:"")}).join("");
 $("#eCan").innerHTML=pageSVG(p,false,ex);const s=$("#eCan svg");s.removeAttribute("width");s.removeAttribute("height");s.style.aspectRatio=p.w+"/"+p.h;s.style.width=`min(100%, calc(72vh * ${p.w} / ${p.h}))`}
function drawLayers(){$("#eLayers").innerHTML=P().objs.slice().reverse().map(o=>`<li class="${sel.includes(o.id)?"cur":""}" data-ly="${o.id}"><span>${({rect:"⬛",ellipse:"⚪",line:"／",tri:"🔺",star:"⭐",poly:"⬢",text:"🔤",img:"🖼️",frame:"🖼️",group:"📦"})[o.type]} ${esc(o.name||lbl(o))}</span><button data-lo="up" title="Вище">↑</button><button data-lo="dn" title="Нижче">↓</button><button data-lo="hide" title="Сховати/показати">${o.hidden?"🙈":"👁"}</button></li>`).join("")||'<li class="mut">Порожньо</li>'}
function lbl(o){return o.type==="text"?String(o.text).slice(0,16):({rect:"Прямокутник",ellipse:"Еліпс",line:"Лінія",tri:"Трикутник",star:"Зірка",poly:"Багатокутник",img:"Зображення",frame:"Рамка для фото",group:"Група"})[o.type]}
const COLORS=["#1b1e28","#ffffff","#e03131","#f76707","#ffd43b","#2f9e44","#1c7ed6","#7048e8","#e64980","#0ca678","#868e96","#f1f3f5"];
function sw(k,v){return`<div class="sw">${COLORS.concat(D.brand&&D.brand.colors||[]).filter((c,i,a)=>a.indexOf(c)===i).map(c=>`<button data-k="${k}" data-v="${c}" style="background:${c}" title="${c}"${v===c?' class="on"':""}></button>`).join("")}<input type="color" data-k="${k}" value="${/^#[0-9a-f]{6}$/i.test(v)?v:"#000000"}" title="Свій колір"></div>`}
function drawProps(){const S=selO(),b=$("#eProps");const p=P();
 if(!S.length){b.innerHTML=`<h4>${esc(p.name)}</h4><label>Фон</label>${sw("pbg",p.bg)}<label><input type="checkbox" data-k="pgrad" ${p.bg2?"checked":""}> Градієнтний фон</label>${p.bg2?sw("pbg2",p.bg2):""}${C.notes?`<label>Нотатки / документація</label><textarea data-k="pnotes" rows="3">${esc(p.notes||"")}</textarea>`:""}${C.brand?brandUI():""}<p class="mut">Клацни об'єкт, щоб змінити його. Shift+клік на полотні або в шарах — вибрати кілька.</p>`;return}
 if(S.length>1){b.innerHTML=`<h4>Вибрано: ${S.length}</h4><p class="mut">Вирівнюй кнопками на панелі або згрупуй.</p><label>Заливка всіх</label>${sw("fill","")}`;return}
 const o=S[0];let h=`<h4>${esc(lbl(o))}</h4><label>Назва шару</label><input data-k="name" value="${esc(o.name||"")}" placeholder="${esc(lbl(o))}">`;
 if(o.type==="text")h+=`<label>Текст</label><textarea data-k="text" rows="3">${esc(o.text)}</textarea><label>Шрифт</label><select data-k="font">${FONTS.map(f=>`<option${o.font===f[0]?" selected":""}>${f[0]}</option>`).join("")}</select>
  <div class="row"><label>Розмір <input type="number" data-k="size" min="6" max="300" value="${o.size}"></label><label><input type="checkbox" data-k="bold" ${o.bold?"checked":""}> Жирний</label></div>
  <div class="row"><label>Інтервал <input type="number" data-k="ls" min="-5" max="40" value="${o.ls||0}"></label><label>Міжрядк. <input type="number" data-k="lh" step="0.1" min="0.8" max="3" value="${o.lh||1.2}"></label></div>
  <div class="row"><select data-k="align"><option value="left">ліворуч</option><option value="center">по центру</option><option value="right">праворуч</option></select><label><input type="checkbox" data-k="upper" ${o.upper?"checked":""}> ВЕЛИКІ</label></div>`;
 if(["rect","ellipse","tri","star","poly","text"].includes(o.type))h+=`<label>Заливка</label>${sw("fill",o.fill)}<label><input type="checkbox" data-k="gradon" ${o.grad?"checked":""}> Градієнт</label>${o.grad?sw("gto",o.grad.to)+`<select data-k="gdir"><option value="v">згори вниз</option><option value="h">зліва направо</option></select>`:""}`;
 if(["rect","ellipse","tri","star","poly","line","frame"].includes(o.type))h+=`<label>Обведення</label>${sw("stroke",o.stroke)}<label>Товщина <input type="number" data-k="sw" min="0" max="40" value="${o.sw||0}"></label>`;
 if(["rect","img","frame"].includes(o.type))h+=`<label>Заокруглення <input type="number" data-k="rx" min="0" max="300" value="${o.rx||0}"></label>`;
 if(o.type==="img")h+=`<label>Тло</label>${sw("bg",o.bg)}<button data-a="imgpick">Змінити зображення</button>`;
 if(o.type==="frame")h+=`<button data-a="framepick">${o.photo?"Змінити фото":"＋ Вставити фото"}</button>`;
 h+=`<div class="row"><label>Поворот <input type="number" data-k="rot" min="-180" max="180" value="${o.rot||0}"></label><label>Прозорість <input type="number" data-k="op" min="0.1" max="1" step="0.1" value="${o.op??1}"></label></div>
  <div class="row"><label><input type="checkbox" data-k="shadow" ${o.shadow?"checked":""}> Тінь</label><label>Розмиття <input type="number" data-k="blur" min="0" max="20" value="${o.blur||0}"></label></div>
  <div class="row"><label>X <input type="number" data-k="x" value="${Math.round(bb(o).x)}"></label><label>Y <input type="number" data-k="y" value="${Math.round(bb(o).y)}"></label></div>`;
 if(C.proto)h+=`<label>🔗 Перехід при натисканні</label><select data-k="link"><option value="">— немає —</option>${D.pages.map((q,i)=>i===pg?"":`<option value="${q.id}"${o.link===q.id?" selected":""}>→ ${esc(q.name)}</option>`).join("")}</select>`;
 b.innerHTML=h;const a=b.querySelector('[data-k="align"]');if(a)a.value=o.align||"left";const g=b.querySelector('[data-k="gdir"]');if(g&&o.grad)g.value=o.grad.dir||"v"}
function brandUI(){const B=D.brand||(D.brand={colors:[],fonts:{h:"",b:""}});
 return`<div class="brand"><h4>🎨 Фірмовий стиль</h4><label>Кольори бренду (${B.colors.length})</label><div class="sw">${B.colors.map((c,i)=>`<button style="background:${c}" data-bdel="${i}" title="Прибрати ${c}"></button>`).join("")}<input type="color" id="bNew" value="#2f9e44"><button data-a="badd" class="mini">＋ додати</button></div>
 <label>Шрифт заголовків</label><select data-k="bfh"><option value="">—</option>${FONTS.map(f=>`<option${B.fonts.h===f[0]?" selected":""}>${f[0]}</option>`).join("")}</select>
 <label>Шрифт тексту</label><select data-k="bfb"><option value="">—</option>${FONTS.map(f=>`<option${B.fonts.b===f[0]?" selected":""}>${f[0]}</option>`).join("")}</select></div>`}
/* ---------- події ---------- */
function onClick(e){const t=e.target;
 const tool=t.closest("[data-tool]");if(tool)return addTool(tool.dataset.tool);
 const pgb=t.closest("[data-pg]");if(pgb&&!t.matches("input")){pg=+pgb.dataset.pg;sel=[];draw();return}
 const al=t.closest("[data-al]");if(al)return align(al.dataset.al);
 const ly=t.closest("[data-ly]");if(ly){const lo=t.closest("[data-lo]");const i=P().objs.findIndex(o=>o.id===ly.dataset.ly);
   if(lo){snap();const A=P().objs;if(lo.dataset.lo==="up"&&i<A.length-1)[A[i],A[i+1]]=[A[i+1],A[i]];if(lo.dataset.lo==="dn"&&i>0)[A[i],A[i-1]]=[A[i-1],A[i]];if(lo.dataset.lo==="hide")A[i].hidden=!A[i].hidden;D.log.layers=(D.log.layers||0)+1;commit();return}
   const L=ly.dataset.ly;sel=(e.shiftKey||e.ctrlKey||e.metaKey)?(sel.includes(L)?sel.filter(x=>x!==L):sel.concat(L)):[L];draw();return}
 const kb=t.closest("button[data-k]");if(kb){setProp(kb.dataset.k,kb.dataset.v);return}
 const bd=t.closest("[data-bdel]");if(bd){D.brand.colors.splice(+bd.dataset.bdel,1);commit();return}
 const a=t.closest("[data-a]");if(!a)return;const A=a.dataset.a;
 if(A==="group"){const S=selO();if(S.length<2){C.toast("Вибери 2+ об'єкти (Shift+клік)");return}snap();const g={id:nid(),type:"group",name:"Група",children:S};P().objs=P().objs.filter(o=>!sel.includes(o.id)).concat([g]);sel=[g.id];D.log.group=(D.log.group||0)+1;commit()}
 if(A==="ungroup"){const S=selO().filter(o=>o.type==="group");if(!S.length)return;snap();S.forEach(g=>{const i=P().objs.indexOf(g);P().objs.splice(i,1,...g.children)});sel=[];commit()}
 if(A==="dup"){const S=selO();if(!S.length)return;snap();const cp=JSON.parse(JSON.stringify(S));const re=o=>{o.id=nid();if(o.children)o.children.forEach(re)};cp.forEach(o=>{re(o);moveO(o,20,20)});P().objs.push(...cp);sel=cp.map(o=>o.id);commit()}
 if(A==="del"){if(!sel.length)return;snap();P().objs=P().objs.filter(o=>!sel.includes(o.id));sel=[];commit()}
 if(A==="undo"){if(!hist.length){C.toast("Немає що скасовувати");return}D=JSON.parse(hist.pop());ED.D=D;sel=[];commit()}
 if(A==="addpage"){snap();const f=C.pageFormat||{w:P().w,h:P().h};D.pages.push({id:"p"+nid(),name:(C.pageWord||"Сторінка")+" "+(D.pages.length+1),w:f.w,h:f.h,bg:"#ffffff",objs:[],notes:""});pg=D.pages.length-1;sel=[];commit()}
 if(A==="png")exportPNG();
 if(A==="preview")preview(pg);if(A==="closeprev"){$("#ePrev").classList.remove("on")}
 if(A==="imgpick"||A==="framepick")pickImg(selO()[0]);
 if(A==="badd"){const c=$("#bNew").value;if(!D.brand.colors.includes(c))D.brand.colors.push(c);commit()}
 if(A==="dlgx")$("#eDlg").classList.remove("on")}
function onInput(e){const t=e.target;if(t.dataset.pname!=null){D.pages[+t.dataset.pname].name=t.value;onChange(D);return}
 const k=t.dataset.k;if(!k||t.tagName==="BUTTON")return;if(e.type==="input"&&(t.type==="checkbox"||t.tagName==="SELECT"))return;
 setProp(k,t.type==="checkbox"?t.checked:t.type==="number"?+t.value:t.value,e.type==="input")}
function setProp(k,v,soft){const p=P();C.touch();
 if(k==="pbg"){p.bg=v;return commit()}if(k==="pbg2"){p.bg2=v;return commit()}if(k==="pgrad"){p.bg2=v?(p.bg2||"#a5d8ff"):"";return commit()}
 if(k==="pnotes"){p.notes=v;onChange(D);return}
 if(k==="bfh"||k==="bfb"){D.brand.fonts[k==="bfh"?"h":"b"]=v;return commit()}
 const S=selO();if(!S.length)return;if(!soft)snap();
 S.forEach(o=>{const tgt=o.type==="group"&&["fill"].includes(k)?flat(o.children).filter(c=>c.type!=="group"):[o];
  tgt.forEach(o=>{if(k==="x"||k==="y"){const b=bb(o);moveO(o,k==="x"?v-b.x:0,k==="y"?v-b.y:0);return}
   if(k==="gradon"){o.grad=v?{to:"#ffffff",dir:"v"}:null;return}if(k==="gto"){o.grad=Object.assign(o.grad||{dir:"v"},{to:v});return}if(k==="gdir"){if(o.grad)o.grad.dir=v;return}
   if(k==="link"){o.link=v||null;D.log.links=(D.log.links||0)+1;return}
   o[k]=v})});
 if(soft){onChange(D);drawCanvas();drawLayers();drawPages();return}commit()}
let IMGS=[];ED.setImgs=a=>IMGS=a;
function pickImg(o){$("#eDlgBox").innerHTML=`<h3>Оберіть зображення</h3><div class="pick">${IMGS.map((m,i)=>`<button data-im="${i}" style="background:${m[2]}"><span>${m[0]}</span>${m[1]}</button>`).join("")}</div><p><button class="btn ghost" data-a="dlgx">Закрити</button></p>`;
 $("#eDlg").classList.add("on");$("#eDlgBox").onclick=e=>{const b=e.target.closest("[data-im]");if(!b)return;const m=IMGS[+b.dataset.im];snap();
  if(o&&o.type==="frame"){o.photo={e:m[0],bg:m[2],n:m[1]}}else if(o&&o.type==="img"){o.emoji=m[0];o.bg=m[2];o.name=m[1]}
  else{const p=P(),s=Math.min(p.w,p.h)*.3;const n={id:nid(),type:"img",emoji:m[0],bg:m[2],name:m[1],x:p.w/2-s/2,y:p.h/2-s/2,w:s,h:s,rx:16};p.objs.push(n);sel=[n.id]}
  $("#eDlg").classList.remove("on");commit()}}
function addTool(t){const p=P(),s=Math.min(p.w,p.h)*.25,x=p.w/2-s/2+((p.objs.length%5)*12),y=p.h/2-s/2+((p.objs.length%5)*12);let o;snap();C.touch();
 if(t==="img")return pickImg(null);
 if(t==="text")o={type:"text",text:"Текст",x,y,size:Math.round(p.w/14),font:"Nunito",fill:"#1b1e28",bold:false,align:"left",lh:1.2};
 else if(t==="line")o={type:"line",x,y,w:s,h:0,stroke:"#1b1e28",sw:6};
 else if(t==="frame")o={type:"frame",x,y,w:s*1.2,h:s,rx:8,stroke:"#ffffff",sw:0};
 else o={type:t,x,y,w:s,h:t==="rect"?s*.7:s,fill:["#ffd43b","#74c0fc","#ff8787","#8ce99a"][p.objs.length%4],stroke:"#1b1e28",sw:0,n:6};
 o.id=nid();p.objs.push(o);sel=[o.id];D.log["add_"+t]=(D.log["add_"+t]||0)+1;commit()}
function align(k){const S=selO();if(!S.length)return;snap();C.touch();const p=P();
 if(k==="dh"||k==="dv"){if(S.length<3){C.toast("Для розподілу вибери 3+ об'єкти");return}const h=k==="dh",L=S.slice().sort((a,b)=>h?bb(a).x-bb(b).x:bb(a).y-bb(b).y);
  const B=L.map(bb),start=h?B[0].x:B[0].y,end=h?B[B.length-1].x+B[B.length-1].w:B[B.length-1].y+B[B.length-1].h,tot=B.reduce((t,b)=>t+(h?b.w:b.h),0),gap=(end-start-tot)/(L.length-1);let cur=start;
  L.forEach((o,i)=>{const b=bb(o);moveO(o,h?cur-b.x:0,h?0:cur-b.y);cur+=(h?b.w:b.h)+gap});D.log.dist=(D.log.dist||0)+1;return commit()}
 const B=S.map(bb),U=S.length===1?{x:0,y:0,w:p.w,h:p.h}:{x:Math.min(...B.map(b=>b.x)),y:Math.min(...B.map(b=>b.y)),w:Math.max(...B.map(b=>b.x+b.w))-Math.min(...B.map(b=>b.x)),h:Math.max(...B.map(b=>b.y+b.h))-Math.min(...B.map(b=>b.y))};
 S.forEach((o,i)=>{const b=B[i];const dx=k==="l"?U.x-b.x:k==="c"?U.x+U.w/2-(b.x+b.w/2):k==="r"?U.x+U.w-(b.x+b.w):0,dy=k==="t"?U.y-b.y:k==="m"?U.y+U.h/2-(b.y+b.h/2):k==="b"?U.y+U.h-(b.y+b.h):0;moveO(o,dx,dy)});D.log.align=(D.log.align||0)+1;commit()}
/* ---------- перетягування ---------- */
function canvasEvents(){const can=$("#eCan");
 can.addEventListener("pointerdown",e=>{const svg=can.querySelector("svg");if(!svg)return;const r=svg.getBoundingClientRect(),p=P(),k=p.w/r.width;
  const h=e.target.closest("[data-h]"),hit=e.target.closest("[data-id]");
  if(!h){if(!hit){sel=[];draw();return}const T=top(hit.dataset.id);if(!T)return;if(e.shiftKey){sel=sel.includes(T.id)?sel.filter(x=>x!==T.id):sel.concat(T.id)}else if(!sel.includes(T.id))sel=[T.id];draw()}
  const S=selO();if(!S.length)return;e.preventDefault();snap();C.touch();const sx=e.clientX,sy=e.clientY,orig=JSON.stringify(S),b0=bb(S[0]);let moved=false;
  const mv=m=>{const dx=(m.clientX-sx)*k,dy=(m.clientY-sy)*k;if(Math.abs(dx)+Math.abs(dy)>2)moved=true;const O=JSON.parse(orig);
   O.forEach((o,i)=>{if(h){const sxf=Math.max(.05,(b0.w+dx)/b0.w),syf=Math.max(.05,(b0.h+dy)/b0.h);scaleO(o,b0.x,b0.y,sxf,o.type==="text"?sxf:syf)}else moveO(o,Math.round(dx),Math.round(dy));Object.assign(S[i],o)});drawCanvas()};
  const up=()=>{removeEventListener("pointermove",mv);removeEventListener("pointerup",up);if(!moved)hist.pop();else{if(h)D.log.resize=(D.log.resize||0)+1;commit()}};
  addEventListener("pointermove",mv);addEventListener("pointerup",up)});
 can.addEventListener("dblclick",e=>{const hit=e.target.closest("[data-id]");if(!hit)return;const o=find(hit.dataset.id);if(o&&o.type==="text"){sel=[top(o.id).id];draw();const ta=$('#eProps [data-k="text"]');if(ta){ta.focus();ta.select()}}
  if(o&&o.type==="frame")pickImg(o)})}
addEventListener("keydown",e=>{if(!C||$("#ePrev").classList.contains("on")||/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName))return;
 if((e.key==="Delete"||e.key==="Backspace")&&sel.length){e.preventDefault();onClick({target:{closest:s=>s==="[data-a]"?{dataset:{a:"del"}}:null,matches:()=>false}})}
 const d={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];if(d&&sel.length){e.preventDefault();const st=e.shiftKey?10:1;selO().forEach(o=>moveO(o,d[0]*st,d[1]*st));commit()}
 if((e.ctrlKey||e.metaKey)&&e.key==="z"){e.preventDefault();onClick({target:{closest:s=>s==="[data-a]"?{dataset:{a:"undo"}}:null,matches:()=>false}})}});
/* ---------- перегляд прототипу ---------- */
function preview(i){const p=D.pages[i];D.log.visited=D.log.visited||[];if(!D.log.visited.includes(p.id))D.log.visited.push(p.id);D.log.preview=(D.log.preview||0)+1;onChange(D);
 $("#ePrevBox").innerHTML=pageSVG(p,true);$("#ePrev").classList.add("on");$("#ePrevBox").onclick=e=>{const l=e.target.closest("[data-link]");if(l){const j=D.pages.findIndex(q=>q.id===l.dataset.link);if(j>=0)preview(j)}}}
/* ---------- експорт ---------- */
function exportPNG(){const p=P(),s=pageSVG(p),img=new Image();img.onload=()=>{const c=document.createElement("canvas");c.width=p.w;c.height=p.h;c.getContext("2d").drawImage(img,0,0);
  const a=document.createElement("a");a.download=(p.name||"дизайн")+".png";a.href=c.toDataURL("image/png");a.click();D.log.png=(D.log.png||0)+1;onChange(D);C.toast("PNG збережено")};
 img.onerror=()=>{D.log.png=(D.log.png||0)+1;onChange(D);C.toast("Збережено")};img.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(s)}
/* ---------- API ---------- */
ED.init=cfg=>{C=cfg;ui();canvasEvents()};
ED.load=(doc,change)=>{D=doc;ED.D=D;D.log=D.log||{};onChange=change||onChange;pg=0;sel=[];hist=[];uid=Math.max(1,...flat(D.pages.flatMap(p=>p.objs)).map(o=>+String(o.id).slice(1)||0))+1;draw()};
ED.page=()=>P();ED.sel=()=>selO();ED.nid=nid;
window.ED=ED;
})();
