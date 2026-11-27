/* Інфо-битва: збирає табло з обраних категорій (#c=id,id,…) і запускає гру */
(function(){
  var h=location.hash.replace(/^#/,""),P={};h.split("&").forEach(function(x){var i=x.indexOf("=");if(i>0)P[x.slice(0,i)]=decodeURIComponent(x.slice(i+1))});
  var ids=(P.c||"").split(",").filter(Boolean);
  function fail(t){document.getElementById("main").innerHTML='<div class="splash"><div class="spic">🧩</div><h2>'+t+'</h2><p class="sptx"><a class="btn" href="/infobytva/" style="text-decoration:none">Обрати категорії</a></p></div>'}
  if(ids.length<2){fail("Оберіть від 2 до 6 категорій");return}
  var R=function(n){return Math.random()*n|0};
  var shuf=function(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=R(i+1),t=a[i];a[i]=a[j];a[j]=t}return a};
  fetch("/site/ib-bank.json").then(function(r){return r.json()}).then(function(B){
    var BY={};B.cats.forEach(function(c){BY[c.id]=c});
    var sel=ids.map(function(i){return BY[i]}).filter(Boolean).slice(0,6);
    if(sel.length<2){fail("Категорії не знайдено — оберіть знову");return}
    var FIN=[];
    var CATS=sel.map(function(c){
      var cl=c.k+" клас";
      if(c.src==="ib"){c.slots.forEach(function(sl){sl.forEach(function(q){if(q.t==="open")FIN.push({q:q.q,ans:q.ans,why:q.why||""})})});return {n:c.n,ic:c.ic,cl:cl,qs:c.slots}}
      var used={},want=[1,1,2,2,3];
      var qs=want.map(function(w){var pool=c.qs.map(function(q,i){return {q:q,i:i,d:Math.abs((q.l||1)-w)}}).filter(function(x){return !used[x.i]});
        var cand=shuf(pool).sort(function(a,b){return a.d-b.d}).slice(0,3);
        cand.forEach(function(x){used[x.i]=1});
        return cand.map(function(x){return {t:"mc",q:x.q.q,o:x.q.o,a:0,why:"Правильна відповідь: "+x.q.o[0]}})});
      c.qs.forEach(function(q){if((q.l||1)>=2&&q.o[0].length<=40&&!/З'єднай/.test(q.q))FIN.push({q:q.q,ans:q.o[0],why:""})});
      return {n:c.n,ic:c.ic,cl:cl,qs:qs}});
    FIN=shuf(FIN).slice(0,5);if(!FIN.length)FIN=[{q:"Назвіть три правила безпечної роботи в інтернеті.",ans:"Відповіді команд оцінює вчитель",why:""}];
    var KEY="ib-"+ids.join(".");try{var sv=JSON.parse(localStorage.getItem(KEY+"-cats")||"null");if(sv&&sv.c&&sv.c.length===CATS.length){CATS=sv.c;FIN=sv.f}else localStorage.setItem(KEY+"-cats",JSON.stringify({c:CATS,f:FIN}))}catch(e){}
    window.IB_CATS=CATS;window.IB_FIN=FIN;window.IB_PIC=B.pics||{};window.IB_KEY=KEY;
    var st=document.createElement("style");st.textContent="main .board{grid-template-columns:repeat("+CATS.length+",minmax(0,1fr))!important}@media (max-width:700px){main .board{grid-template-columns:repeat("+Math.min(3,CATS.length)+",minmax(0,1fr))!important}}";document.head.appendChild(st);
    var ks={};sel.forEach(function(c){ks[c.k]=1});
    document.getElementById("ibT").innerHTML='Інфо-битва · '+Object.keys(ks).join(", ")+' клас <a href="/infobytva/#c='+ids.join(",")+'" style="color:inherit;font-size:.6em;opacity:.7;margin-left:8px" title="Змінити категорії">⚙ змінити</a>';
    document.getElementById("ibS").textContent=sel.map(function(c){return c.n}).join(" · ");
    document.title="Інфо-битва: "+sel.map(function(c){return c.n}).join(", ")+" | urokinfo";
    IB_RUN();
  }).catch(function(e){fail("Не вдалося завантажити питання. Перевірте інтернет.");console.error(e)});
})();
