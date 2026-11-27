/* ===== Нові механіки островів (вставляється в рушій після STAGE_FN) ===== */
(function(){if(document.getElementById('xst-css'))return;const st=document.createElement('style');st.id='xst-css';st.textContent=`
.xw{display:grid;gap:.7rem;justify-items:center;width:100%}
.xtarget{font-weight:900;font-size:1.15rem;padding:.4rem .9rem;border-radius:999px;background:var(--c2l,#e7f5ff);border:2px solid var(--c2,#1c7ed6)}
.xsky{position:relative;width:min(100%,720px);height:min(58vh,420px);border-radius:var(--r,18px);background:linear-gradient(#e7f5ff,#fff4e6);overflow:hidden;border:2px solid var(--line,#dee2e6)}
.xfly{position:absolute;display:flex;flex-direction:column;align-items:center;gap:.1rem;padding:.35rem .55rem;border-radius:16px;background:#fff;border:2px solid var(--line,#dee2e6);font-weight:800;font-size:.95rem;cursor:pointer;box-shadow:0 3px 8px #0001;transition:transform .2s,opacity .3s;max-width:42%;text-align:center}
.xfly .emo{font-size:2rem}.xfly.got{transform:scale(1.3);opacity:0;pointer-events:none}
@keyframes xfloat{0%{transform:translateY(0)}50%{transform:translateY(-14px)}100%{transform:translateY(0)}}
.xfly{animation:xfloat 2.6s ease-in-out infinite}
.xballs{display:flex;flex-wrap:wrap;gap:.8rem;justify-content:center;width:min(100%,760px)}
.xball{position:relative;width:min(44%,210px);min-height:150px;border:0;border-radius:50% 50% 46% 46%/55% 55% 45% 45%;padding:1.1rem .8rem 1.4rem;font:800 .95rem/1.25 inherit;color:#1b1e28;cursor:pointer;box-shadow:inset -10px -12px 0 #0000001a;animation:xfloat 3s ease-in-out infinite}
.xball::after{content:"";position:absolute;left:50%;bottom:-16px;width:2px;height:18px;background:#868e96}
.xball .emo{display:block;font-size:1.7rem}.xball.pop{animation:none;transform:scale(1.4);opacity:0;transition:.35s}.xball.keep{outline:4px solid var(--ok,#2b8a3e)}
.xdoors{display:flex;flex-wrap:wrap;gap:.7rem;justify-content:center;width:min(100%,780px)}
.xdoor{flex:1 1 160px;max-width:220px;min-height:170px;border-radius:14px 14px 4px 4px;border:4px solid #8d5524;background:linear-gradient(#c58c52,#a0673a);color:#fff;font:800 1rem/1.25 inherit;padding:.8rem .6rem;cursor:pointer;position:relative;text-shadow:0 1px 2px #0006;display:flex;align-items:center;justify-content:center;text-align:center}
.xdoor::after{content:"";position:absolute;right:12px;top:50%;width:10px;height:10px;border-radius:50%;background:#ffd43b}
.xdoor.open{background:linear-gradient(#fff9db,#ffec99);color:#1b1e28;text-shadow:none;border-color:var(--ok,#2b8a3e)}.xdoor.off{opacity:.45}
.xq{display:flex;gap:.6rem;align-items:center;font-weight:800;font-size:1.1rem;max-width:760px;text-align:center}.xq .emo{font-size:2rem}
.xsteps{display:grid;gap:.45rem;width:min(100%,560px)}
.xstep{display:flex;gap:.6rem;align-items:center;padding:.55rem .8rem;border-radius:12px;border:2px solid var(--line,#dee2e6);background:#fff;font:700 1rem inherit;cursor:pointer;text-align:left}
.xstep b{min-width:1.6rem;height:1.6rem;border-radius:50%;background:var(--c2l,#e7f5ff);display:grid;place-items:center}.xstep .emo{font-size:1.4rem}
.xstep.bugok{border-color:var(--bad,#e03131);background:#fff5f5;text-decoration:line-through}.xstep.fixd{border-color:var(--ok,#2b8a3e);background:#ebfbee;text-decoration:none}
.xpix{display:grid;gap:3px;width:min(100%,380px);margin:auto}
.xpix button{aspect-ratio:1;border:1px solid #adb5bd;border-radius:4px;background:#fff;cursor:pointer;padding:0}
.xpal{display:flex;gap:.4rem;flex-wrap:wrap;justify-content:center}.xpal button{width:46px;height:46px;border-radius:50%;border:3px solid #fff;box-shadow:0 0 0 2px #adb5bd;cursor:pointer;font-size:1.2rem}.xpal button.on{box-shadow:0 0 0 4px var(--c2,#1c7ed6)}
.xcode{font:800 1.05rem/1.6 ui-monospace,Menlo,monospace;background:#fff;border:2px dashed var(--line,#dee2e6);border-radius:12px;padding:.4rem .8rem}
.xrow{display:flex;gap:.6rem;flex-wrap:wrap;justify-content:center;align-items:center}
.xblocks{display:flex;gap:.4rem;flex-wrap:wrap;justify-content:center}
.xblk{border:0;border-radius:10px;padding:.5rem .7rem;font:800 .95rem inherit;color:#fff;cursor:pointer;box-shadow:0 3px 0 #0003}
.xblk.mv{background:#4c97ff}.xblk.tn{background:#9966ff}.xblk.rp{background:#ffab19}.xblk.pn{background:#0fbd8c}.xblk.lk{background:#cf63cf}
.xprog{min-height:52px;width:min(100%,560px);display:flex;flex-wrap:wrap;gap:.3rem;padding:.4rem;border-radius:12px;background:#f1f3f5;align-items:center}
.xprog .xblk{padding:.35rem .55rem;font-size:.85rem}.xprog .xblk.cur{outline:3px solid #212529}
.xstage{position:relative;display:grid;gap:2px;width:min(100%,400px);background:#dee2e6;border-radius:10px;padding:2px}
.xstage div{aspect-ratio:1;background:#fff;border-radius:3px;display:grid;place-items:center;font-size:1.2rem}
.xstage div.tg{background:#fff3bf}.xstage div.tr{background:#d3f9d8}.xstage div.tr.tg{background:#8ce99a}
.xspr{position:absolute;display:grid;place-items:center;font-size:1.8rem;transition:left .35s,top .35s,transform .35s;pointer-events:none}
.xdoc{width:min(100%,620px);background:#fff;border:2px solid var(--line,#dee2e6);border-radius:10px;padding:1rem 1.2rem;font:500 1.15rem/1.6 Georgia,serif;min-height:120px}
.xdoc span{cursor:pointer;border-radius:4px;padding:0 1px}.xdoc span.sel{background:#a5d8ff}
.xbar{display:flex;gap:.35rem;flex-wrap:wrap;justify-content:center;background:#f1f3f5;padding:.35rem;border-radius:10px}
.xbar button{min-width:44px;height:42px;border:1px solid #ced4da;border-radius:8px;background:#fff;font:800 1rem inherit;cursor:pointer}
.xslide{width:min(100%,520px);aspect-ratio:16/9;background:#fff;border:2px solid var(--line,#dee2e6);border-radius:10px;display:grid;padding:.8rem;gap:.5rem;box-shadow:0 4px 14px #0001}
.xslide .ph{border:2px dashed #adb5bd;border-radius:8px;display:grid;place-items:center;color:#868e96;font-weight:700;font-size:.9rem;padding:.3rem;text-align:center}
.xslide .ph.fill{border-style:solid;border-color:var(--c2,#1c7ed6);color:#1b1e28;font-size:1.05rem}.xslide .ph.xpb{font-size:2.4rem}
.xmb{width:min(80vw,260px);aspect-ratio:1.15;background:#212529;border-radius:18px;display:grid;grid-template-columns:auto 1fr auto;align-items:center;padding:12px;gap:10px}
.xmb .leds{display:grid;grid-template-columns:repeat(5,1fr);gap:6px}.xmb .leds i{aspect-ratio:1;border-radius:3px;background:#3a3f45}.xmb .leds i.on{background:#ff4136;box-shadow:0 0 8px #ff4136}
.xmb button{width:44px;height:44px;border-radius:50%;border:3px solid #adb5bd;background:#495057;color:#fff;font-weight:900;cursor:pointer}
.xpick{display:flex;gap:.4rem;flex-wrap:wrap;justify-content:center}.xpick button{border:2px solid var(--line,#dee2e6);border-radius:12px;background:#fff;padding:.45rem .7rem;font:800 .95rem inherit;cursor:pointer}.xpick button.on{border-color:var(--c2,#1c7ed6);background:var(--c2l,#e7f5ff)}
@media (prefers-reduced-motion:reduce){.xfly,.xball{animation:none}.xspr{transition:none}}
`;document.head.appendChild(st);})();
const xsay=(q)=>setTalk(q);
const xmiss=(g,t)=>{try{logMiss(g.name,String(t).replace(/<[^>]+>/g,''))}catch(e){}};
const xhint=(t)=>{const h=t||G.T.think;fact('🤔 '+h);speak(h);};

/* ---- CATCH: Ловилка (дані як у sort) ---- */
function stCatch(g,a){const w=el('div','xw');a.appendChild(w);const order=shuffle(g.baskets.map((b,j)=>j));let bi=0,done=0;
  const total=g.items.length;setDots(total,0);
  const round=()=>{if(bi>=order.length){stageDone();return;}const j=order[bi],B=g.baskets[j];const tgt=g.items.filter(i=>i.to===j);let left=tgt.length;
    if(!left){bi++;round();return;}
    xsay(`${bi===0&&g.say?g.say+'<br>':''}Лови лише: <b>${B.e||''} ${B.n}</b>! Торкайся потрібних карток.`);
    w.innerHTML=`<div class="xtarget">${B.e||''} ${B.n}</div><div class="xsky"></div>`;const sky=w.querySelector('.xsky');
    shuffle(g.items.filter(i=>!i._got)).forEach((it,n)=>{const b=el('button','xfly',`<span class="emo">${it.e}</span><span>${it.n}</span>`);
      b.style.left=(3+(n%3)*32+((n*7)%6))+'%';b.style.top=(4+Math.floor(n/3)*30+((n*11)%8))+'%';b.style.animationDelay=(n*.35)+'s';sky.appendChild(b);
      b.onclick=()=>{if(it.to===j){it._got=1;b.classList.add('got');sOk();addStar();done++;setDots(total,done);fact('✅ '+(it.why||G.T.ok));left--;
          if(!left){speak(it.why||G.T.ok);bi++;setTimeout(round,2200);}}
        else{xmiss(g,it.n+' → '+B.n);bad(b);xhint(it.hint);}};});
    idle(()=>{const t=[...sky.children].find((c,n)=>!c.classList.contains('got')&&g.items.find(i=>c.textContent.includes(i.n)&&i.to===j));showHand(t);});};
  round();}

/* ---- BALLOONS: Лопни вигадки (дані як у tf) ---- */
function stBalloons(g,a){const w=el('div','xw');a.appendChild(w);const items=shuffle(g.items);const sets=[];for(let i=0;i<items.length;i+=(items.length>4?3:items.length))sets.push(items.slice(i,i+(items.length>4?3:items.length)));
  const C=['#ffc9c9','#a5d8ff','#b2f2bb','#ffec99','#d0bfff','#ffd8a8'];let k=0,cnt=0;setDots(items.length,0);
  const round=()=>{if(k>=sets.length){stageDone();return;}const S2=sets[k];const wantFalse=S2.some(x=>!x.a)?true:false;let left=S2.filter(x=>x.a!==!wantFalse? false:true).length;
    left=S2.filter(x=>wantFalse?!x.a:x.a).length;
    xsay(wantFalse?'Лопни всі кульки з <b>вигадками</b> 🎈 — правду залиш!':'Тут усе правда? Лопни кульки з <b>правдою</b> 🎈');
    w.innerHTML='<div class="xballs"></div>';const box=w.firstChild;
    S2.forEach((it,n)=>{const b=el('button','xball',`<span class="emo">${it.e}</span>${it.t}`);b.style.background=C[(k*3+n)%C.length];b.style.animationDelay=(n*.4)+'s';box.appendChild(b);
      b.onclick=()=>{const target=wantFalse?!it.a:it.a;if(target){b.classList.add('pop');tone([[880,.05],[1200,.08]]);addStar();cnt++;setDots(items.length,cnt);fact('✅ '+it.why);speak(it.why);left--;
          if(!left){S2.filter(x=>wantFalse?x.a:!x.a).forEach(x=>{cnt++;});setDots(items.length,Math.min(cnt,items.length));[...box.children].forEach(c=>{if(!c.classList.contains('pop'))c.classList.add('keep')});k++;setTimeout(round,2800);}}
        else{xmiss(g,it.t);bad(b);xhint(it.hint);}};});
    idle(()=>{const i=S2.findIndex(x=>(wantFalse?!x.a:x.a));const t=[...box.children][i];if(t&&!t.classList.contains('pop'))showHand(t);});};
  round();}

/* ---- DOORS: Двері з відповідями (дані як у choose) ---- */
function stDoors(g,a){let k=0;const w=el('div','xw');a.appendChild(w);
  const q=()=>{if(k>=g.items.length){stageDone();return;}const it=g.items[k];setDots(g.items.length,k);xsay(k===0&&g.say?g.say+'<br>'+it.q:it.q);
    const order=shuffle(it.opts.map((t,i)=>i));w.innerHTML=`<div class="xq">${it.e?`<span class="emo">${it.e}</span>`:''}<div>${it.q}</div></div><div class="xdoors"></div>`;const box=w.querySelector('.xdoors');
    order.forEach(i=>{const b=el('button','xdoor',it.opts[i]);b.onclick=()=>{if(i===it.a){b.classList.add('open');b.innerHTML='🎁<br>'+it.opts[i];good(it.why);k++;setTimeout(q,3400);}
      else{xmiss(g,it.q+' → '+it.opts[i]);bad(b);b.classList.add('off');b.disabled=true;xhint(it.hint);}};box.appendChild(b);});
    idle(()=>showHand([...box.children][order.indexOf(it.a)]));};
  q();}

/* ---- BUG: Біт помилився — знайди хибний крок ---- */
function stBug(g,a){let k=0;const w=el('div','xw');a.appendChild(w);
  const r=()=>{if(k>=g.rounds.length){stageDone();return;}const R=g.rounds[k];setDots(g.rounds.length,k);xsay(R.q||'Біт склав алгоритм, але <b>один крок</b> хибний. Знайди його!');
    w.innerHTML=`<div class="xsteps"></div>`;const box=w.firstChild;let found=false;
    R.steps.forEach((s,i)=>{const b=el('button','xstep',`<b>${i+1}</b><span class="emo">${s.e||''}</span><span>${s.t}</span>`);box.appendChild(b);
      b.onclick=()=>{if(found)return;if(i===R.bad){found=true;b.classList.add('bugok');sOk();addStar();fact('✅ '+R.why);speak(R.why);
          if(R.fix){setTimeout(()=>{b.classList.add('fixd');b.querySelector('span:last-child').textContent=R.fix;b.querySelector('.emo').textContent=R.fixe||'✔️';tone([[660,.1],[990,.15]]);},1400);}
          k++;setTimeout(r,3800);}
        else{xmiss(g,(R.q||'')+' крок '+(i+1));bad(b);xhint(R.hint);}};});
    idle(()=>showHand(box.children[R.bad]));};
  r();}

/* ---- PIXEL: Розфарбуй за кодом ---- */
function stPixel(g,a){let k=0;const w=el('div','xw');a.appendChild(w);
  const lv=()=>{if(k>=g.levels.length){stageDone();return;}const L=g.levels[k];setDots(g.levels.length,k);xsay(L.q);
    const pal=L.pal;const keys=Object.keys(pal);let cur=keys.find(c=>c!=='.')||keys[0];const H=L.rows.length,W=L.rows[0].length;const st2=Array.from({length:H},()=>Array(W).fill('.'));
    const code=L.code||L.rows.map(r=>{let o=[],c=r[0],n=0;for(const ch of r+'#'){if(ch===c)n++;else{o.push(n+(pal[c]?pal[c].e:'⬜'));c=ch;n=1}}return o.join(' ')});
    w.innerHTML=`${L.hideCode?'':`<div class="xcode">${code.map((s,i)=>`${i+1}: ${s}`).join('<br>')}</div>`}<div class="xrow"><div class="xpix" style="grid-template-columns:repeat(${W},1fr)"></div></div><div class="xpal"></div><button class="big" style="font-size:1.05rem">✔ Перевірити</button>`;
    const gr=w.querySelector('.xpix'),pl=w.querySelector('.xpal');
    keys.forEach(c=>{const b=el('button',c===cur?'on':'',pal[c].e||'');b.style.background=pal[c].c;b.title=pal[c].n||'';b.onclick=()=>{cur=c;[...pl.children].forEach(x=>x.classList.toggle('on',x===b))};pl.appendChild(b);});
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){const c=el('button','');c.style.background=pal['.']?pal['.'].c:'#fff';c.onclick=()=>{st2[y][x]=cur;c.style.background=pal[cur].c;tone([[500+x*20,.03]]);};gr.appendChild(c);}
    w.querySelector('.big').onclick=()=>{let wrong=0;for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(st2[y][x]!==L.rows[y][x])wrong++;
      if(!wrong){good(L.ok||G.T.ok);k++;setTimeout(lv,3000);}else{xmiss(g,'рівень '+(k+1)+': '+wrong+' клітинок');sNo();xhint((L.hint?L.hint+' ':'')+'Не збігається клітинок: '+wrong+'.');}};
    idle(()=>showHand(gr.children[L.rows[0].split('').findIndex(c=>c!=='.')]||gr.children[0]));};
  lv();}

/* ---- BLOCKS: Скретч-блоки на сцені ---- */
const XB={f:{t:'➡ крок',c:'mv'},l:{t:'↺ ліворуч',c:'tn'},r:{t:'↻ праворуч',c:'tn'},p:{t:'✏ олівець',c:'pn'},s:{t:'🐾 штамп',c:'pn'},
  r2:{t:'🔁 2 рази',c:'rp'},r3:{t:'🔁 3 рази',c:'rp'},r4:{t:'🔁 4 рази',c:'rp'},x:{t:'🌈 костюм',c:'lk'},say:{t:'💬 сказати',c:'lk'}};
function stBlocks(g,a){let k=0;const w=el('div','xw');a.appendChild(w);
  const lv=()=>{if(k>=g.levels.length){stageDone();return;}const L=g.levels[k];setDots(g.levels.length,k);xsay(L.q);const prog=[];let busy=false,fails=0;
    w.innerHTML=`<div class="xstage" style="grid-template-columns:repeat(${L.w},1fr)"></div><div class="xprog"></div><div class="xblocks"></div><div class="xrow"><button class="hintbtn xdel">⌫ Стерти</button><button class="big xrun" style="font-size:1.05rem">🚩 Запуск</button></div>`;
    const sg=w.querySelector('.xstage'),pg=w.querySelector('.xprog'),bl=w.querySelector('.xblocks');
    const T=new Set((L.target||[]).map(p=>p.join(','))),G2=L.goal?L.goal.join(','):null;
    for(let y=0;y<L.h;y++)for(let x=0;x<L.w;x++){const c=el('div',T.has(x+','+y)?'tg':'');if(G2===x+','+y)c.textContent=L.goalE||'⭐';if((L.walls||[]).some(([p,q])=>p===x&&q===y))c.textContent=L.wallE||'🧱';c.dataset.xy=x+','+y;sg.appendChild(c);}
    const spr=el('div','xspr',L.spr||'🐱');sg.appendChild(spr);
    const D=[[1,0],[0,1],[-1,0],[0,-1]];
    const place=(x,y,d)=>{spr.style.left=`calc(${x/L.w*100}% + 2px)`;spr.style.top=`calc(${y/L.h*100}% + 2px)`;spr.style.width=(100/L.w)+'%';spr.style.height=(100/L.h)+'%';spr.style.transform=`rotate(${d*90}deg)`;};
    place(L.start[0],L.start[1],L.dir||0);
    const draw=()=>{pg.innerHTML=prog.length?prog.map(b=>`<span class="xblk ${XB[b].c}">${XB[b].t}</span>`).join(''):'<span style="color:#868e96">Натискай блоки — так складеш програму</span>';};draw();
    L.blocks.forEach(b=>{const e=el('button','xblk '+XB[b].c,XB[b].t);e.onclick=()=>{if(busy||prog.length>=(L.max||12))return;prog.push(b);tone([[520,.05]]);draw();};bl.appendChild(e);});
    w.querySelector('.xdel').onclick=()=>{if(!busy){prog.pop();draw();}};
    const reset=()=>{sg.querySelectorAll('.tr').forEach(c=>c.classList.remove('tr'));sg.querySelectorAll('.st').forEach(c=>{c.classList.remove('st');if(!T.has(c.dataset.xy)&&c.dataset.xy!==G2)c.textContent='';});place(L.start[0],L.start[1],L.dir||0);};
    w.querySelector('.xrun').onclick=async()=>{if(busy||!prog.length)return;busy=true;reset();let x=L.start[0],y=L.start[1],d=L.dir||0,pen=false,crash=false;const vis=new Set(),stamps=new Set();
      const seq=[];for(let i=0;i<prog.length;i++){const b=prog[i];if(/^r\d/.test(b)){const n=+b[1],nx=prog[i+1];if(nx&&!/^r\d/.test(nx)){for(let j=0;j<n;j++)seq.push([nx,i+1]);i++;}continue;}seq.push([b,i]);}
      const cell=(x,y)=>sg.querySelector(`[data-xy="${x},${y}"]`);if(L.penStart){pen=true;vis.add(x+','+y);cell(x,y).classList.add('tr');}
      for(const [b,pi] of seq){[...pg.children].forEach((c,j)=>c.classList.toggle('cur',j===pi));await new Promise(r=>setTimeout(r,reduce?120:420));
        if(b==='f'){const nx=x+D[d][0],ny=y+D[d][1];if(nx<0||ny<0||nx>=L.w||ny>=L.h||(L.walls||[]).some(([p,q])=>p===nx&&q===ny)){crash=true;bad(spr);break;}x=nx;y=ny;if(pen){vis.add(x+','+y);cell(x,y).classList.add('tr');}}
        else if(b==='l')d=(d+3)%4;else if(b==='r')d=(d+1)%4;else if(b==='p'){pen=true;vis.add(x+','+y);cell(x,y).classList.add('tr');}
        else if(b==='s'){stamps.add(x+','+y);const c=cell(x,y);c.classList.add('st');c.textContent=L.stampE||'🐾';}
        else if(b==='x'){spr.textContent=spr.textContent===(L.spr||'🐱')?(L.spr2||'😺'):(L.spr||'🐱');}
        else if(b==='say'){fact('💬 '+(L.sayT||'Привіт!'));}
        place(x,y,d);tone([[440,.04]]);}
      [...pg.children].forEach(c=>c.classList.remove('cur'));
      let ok=!crash;if(ok&&L.goal)ok=x===L.goal[0]&&y===L.goal[1];
      if(ok&&L.target){const S3=L.mode==='stamp'?stamps:vis;ok=[...T].every(p=>S3.has(p))&&[...S3].every(p=>T.has(p));}
      if(ok&&L.need)ok=L.need.every(b=>prog.includes(b));
      if(ok&&L.max2)ok=prog.length<=L.max2;
      if(ok){good(L.ok||G.T.ok);k++;setTimeout(lv,3200);}
      else{fails++;xmiss(g,'рівень '+(k+1));if(!crash)sNo();xhint(crash?(L.bump||'Ой, вийшли за сцену!'):(L.max2&&prog.length>L.max2?'Програма задовга — скористайся блоком повторення 🔁.':(L.hint||G.T.notyet)));
        if(fails>=2&&L.sol)fact('💡 Підказка: '+L.sol.map(b=>XB[b].t).join(' · '));setTimeout(()=>{busy=false;},700);}};
    idle(()=>{if(L.sol){const want=L.sol[prog.length];const ok=prog.every((b,i)=>b===L.sol[i]);showHand(ok&&want?[...bl.children][L.blocks.indexOf(want)]:ok?w.querySelector('.xrun'):w.querySelector('.xdel'));}});};
  lv();}

/* ---- TEXTED: Міні-редактор тексту ---- */
function stTexted(g,a){let k=0;const w=el('div','xw');a.appendChild(w);
  const r=()=>{if(k>=g.rounds.length){stageDone();return;}const R=g.rounds[k];setDots(g.rounds.length,k);xsay(R.q);
    const words=R.text.split(' ');const fmt=words.map(()=>({b:0,i:0,u:0,c:''}));let sel=new Set(),align=R.align0||'left',deleted=new Set();
    w.innerHTML=`<div class="xbar"><button data-f="b"><b>Ж</b></button><button data-f="i"><i>К</i></button><button data-f="u"><u>П</u></button>
      <button data-f="c:#e03131" style="color:#e03131">А</button><button data-f="c:#1971c2" style="color:#1971c2">А</button><button data-f="c:#2f9e44" style="color:#2f9e44">А</button>
      <button data-f="al:left">⬅</button><button data-f="al:center">⬌</button><button data-f="al:right">➡</button><button data-f="del">⌫</button></div><div class="xdoc"></div><button class="big" style="font-size:1.05rem">✔ Готово</button>`;
    const doc=w.querySelector('.xdoc');
    const draw=()=>{doc.style.textAlign=align;doc.innerHTML=words.map((t,i)=>deleted.has(i)?'':`<span data-i="${i}" class="${sel.has(i)?'sel':''}" style="${fmt[i].b?'font-weight:800;':''}${fmt[i].i?'font-style:italic;':''}${fmt[i].u?'text-decoration:underline;':''}${fmt[i].c?'color:'+fmt[i].c:''}">${t}</span>`).join(' ');
      doc.querySelectorAll('span').forEach(s=>s.onclick=()=>{const i=+s.dataset.i;sel.has(i)?sel.delete(i):sel.add(i);draw();});};draw();
    w.querySelectorAll('.xbar button').forEach(b=>b.onclick=()=>{const f=b.dataset.f;if(f.startsWith('al:')){align=f.slice(3);}
      else if(f==='del'){sel.forEach(i=>deleted.add(i));sel.clear();}
      else{if(!sel.size){fact('👆 Спершу торкнись слова, щоб виділити його.');speak('Спершу торкнись слова.');return;}sel.forEach(i=>{if(f.startsWith('c:'))fmt[i].c=f.slice(2);else fmt[i][f]=fmt[i][f]?0:1;});}
      tone([[600,.04]]);draw();});
    w.querySelector('.big').onclick=()=>{const C=R.check;let ok=true;
      if(C.align&&align!==C.align)ok=false;
      (C.words||[]).forEach(cw=>{const i=words.findIndex((t,j)=>t.replace(/[.,!?:;«»]/g,'')===cw.w&&!deleted.has(j));if(i<0){ok=false;return;}const f=fmt[i];if(cw.b!=null&&!!f.b!==!!cw.b)ok=false;if(cw.i!=null&&!!f.i!==!!cw.i)ok=false;if(cw.u!=null&&!!f.u!==!!cw.u)ok=false;if(cw.c&&f.c!==cw.c)ok=false;});
      (C.del||[]).forEach(dw=>{if(words.some((t,j)=>t.replace(/[.,!?:;«»]/g,'')===dw&&!deleted.has(j)))ok=false;});
      if(C.keepAll&&deleted.size>(C.del||[]).length)ok=false;
      if(ok){good(R.ok);k++;setTimeout(r,3200);}else{xmiss(g,R.q);sNo();xhint(R.hint);}};
    idle(()=>{const cw=(R.check.words||[])[0];if(cw){const i=words.findIndex(t=>t.replace(/[.,!?:;«»]/g,'')===cw.w);showHand(doc.querySelector(`[data-i="${i}"]`));}});};
  r();}

/* ---- SLIDE: Конструктор слайда ---- */
function stSlide(g,a){let k=0;const w=el('div','xw');a.appendChild(w);
  const LAY={title:{n:'Титульний',e:'🅃',cols:'1fr',rows:'2fr 1fr',ph:['title','sub']},tp:{n:'Заголовок і картинка',e:'🖼️',cols:'1fr',rows:'1fr 3fr',ph:['title','pic']},two:{n:'Дві картинки',e:'🖼️🖼️',cols:'1fr 1fr',rows:'1fr 3fr',ph:['title','pic','pic2']},txt:{n:'Заголовок і текст',e:'📝',cols:'1fr',rows:'1fr 3fr',ph:['title','text']}};
  const r=()=>{if(k>=g.rounds.length){stageDone();return;}const R=g.rounds[k];setDots(g.rounds.length,k);xsay(R.q);const S4={lay:null,title:null,pic:null,pic2:null,text:null,sub:null,bg:'#ffffff'};
    w.innerHTML=`<div class="xpick lay">${Object.entries(LAY).filter(([k2])=>!R.lays||R.lays.includes(k2)).map(([k2,v])=>`<button data-l="${k2}">${v.e} ${v.n}</button>`).join('')}</div><div class="xslide"></div>
      <div class="xpick tit">${(R.titles||[]).map((t,i)=>`<button data-t="${i}">${t}</button>`).join('')}</div><div class="xpick pic">${(R.pics||[]).map((p,i)=>`<button data-p="${i}" style="font-size:1.5rem">${p}</button>`).join('')}</div>
      ${R.bgs?`<div class="xpick bg">${R.bgs.map(c=>`<button data-b="${c}" style="background:${c};width:44px;height:40px"></button>`).join('')}</div>`:''}<button class="big" style="font-size:1.05rem">✔ Готово</button>`;
    const sl=w.querySelector('.xslide');
    const draw=()=>{sl.style.background=S4.bg;if(!S4.lay){sl.style.gridTemplateColumns='1fr';sl.style.gridTemplateRows='1fr';sl.innerHTML='<div class="ph">Спершу обери макет слайда ⬆</div>';return;}const L=LAY[S4.lay];
      sl.style.gridTemplateColumns=L.cols;sl.style.gridTemplateRows=L.rows;
      sl.innerHTML=L.ph.map(p=>{const v=p==='title'?S4.title!=null?R.titles[S4.title]:null:p==='pic'?S4.pic!=null?R.pics[S4.pic]:null:p==='pic2'?S4.pic2!=null?R.pics[S4.pic2]:null:p==='sub'?(S4.title!=null?R.sub||'':null):(S4.title!=null?R.text||'Текст слайда':null);
        const lab={title:'Заголовок',pic:'Картинка',pic2:'Картинка',sub:'Підзаголовок',text:'Текст'}[p];
        return `<div class="ph ${v?'fill':''} ${p.startsWith('pic')&&v?'xpb':''}" style="${L.cols.includes(' ')&&p==='title'?'grid-column:1/3':''}">${v||'Клацни, щоб додати: '+lab}</div>`;}).join('');};draw();
    w.querySelectorAll('.lay button').forEach(b=>b.onclick=()=>{S4.lay=b.dataset.l;w.querySelectorAll('.lay button').forEach(x=>x.classList.toggle('on',x===b));draw();});
    w.querySelectorAll('.tit button').forEach(b=>b.onclick=()=>{S4.title=+b.dataset.t;w.querySelectorAll('.tit button').forEach(x=>x.classList.toggle('on',x===b));draw();});
    w.querySelectorAll('.pic button').forEach(b=>b.onclick=()=>{const i=+b.dataset.p;if(S4.lay==='two'&&S4.pic!=null&&S4.pic!==i)S4.pic2=i;else S4.pic=i;w.querySelectorAll('.pic button').forEach((x,j)=>x.classList.toggle('on',j===S4.pic||j===S4.pic2));draw();});
    w.querySelectorAll('.bg button').forEach(b=>b.onclick=()=>{S4.bg=b.dataset.b;draw();});
    w.querySelector('.big').onclick=()=>{const C=R.check;let ok=true;if(C.lay&&!(Array.isArray(C.lay)?C.lay:[C.lay]).includes(S4.lay))ok=false;if(C.title!=null&&S4.title!==C.title)ok=false;
      if(C.pic!=null&&S4.pic!==C.pic&&S4.pic2!==C.pic)ok=false;if(C.pics&&!C.pics.every(p=>S4.pic===p||S4.pic2===p))ok=false;if(C.bgDark!=null&&((parseInt(S4.bg.slice(1,3),16)<100)!==C.bgDark))ok=false;
      if(ok){good(R.ok);k++;setTimeout(r,3200);}else{xmiss(g,R.q);sNo();xhint(R.hint);}};
    idle(()=>showHand(S4.lay?w.querySelector('.tit button'):w.querySelector('.lay button')));};
  r();}

/* ---- MBIT: Симулятор Micro:Bit ---- */
const XIMG={heart:'0101011111111110111000100',smile:'0000001010000001000101110',sad:'0000001010000000111010001',yes:'0000000001000101010000100',no:'1000101010001000101010001',arrow:'0010001110101010010000100',square:'1111110001100011000111111',dot:'0000000000001000000000000',empty:'0000000000000000000000000'};
const XIN={heart:'❤️ серце',smile:'🙂 усмішка',sad:'🙁 сум',yes:'✔ галочка',no:'✖ хрестик',arrow:'⬆ стрілка',square:'⬜ квадрат',dot:'• крапка'};
const XEV={start:'▶ на старті',A:'🅰 кнопка A',B:'🅱 кнопка B',shake:'👋 струснути',dark:'🌙 стало темно',loud:'🔊 гучно',tilt:'↘ нахил'};
function stMbit(g,a){let k=0;const w=el('div','xw');a.appendChild(w);
  const r=()=>{if(k>=g.rounds.length){stageDone();return;}const R=g.rounds[k];setDots(g.rounds.length,k);xsay(R.q);let ev=null,ac=null,rep=null;
    w.innerHTML=`<div class="xrow"><div style="display:grid;gap:.4rem"><b>1. Коли…</b><div class="xpick evs">${R.events.map(e=>`<button data-e="${e}">${XEV[e]}</button>`).join('')}</div>
      <b>2. Показати…</b><div class="xpick acs">${R.actions.map(e=>`<button data-a="${e}">${XIN[e]}</button>`).join('')}</div>
      ${R.reps?`<b>3. Скільки разів?</b><div class="xpick rps">${R.reps.map(n=>`<button data-r="${n}">${n===0?'завжди 🔁':n+' раз'+(n<5&&n>1?'и':'')}</button>`).join('')}</div>`:''}</div>
      <div style="display:grid;gap:.5rem;justify-items:center"><div class="xmb"><button class="ba">A</button><div class="leds">${'<i></i>'.repeat(25)}</div><button class="bb">B</button></div>
      <div class="xpick sim">${R.sim.map(e=>`<button data-s="${e}">${XEV[e]}</button>`).join('')}</div></div></div><button class="big" style="font-size:1.05rem">✔ Програма готова</button>`;
    const leds=[...w.querySelectorAll('.leds i')];const show=im=>{const s=XIMG[im]||XIMG.empty;leds.forEach((l,i)=>l.classList.toggle('on',s[i]==='1'));};show('empty');
    const sel=(cls,attr,set)=>w.querySelectorAll(cls+' button').forEach(b=>b.onclick=()=>{set(b.dataset[attr]);w.querySelectorAll(cls+' button').forEach(x=>x.classList.toggle('on',x===b));});
    sel('.evs','e',v=>ev=v);sel('.acs','a',v=>ac=v);sel('.rps','r',v=>rep=+v);
    const fire=e=>{if(ev===e&&ac){let n=0;const max=rep==null?1:rep||3;const blink=()=>{show(ac);tone([[700,.08]]);setTimeout(()=>{n++;if(n<max){show('empty');setTimeout(blink,250)}},450)};blink();}else{show('empty');fact('Micro:Bit нічого не робить — для цієї події немає команди.');}};
    w.querySelectorAll('.sim button').forEach(b=>b.onclick=()=>fire(b.dataset.s));w.querySelector('.ba').onclick=()=>fire('A');w.querySelector('.bb').onclick=()=>fire('B');
    w.querySelector('.big').onclick=()=>{const ok=ev===R.ok[0]&&ac===R.ok[1]&&(R.ok[2]==null||rep===R.ok[2]);if(ok){fire(ev);good(R.why);k++;setTimeout(r,3600);}else{xmiss(g,R.q);sNo();xhint(R.hint);}};
    idle(()=>showHand(ev?(ac?w.querySelector('.big'):w.querySelector(`.acs [data-a="${R.ok[1]}"]`)):w.querySelector(`.evs [data-e="${R.ok[0]}"]`)));};
  r();}

Object.assign(STAGE_FN,{catch:stCatch,balloons:stBalloons,doors:stDoors,bug:stBug,pixel:stPixel,blocks:stBlocks,texted:stTexted,slide:stSlide,mbit:stMbit});
