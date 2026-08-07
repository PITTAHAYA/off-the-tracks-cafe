/* ═══════════════════════════════════════════════════════════
   OFF THE TRACKS — stamp card
   Ten coffees, the eleventh is on the house. Lives in the visitor's
   own browser, so there's no account to make and no data to hold.

   In the demo the counter stamps itself so the mechanic is visible.
   In production a stamp should only come from the café's side —
   scan a rotating QR at the till, or a one-time code from the POS —
   otherwise anyone can stamp their own card. stamp() is the seam.
   ═══════════════════════════════════════════════════════════ */
(function(){
"use strict";
const root = document.getElementById("rewards");
if(!root || typeof OTT === "undefined") return;

const DEMO_MODE = true;
const GOAL = 10;
const KEY  = "ott_stamps_v1";

let state = {n:0, free:0};
try{ state = Object.assign(state, JSON.parse(localStorage.getItem(KEY)) || {}); }catch(_){}
const save = () => { try{ localStorage.setItem(KEY, JSON.stringify(state)); }catch(_){} };

function stamp(){
  state.n++;
  if(state.n >= GOAL){ state.n = 0; state.free++; celebrate(); }
  save(); paint();
}
function celebrate(){
  OTT.toast("Free coffee unlocked");
  root.classList.add("won");
  setTimeout(()=>root.classList.remove("won"), 1400);
}

function paint(){
  const left = GOAL - state.n;
  root.innerHTML = `
    <div class="card">
      <div class="card__top">
        <span class="card__brand">Off the Tracks</span>
        <span class="card__n">${state.n} / ${GOAL}</span>
      </div>

      <div class="dots" role="img"
           aria-label="${state.n} of ${GOAL} stamps collected">
        ${Array.from({length:GOAL}, (_,i)=>`
          <span class="dot ${i < state.n ? "on" : ""}" style="--i:${i}">
            ${i < state.n ? `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 8h1a3 3 0 0 1 0 6h-1M3 8h15v7a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4zM6 2v3M10 2v3M14 2v3"/></svg>` : ``}
          </span>`).join("")}
      </div>

      <p class="card__msg">
        ${left === GOAL ? "Ten coffees, the eleventh is on us."
         : left === 1   ? "One more and the next one's free."
         : `${left} more to a free coffee.`}
      </p>

      ${state.free ? `<p class="card__free">
        <b>${state.free}</b> free coffee${state.free===1?"":"s"} waiting — just say so at the till.
      </p>` : ``}
    </div>

    ${DEMO_MODE ? `
      <button class="btn btn--fill" id="stampBtn">Add a stamp</button>
      <p class="demo">
        Preview — the button stands in for scanning the café's code at the till,
        so a customer can't stamp their own card.
      </p>` : ``}

    ${state.n || state.free ? `<button class="btn btn--ghost" id="resetBtn">Reset card</button>` : ``}`;

  const s = document.getElementById("stampBtn");
  if(s) s.onclick = stamp;
  const r = document.getElementById("resetBtn");
  if(r) r.onclick = ()=>{ state = {n:0, free:0}; save(); paint(); OTT.toast("Card reset"); };
}

paint();
})();
