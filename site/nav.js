/* Спільна шапка urokinfo: меню + поле коду. Підключення: <script src="/site/nav.js" defer></script> */
(function(){
  var P=location.pathname,css=document.createElement("style");
  css.textContent='.un{display:block;gap:0;position:sticky;top:0;z-index:50;background:color-mix(in srgb,var(--un-bg,#fff) 92%,transparent);backdrop-filter:blur(8px);border-bottom:1px solid var(--un-line,#e3e6ee);font:600 15px/1.2 Nunito,system-ui,sans-serif}'+
  '.un>div{max-width:1200px;margin:0 auto;padding:8px 14px;display:flex;align-items:center;gap:6px}'+
  '.un .b{font:800 15px Unbounded,Nunito,system-ui,sans-serif;color:var(--un-ink,#1b1e28);text-decoration:none;margin-right:8px;white-space:nowrap}.un .b span{color:#c2255c}'+
  '.un nav{display:flex;gap:2px;overflow-x:auto;scrollbar-width:none;flex:1;min-width:0}.un nav::-webkit-scrollbar{display:none}'+
  '.un nav a{padding:8px 11px;border-radius:999px;color:var(--un-mut,#5c6375);text-decoration:none;white-space:nowrap}.un nav a:hover{color:var(--un-ink,#1b1e28);background:var(--un-hov,#eef0f6)}'+
  '.un nav a[aria-current]{color:var(--un-ink,#1b1e28);background:var(--un-hov,#eef0f6);font-weight:800}'+
  '.un form{display:flex;gap:0;flex:none;position:relative}.un input{width:74px;padding:7px 9px;border:1px solid var(--un-line,#d6d9e3);border-right:0;border-radius:10px 0 0 10px;font:700 15px ui-monospace,Menlo,monospace;background:var(--un-bg,#fff);color:var(--un-ink,#1b1e28)}'+
  '.un button{border:1px solid #c2255c;background:#c2255c;color:#fff;border-radius:0 10px 10px 0;padding:7px 10px;font:800 14px Nunito,system-ui,sans-serif;cursor:pointer}'+
  '.un .m{position:absolute;right:0;top:110%;background:#1b1e28;color:#fff;font-size:13px;padding:6px 10px;border-radius:8px;white-space:nowrap;display:none}.un .m.on{display:block}'+
  '@media (prefers-color-scheme:dark){.un{--un-bg:#14161e;--un-ink:#eef0f5;--un-mut:#a3a9b8;--un-line:#2c3040;--un-hov:#232634}.un .b span{color:#f06595}}'+
  '.un .un-s{display:none}@media (max-width:560px){.un .b{display:none}.un input{width:56px}.un>div{padding:8px 8px;gap:4px}.un nav a{padding:8px 6px;font-size:14px}.un input{width:48px;padding:7px 6px}.un button{display:none}.un input{border-right:1px solid var(--un-line,#d6d9e3);border-radius:10px;width:54px}.un .un-f{display:none}.un .un-s{display:inline}}';
  document.head.appendChild(css);
  var L=[["/","Уроки","Уроки",/^\/($|\d+-klas|10-11-klas|matematyka|chytannia)/],["/vse/","Інтерактиви","Інтерактиви",/^\/(vse|seredovyshcha)\//],["/vchyteliu/","Для вчителя","Вчителю",/^\/(vchyteliu|kody|konstruktor)\//],["/progres/","Мій прогрес","Прогрес",/^\/progres\//]];
  var h=document.createElement("header");h.className="un";
  h.innerHTML='<div><a class="b" href="/">urok<span>info</span></a><nav aria-label="Головне меню">'+L.map(function(x){return '<a href="'+x[0]+'"'+(x[3].test(P)?' aria-current="page"':'')+'><span class="un-f">'+x[1]+'</span><span class="un-s">'+x[2]+'</span></a>'}).join("")+
   '</nav><form role="search" aria-label="Перейти за кодом"><input inputmode="numeric" enterkeyhint="go" maxlength="5" placeholder="код" aria-label="Код уроку чи гри"><button type="submit">→</button><span class="m" role="status"></span></form></div>';
  document.body.insertBefore(h,document.body.firstChild);
  var f=h.querySelector("form"),i=h.querySelector("input"),m=h.querySelector(".m"),C=null;
  function say(t){m.textContent=t;m.classList.add("on");setTimeout(function(){m.classList.remove("on")},2500)}
  f.onsubmit=function(e){e.preventDefault();var c=i.value.replace(/\D/g,"");if(c.length<3){say("Введи 3–4 цифри");return}
    var go=function(){if(C[c])location.href=C[c];else say("Код "+c+" не знайдено")};
    if(C)go();else fetch("/site/codes.json").then(function(r){return r.json()}).then(function(j){C=j;go()}).catch(function(){location.href="/"+c+"/"})};
})();
