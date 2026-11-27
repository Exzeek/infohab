/* Живий урок: учні приєднуються за 5-значним кодом, учитель бачить прогрес на /pult/.
   Firebase Realtime Database через REST (без SDK), анонімний вхід. */
(function(){
if(window.LIVE)return;
var KEY="AIzaSyCorRSiv8wEi9JKJ-Yh36Mg3enDv-DuKK8",DB="https://urokinfo-fb77b-default-rtdb.europe-west1.firebasedatabase.app/";
function ls(k,v){try{if(v===undefined)return JSON.parse(localStorage.getItem(k)||"null");if(v===null)localStorage.removeItem(k);else localStorage.setItem(k,JSON.stringify(v))}catch(e){return null}}
var pending=null;
function token(){
  var a=ls("fb-auth");
  if(a&&a.exp>Date.now()+60000)return Promise.resolve(a);
  if(pending)return pending;
  var p=a&&a.rt?
    fetch("https://securetoken.googleapis.com/v1/token?key="+KEY,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:"grant_type=refresh_token&refresh_token="+encodeURIComponent(a.rt)})
      .then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(j){return{t:j.id_token,rt:j.refresh_token,uid:j.user_id,exp:Date.now()+(+j.expires_in)*1000}})
      .catch(function(){ls("fb-auth",null);return signup()})
    :signup();
  pending=p.then(function(x){ls("fb-auth",x);pending=null;return x},function(e){pending=null;throw e});
  return pending;
}
function signup(){return fetch("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key="+KEY,{method:"POST",headers:{"Content-Type":"application/json"},body:'{"returnSecureToken":true}'})
  .then(function(r){if(!r.ok)throw new Error("auth "+r.status);return r.json()}).then(function(j){return{t:j.idToken,rt:j.refreshToken,uid:j.localId,exp:Date.now()+(+j.expiresIn)*1000}})}
function api(path,method,body){return token().then(function(a){
  return fetch(DB+path+".json?auth="+a.t,{method:method||"GET",body:body===undefined?undefined:JSON.stringify(body)}).then(function(r){
    if(!r.ok){var e=new Error("db "+r.status);e.status=r.status;throw e}return r.json()})})}
function stream(path,cb){var es=null,stop=false;
  function open(){token().then(function(a){if(stop)return;es=new EventSource(DB+path+".json?auth="+a.t);
    var h=function(ev){try{var d=JSON.parse(ev.data);cb(ev.type,d.path,d.data)}catch(e){}};
    es.addEventListener("put",h);es.addEventListener("patch",h);
    es.addEventListener("auth_revoked",function(){es.close();ls("fb-auth",Object.assign(ls("fb-auth")||{},{exp:0}));open()});
    es.addEventListener("cancel",function(){cb("cancel")});
    es.onerror=function(){};})}
  open();return{close:function(){stop=true;if(es)es.close()}}}
/* ---------- учень ---------- */
var last="",lastT=0,timer=null,extra={};
function me(){return ls("live")}
function page(){var t=document.title.split(" — ")[0].split(" | ")[0];return t.slice(0,80)}
function norm(u){try{var x=new URL(u,location.origin);return x.pathname.replace(/\/?$/,"/")+x.search}catch(e){return u}}
function taskIdx(m){var T=(m&&m.tasks)||[],here=norm(location.href),hp=location.pathname.replace(/\/?$/,"/"),i;
  for(i=0;i<T.length;i++)if(T[i].url&&norm(T[i].url)===here)return i;
  for(i=0;i<T.length;i++)if(T[i].url&&norm(T[i].url).split("?")[0]===hp&&!/\?/.test(norm(T[i].url)))return i;return -1}
var META=null,TI=-1;
function send(force){var L=me();if(!L)return;
  var d=Object.assign({n:L.name,pg:page(),u:location.pathname+location.search},extra);
  if(TI>=0){d["r/"+TI]={v:1,d:extra.d==null?null:extra.d,t:extra.t==null?null:extra.t,g:extra.g==null?null:extra.g,e:extra.e==null?null:extra.e,x:extra.x||null};d.ti=TI}else d.ti=-1;
  var sig=JSON.stringify(d);if(!force&&sig===last&&Date.now()-lastT<45000)return;last=sig;lastT=Date.now();
  d.ts={".sv":"timestamp"};
  token().then(function(a){return api("s/"+L.code+"/st/"+a.uid,"PATCH",d)}).catch(function(e){if(e.status===401||e.status===403){badge("⛔ Урок завершено")}});
}
function report(o){if(!me())return;extra=Object.assign(extra,o||{});clearTimeout(timer);timer=setTimeout(send,800)}
function join(code,name){code=String(code).replace(/\D/g,"");name=String(name||"").trim().slice(0,40);
  if(!/^\d{5}$/.test(code))return Promise.reject(new Error("Код уроку — 5 цифр"));
  if(name.length<2)return Promise.reject(new Error("Впиши ім'я й першу літеру прізвища"));
  return api("s/"+code+"/meta").then(function(m){
    if(!m)throw new Error("Урок "+code+" не знайдено. Перевір код.");
    if(!m.open)throw new Error("Учитель закрив вхід на цей урок.");
    ls("live",{code:code,name:name,at:Date.now()});return token().then(function(a){
      return api("s/"+code+"/st/"+a.uid,"PUT",{n:name,pg:page(),u:location.pathname,ts:{".sv":"timestamp"},j:{".sv":"timestamp"}})}).then(function(){return m})});
}
function leave(){var L=me();ls("live",null);var b=document.getElementById("liveB");if(b)b.remove();
  if(L)token().then(function(a){return api("s/"+L.code+"/st/"+a.uid+"/off","PUT",true)}).catch(function(){})}
function meta(code){return api("s/"+code+"/meta")}
function badge(txt){var L=me();if(!L||/^\/(pult|klas)\//.test(location.pathname))return;
  var b=document.getElementById("liveB");if(!b){b=document.createElement("div");b.id="liveB";
    b.style.cssText="position:fixed;right:12px;top:auto;bottom:64px;z-index:9997;display:flex;gap:6px;align-items:center;background:#2b8a3e;color:#fff;border-radius:999px;padding:6px 6px 6px 12px;font:800 13px Nunito,system-ui,sans-serif;box-shadow:0 2px 10px #0003;max-width:calc(100vw - 24px)";
    document.body.appendChild(b)}
  b.innerHTML='<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap"></span><a href="#" style="color:#fff;background:#ffffff33;border-radius:999px;padding:2px 8px;text-decoration:none">вийти</a>';
  b.firstChild.textContent=txt||("🟢 Урок "+L.code+" · "+L.name);
  b.querySelector("a").onclick=function(e){e.preventDefault();if(confirm("Вийти з уроку "+L.code+"?"))leave()};
}
var cur0=null;
function nextLink(){var T=(META&&META.tasks)||[];if(!T.length)return null;var n=TI+1;
  if(TI>=0&&n<T.length&&T[n].url)return{href:T[n].url,txt:"Далі: "+(n+1)+"/"+T.length+" →"};return{href:"/klas/",txt:"📋 Завдання уроку"}}
function drawBadge(){var L=me();if(!L)return;var T=(META&&META.tasks)||[];
  badge(TI>=0?"🟢 "+L.name+" · завдання "+(TI+1)+"/"+T.length:"🟢 Урок "+L.code+" · "+L.name);
  var b=document.getElementById("liveB"),nl=nextLink();if(b&&nl){var a=document.createElement("a");a.href=nl.href;a.textContent=nl.txt;a.style.cssText="color:#2b8a3e;background:#fff;border-radius:999px;padding:2px 10px;text-decoration:none;white-space:nowrap";b.insertBefore(a,b.lastChild)}}
function watchTask(first){var L=me();if(!L||/^\/(pult|klas)\//.test(location.pathname))return;
  meta(L.code).then(function(m){if(!m){META=null;badge("⛔ Урок завершено");return}
    var was=TI;META=m;TI=taskIdx(m);if(first||was!==TI){drawBadge();if(TI!==was)send(true)}
    var T=m.tasks||[],c=typeof m.cur==="number"?m.cur:-1;
    if(cur0===null){cur0=c;return}
    if(c!==cur0){cur0=c;if(c>=0&&T[c]&&T[c].url&&c!==TI){location.href=T[c].url}}
  }).catch(function(){})}
/* ---------- сторінки уроків: читаємо рядок «Надіслати вчителю» ---------- */
function parseRow(r){var f=String(r).split("|");if(f[0]!=="v1"||f.length<15)return null;
  var x=(f[15]||"").trim(),items=x&&x!=="—"?x.split(","):[],d=0;
  items.forEach(function(it){var v=(it.split(":")[1]||"");if(!/н/.test(v))d++});
  var fin=/^завершено/.test(f[14]||""),g=parseInt(f[7],10);
  return{d:items.length?d:null,t:items.length||null,e:parseInt(f[10],10)||0,g:fin&&g>0?g:null,x:x.slice(0,600)}}
var rowFn=null,rowTried=0;
function findRowFn(){if(typeof window.__urow==="function")return window.__urow;var c=[];for(var k in window){try{var f=window[k];if(typeof f==="function"&&f.length<=3&&!/^on|^__/.test(k)){var src=Function.prototype.toString.call(f);if(src.indexOf('"v1"')>-1&&/join\(["']\|["']\)/.test(src))c.push(f)}}catch(e){}}
  for(var i=0;i<c.length;i++){try{var r=c[i]("·","·");if(typeof r==="string"&&r.indexOf("v1|")===0)return c[i]}catch(e){}}return null}
function lessonTick(){if(!rowFn&&rowTried<3){rowTried++;rowFn=findRowFn()}if(!rowFn)return;
  try{var o=parseRow(rowFn("·","·"));if(o)report(o)}catch(e){}}
function hookLesson(){if(!/^\/a\//.test(location.pathname))return;
  setInterval(function(){if(me()&&!document.hidden)lessonTick()},4000);setTimeout(lessonTick,1500);
  document.addEventListener("click",function(e){var a=e.target.closest&&e.target.closest('a[href*="entry.1997531456"]');if(!a||!me())return;
    setTimeout(function(){try{var u=new URL(a.href);var o=parseRow(u.searchParams.get("entry.1997531456"));if(o){report(o);send(true)}}catch(x){}},50)},true);
  var wo=window.open;window.open=function(u){try{if(me()&&String(u).indexOf("entry.1997531456")>-1){var o=parseRow(new URL(u,location.href).searchParams.get("entry.1997531456"));if(o){report(o);setTimeout(function(){send(true)},900)}}}catch(x){}return wo.apply(this,arguments)}}
window.LIVE={join:join,leave:leave,report:report,me:me,meta:meta,api:api,stream:stream,token:token,send:send};
if(me()){
  var go=function(){badge();watchTask(true);send(true);hookLesson();setInterval(function(){if(!document.hidden)send()},30000);setInterval(watchTask,20000)};
  document.readyState==="loading"?document.addEventListener("DOMContentLoaded",go):go();
  document.addEventListener("visibilitychange",function(){if(!document.hidden)send(true)});
}
})();
