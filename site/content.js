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
      foot:"Direct-trade beans from a local roaster, pulled on a vintage Synesso.",
      items:[
        {n:"Drip Coffee",          p:"3.50", sizes:"8 · 12 · 16oz"},
        {n:"Iced Drip Coffee",     p:"4.00", sizes:"12 · 16oz"},
        {n:"Espresso",             p:"3.25", sizes:"2oz"},
        {n:"Americano",            p:"3.75", sizes:"8 · 12 · 16oz"},
        {n:"Latte",                p:"5.00", sizes:"8 · 12 · 16oz"},
        {n:"Cappuccino",           p:"5.00", sizes:"8 · 12 · 16oz"},
        {n:"Mocha",                p:"5.50", sizes:"8 · 12 · 16oz"},
        {n:"White Chocolate Mocha",p:"5.75", sizes:"8 · 12 · 16oz"},
        {n:"Cortado",              p:"4.25", sizes:"5oz"},
        {n:"Flat White",           p:"4.75", sizes:"8oz"},
        {n:"Espresso Macchiato",   p:"3.75", sizes:"3oz"},
        {n:"Caramel Macchiato",    p:"5.75", sizes:"8 · 12 · 16oz"},
        {n:"Dirty Chai Latte",     p:"5.75", sizes:"8 · 12 · 16oz"}
    ]},

    { id:"noncoffee", label:"Non-Coffee", style:"rows",
      foot:"Add-ons: oat, almond, soy or coconut milk · syrups · whipped cream · espresso shot · liqueur.",
      items:[
        {n:"Matcha Latte",    p:"5.75", sizes:"8 · 12 · 16oz"},
        {n:"Chai Latte",      p:"5.25", sizes:"8 · 12 · 16oz"},
        {n:"Turmeric Latte",  p:"5.25", sizes:"8 · 12 · 16oz"},
        {n:"London Fog",      p:"5.00", sizes:"8 · 12 · 16oz"},
        {n:"Hot Chocolate",   p:"4.75", sizes:"8 · 12 · 16oz"},
        {n:"Tea",             p:"4.00", sizes:"8 · 12 · 16oz", note:"hot or iced"},
        {n:"Lemonade",        p:"5.50", sizes:"8 · 12 · 16oz", note:"mango · coconut · strawberry · plain"}
    ]},

    { id:"sandwiches", label:"Sandwiches", style:"list",
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
        {n:"Lox",              p:"14.00", img:"IMG_4182.jpg",
         d:"Smoked salmon, cream cheese, dill, onions.", on:"Everything or plain bagel"},
        {n:"Butter Croissant", p:"4.75",  img:"IMG_4190.jpg",
         d:"Traditional, flaky and golden.", diet:["V"]},
        {n:"Pain au Chocolat", p:"5.25",  img:"IMG_4191.jpg",
         d:"Two batons of dark chocolate, laminated through.", diet:["V"]},
        {n:"Pistachio Cruffin",p:"6.25",  img:"IMG_4185.jpg", tag:"Favourite",
         d:"Croissant dough, muffin shape, pistachio cream.", diet:["V"]},
        {n:"House Muffin",     p:"4.50",  img:"IMG_4188.jpg",
         d:"Ask for today's flavours.", diet:["V"]},
        {n:"Scones",           p:"4.50",  img:"IMG_4196.jpg",
         d:"Savoury and sweet — ask for today's.", diet:["V"]},
        {n:"Macarons",         p:"3.00",  img:"IMG_4183.jpg",
         d:"A few flavours a day, sold singly.", diet:["GF"]},
        {n:"Fruit Tart",       p:"7.00",  img:"IMG_4194.jpg",
         d:"Pastry cream, macerated strawberries.", diet:["V"]},
        {n:"Coconut Cream Pie",p:"7.25",  img:"IMG_4193.jpg",
         d:"Cut thick, raspberry and mint on top.", diet:["V"]},
        {n:"Chocolate Slice",  p:"6.75",  img:"IMG_4234.jpg",
         d:"Dark sponge, raspberry cream, chocolate drizzle.", diet:["V"]},
        {n:"Toasted Bagel",    p:"5.00",  note:"cream cheese or butter"}
    ]},

    { id:"soup", label:"Soup", style:"rows",
      foot:"Ask your barista for today's pot.",
      items:[
        {n:"Soup of the Week", p:"9.00", note:"changes daily"}
    ]}
  ]
};
