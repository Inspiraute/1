const CACHE='hanjagyeol-static-v3';
const FILES=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./words.json'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('hanjagyeol-')&&k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 const u=new URL(e.request.url);if(u.origin!==self.location.origin)return;
 const words=u.pathname.endsWith('/words.json'),navigate=e.request.mode==='navigate';
 if(words||navigate){const fallback=words?'./words.json':'./index.html';e.respondWith(fetch(e.request,{cache:'no-store'}).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(c=>c.put(fallback,copy)).catch(()=>{})}return response}).catch(()=>caches.match(fallback).then(x=>x||Response.error())));return}
 e.respondWith(caches.match(e.request).then(x=>x||fetch(e.request)))
});