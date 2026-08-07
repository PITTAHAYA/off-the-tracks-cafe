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

function add(id, n, p){
  const found = cart.find(i=>i.id === id);
  if(found) found.q++;
  else cart.push({id, n, p:parseFloat(p), q:1});
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
          <span class="cline__n">${i.n}</span>
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

/* Add buttons are injected by menu.html after each render */
window.OTT_ORDER = {
  add,
  bind(root){
    $$("[data-add]", root).forEach(b=>{
      b.onclick = e=>{
        e.preventDefault(); e.stopPropagation();
        add(b.dataset.add, b.dataset.name, b.dataset.price);
        OTT.toast(b.dataset.name + " added");
      };
    });
  }
};

paint();
/* app.js renders the first menu tab before this file loads, so bind
   whatever is already on the page. Later tab switches call bind() themselves. */
window.OTT_ORDER.bind(document);
})();
