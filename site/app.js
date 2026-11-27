/* Для сторінок уроків і середовищ (без спільної шапки): кнопка повного екрана + офлайн-кеш */
(function(){
  if(document.querySelector("header.un"))return;
  var has=[].some.call(document.querySelectorAll("button"),function(x){return x.id==="bFull"||/⛶/.test(x.textContent)});
  if(document.fullscreenEnabled&&!has&&!document.getElementById("uFs")){
    var b=document.createElement("button");b.id="uFs";b.type="button";b.textContent="⛶";b.title="Повний екран (Esc — вийти)";b.setAttribute("aria-label","Повний екран");
    b.style.cssText="position:fixed;left:0;top:40%;z-index:9998;width:32px;height:38px;border-radius:0 12px 12px 0;border:1px solid #0002;background:#ffffffd9;color:#1b1e28;font:700 20px/1 system-ui,sans-serif;cursor:pointer;box-shadow:0 2px 8px #0002;opacity:.75";
    b.onmouseenter=function(){b.style.opacity=1};b.onmouseleave=function(){b.style.opacity=.75};
    b.onclick=function(){document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(function(){})};
    document.addEventListener("fullscreenchange",function(){b.textContent=document.fullscreenElement?"✕":"⛶"});
    var st=document.createElement("style");st.textContent="@media print{#uFs{display:none!important}}";document.head.appendChild(st);
    var kt=document.querySelector(".k-top .k-timer");if(kt){b.style.cssText="width:38px;height:34px;border-radius:10px;border:1px solid var(--line,#ddd);background:var(--surface,#fff);color:inherit;font:700 18px/1 system-ui,sans-serif;cursor:pointer;margin-left:6px";kt.after(b)}else(document.body||document.documentElement).appendChild(b);
  }
  window.UFBgo=window.UFBgo||function(t){if(window.UFB)return UFB.open(t);var s=document.createElement("script");s.src="/site/feedback.js";s.onload=function(){UFB.open(t)};document.head.appendChild(s)};
  var fb=document.createElement("button");fb.type="button";fb.textContent="💬";fb.title="Повідомити про помилку або ідею";fb.setAttribute("aria-label","Повідомити про помилку або ідею");fb.onclick=function(){UFBgo("bug")};
  var kt2=document.querySelector(".k-top .k-timer");
  if(kt2){fb.style.cssText="width:38px;height:34px;border-radius:10px;border:1px solid var(--line,#ddd);background:var(--surface,#fff);color:inherit;font:700 17px/1 system-ui,sans-serif;cursor:pointer;margin-left:6px";(document.getElementById("uFs")||kt2).after(fb)}
  else{fb.style.cssText="position:fixed;left:0;top:calc(40% + 44px);z-index:9998;width:32px;height:38px;border-radius:0 12px 12px 0;border:1px solid #0002;background:#ffffffd9;font:700 19px/1 system-ui,sans-serif;cursor:pointer;box-shadow:0 2px 8px #0002;opacity:.75";if(!document.getElementById("uFs"))fb.style.bottom="12px";(document.body||document.documentElement).appendChild(fb)}
  if("serviceWorker" in navigator&&(location.protocol==="https:"||location.hostname==="localhost"))addEventListener("load",function(){navigator.serviceWorker.register("/sw.js").catch(function(){})});
})();

(function(){if(window.LIVE||document.getElementById("liveJs"))return;var s=document.createElement("script");s.id="liveJs";s.src="/site/live.js";s.defer=true;document.head.appendChild(s)})();

(function(){var h=location.hostname;if(window.__ugd||location.protocol==="file:"||/(^|\.)urokinfo\.com\.ua$|github\.io$|^localhost$|^127\./.test(h))return;window.__ugd=1;var f=function(){if(document.getElementById("ugd"))return;var b=document.createElement("a");b.id="ugd";b.href="https://urokinfo.com.ua"+location.pathname;b.textContent="Цей матеріал скопійовано з urokinfo.com.ua без дозволу — відкрити оригінал →";b.style.cssText="position:fixed;left:0;right:0;top:0;z-index:2147483647;background:#e03131;color:#fff;font:800 15px system-ui,sans-serif;padding:10px;text-align:center;text-decoration:none";document.body.appendChild(b)};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",f):f()})();

(function(){function load(){if(document.getElementById("spkJs")){window.USPEAK&&USPEAK.enable();return}var s=document.createElement("script");s.id="spkJs";s.src="/site/speak.js";s.onload=function(){window.USPEAK&&USPEAK.enable()};document.head.appendChild(s)}
window.USPEAK_LOAD=load;
function chk(){try{var L=[].slice.call(document.querySelectorAll('script[type="application/ld+json"]')).map(function(x){try{return JSON.parse(x.textContent)}catch(e){return{}}});
  for(var i=0;i<L.length;i++){var lv=L[i].educationalLevel;if(lv&&lv.length&&lv.every(function(v){return/^[234] клас/.test(v)})){load();return}}}catch(e){}}
document.readyState==="loading"?document.addEventListener("DOMContentLoaded",chk):chk()})();
