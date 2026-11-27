/* 🔊 Прочитати вголос: натисни кнопку, потім торкнись тексту — браузер прочитає його українською. */
(function(){
if(window.USPEAK||!("speechSynthesis" in window))return;
var on=false,btn,voice=null,cur=null;
function pick(){var v=speechSynthesis.getVoices();voice=v.find(function(x){return/^uk/i.test(x.lang)})||null}
pick();speechSynthesis.onvoiceschanged=pick;
function txt(el){var t=(el.innerText||el.textContent||"").replace(/\s+/g," ").trim();return t.slice(0,600)}
function target(e){var el=e.target;if(!el||el===btn||btn.contains(el))return null;
  var b=el.closest("button,label,li,p,h1,h2,h3,h4,td,th,figcaption,.q,.task,.k-task,[class*=quest],[class*=prompt],div");
  while(b&&b.parentElement&&txt(b).length<3)b=b.parentElement;
  if(b&&txt(b).length>600){var s=el.closest("p,li,span,b,label");if(s)b=s}return b}
function say(t,el){speechSynthesis.cancel();if(!t)return;var u=new SpeechSynthesisUtterance(t);u.lang="uk-UA";if(voice)u.voice=voice;u.rate=.92;
  if(cur)cur.style.outline="";cur=el;if(el){el.style.outline="3px solid #ffb020";el.style.outlineOffset="2px"}
  u.onend=u.onerror=function(){if(cur)cur.style.outline="";cur=null};speechSynthesis.speak(u)}
function setOn(v){on=v;btn.setAttribute("aria-pressed",v);btn.innerHTML=v?"👆 Торкнись тексту":"🔊 Прочитати";document.documentElement.style.cursor=v?"help":""}
function make(){btn=document.createElement("button");btn.type="button";btn.id="uSpeak";
  btn.style.cssText="position:fixed;left:12px;bottom:12px;z-index:9996;border:0;border-radius:999px;padding:10px 16px;font:800 16px Nunito,system-ui,sans-serif;background:#1864ab;color:#fff;box-shadow:0 3px 12px #0004;cursor:pointer";
  btn.title="Натисни, а потім торкнись тексту — він прочитається вголос";setOn(false);
  btn.onclick=function(e){e.stopPropagation();if(speechSynthesis.speaking){speechSynthesis.cancel()}
    if(!voice&&!btn._warned){btn._warned=1;try{alert("На цьому пристрої може не бути українського голосу. Якщо читання звучить дивно — попроси вчителя ввімкнути український голос у налаштуваннях системи.")}catch(x){}}
    setOn(!on)};
  document.body.appendChild(btn);
  document.addEventListener("click",function(e){if(!on)return;var el=target(e);if(!el)return;e.preventDefault();e.stopPropagation();setOn(false);say(txt(el),el)},true)}
window.USPEAK={say:say,enable:function(){if(!btn)(document.body?make():document.addEventListener("DOMContentLoaded",make))}};
})();
