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
function send(force){var L=me();if(!L)return;
  var d=Object.assign({n:L.name,pg:page(),u:location.pathname+location.search},extra);
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
var task0=null;
function watchTask(){var L=me();if(!L||/^\/(pult|klas)\//.test(location.pathname))return;
  meta(L.code).then(function(m){if(!m){badge("⛔ Урок завершено");return}
    var t=m.task&&m.task.url;if(task0===null){task0=t||"";return}
    if(t&&t!==task0){task0=t;var b=document.getElementById("liveB");if(b){b.firstChild.innerHTML="";var a=document.createElement("a");a.href=t;a.style.cssText="color:#fff";a.textContent="📌 Нове завдання: "+m.task.title+" →";b.firstChild.appendChild(a)}}
  }).catch(function(){})}
window.LIVE={join:join,leave:leave,report:report,me:me,meta:meta,api:api,stream:stream,token:token,send:send};
if(me()){
  var go=function(){badge();send(true);watchTask();setInterval(function(){if(!document.hidden)send()},30000);setInterval(watchTask,20000)};
  document.readyState==="loading"?document.addEventListener("DOMContentLoaded",go):go();
  document.addEventListener("visibilitychange",function(){if(!document.hidden)send(true)});
}
})();
