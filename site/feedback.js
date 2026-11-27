/* Форма «Повідомити про помилку / ідею». Лист надходить на пошту автора через Web3Forms — адреса пошти на сайті не показується.
   Ключ доступу Web3Forms публічний за задумом (за ним видно лише форму, не пошту). */
(function(){
var KEY=window.UFB_KEY||"";/* ← ключ доступу Web3Forms */
if(window.UFB)return;
function el(t,c,h){var e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e}
var css=el("style",null,'.ufb-w{position:fixed;inset:0;background:#0009;z-index:9999;display:grid;place-items:center;padding:12px;font:15px/1.45 Nunito,system-ui,sans-serif}'+
'.ufb{background:#fff;color:#1b1e28;border-radius:18px;padding:18px;width:min(520px,100%);max-height:94vh;overflow:auto;box-shadow:0 20px 60px #0006}'+
'.ufb h3{margin:0 0 4px;font:800 19px Unbounded,Nunito,sans-serif}.ufb p{margin:0 0 10px;color:#5c6375;font-size:14px}'+
'.ufb .ty{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px}.ufb .ty label{border:2px solid #e3e6ee;border-radius:12px;padding:7px 12px;cursor:pointer;font-weight:800}'+
'.ufb .ty input{position:absolute;opacity:0}.ufb .ty label:has(input:checked){border-color:#c2255c;background:#fff0f6}'+
'.ufb textarea,.ufb input[type=text]{width:100%;box-sizing:border-box;font:15px Nunito,system-ui,sans-serif;border:1px solid #d6d9e3;border-radius:10px;padding:9px;margin:4px 0 8px;background:#fff;color:#1b1e28}'+
'.ufb textarea{min-height:110px;resize:vertical}.ufb small{color:#868e96;display:block;margin-bottom:8px}'+
'.ufb .row{display:flex;gap:8px;justify-content:flex-end;margin-top:6px}.ufb button{border:0;border-radius:12px;padding:10px 16px;font:800 15px Nunito,sans-serif;cursor:pointer}'+
'.ufb .go{background:#c2255c;color:#fff}.ufb .no{background:#f1f3f5;color:#1b1e28}.ufb .msg{font-weight:800;margin-top:8px}.ufb .msg.ok{color:#2b8a3e}.ufb .msg.bad{color:#e03131}'+
'@media (prefers-color-scheme:dark){.ufb{background:#1b1e28;color:#eef0f5}.ufb textarea,.ufb input[type=text]{background:#12141b;color:#eef0f5;border-color:#2c3040}.ufb .ty label{border-color:#2c3040}.ufb .ty label:has(input:checked){background:#3a1a2a}.ufb .no{background:#2c3040;color:#eef0f5}}');
function ctx(){var c={};try{var K=window.KIT;var s=document.querySelector("#kSet");if(s)c.set=s.options[s.selectedIndex].text;var k=document.querySelector("#kCount");if(k)c.progress=k.textContent}catch(e){}return c}
function open(type){if(document.querySelector(".ufb-w"))return;if(!document.getElementById("ufbcss"))(css.id="ufbcss",document.head.appendChild(css));
 var w=el("div","ufb-w"),f=el("form","ufb");w.appendChild(f);
 f.innerHTML='<h3>Напишіть нам</h3><p>Знайшли помилку, маєте ідею чи побажання? Повідомлення прочитає автор сайту.</p>'+
 '<div class="ty"><label><input type="radio" name="t" value="Помилка" '+(type!=="idea"?"checked":"")+'>🐞 Помилка</label><label><input type="radio" name="t" value="Ідея" '+(type==="idea"?"checked":"")+'>💡 Ідея</label><label><input type="radio" name="t" value="Інше">💬 Інше</label></div>'+
 '<label>Що сталося або що запропонуєте?<textarea name="m" required minlength="5" placeholder="Напр.: на телефоні не видно кнопки «Здати роботу» після 4-го завдання"></textarea></label>'+
 '<label>Хто ви (необов\'язково)<input type="text" name="n" maxlength="60" placeholder="Ім\'я, клас або «вчитель»"></label>'+
 '<label>Куди відповісти (необов\'язково)<input type="text" name="c" maxlength="80" placeholder="Пошта або Telegram"></label>'+
 '<small>Разом із повідомленням надішлеться адреса цієї сторінки й розмір екрана — так легше знайти помилку.</small>'+
 '<input type="checkbox" name="botcheck" style="display:none" tabindex="-1" autocomplete="off">'+
 '<div class="row"><button type="button" class="no">Скасувати</button><button type="submit" class="go">Надіслати</button></div><div class="msg" role="status"></div>';
 document.body.appendChild(w);f.m.focus();
 var close=function(){w.remove()};f.querySelector(".no").onclick=close;w.onclick=function(e){if(e.target===w)close()};
 document.addEventListener("keydown",function k(e){if(e.key==="Escape"){close();document.removeEventListener("keydown",k)}});
 f.onsubmit=function(e){e.preventDefault();var M=f.querySelector(".msg");if(f.botcheck.checked)return;
  var txt=f.m.value.trim();if(txt.length<5){M.className="msg bad";M.textContent="Опишіть трохи детальніше";return}
  var last=+(localStorage.getItem("ufb-last")||0);if(Date.now()-last<30000){M.className="msg bad";M.textContent="Зачекайте пів хвилини перед наступним повідомленням";return}
  if(!KEY){M.className="msg bad";M.textContent="Форма ще налаштовується. Спробуйте трохи пізніше.";return}
  var t=f.querySelector("input[name=t]:checked").value,c=ctx(),b=f.querySelector(".go");b.disabled=true;b.textContent="Надсилаю…";
  var data={access_key:KEY,subject:"urokinfo · "+t+" · "+(document.title||location.pathname).slice(0,60),from_name:"urokinfo.com.ua",
   "Тип":t,"Повідомлення":txt,"Від":f.n.value.trim()||"—","Контакт":f.c.value.trim()||"—","Сторінка":location.href,"Назва сторінки":document.title,
   "Завдання":c.set||"—","Прогрес":c.progress||"—","Екран":innerWidth+"×"+innerHeight+(matchMedia("(pointer:coarse)").matches?" (сенсорний)":""),"Браузер":navigator.userAgent.slice(0,160),"Час":new Date().toLocaleString("uk-UA")};
  fetch("https://api.web3forms.com/submit",{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(data)})
   .then(function(r){return r.json()}).then(function(j){if(!j.success)throw 0;localStorage.setItem("ufb-last",Date.now());M.className="msg ok";M.textContent="Дякуємо! Повідомлення надіслано 💌";setTimeout(close,1800)})
   .catch(function(){b.disabled=false;b.textContent="Надіслати";M.className="msg bad";M.textContent="Не вдалося надіслати. Перевірте інтернет і спробуйте ще раз."})}}
window.UFB={open:open};
})();
