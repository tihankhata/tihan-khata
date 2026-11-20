const V='tk-v5';
self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(V).then(c=>c.addAll(['./','manifest.json','icon-192.png','icon-512.png','icon-512-maskable.png'])).catch(()=>{}));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET')return;
  const u=new URL(r.url);
  const ok=u.origin===location.origin||u.hostname.endsWith('jsdelivr.net')||u.hostname.endsWith('googleapis.com')||u.hostname.endsWith('gstatic.com');
  if(!ok)return;
  e.respondWith(
    fetch(r).then(res=>{
      if(res&&(res.ok||res.type==='opaque')){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp)).catch(()=>{})}
      return res;
    }).catch(()=>caches.match(r).then(m=>m||caches.match('./')))
  );
});
