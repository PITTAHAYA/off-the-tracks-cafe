# Off the Tracks — Café & Bistro

Mobile site for the Google Maps listing of [Off the Tracks](https://tracksbistro.ca),
1363 Railspur Alley, Granville Island, Vancouver.

Five short pages. Installable to the home screen, works with no signal, takes
pickup orders and table bookings. No build step, no dependencies, no framework.

**Live:** https://off-the-tracks-cafe.vercel.app

```
site/             the site — open site/index.html
  index.html      Home     — hero, three doors, story, reviews
  menu.html       Menu     — Eats, Baked, Drinks, add to order
  place.html      Place    — eighteen photos, a lightbox
  visit.html      Visit    — map, hours, booking, feedback
  rewards.html    Stamps   — ten-coffee loyalty card
  app.js          shared behaviour + ALL editable content
  order.js        cart and checkout
  reserve.js      table booking
  sw.js           offline cache
  assets/w/       WebP photos, two sizes each
IMG_*.jpg         the original photographs
```

Home page is 0.45 MB across 9 requests, against 6.7 MB and 61 requests
on the current site.

**[Full documentation in `site/README.md`](site/README.md)** — what to edit,
what's built in, and how the pieces fit.

## Quick start

Open `site/index.html` in a browser. To deploy, upload the `site/` folder to any
static host.

## Editing

Everything editable — phone, email, address, socials, hours, menu, gallery — lives
in one block at the top of [`site/app.js`](site/app.js).
