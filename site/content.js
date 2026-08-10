/* ═══════════════════════════════════════════════════════════
   OFF THE TRACKS — everything the café can change.

   This is the ONLY file that needs editing to update the site.
   Use admin.html to edit it in a browser — no code required.

   Loaded before app.js, so it's plain JavaScript rather than JSON
   (works from a file:// double-click, no fetch, no CORS).
   ═══════════════════════════════════════════════════════════ */
window.OTT_CONTENT = {

  /* ── the basics ─────────────────────────────────────── */
  phone:   "+16046898700",
  email:   "info@tracksbistro.ca",
  address: "1363 Railspur Alley, Vancouver, BC V6H 4G9",
  instagram: "https://www.instagram.com/offthetracksbistro/",
  facebook:  "https://www.facebook.com/tracksbistro",

  /* Show prices on the site? Set false to hide every price. */
  showPrices: true,

  /* ── today's board ──────────────────────────────────────
     Leave `text` empty to hide the banner completely.
     This is the one thing worth changing most days.        */
  special: {
    text: "",                      // e.g. "Soup today: roasted tomato & fennel"
    until: ""                      // optional, e.g. "while it lasts"
  },

  /* ── opening hours ──────────────────────────────────────
     24-hour clock. 0 = Sunday.                             */
  hours: [
    {day:"Sunday",    open:9, close:17},
    {day:"Monday",    open:9, close:16},
    {day:"Tuesday",   open:9, close:16},
    {day:"Wednesday", open:9, close:16},
    {day:"Thursday",  open:9, close:16},
    {day:"Friday",    open:9, close:16},
    {day:"Saturday",  open:9, close:17}
  ],

  /* ── reviews ────────────────────────────────────────────
     rating + count come from the Google listing.
     quotes: paste REAL reviews only. Empty array = the section
     shows the rating and a link, and no quotes.            */
  reviews: {
    rating: 4.0,
    count:  0,                     // put the real number from Google here
    url: "https://www.google.com/maps/place/Off+the+Tracks/@49.270467,-123.133789,16z/data=!4m5!3m4!1s0x0:0xea4001cf150c8f99!8m2!3d49.2704673!4d-123.1337891",
    quotes: []                     // {text:"…", who:"Google review"}
  },

  /* ── the menu ───────────────────────────────────────────
     img: a file in assets/ (e.g. "IMG_4180.jpg"). Leave it out
     and the card shows a placeholder until a photo exists.  */
  menu: [
    { id:"eats", label:"Eats", style:"cards",
      foot:"Sandwiches on certified organic bread from A Bread Affair.",
      items:[
        {n:"Avocado Toast",     p:"16.50", img:"IMG_4184.jpg", tag:"Favourite", diet:["V"]},
        {n:"Chicken Fig",       p:"18.50", img:"IMG_4180.jpg"},
        {n:"Egg Sandwich",      p:"14.00", note:"bacon or avocado"},
        {n:"Breakfast Burrito", p:"16.00"},
        {n:"Grilled Cheese",    p:"14.50", diet:["V"]},
        {n:"Tomato Pesto",      p:"14.50", diet:["V"]},
        {n:"Chicken Club",      p:"18.50"},
        {n:"Beet-L-T",          p:"16.00", diet:["V"]},
        {n:"Sides",             p:"6.50",  note:"fries, soup or salad"}
    ]},

    { id:"baked", label:"Baked", style:"cards",
      foot:"Baked fresh every morning. Come early to see what's in.",
      items:[
        {n:"Croissant",         p:"4.75", img:"IMG_4190.jpg", diet:["V"]},
        {n:"Pain au Chocolat",  p:"5.25", img:"IMG_4191.jpg", diet:["V"]},
        {n:"Cruffin",           p:"6.25", img:"IMG_4185.jpg", tag:"Favourite", diet:["V"]},
        {n:"Loaf Cake",         p:"5.00", img:"IMG_4188.jpg", diet:["V"]},
        {n:"Macarons",          p:"3.00", img:"IMG_4183.jpg", diet:["GF"]},
        {n:"Tarts",             p:"7.00", img:"IMG_4194.jpg", diet:["V"]},
        {n:"Cakes",             p:"6.75", img:"IMG_4234.jpg", diet:["V"]},
        {n:"Pies",              p:"7.25", img:"IMG_4193.jpg", diet:["V"]}
    ]},

    { id:"drinks", label:"Drinks", style:"rows",
      hero:{img:"IMG_4174.jpg", cap:"Cappuccino, on the terrace"},
      foot:"Direct-trade beans from a local roaster, pulled on a vintage Synesso.",
      items:[
        {n:"Espresso",   p:"3.50"},
        {n:"Americano",  p:"4.00"},
        {n:"Cortado",    p:"4.50"},
        {n:"Flat White", p:"5.00"},
        {n:"Cappuccino", p:"5.00"},
        {n:"Latte",      p:"5.25"},
        {n:"Mocha",      p:"5.75"},
        {n:"Tea",        p:"4.00"},
        {n:"Craft Beer", p:"8.50", note:"local, rotating"},
        {n:"Wine",       p:"11.00"},
        {n:"Cocktails",  p:"13.00"},
        {n:"Spirits",    p:"10.00"}
    ]}
  ]
};
