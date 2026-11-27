/* urokinfo service worker: сторінки — спершу мережа, потім кеш; файли сайту — з кешу з фоновим оновленням */
const V="urokinfo-v1",CORE=["/","/vse/","/progres/","/vchyteliu/","/konstruktor/","/urok/","/yak-korystuvatysia/","/offline/","/site/nav.js","/site/app.js","/site/qrcode.js","/site/codes.json","/site/catalog.json","/favicon.svg","/manifest.webmanifest","/site/icon-192.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=="GET"||u.origin!==location.origin)return;
  if(r.mode==="navigate"){
    e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(V).then(c=>c.put(u.pathname+u.search,cp))}return res})
      .catch(()=>caches.match(u.pathname+u.search).then(m=>m||caches.match(u.pathname)).then(m=>m||caches.match("/offline/"))));
    return}
  e.respondWith(caches.match(r).then(m=>{const net=fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res}).catch(()=>m);return m||net}));
});
