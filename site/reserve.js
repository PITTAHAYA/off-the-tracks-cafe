/* ═══════════════════════════════════════════════════════════
   OFF THE TRACKS — table booking
   Slots come from the real opening hours. Availability is
   SIMULATED but deterministic: the same date, time and party size
   always give the same answer, so it behaves like a real system
   instead of reshuffling on every render.

   DEMO_MODE = true means nothing is reserved and the confirmation
   says so. To go live, point book() at a real booking provider
   (OpenTable, Tock, Resy) and set DEMO_MODE = false.
   ═══════════════════════════════════════════════════════════ */
(function(){
"use strict";
const root = document.getElementById("reserve");
if(!root || typeof OTT === "undefined") return;

const DEMO_MODE = true;
const DAYS      = 14;     // how far ahead you can book
const STEP      = 30;     // minutes between slots
const LAST      = 60;     // no bookings within this many minutes of closing

const $  = (s,r=root) => r.querySelector(s);
const $$ = (s,r=root) => [...r.querySelectorAll(s)];

let party = 2, dayIdx = 0, chosen = null;

/* ── the dates you can pick ────────────────────────────── */
const DAYNAME = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MON     = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function days(){
  const out = [];
  const base = new Date();
  for(let i = 0; i < DAYS; i++){
    const d = new Date(base.getTime() + i*86400000);
    const parts = new Intl.DateTimeFormat("en-CA",{timeZone:"America/Vancouver",
      weekday:"short", day:"numeric", month:"numeric", year:"numeric"}).formatToParts(d);
    const g = t => parts.find(p=>p.type===t).value;
    const dow = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].indexOf(g("weekday"));
    out.push({
      dow, day:+g("day"), month:+g("month"), year:+g("year"),
      key:`${g("year")}-${g("month")}-${g("day")}`,
      short: i===0 ? "Today" : i===1 ? "Tomorrow" : DAYNAME[dow].slice(0,3),
      num: g("day"), mon: MON[+g("month")-1]
    });
  }
  return out;
}
const DATES = days();

/* ── deterministic "is this slot free?" ────────────────── */
function hash(str){
  let h = 2166136261;
  for(let i = 0; i < str.length; i++){ h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0) / 4294967295;
}
function seatsFor(date, mins, size){
  const weekend = date.dow === 0 || date.dow === 6;
  const midday  = mins >= 11*60 && mins <= 14*60;
  /* busier at weekends and over lunch; big tables are scarcer */
  let pressure = 0.10 + (weekend ? 0.14 : 0) + (midday ? 0.16 : 0) + (size >= 6 ? 0.16 : size >= 5 ? 0.08 : 0);
  const roll = hash(date.key + ":" + mins + ":" + size);
  if(roll < pressure)        return 0;                    // full
  if(roll < pressure + 0.14) return 1 + Math.floor(hash("t"+date.key+mins) * 2); // 1–2 left
  return 6;                                               // plenty
}

function slotsFor(date){
  const h = OTT.HOURS[date.dow];
  const now = OTT.vanNow();
  const isToday = date.short === "Today";
  const out = [];
  for(let t = h.open*60; t <= h.close*60 - LAST; t += STEP){
    if(isToday && t < now.mins + 45) continue;            // no same-hour walk-ins
    out.push({mins:t, seats:seatsFor(date, t, party)});
  }
  return out;
}

/* ── views ─────────────────────────────────────────────── */
function paint(){
  const date = DATES[dayIdx];
  const list = slotsFor(date);
  const open = list.filter(s=>s.seats > 0).length;

  root.innerHTML = `
    <p class="eyebrow">Book a table</p>
    <h2 class="rsv__h">Save yourself a seat.</h2>
    <p class="rsv__sub">Walk-ins are always welcome — but the loft fills up at lunch.</p>

    <div class="rsv__lbl">Party size</div>
    <div class="rsv__row" role="radiogroup" aria-label="Party size">
      ${[1,2,3,4,5,6,7,8].map(n=>`
        <button class="pchip" role="radio" data-party="${n}"
                aria-checked="${n===party}">${n}${n===8?"+":""}</button>`).join("")}
    </div>

    <div class="rsv__lbl">Date</div>
    <div class="rsv__row rsv__row--scroll" role="radiogroup" aria-label="Date">
      ${DATES.map((d,i)=>`
        <button class="dchip" role="radio" data-day="${i}" aria-checked="${i===dayIdx}">
          <span>${d.short}</span><b>${d.num}</b><i>${d.mon}</i>
        </button>`).join("")}
    </div>

    <div class="rsv__lbl">
      Time
      <em class="rsv__avail ${open ? "" : "none"}">
        ${open ? open + " time" + (open===1?"":"s") + " open" : "fully booked"}
      </em>
    </div>
    ${list.length ? `
      <div class="slots" role="radiogroup" aria-label="Time">
        ${list.map(s=>`
          <button class="slot" role="radio" data-mins="${s.mins}"
                  ${s.seats === 0 ? "disabled" : ""} aria-checked="false"
                  aria-label="${OTT.clock(s.mins)}${s.seats===0?", fully booked":s.seats<=2?", "+s.seats+" tables left":""}">
            ${OTT.clock(s.mins)}
            ${s.seats === 0 ? `<i>Full</i>` : s.seats <= 2 ? `<i class="few">${s.seats} left</i>` : ``}
          </button>`).join("")}
      </div>` : `<p class="rsv__none">${
        date.short === "Today"
          ? "Too late to book for today — tomorrow is open."
          : "No tables left on this day."
      }</p>`}

    <div id="rsvForm"></div>`;

  wire();
}

function wire(){
  $$("[data-party]").forEach(b=>b.onclick = ()=>{ party = +b.dataset.party; chosen = null; paint(); });
  $$("[data-day]").forEach(b=>b.onclick   = ()=>{ dayIdx = +b.dataset.day; chosen = null; paint(); });
  $$(".slot:not([disabled])").forEach(b=>b.onclick = ()=>{
    $$(".slot").forEach(x=>x.setAttribute("aria-checked", x === b));
    chosen = +b.dataset.mins;
    showForm();
  });
}

function showForm(){
  const date = DATES[dayIdx];
  $("#rsvForm").innerHTML = `
    <div class="rsv__form">
      <p class="rsv__pick">
        <b>${party} ${party===1?"person":"people"}</b> ·
        ${date.short === "Today" || date.short === "Tomorrow"
          ? date.short : DAYNAME[date.dow]} ${date.num} ${date.mon} ·
        <b>${OTT.clock(chosen)}</b>
      </p>
      <label class="fld"><span>Name</span>
        <input id="rName" type="text" autocomplete="name" placeholder="Name for the table"></label>
      <label class="fld"><span>Mobile</span>
        <input id="rPhone" type="tel" autocomplete="tel" placeholder="In case anything changes"></label>
      <button class="btn btn--fill" id="rGo">Request this table</button>
    </div>`;
  $("#rsvForm").scrollIntoView({behavior:"smooth", block:"nearest"});
  $("#rGo").onclick = book;
}

/* The single point that would talk to a real booking provider. */
function book(){
  const name = $("#rName").value.trim();
  if(!name){ $("#rName").focus(); OTT.toast("Add a name for the table"); return; }
  const btn = $("#rGo");
  btn.disabled = true; btn.textContent = "Checking the book…";

  setTimeout(()=>{
    const date = DATES[dayIdx];
    const ref  = "T-" + Math.floor(1000 + Math.random()*9000);
    root.innerHTML = `
      <div class="tick2" aria-hidden="true">✓</div>
      <p class="eyebrow">Booking ${ref}</p>
      <h2 class="rsv__h">Table for ${party}, ${OTT.clock(chosen)}.</h2>
      <p class="rsv__sub">
        ${DAYNAME[date.dow]} ${date.num} ${date.mon} · under ${name}<br>
        1363 Railspur Alley — we'll hold it for 15 minutes.
      </p>
      ${DEMO_MODE ? `<p class="demo">Preview only — no table has actually been reserved.</p>` : ``}
      <button class="btn btn--out" id="rAgain">Book another</button>`;
    $("#rAgain").onclick = ()=>{ chosen = null; paint(); };
  }, 1100);
}

paint();
})();
