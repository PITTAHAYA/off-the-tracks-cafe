/* ═══════════════════════════════════════════════════════════
   OFF THE TRACKS — shared behaviour + all editable content.
   One file, loaded by every page. Each block runs only if the
   page it belongs to is the one being shown.
   ═══════════════════════════════════════════════════════════ */
(function(){
"use strict";
const $  = (s,r=document) => r.querySelector(s);
const $$ = (s,r=document) => [...r.querySelectorAll(s)];
/* Photos are served as WebP at two sizes: full (≤1400px) for the hero and
   lightbox, -sm (≤700px) for cards, doors and gallery thumbs. Roughly a
   third of the JPEG weight. The originals stay in assets/ as a fallback. */
const A   = "assets/";
const IMG = (f, size) =>
  "assets/w/" + f.replace(/\.jpg$/, "") + (size === "sm" ? "-sm" : "") + ".webp";

/* ═══════════════════════════════════════════════════════════
   CONTENT comes from content.js, which the café edits through
   admin.html. The fallbacks below only matter if content.js
   fails to load, so the site degrades to something correct
   rather than to a blank page.
   ═══════════════════════════════════════════════════════════ */
const C = window.OTT_CONTENT || {};

const PHONE   = C.phone   || "";
const EMAIL   = C.email   || "info@tracksbistro.ca";
const ADDRESS = C.address || "1363 Railspur Alley, Vancouver, BC V6H 4G9";
const SOCIAL  = { instagram:C.instagram || "", facebook:C.facebook || "" };
const SPECIAL = C.special || {text:""};
const REVIEWS = C.reviews || {quotes:[]};

const HOURS = C.hours || [        // index 0 = Sunday … 6 = Saturday, 24h clock
  {day:"Sunday",    open:9, close:17},
  {day:"Monday",    open:9, close:16},
  {day:"Tuesday",   open:9, close:16},
  {day:"Wednesday", open:9, close:16},
  {day:"Thursday",  open:9, close:16},
  {day:"Friday",    open:9, close:16},
  {day:"Saturday",  open:9, close:17}
];

const SHOW_PRICES = C.showPrices !== false;

const MENU = C.menu || [];

const GALLERY = [
  {img:"IMG_4173.jpg", alt:"Railspur Alley in the sun, the café's timber frame and navy umbrella, Granville Street Bridge behind."},
  {img:"IMG_4174.jpg", alt:"A cappuccino in a blue cup held up in front of the patio planters."},
  {img:"IMG_4195.jpg", alt:"The café floor from the mezzanine: timber trusses, espresso bar, guests at wooden tables."},
  {img:"IMG_4172.jpg", alt:"The entrance under the Café · Bistro sign, hanging plants and flower boxes."},
  {img:"IMG_4183.jpg", alt:"Lemonade with an orange wheel beside three macarons on the patio."},
  {img:"IMG_4175.jpg", alt:"The bar and chalkboard menus, with the long communal table in the foreground."},
  {img:"IMG_4177.jpg", alt:"A rosetta poured into a white cup, seen from directly above."},
  {img:"IMG_4176.jpg", alt:"The row of Railspur Alley studios in autumn colour."},
  {img:"IMG_4185.jpg", alt:"Three pistachio cruffins on a wooden board among garden flowers."},
  {img:"IMG_4192.jpg", alt:"Raspberry cupcakes carried out on a board into the alley."},
  {img:"IMG_4238.jpg", alt:"Two breakfasts and coffees on a patio table beside the planters."},
  {img:"IMG_4196.jpg", alt:"A full tray of croissants, cruffins and danishes fresh from the oven."},
  {img:"IMG_4180.jpg", alt:"A chicken sandwich on a soft bun with an arugula salad alongside."},
  {img:"IMG_4189.jpg", alt:"Avocado toast with a soft egg breaking over it."},
  {img:"IMG_4235.jpg", alt:"Three soft tacos on a long plate beside a glass of beer."},
  {img:"IMG_4236.jpg", alt:"A bowl of greens with seared tofu, chickpeas, egg and tomato."},
  {img:"IMG_4179.jpg", alt:"A waffle with berries, blueberry compote and cream."},
  {img:"IMG_4182.jpg", alt:"A granola bowl and a smoked salmon bagel with a latte."}
];

/* ═══════════ open / closed, in Vancouver time ═══════════ */
function vanNow(){
  const p = new Intl.DateTimeFormat("en-CA",{timeZone:"America/Vancouver",
    weekday:"short",hour:"2-digit",minute:"2-digit",hour12:false}).formatToParts(new Date());
  const g = t => p.find(x=>x.type===t).value;
  return {day:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].indexOf(g("weekday")),
          mins:parseInt(g("hour"),10)*60 + parseInt(g("minute"),10)};
}
const fmt = h => (h%12===0?12:h%12) + (h>=12?"pm":"am");
/* minutes-since-midnight → "9:15am", for pickup and booking times */
function clock(mins){
  const h = Math.floor(mins/60), m = mins % 60;
  return (h%12===0?12:h%12) + (m ? ":" + String(m).padStart(2,"0") : "") + (h>=12?"pm":"am");
}

function paintStatus(){
  const el = $("#status"); if(!el) return;
  const now = vanNow(), t = HOURS[now.day];
  const live = now.mins >= t.open*60 && now.mins < t.close*60;
  const soon = live && (t.close*60 - now.mins) <= 60;
  const dot = $(".status__dot", el), txt = $(".status__txt", el);
  dot.classList.toggle("shut", !live || soon);
  if(soon)      txt.textContent = "Closing " + fmt(t.close);
  else if(live) txt.textContent = "Open till " + fmt(t.close);
  else {
    const next = now.mins < t.open*60 ? t : HOURS[(now.day+1)%7];
    txt.textContent = "Opens " + fmt(next.open);
  }
}
paintStatus(); setInterval(paintStatus, 60000);

/* ═══════════ desktop top nav ═══════════
   On phones the rail lives at the bottom; on a wide screen that reads
   as a shrunk-down app. So we inject a real horizontal nav into the
   top bar — CSS shows it only past 900px and hides the bottom rail. */
(function(){
  const top = $(".top"); if(!top) return;
  const here = (location.pathname.split("/").pop() || "index.html");
  const links = [
    ["index.html","Home"], ["menu.html","Menu"], ["place.html","Place"],
    ["visit.html","Visit"], ["rewards.html","Stamps"]
  ];
  const nav = document.createElement("nav");
  nav.className = "topnav";
  nav.setAttribute("aria-label", "Primary");
  nav.innerHTML = links.map(([h,l])=>
    `<a href="${h}"${h===here?' aria-current="page"':''}>${l}</a>`).join("");
  const cta = document.createElement("a");
  cta.className = "topcta";
  cta.href = "menu.html";
  cta.textContent = "Order pickup";
  const status = $(".status", top);
  top.insertBefore(nav, status);
  top.insertBefore(cta, status);
})();

/* ═══════════ hours table (visit page) ═══════════ */
(function(){
  const box = $("#hours"); if(!box) return;
  const today = vanNow().day;
  box.innerHTML = [1,2,3,4,5,6,0].map(i=>{
    const h = HOURS[i];
    return `<div class="hrow${i===today?" hrow--now":""}">
      <span class="hrow__d">${h.day}</span>
      <span class="hrow__t">${fmt(h.open)} — ${fmt(h.close)}</span></div>`;
  }).join("");
})();

/* ═══════════ today's board (home) ═══════════
   Hidden entirely unless the café has written something. */
(function(){
  const box = $("#special"); if(!box) return;
  if(!SPECIAL.text){ box.remove(); return; }
  box.innerHTML = `<span class="special__k">Today</span>
    <span class="special__v">${SPECIAL.text}</span>
    ${SPECIAL.until ? `<span class="special__u">${SPECIAL.until}</span>` : ``}`;
  box.hidden = false;
})();

/* ═══════════ reviews (home) ═══════════
   Rating and count come from the café's Google listing. Quotes are
   only shown if real ones have been pasted into content.js — the
   section never invents them. */
(function(){
  const box = $("#says"); if(!box) return;
  const r = REVIEWS;
  const stars = n => "★★★★★".slice(0, Math.round(n)).padEnd(5, "☆");
  const head = r.rating ? `
    <a class="rating" href="${r.url || "#"}" target="_blank" rel="noopener">
      <span class="rating__s" aria-hidden="true">${stars(r.rating)}</span>
      <span class="rating__n">${r.rating.toFixed(1)}</span>
      <span class="rating__c">${r.count ? r.count + " reviews on Google" : "on Google"} →</span>
    </a>` : ``;
  const quotes = (r.quotes && r.quotes.length) ? `
    <div class="says__track">
      ${r.quotes.map(q=>`
        <blockquote class="say">
          <p>${q.text}</p>
          <cite>${q.who || "Google review"}</cite>
        </blockquote>`).join("")}
    </div>` : ``;
  if(!head && !quotes){ box.remove(); return; }
  box.innerHTML = `<p class="says__t">What regulars say</p>${head}${quotes}`;
})();

/* ═══════════ image fade-in ═══════════ */
function fadeIn(root=document){
  $$("img.fade", root).forEach(img=>{
    const on = ()=>img.classList.add("ok");
    img.complete ? on() : img.addEventListener("load", on, {once:true});
    img.addEventListener("error", ()=>{
      const host = img.closest(".mcard, .tile, .gitem");
      if(host) host.style.display = "none";
    }, {once:true});
  });
}
fadeIn();

/* ═══════════ scroll reveal ═══════════ */
const io = new IntersectionObserver(es=>{
  es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } });
},{rootMargin:"0px 0px -10% 0px",threshold:.05});
$$(".rv").forEach(el=>io.observe(el));

/* ═══════════ menu page ═══════════ */
(function(){
  const tabs = $("#tabs"), panel = $("#panel");
  if(!tabs || !panel) return;

  let RCAT = "";   // id of the category currently being rendered
  const has   = it => SHOW_PRICES && !!it.p;
  const price = it => has(it) ? `<span class="price">$${it.p}</span>` : ``;
  const slug  = n => n.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
  /* Orderable only when it has a price — you can't add a "market price" item */
  const addBtn = it => has(it)
    ? `<button class="add" data-add="${slug(it.n)}" data-cat="${RCAT}"
               data-name="${it.n}" data-price="${it.p}"
               aria-label="Add ${it.n} to your order">+</button>`
    : ``;

  /* Items without a photo drop the image block entirely and render as a
     simple text card — no placeholder square. align-items:start keeps them
     compact beside the taller photo cards. */
  const card = it => `<article class="mcard${it.img ? "" : " mcard--text"}">
      ${it.img ? `<div class="mcard__ph">
        <img class="fade" loading="lazy" src="${IMG(it.img,"sm")}" alt="${it.n}">
        ${it.tag ? `<span class="mcard__tag">${it.tag}</span>` : ``}
      </div>` : ``}
      <div class="mcard__in">
        <h3>${it.n}</h3>
        ${it.d ? `<p class="mcard__d">${it.d}</p>` : ``}
        ${it.on ? `<p class="mcard__on">${it.on}</p>` : ``}
        <div class="mcard__foot">
          ${price(it)}
          ${it.diet ? it.diet.map(c=>`<span class="chip">${c}</span>`).join("") : ``}
          ${addBtn(it)}
        </div>
      </div>
    </article>`;

  const row = it => {
    const sub = [it.sizes, it.note].filter(Boolean).join("  ·  ");
    return `<div class="mrow">
      <span class="mrow__n">${it.n}</span>
      ${has(it) ? `<span class="mrow__dot"></span>${price(it)}` : `<span class="mrow__dot"></span>`}
      ${addBtn(it)}
      ${sub ? `<span class="mrow__sub">${sub}</span>` : ``}
    </div>`;
  };

  /* A tidy descriptive list — name + price on a line, ingredients under,
     bread note under that. Uniform, orderly, no ragged card heights. */
  const listRow = it => `<div class="litem">
      <div class="litem__top">
        <h3>${it.n}${it.diet ? it.diet.map(c=>`<span class="chip">${c}</span>`).join("") : ``}</h3>
        <span class="litem__line"></span>
        ${price(it)}${addBtn(it)}
      </div>
      ${it.d  ? `<p class="litem__d">${it.d}</p>` : ``}
      ${it.on ? `<p class="litem__on">${it.on}</p>` : ``}
    </div>`;

  function render(id){
    const c = MENU.find(m=>m.id===id);
    RCAT = c.id;
    const hero = c.hero
      ? `<figure class="mhero">
           <img class="fade" loading="lazy" src="${IMG(c.hero.img)}" alt="${c.hero.cap}">
           <figcaption>${c.hero.cap}</figcaption>
         </figure>` : ``;
    const foot = c.foot ? `<p class="mfoot">${c.foot}</p>` : ``;
    const body =
        c.style === "cards" ? `<div class="mgrid">${c.items.map(card).join("")}</div>`
      : c.style === "list"  ? `<div class="mlist">${c.items.map(listRow).join("")}</div>`
      :                       `<div class="mrows">${c.items.map(row).join("")}</div>`;
    panel.innerHTML = hero + body + foot;
    fadeIn(panel);
    if(window.OTT_ORDER) window.OTT_ORDER.bind(panel);
    if(matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    $$(".mcard, .mrow, .litem", panel).forEach((el,i)=>{
      el.style.opacity = 0; el.style.transform = "translateY(12px)";
      setTimeout(()=>{
        el.style.transition = "opacity .45s var(--ease), transform .45s var(--ease)";
        el.style.opacity = 1; el.style.transform = "none";
      }, 30 + i*40);
    });
  }

  tabs.innerHTML = MENU.map((m,i)=>
    `<button class="tab" role="tab" data-id="${m.id}" aria-selected="${i===0}">${m.label}</button>`).join("");
  tabs.addEventListener("click", e=>{
    const b = e.target.closest(".tab"); if(!b) return;
    $$(".tab", tabs).forEach(t=>t.setAttribute("aria-selected", t===b));
    b.scrollIntoView({inline:"center",block:"nearest",behavior:"smooth"});
    render(b.dataset.id);
  });
  render(MENU[0].id);
})();

/* ═══════════ gallery + lightbox (place page) ═══════════ */
(function(){
  const grid = $("#gal"); if(!grid) return;
  grid.innerHTML = GALLERY.map((g,i)=>
    `<button class="gitem" data-i="${i}" aria-label="Open photo ${i+1} of ${GALLERY.length}">
       <img class="fade" loading="lazy" src="${IMG(g.img,"sm")}" alt="${g.alt}"></button>`).join("");
  fadeIn(grid);

  const lb = $("#lb"), img = $("#lbImg"), count = $("#lbCount");
  let i = 0;
  function open(n){
    i = (n + GALLERY.length) % GALLERY.length;
    img.src = IMG(GALLERY[i].img); img.alt = GALLERY[i].alt;
    count.textContent = (i+1) + " / " + GALLERY.length;
    lb.classList.add("open");
    requestAnimationFrame(()=>lb.classList.add("show"));
    document.body.style.overflow = "hidden";
    $("#lbX").focus();
  }
  function close(){
    lb.classList.remove("show");
    setTimeout(()=>{ lb.classList.remove("open"); document.body.style.overflow=""; },280);
  }
  grid.addEventListener("click", e=>{
    const b = e.target.closest("[data-i]"); if(b) open(+b.dataset.i);
  });
  $("#lbX").onclick = close;
  $("#lbNext").onclick = ()=>open(i+1);
  $("#lbPrev").onclick = ()=>open(i-1);
  lb.addEventListener("click", e=>{ if(e.target === lb) close(); });
  addEventListener("keydown", e=>{
    if(!lb.classList.contains("open")) return;
    if(e.key === "Escape") close();
    if(e.key === "ArrowRight") open(i+1);
    if(e.key === "ArrowLeft")  open(i-1);
  });
  let sx=0, sy=0;
  lb.addEventListener("touchstart", e=>{ sx=e.touches[0].clientX; sy=e.touches[0].clientY; },{passive:true});
  lb.addEventListener("touchend", e=>{
    const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if(Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) open(i + (dx<0?1:-1));
    else if(dy > 90) close();
  },{passive:true});
})();

/* ═══════════ copy / share / call ═══════════ */
let tT;
function toast(msg){
  const t = $("#toast"); if(!t) return;
  t.textContent = msg; t.classList.add("on");
  clearTimeout(tT); tT = setTimeout(()=>t.classList.remove("on"), 2000);
}
const copyBtn = $("#copyBtn");
if(copyBtn) copyBtn.onclick = async ()=>{
  try{ await navigator.clipboard.writeText(ADDRESS); }
  catch(_){
    const ta = document.createElement("textarea");
    ta.value = ADDRESS; ta.style.position="fixed"; ta.style.opacity=0;
    document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove();
  }
  toast("Address copied");
};
const shareBtn = $("#shareBtn");
if(shareBtn) shareBtn.onclick = async ()=>{
  const d = {title:"Off the Tracks", text:"Railspur Alley, Granville Island", url:location.href};
  if(navigator.share){ try{ await navigator.share(d); }catch(_){} }
  else { try{ await navigator.clipboard.writeText(location.href); toast("Link copied"); }catch(_){} }
};
/* ═══════════ feedback (visit page) ═══════════
   No backend, so it composes a mail rather than pretending to store
   anything. Two taps, against five fields on the old contact form. */
(function(){
  const send = $("#fbSend"); if(!send) return;
  let mood = "";
  $$(".mood__b").forEach(b=>b.onclick = ()=>{
    $$(".mood__b").forEach(x=>x.setAttribute("aria-checked", x === b));
    mood = b.dataset.mood;
  });
  send.onclick = ()=>{
    const text = $("#fbText").value.trim();
    if(!mood && !text){ $("#fbText").focus(); toast("Pick one or leave a note"); return; }
    const body = (mood ? mood + ".\n\n" : "") + text;
    location.href = "mailto:" + EMAIL +
      "?subject=" + encodeURIComponent("Feedback" + (mood ? " — " + mood : "")) +
      "&body=" + encodeURIComponent(body);
  };
})();

/* Call buttons and the printed number stay hidden until PHONE is set */
if(PHONE){
  $$("[data-call]").forEach(el=>{ el.href = "tel:"+PHONE; el.hidden = false; });
  const pretty = PHONE.replace(/^\+1(\d{3})(\d{3})(\d{4})$/, "($1) $2-$3");
  $$("[data-phone-text]").forEach(el=>{
    el.textContent = pretty; el.href = "tel:"+PHONE; el.hidden = false;
  });
}

/* ═══════════ installable + works offline ═══════════
   Granville Island signal is patchy and the building is timber and
   steel. Once visited, the menu, hours and photos stay readable with
   no connection — and the site can be added to the home screen like
   an app, which is the difference between being bookmarked and being
   forgotten. Needs https (or localhost); silently skips on file://. */
if("serviceWorker" in navigator && location.protocol === "https:"){
  addEventListener("load", ()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));
}

/* Chrome/Edge/Android: offer the install once, unobtrusively.
   iOS Safari has no such event — it uses Share ▸ Add to Home Screen. */
let installEvent = null;
addEventListener("beforeinstallprompt", e=>{
  e.preventDefault(); installEvent = e;
  if(localStorage.getItem("ott_install_done")) return;
  const bar = document.createElement("div");
  bar.className = "install";
  bar.innerHTML = `
    <span>Add Off the Tracks to your home screen</span>
    <button class="install__go">Add</button>
    <button class="install__x" aria-label="Not now">×</button>`;
  document.body.appendChild(bar);
  requestAnimationFrame(()=>bar.classList.add("in"));
  const dismiss = ()=>{
    bar.classList.remove("in");
    setTimeout(()=>bar.remove(), 300);
    try{ localStorage.setItem("ott_install_done","1"); }catch(_){}
  };
  bar.querySelector(".install__x").onclick = dismiss;
  bar.querySelector(".install__go").onclick = async ()=>{
    dismiss();
    if(installEvent){ installEvent.prompt(); installEvent = null; }
  };
});

/* ═══════════ shared API for order.js and reserve.js ═══════════
   Keeps hours, time formatting and the toast in one place so the
   ordering and booking flows can never drift from the real hours. */
window.OTT = { HOURS, MENU, MODS:C.mods||{}, PHONE, EMAIL, ADDRESS, SOCIAL, vanNow, fmt, clock, toast };

/* ═══════════ demo disclaimer footer ═══════════ */
(function(){
  const foot = document.createElement("footer");
  foot.className = "demo-foot";
  foot.innerHTML =
    '<div class="demo-foot__brand">' +
      '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.2"/>' +
      '<path d="M8 8l8 8M16 8l-8 8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>' +
      'Built by Pittahaya</div>' +
    '<p>This website is a <strong style="color:rgba(246,241,231,.85)">demonstration concept</strong> ' +
      'created by <a href="https://www.pittahaya.com" target="_blank" rel="noopener">Pittahaya</a>. ' +
      'All photographs are used strictly for presentation purposes.</p>' +
    '<span class="demo-foot__sep"></span>' +
    '<p>If you are the business owner and do not wish to proceed with our services, ' +
      'this site will be taken down immediately upon request. ' +
      'For any questions or concerns, reach us at ' +
      '<a href="https://www.pittahaya.com" target="_blank" rel="noopener">pittahaya.com</a>.</p>';
  document.body.appendChild(foot);
})();

/* ═══════════ hero parallax (home only) ═══════════ */
(function(){
  const media = $("#heroMedia"); if(!media) return;
  if(matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  let t = false;
  addEventListener("scroll", ()=>{
    if(t) return; t = true;
    requestAnimationFrame(()=>{
      t = false;
      const y = scrollY;
      if(y < innerHeight * 1.2) media.style.transform = `translate3d(0,${y*.3}px,0)`;
    });
  },{passive:true});
})();
})();
