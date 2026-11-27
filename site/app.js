/* Для сторінок уроків і середовищ (без спільної шапки): кнопка повного екрана + офлайн-кеш */
(function(){
  if(document.querySelector("header.un"))return;
  var has=[].some.call(document.querySelectorAll("button"),function(x){return x.id==="bFull"||/⛶/.test(x.textContent)});
  if(document.fullscreenEnabled&&!has&&!document.getElementById("uFs")){
    var b=document.createElement("button");b.id="uFs";b.type="button";b.textContent="⛶";b.title="Повний екран (Esc — вийти)";b.setAttribute("aria-label","Повний екран");
    b.style.cssText="position:fixed;left:12px;bottom:12px;z-index:9998;width:42px;height:42px;border-radius:50%;border:1px solid #0002;background:#ffffffd9;color:#1b1e28;font:700 20px/1 system-ui,sans-serif;cursor:pointer;box-shadow:0 2px 8px #0002;opacity:.75";
    b.onmouseenter=function(){b.style.opacity=1};b.onmouseleave=function(){b.style.opacity=.75};
    b.onclick=function(){document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(function(){})};
    document.addEventListener("fullscreenchange",function(){b.textContent=document.fullscreenElement?"✕":"⛶"});
    var st=document.createElement("style");st.textContent="@media print{#uFs{display:none!important}}";document.head.appendChild(st);
    (document.body||document.documentElement).appendChild(b);
  }
  if("serviceWorker" in navigator&&(location.protocol==="https:"||location.hostname==="localhost"))addEventListener("load",function(){navigator.serviceWorker.register("/sw.js").catch(function(){})});
})();
