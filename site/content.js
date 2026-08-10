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
    { id:"coffee", label:"Coffee", style:"rows",
      hero:{img:"IMG_4174.jpg", cap:"Cappuccino, on the terrace"},
      foot:"Direct-trade beans from a local roaster, pulled on a vintage Synesso.",
      items:[
        {n:"Drip Coffee",          sizes:"8 · 12 · 16oz"},
        {n:"Iced Drip Coffee",     sizes:"12 · 16oz"},
        {n:"Espresso",             sizes:"2oz"},
        {n:"Americano",            sizes:"8 · 12 · 16oz"},
        {n:"Latte",                sizes:"8 · 12 · 16oz"},
        {n:"Cappuccino",           sizes:"8 · 12 · 16oz"},
        {n:"Mocha",                sizes:"8 · 12 · 16oz"},
        {n:"White Chocolate Mocha",sizes:"8 · 12 · 16oz"},
        {n:"Cortado",              sizes:"5oz"},
        {n:"Flat White",           sizes:"8oz"},
        {n:"Espresso Macchiato",   sizes:"3oz"},
        {n:"Caramel Macchiato",    sizes:"8 · 12 · 16oz"},
        {n:"Dirty Chai Latte",     sizes:"8 · 12 · 16oz"}
    ]},

    { id:"noncoffee", label:"Non-Coffee", style:"rows",
      foot:"Add-ons: oat, almond, soy or coconut milk · syrups · whipped cream · espresso shot · liqueur.",
      items:[
        {n:"Matcha Latte",    sizes:"8 · 12 · 16oz"},
        {n:"Chai Latte",      sizes:"8 · 12 · 16oz"},
        {n:"Turmeric Latte",  sizes:"8 · 12 · 16oz"},
        {n:"London Fog",      sizes:"8 · 12 · 16oz"},
        {n:"Hot Chocolate",   sizes:"8 · 12 · 16oz"},
        {n:"Tea",             sizes:"8 · 12 · 16oz", note:"hot or iced"},
        {n:"Lemonade",        sizes:"8 · 12 · 16oz", note:"mango · coconut · strawberry · plain"}
    ]},

    { id:"sandwiches", label:"Sandwiches", style:"cards",
      foot:"Made fresh in-house. Served with kettle chips or bistro salad.",
      items:[
        {n:"Sunrise Sandwich", p:"14.00", img:"IMG_4184.jpg", tag:"Favourite",
         d:"Hard egg, arugula, cheddar, garlic mayo, bacon.", on:"On a brioche bun"},
        {n:"B.A.T",            p:"14.00",
         d:"Bacon, arugula, tomato, garlic mayo.", on:"On sourdough"},
        {n:"Reuben",           p:"16.00",
         d:"Corned beef, Swiss, sauerkraut, thousand island.", on:"On rye"},
        {n:"Chicken Sandwich", p:"18.00", img:"IMG_4180.jpg",
         d:"Chicken breast, garlic mayo, arugula, tomato, Swiss, onion jam.", on:"On a baguette"},
        {n:"Tofu Sandwich",    p:"16.00", diet:["V"],
         d:"Smoked tofu, vegan mayo, arugula, tomato, cucumber, guacamole.", on:"On sourdough"},
        {n:"Grilled Cheese",   p:"14.00", diet:["V"],
         d:"Cheddar, Swiss, mozzarella & pepperjack.", on:"On sourdough"}
    ]},

    { id:"baked", label:"Baked", style:"cards",
      foot:"Bagels and pastries baked daily. Come early to see what's in.",
      items:[
        {n:"Lox",             p:"14.00", img:"IMG_4182.jpg",
         d:"Smoked salmon, cream cheese, dill, onions.", on:"Everything or plain bagel"},
        {n:"Toasted Bagel",   p:"5.00",  note:"cream cheese or butter"},
        {n:"House Muffin",    p:"4.50",  img:"IMG_4188.jpg", note:"ask for today's", diet:["V"]},
        {n:"Butter Croissant",p:"4.75",  img:"IMG_4190.jpg", diet:["V"]},
        {n:"Scones",          p:"4.50",  note:"savoury & sweet — ask for today's", diet:["V"]}
    ]},

    { id:"soup", label:"Soup", style:"rows",
      foot:"Ask your barista for today's pot.",
      items:[
        {n:"Soup of the Week", note:"changes daily"}
    ]}
  ]
};
