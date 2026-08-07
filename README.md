# Off the Tracks — Café & Bistro

Mobile site for the Google Maps listing of [Off the Tracks](https://tracksbistro.ca),
1363 Railspur Alley, Granville Island, Vancouver.

Four short pages, no build step, no dependencies.

```
site/          the site — open site/index.html
  index.html   Home    — one photo, the name, three doors
  menu.html    Menu    — Eats, Baked, Drinks
  place.html   Place   — eighteen photos, a lightbox
  visit.html   Visit   — map, address, hours, call, socials
  app.css      shared styles
  app.js       shared behaviour + ALL editable content
  assets/      photos resized to 1600px for the web
IMG_*.jpg      the original photographs
```

**[Full documentation in `site/README.md`](site/README.md)** — what to edit,
what's built in, and how the pieces fit.

## Quick start

Open `site/index.html` in a browser. To deploy, upload the `site/` folder to any
static host.

## Editing

Everything editable — phone, email, address, socials, hours, menu, gallery — lives
in one block at the top of [`site/app.js`](site/app.js).
