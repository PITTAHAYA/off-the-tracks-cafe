/* ═══════════════════════════════════════════════════════════
   OFF THE TRACKS — pickup ordering
   Cart → checkout → confirmation, with the pickup times derived
   from the café's real opening hours.

   DEMO_MODE = true means nothing leaves the browser: no order is
   sent, no payment is taken, and the confirmation says so. To make
   it real, wire submitOrder() to a POS/Stripe endpoint and set
   DEMO_MODE = false — nothing else in this file needs to change.
   ═══════════════════════════════════════════════════════════ */
(function(){
"use strict";
if(typeof OTT === "undefined") return;          // app.js exposes the shared data

const DEMO_MODE = true;
const GST       = 0.05;                          // BC GST on prepared food
const LEAD_MINS = 20;                            // earliest pickup from now
const KEY       = "ott_cart_v1";

const $  = (s,r=document) => r.querySelector(s);
const $$ = (s,r=document) => [...r.querySelectorAll(s)];
const money = n => "$" + n.toFixed(2);

/* ── state ─────────────────────────────────────────────── */
let cart = [];
try{ cart = JSON.parse(localStorage.getItem(KEY)) || []; }catch(_){ cart = []; }
const save = () => { try{ localStorage.setItem(KEY, JSON.stringify(cart)); }catch(_){} };

const count    = () => cart.reduce((n,i)=>n + i.q, 0);
const subtotal = () => cart.reduce((n,i)=>n + i.p * i.q, 0);
const tax      = () => subtotal() * GST;
const total    = () => subtotal() + tax();

const slug = n => n.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");

function add(id, n, p, sub){
  const found = cart.find(i=>i.id === id);
  if(found) found.q++;
  else cart.push({id, n, p:parseFloat(p), q:1, sub:sub||""});
  save(); paint(); bump();
}
function setQty(id, q){
  const i = cart.find(x=>x.id === id); if(!i) return;
  i.q = q;
  if(i.q <= 0) cart = cart.filter(x=>x.id !== id);
  save(); paint();
}

/* ── pickup slots, from the real opening hours ─────────── */
function slots(){
  const now = OTT.vanNow();
  const out = [];
  for(let dayOffset = 0; dayOffset < 3 && out.length < 8; dayOffset++){
    const idx = (now.day + dayOffset) % 7;
    const h   = OTT.HOURS[idx];
    let t = h.open * 60;
    if(dayOffset === 0) t = Math.max(t, Math.ceil((now.mins + LEAD_MINS)/15) * 15);
    for(; t < h.close * 60 && out.length < 8; t += 15){
      out.push({
        mins:t, dayOffset,
        label:(dayOffset === 0 ? "Today" : dayOffset === 1 ? "Tomorrow" : h.day) +
              " · " + OTT.clock(t)
      });
    }
  }
  return out;
}

/* ── the floating cart pill ────────────────────────────── */
const pill = document.createElement("button");
pill.className = "cartpill";
pill.setAttribute("aria-label", "Open your order");
document.body.appendChild(pill);
pill.onclick = () => openSheet("cart");

function bump(){
  pill.classList.remove("pop");
  void pill.offsetWidth;
  pill.classList.add("pop");
}

/* ── the sheet (cart / checkout / done) ────────────────── */
const sheet = document.createElement("div");
sheet.className = "sheet";
sheet.innerHTML = `
  <div class="sheet__scrim" data-close></div>
  <div class="sheet__panel" role="dialog" aria-modal="true" aria-label="Your order">
    <button class="sheet__x" data-close aria-label="Close">×</button>
    <div class="sheet__body" id="sheetBody"></div>
  </div>`;
document.body.appendChild(sheet);
sheet.addEventListener("click", e=>{ if(e.target.closest("[data-close]")) closeSheet(); });
addEventListener("keydown", e=>{ if(e.key === "Escape" && sheet.classList.contains("open")) closeSheet(); });

let step = "cart";
function openSheet(s){
  step = s; render();
  sheet.classList.add("open");
  requestAnimationFrame(()=>sheet.classList.add("show"));
  document.body.style.overflow = "hidden";
  $(".sheet__x", sheet).focus();
}
function closeSheet(){
  sheet.classList.remove("show");
  setTimeout(()=>{ sheet.classList.remove("open"); document.body.style.overflow = ""; }, 280);
}

/* ── views ─────────────────────────────────────────────── */
function viewCart(){
  if(!cart.length) return `
    <p class="eyebrow">Your order</p>
    <h2 class="sheet__h">Nothing in it yet.</h2>
    <p class="sheet__note">Add something from the menu and it'll show up here.</p>
    <a class="btn btn--fill" href="menu.html">See the menu</a>`;

  return `
    <p class="eyebrow">Your order</p>
    <h2 class="sheet__h">Pick up at Railspur</h2>
    <div class="lines">
      ${cart.map(i=>`
        <div class="cline">
          <div class="cline__main">
            <span class="cline__n">${i.n}</span>
            ${i.sub ? `<span class="cline__sub">${i.sub}</span>` : ``}
          </div>
          <span class="cline__p">${money(i.p * i.q)}</span>
          <div class="qty">
            <button data-q="${i.id}" data-v="${i.q-1}" aria-label="One fewer ${i.n}">−</button>
            <span aria-live="polite">${i.q}</span>
            <button data-q="${i.id}" data-v="${i.q+1}" aria-label="One more ${i.n}">+</button>
          </div>
        </div>`).join("")}
    </div>
    <dl class="totals">
      <div><dt>Subtotal</dt><dd>${money(subtotal())}</dd></div>
      <div><dt>GST 5%</dt><dd>${money(tax())}</dd></div>
      <div class="totals__t"><dt>Total</dt><dd>${money(total())}</dd></div>
    </dl>
    <button class="btn btn--fill" id="toCheckout">Checkout · ${money(total())}</button>`;
}

function viewCheckout(){
  const opts = slots();
  return `
    <p class="eyebrow">Pickup</p>
    <h2 class="sheet__h">When suits you?</h2>
    <div class="chips" role="radiogroup" aria-label="Pickup time">
      ${opts.map((s,i)=>`
        <button class="chip2" role="radio" data-slot="${i}"
                aria-checked="${i===0}">${s.label}</button>`).join("")}
    </div>
    <label class="fld"><span>Name</span>
      <input id="fName" type="text" autocomplete="name" placeholder="Who's collecting"></label>
    <label class="fld"><span>Mobile</span>
      <input id="fPhone" type="tel" autocomplete="tel" placeholder="For when it's ready"></label>

    <p class="eyebrow" style="margin-top:26px">Payment</p>
    <div class="pay" role="radiogroup" aria-label="Payment method">
      <button class="pay__opt" role="radio" aria-checked="true" data-pay="counter">
        <b>Pay at the counter</b><span>Card or cash when you collect</span></button>
      <button class="pay__opt" role="radio" aria-checked="false" data-pay="card">
        <b>Pay now by card</b><span>${DEMO_MODE ? "Simulated in this preview" : "Secure checkout"}</span></button>
    </div>

    <button class="btn btn--fill" id="place">Place order · ${money(total())}</button>
    <button class="btn btn--ghost" id="backCart">Back to order</button>`;
}

function viewDone(o){
  return `
    <div class="tick2" aria-hidden="true">✓</div>
    <p class="eyebrow">Order ${o.ref}</p>
    <h2 class="sheet__h">See you at ${o.time}.</h2>
    <p class="sheet__note">
      ${o.pay === "card" ? "Paid" : "Pay at the counter"} · ${money(o.total)}<br>
      1363 Railspur Alley — we'll have it on the pass.
    </p>
    ${DEMO_MODE ? `<p class="demo">Preview only — no order was sent and no payment was taken.</p>` : ``}
    <button class="btn btn--fill" data-close>Done</button>`;
}

function render(){
  const body = $("#sheetBody", sheet);
  if(step === "cart")     body.innerHTML = viewCart();
  if(step === "checkout") body.innerHTML = viewCheckout();
  body.scrollTop = 0;
  wire();
}

function wire(){
  const body = $("#sheetBody", sheet);

  $$("[data-q]", body).forEach(b=>b.onclick = ()=>{
    setQty(b.dataset.q, +b.dataset.v); render();
  });
  const go = $("#toCheckout", body);
  if(go) go.onclick = ()=>{ step = "checkout"; render(); };
  const back = $("#backCart", body);
  if(back) back.onclick = ()=>{ step = "cart"; render(); };

  $$("[data-slot]", body).forEach(b=>b.onclick = ()=>{
    $$("[data-slot]", body).forEach(x=>x.setAttribute("aria-checked", x === b));
  });
  $$("[data-pay]", body).forEach(b=>b.onclick = ()=>{
    $$("[data-pay]", body).forEach(x=>x.setAttribute("aria-checked", x === b));
  });

  const place = $("#place", body);
  if(place) place.onclick = ()=>submitOrder(body, place);
}

/* The single point that would talk to a real POS or payment provider. */
function submitOrder(body, btn){
  const name = $("#fName", body).value.trim();
  if(!name){
    $("#fName", body).focus();
    OTT.toast("Add a name for the order");
    return;
  }
  const slotEl = $('[data-slot][aria-checked="true"]', body);
  const time   = slotEl ? slotEl.textContent.split("·").pop().trim() : "soon";
  const pay    = $('[data-pay][aria-checked="true"]', body).dataset.pay;
  const amount = total();

  btn.disabled = true;
  btn.textContent = pay === "card" ? "Taking payment…" : "Sending to the kitchen…";

  setTimeout(()=>{
    const ref = "OTT-" + Math.floor(1000 + Math.random()*9000);
    cart = []; save(); paint();
    step = "done";
    $("#sheetBody", sheet).innerHTML = viewDone({ref, time, pay, total:amount});
    wire();
  }, 1100);
}

/* ── paint the pill + any add buttons ──────────────────── */
function paint(){
  const n = count();
  pill.hidden = n === 0;
  pill.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h2l2.2 9.4a2 2 0 0 0 2 1.6h6.9a2 2 0 0 0 2-1.5L21 8H7"/><circle cx="10" cy="20" r="1.3"/><circle cx="18" cy="20" r="1.3"/></svg>
    <span>${n} item${n===1?"":"s"}</span><b>${money(total())}</b>`;
  if(sheet.classList.contains("open") && step === "cart") render();
}

/* ═══════════════════════════════════════════════════════════
   CUSTOMIZE — size, milk, sweetness, ice, extras, a side.
   A second bottom sheet that opens over the menu. Drinks with any
   option open it; plain items (baked) add in one tap.
   ═══════════════════════════════════════════════════════════ */
const M = () => OTT.MODS || {};
const ICE_G = () => ({key:"ice", label:"Ice", choices:M().ice || []});

function buildGroups(item, cat){
  const G = [];
  const sizes = (item.sizes || "").match(/\d+/g);
  if(sizes && sizes.length > 1){
    const d = sizes.length >= 3 ? [0, 0.60, 1.10] : [0, 0.60];
    G.push({key:"size", label:"Size", choices: sizes.map((s,i)=>({n:s+"oz", d:d[i]||0}))});
  }
  if(cat.customize){
    if(!item.iced && !item.noIce)
      G.push({key:"temp", label:"Temperature", choices:[{n:"Hot"},{n:"Iced"}]});
    if(item.milk !== false && (M().milk||[]).length)
      G.push({key:"milk", label:"Milk", choices:M().milk});
    if((M().sweet||[]).length)
      G.push({key:"sweet", label:"Sweetness", choices:M().sweet, def:2});
    if((M().extras||[]).length)
      G.push({key:"extras", label:"Add anything", multi:true, choices:M().extras});
  }
  if(cat.side && (M().sides||[]).length)
    G.push({key:"side", label:"Choose a side", choices:M().sides});
  return G;
}

let cst = null;

function icedNow(){
  if(cst.item.iced) return true;
  const t = cst.groups.find(g=>g.key==="temp");
  return !!(t && cst.sel.temp === 1);
}
/* base groups, with an Ice group revealed whenever the drink is iced */
function displayGroups(){
  const out = [];
  if(cst.item.iced){                        // always-iced: ice sits after size
    for(const g of cst.groups){ out.push(g); if(g.key==="size") out.push(ICE_G()); }
    if(!cst.groups.some(g=>g.key==="size")) out.unshift(ICE_G());
  } else {
    for(const g of cst.groups){ out.push(g); if(g.key==="temp" && icedNow()) out.push(ICE_G()); }
  }
  return out;
}
function custPrice(){
  let p = parseFloat(cst.item.p);
  displayGroups().forEach(g=>{
    if(g.multi) return;
    const c = g.choices[cst.sel[g.key]||0];
    if(c && c.d) p += c.d;
  });
  cst.extras.forEach(i=> p += (M().extras[i].d || 0));
  return p;
}

const csheet = document.createElement("div");
csheet.className = "sheet";
csheet.innerHTML = `
  <div class="sheet__scrim" data-cclose></div>
  <div class="sheet__panel" role="dialog" aria-modal="true" aria-label="Customize your order">
    <button class="sheet__x" data-cclose aria-label="Close">×</button>
    <div class="sheet__body" id="csheetBody"></div>
  </div>`;
document.body.appendChild(csheet);
csheet.addEventListener("click", e=>{ if(e.target.closest("[data-cclose]")) closeCSheet(); });
addEventListener("keydown", e=>{ if(e.key==="Escape" && csheet.classList.contains("open")) closeCSheet(); });

function openCSheet(){
  csheet.classList.add("open");
  requestAnimationFrame(()=>csheet.classList.add("show"));
  document.body.style.overflow = "hidden";
  $(".sheet__x", csheet).focus();
}
function closeCSheet(){
  csheet.classList.remove("show");
  setTimeout(()=>{ csheet.classList.remove("open"); document.body.style.overflow=""; }, 280);
}

function openCustomize(item, cat){
  const groups = buildGroups(item, cat);
  if(!groups.length){ add(slug(item.n), item.n, item.p); OTT.toast(item.n + " added"); return; }
  cst = { item, cat, groups, sel:{}, extras:new Set(), qty:1 };
  groups.forEach(g=>{ if(!g.multi) cst.sel[g.key] = g.def || 0; });
  renderCustomize();
  openCSheet();
}

function renderCustomize(){
  const it = cst.item;
  if(cst.sel.ice === undefined) cst.sel.ice = 0;
  const groups = displayGroups();
  $("#csheetBody", csheet).innerHTML = `
    <p class="eyebrow">Make it yours</p>
    <h2 class="sheet__h">${it.n}</h2>
    ${groups.map(g=>`
      <div class="optg">
        <div class="optg__l">${g.label}</div>
        <div class="chips2">
          ${g.choices.map((c,i)=>{
            const on = g.multi ? cst.extras.has(i) : (cst.sel[g.key]||0) === i;
            const attr = g.multi ? `data-x="${i}"` : `data-g="${g.key}" data-i="${i}"`;
            return `<button class="chip3" ${attr} aria-checked="${on}">${c.n}${c.d?`<i>+$${c.d.toFixed(2)}</i>`:``}</button>`;
          }).join("")}
        </div>
      </div>`).join("")}
    <div class="cqty">
      <span class="optg__l">Quantity</span>
      <div class="qty">
        <button id="cqMinus" aria-label="One fewer">−</button>
        <span aria-live="polite">${cst.qty}</span>
        <button id="cqPlus" aria-label="One more">+</button>
      </div>
    </div>
    <button class="btn btn--fill" id="cAdd">Add to order — ${money(custPrice()*cst.qty)}</button>`;

  const b = $("#csheetBody", csheet);
  $$("[data-g]", b).forEach(el=>el.onclick = ()=>{ cst.sel[el.dataset.g] = +el.dataset.i; renderCustomize(); });
  $$("[data-x]", b).forEach(el=>el.onclick = ()=>{
    const i = +el.dataset.x; cst.extras.has(i) ? cst.extras.delete(i) : cst.extras.add(i); renderCustomize();
  });
  $("#cqMinus", b).onclick = ()=>{ cst.qty = Math.max(1, cst.qty-1); renderCustomize(); };
  $("#cqPlus", b).onclick  = ()=>{ cst.qty++; renderCustomize(); };
  $("#cAdd", b).onclick = commitCustomize;
}

/* human summary of the non-default choices, e.g. "12oz · Oat · Iced · Extra shot" */
function commitCustomize(){
  const it = cst.item, parts = [];
  displayGroups().forEach(g=>{
    if(g.multi) return;
    const idx = cst.sel[g.key] || 0, c = g.choices[idx];
    if(!c) return;
    if(g.key === "size")       parts.push(c.n);
    else if(g.key === "temp"){ if(idx === 1) parts.push("Iced"); }
    else if(g.key === "milk"){ if(idx !== 0) parts.push(c.n); }
    else if(g.key === "sweet"){ if(idx !== 2) parts.push(c.n); }
    else if(g.key === "ice"){  if(idx !== 0) parts.push(c.n); }
    else if(g.key === "side")  parts.push(c.n);
  });
  [...cst.extras].sort((a,b)=>a-b).forEach(i=> parts.push(M().extras[i].n));
  const sub = parts.join("  ·  ");
  const id = slug(it.n) + "|" + sub.toLowerCase().replace(/[^a-z0-9]+/g,"");
  const unit = custPrice();
  const found = cart.find(x=>x.id === id);
  if(found) found.q += cst.qty;
  else cart.push({id, n:it.n, p:unit, q:cst.qty, sub});
  save(); paint(); bump();
  closeCSheet();
  OTT.toast(it.n + " added");
}

/* Add buttons are injected by menu.html after each render */
window.OTT_ORDER = {
  add,
  bind(root){
    $$("[data-add]", root).forEach(b=>{
      b.onclick = e=>{
        e.preventDefault(); e.stopPropagation();
        const cat  = (OTT.MENU || []).find(c=>c.id === b.dataset.cat);
        const item = cat && cat.items.find(x=>x.n === b.dataset.name);
        if(item) openCustomize(item, cat);
        else { add(b.dataset.add, b.dataset.name, b.dataset.price); OTT.toast(b.dataset.name + " added"); }
      };
    });
  }
};

paint();
/* app.js renders the first menu tab before this file loads, so bind
   whatever is already on the page. Later tab switches call bind() themselves. */
window.OTT_ORDER.bind(document);
})();
