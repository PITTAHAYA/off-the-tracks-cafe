/* ═══════════════════════════════════════════════════════════
   OFF THE TRACKS — service worker
   Granville Island has patchy signal and the café is inside a
   timber-framed building. This keeps the menu, hours and photos
   readable with no connection at all.

   Strategy:
     documents  → network first, fall back to cache  (always fresh when online)
     everything → cache first, refresh in background  (instant on repeat visits)

   Bump CACHE when you change the site and old copies should be dropped.
   ═══════════════════════════════════════════════════════════ */
const CACHE = "ott-v10";

const SHELL = [
  "index.html", "menu.html", "place.html", "visit.html", "rewards.html",
  "app.css", "app.js", "content.js", "order.js", "reserve.js", "rewards.js",
  "icons/icon-192.png", "icons/icon-512.png",
  "assets/w/IMG_4173.webp",                                  // hero
  "assets/w/IMG_4196-sm.webp", "assets/w/IMG_4195-sm.webp",   // the three doors
  "assets/w/IMG_4172-sm.webp",
  "assets/w/IMG_4184.webp", "assets/w/IMG_4174.webp"          // menu tab heroes
];

self.addEventListener("install", e=>{
  e.waitUntil(
    caches.open(CACHE)
      // addAll fails the whole install if one file 404s, so add individually
      .then(c => Promise.all(SHELL.map(u => c.add(u).catch(()=>{}))))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener("activate", e=>{
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener("fetch", e=>{
  const req = e.request;
  if(req.method !== "GET") return;

  const url = new URL(req.url);
  if(url.origin !== location.origin) return;      // let fonts and maps go to the network

  if(req.mode === "navigate"){
    e.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
          return res;
        })
        .catch(()=> caches.match(req).then(r => r || caches.match("index.html")))
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(hit => {
      const live = fetch(req).then(res => {
        if(res && res.status === 200){
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      }).catch(()=> hit);
      return hit || live;
    })
  );
});
