/* Каркас середовищ: набори завдань з автоперевіркою, таймер, оцінка з 12, «Надіслати вчителю». */
(function(){
const FORM="https://docs.google.com/forms/d/e/1FAIpQLSeaDGNzqpEMjZyDt4WUwg3k3FAhGGW4pG1E8IcOk8b4LQsBVw/viewform?usp=pp_url&entry.1997531456=";
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const clean=v=>String(v==null?"":v).replace(/[|\n\r]/g," ").trim()||"—";
const hm=ms=>{const s=Math.max(0,Math.round(ms/1000));return Math.floor(s/60)+" хв "+String(s%60).padStart(2,"0")+" с";};
const mmss=ms=>{const s=Math.max(0,Math.floor(ms/1000));return String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0");};
const ls={get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
let C,setKey,S,timerI;
function toast(m,ms){let t=$(".toast");if(!t){t=document.createElement("div");t.className="toast";document.body.append(t)}t.textContent=m;t.classList.add("on");clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove("on"),ms||2200)}
function set(){return C.sets[setKey]}
function fresh(){return{t0:0,tEnd:0,done:{},sub:0,res:null,err:0}}
function save(){ls.set("env-"+C.id+"-"+setKey,S)}
function touch(){if(!S.t0&&!S.res){S.t0=Date.now();save()}}
function elapsed(){return S.t0?((S.tEnd||S.tAll||Date.now())-S.t0):0}
function tick(){const t=$("#kTimer");if(t)t.textContent="⏱ "+mmss(elapsed())}
function renderSide(){
  const st=set();
  $("#kStory").textContent=st.story||"";
  const ul=$("#kTasks");ul.innerHTML="";
  st.tasks.forEach((t,i)=>{const li=document.createElement("li");li.id="kt"+i;
    li.innerHTML=`<span class="n">${i+1}</span><span class="tx">${t.t}${t.hint?`<span class="hint">${t.hint}</span>`:""}</span>`;ul.append(li)});
  refresh();renderRes();
}
function refresh(){
  if(!C)return;const st=set();let n=0;
  st.tasks.forEach((t,i)=>{let ok=!!S.done[i];if(!ok&&!S.res){try{ok=!!t.ok()}catch(e){ok=false}if(ok){S.done[i]=1;}}
    const li=$("#kt"+i);if(li){li.classList.toggle("ok",ok);li.classList.toggle("miss",!!S.res&&!ok)}if(ok)n++});
  $("#kProg").style.width=(100*n/st.tasks.length)+"%";$("#kCount").textContent=n+" / "+st.tasks.length;
  const all=n===st.tasks.length&&!S.res;if(all&&!S.tAll){S.tAll=Date.now();toast("🎉 Усі завдання виконано! Натисни «Здати роботу».",4000)}
  const db=$("#kDone");if(db)db.classList.toggle("on",all);
  save();return n;
}
function compute(){
  const st=set(),tot=st.tasks.length,n=Object.keys(S.done).length,T=elapsed(),norm=(st.norm||15)*60000;
  const mult=S.sub>1?0.8:1;const base=12*(n/tot)*mult;
  const timePen=T<=norm?0:T<=1.5*norm?1:2;
  const grade=Math.max(1,Math.min(12,Math.round(base-timePen)));
  return{grade,n,tot,T,norm,timePen,mult,tooFast:T<0.3*norm,err:S.err};
}
function submit(){
  touch();refresh();const sd=document.querySelector(".k-side");if(sd)sd.classList.remove("min");
  const st=set(),undone=st.tasks.length-Object.keys(S.done).length;
  S.sub=(S.sub||0)+1;S.err=(S.err||0)+undone;S.tEnd=Date.now();S.res=compute();save();
  renderRes();refresh();
  $("#kRes").scrollIntoView({behavior:"smooth",block:"nearest"});
}
function renderRes(){
  const box=$("#kRes"),st=set();
  if(!S.res){box.classList.remove("on");$("#kSubmit").hidden=false;$("#kAgain").hidden=false;$("#kRedo").hidden=true;return}
  const r=S.res;box.classList.add("on");
  $("#kGrade").textContent=r.grade;
  $("#kInfo").innerHTML=`<span>виконано ${r.n} з ${r.tot}</span><span>· невиконаних при здачі: ${r.err}</span><span>· час ${hm(r.T)} (норма ${hm(r.norm)})</span>${r.timePen?`<span>· штраф за час −${r.timePen}</span>`:""}${r.mult<1?`<span>· повторна здача ×0,8</span>`:""}${r.tooFast?`<span>· ⚠ занадто швидко</span>`:""}`;
  $("#kSubmit").hidden=true;$("#kAgain").hidden=false;
  $("#kRedo").hidden=!(S.sub<2&&r.n<r.tot);
}
function line(name,cls){
  const st=set(),r=S.res||compute();
  const tasks=st.tasks.map((t,i)=>"С"+(i+1)+":"+(S.done[i]?"0":"н")).join(",");
  return["v1",st.cls||C.cls||"—",C.title+" · "+st.name,clean(cls),clean(name),ls.get("env-att-"+C.id+"-"+setKey,1),"середовище",r.grade,r.n+" з "+r.tot,Math.round(100*r.n/r.tot),r.err||0,hm(r.T),hm(r.norm),r.tooFast?"занадто швидко":"",S.res?"завершено":"не завершено",tasks].join("|");
}
function chooseSet(k,reset){
  setKey=k;ls.set("env-last-"+C.id,k);
  try{const M={t:C.title,p:location.pathname,s:{}};Object.entries(C.sets).forEach(([sk,v])=>M.s[sk]={n:v.name,c:v.cls||C.cls,tot:v.tasks.length});ls.set("env-meta-"+C.id,M);
    const u=location.pathname+"?set="+k,h=ls.get("ui-hist",[]).filter(x=>x.u!==u);h.unshift({u,t:C.title+" · "+C.sets[k].name,ts:Date.now()});ls.set("ui-hist",h.slice(0,40))}catch(e){}
  S=reset?fresh():ls.get("env-"+C.id+"-"+k,null)||fresh();
  if(reset){save()}
  const sel=$("#kSet");if(sel)sel.value=k;
  C.onSet&&C.onSet(k,!!reset||!ls.get("env-"+C.id+"-"+k+"-started",false));
  ls.set("env-"+C.id+"-"+k+"-started",true);
  renderSide();
}
function build(){
  const top=document.createElement("header");top.className="k-top";
  const opts=Object.entries(C.sets).map(([k,s])=>`<option value="${k}">${esc(s.name)}</option>`).join("");
  top.innerHTML=`<a class="home" href="/seredovyshcha/">← Середовища</a><h1>${esc(C.title)}</h1><span class="sub">${esc(C.sub||"")}</span><span class="sp"></span><label class="sub">Завдання: <select id="kSet">${opts}</select></label><span class="k-timer" id="kTimer">⏱ 00:00</span>`;
  const main=document.getElementById("app");main.classList.add("k-main");
  const wrap=document.createElement("div");wrap.className="k-wrap";
  main.parentNode.insertBefore(wrap,main);wrap.append(main);
  const side=document.createElement("aside");side.className="k-side";
  side.innerHTML=`<h2>Завдання <span><span id="kCount" class="sub"></span> <button class="k-toggle" id="kTog" type="button">згорнути</button></span></h2><div class="k-prog"><i id="kProg"></i></div><div class="story" id="kStory"></div><ul class="k-tasks" id="kTasks"></ul>
<div class="k-act"><button class="btn" id="kSubmit" type="button">Здати роботу й отримати оцінку</button><button class="btn ghost" id="kRedo" type="button" hidden>Доробити й здати ще раз (×0,8)</button><button class="btn ghost" id="kAgain" type="button">↺ Почати цей набір заново</button></div>
<div class="k-res" id="kRes"><div class="row" style="align-items:baseline;gap:10px"><span class="big" id="kGrade">—</span><span>з 12</span></div><div class="row" id="kInfo"></div>
<input id="kName" placeholder="Прізвище та ім'я" autocomplete="name"><input id="kCls" placeholder="Клас, напр. 8-Б"><a class="btn send" id="kSend" href="#" target="_blank" rel="noopener" style="text-align:center;text-decoration:none">📤 Надіслати вчителю</a><div class="msg" id="kMsg"></div></div>`;
  wrap.append(side);document.body.insertBefore(top,wrap);
  const bar=document.createElement("div");bar.id="kDone";bar.className="k-done";bar.innerHTML='<span>🎉 Усі завдання виконано!</span><button class="btn" type="button">Здати роботу й отримати оцінку</button>';document.body.append(bar);
  bar.querySelector("button").onclick=()=>{side.classList.remove("min");const tg=$("#kTog");if(tg)tg.textContent="згорнути";submit();bar.classList.remove("on")};
  $("#kSet").onchange=e=>chooseSet(e.target.value,false);
  $("#kSubmit").onclick=submit;
  $("#kRedo").onclick=()=>{S.res=null;S.tEnd=0;save();renderRes();refresh();toast("Доробляй завдання й здавай ще раз")};
  $("#kAgain").onclick=()=>{if(!confirm("Почати цей набір завдань заново? Поточна робота зникне."))return;ls.set("env-att-"+C.id+"-"+setKey,ls.get("env-att-"+C.id+"-"+setKey,1)+1);chooseSet(setKey,true)};
  $("#kTog").onclick=()=>{side.classList.toggle("min");$("#kTog").textContent=side.classList.contains("min")?"розгорнути":"згорнути"};
  $("#kSend").onclick=e=>{const n=$("#kName").value.trim(),c=$("#kCls").value.trim(),m=$("#kMsg");
    if(!S.res){e.preventDefault();m.textContent="Спершу натисни «Здати роботу»";return}
    if(!n||!c){e.preventDefault();m.textContent="Впиши прізвище, ім'я та клас";(n?$("#kCls"):$("#kName")).focus();return}
    ls.set("env-who",{n,c});m.textContent="";e.currentTarget.href=FORM+encodeURIComponent(line(n,c));};
  const who=ls.get("env-who",null);if(who){$("#kName").value=who.n;$("#kCls").value=who.c}
  main.addEventListener("pointerdown",touch,true);main.addEventListener("keydown",touch,true);
  timerI=setInterval(tick,1000);
}
window.KIT={
  start(cfg){C=cfg;build();const keys=Object.keys(C.sets);const q=new URLSearchParams(location.search).get("set");
    const k=(q&&C.sets[q])?q:(ls.get("env-last-"+C.id,keys[0]));chooseSet(C.sets[k]?k:keys[0],false);
    setInterval(refresh,1500);},
  refresh,touch,toast,esc,ls,
  get set(){return setKey},
  load(def){return ls.get("env-data-"+C.id+"-"+setKey,def)},
  store(v){ls.set("env-data-"+C.id+"-"+setKey,v)},
  frozen(){return !!(S&&S.res)}
};
})();
