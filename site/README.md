# Off the Tracks — Café & Bistro

Four short pages for the Google Maps listing. No build step, no dependencies.
Drop the `site/` folder on any host.

```
site/
  index.html   Home    — one photo, the name, three doors
  menu.html    Menu    — three tabs: Eats, Baked, Drinks
  place.html   Place   — eighteen photos, a lightbox
  visit.html   Visit   — map, address, hours, call, socials
  app.css      shared styles
  app.js       shared behaviour + ALL editable content
  assets/      27 photos, resized to 1600px (11 MB)
```

Each page does one job. Nothing has a paragraph — the home page is about
25 words total, and the pictures carry the rest.

## Content

Everything editable is in one block at the top of `app.js`: phone, email, address,
socials, hours, menu, gallery. Content checked against tracksbistro.ca — menu items,
hours, phone, email, socials and the "not a product of industry, but artisanship"
line all come from there.

**Prices are deliberately absent**, because Off the Tracks doesn't publish any. A stale
price on a Maps listing is worse than no price. If that changes, add `p:"14.50"` to any
item in `MENU` and it renders; leave it off and the row stays clean. No other edit needed.

Hours live in `HOURS` (24h clock, index 0 = Sunday). Change them there and the
open/closed pill and the hours table both follow. The JSON-LD at the bottom of
`index.html` is hand-written and needs the same edit.

Two menu items are worth a look before launch: `Baked` names the pastries generically
(Croissant, Cruffin, Tarts, Cakes, Pies) since the actual case rotates daily, and the
`Eats` list is exactly the eight items from tracksbistro.ca. If the kitchen has moved
on, that list is nine lines to update.

## What's built in

- **The line.** The bottom nav is a rail with four stops; the current page is the
  filled one. It's the "Off the Tracks" idea used as navigation rather than
  decoration, and it keeps every page one tap from every other page.
- **Live open/closed**, computed in `America/Vancouver` — right for someone
  checking from another timezone. Warns at the 60-minute mark, refreshes each minute.
- **Menu.** Drinks are name–leader–price rows. Food is photo cards with the price
  and dietary chips, no descriptions. Six tabs, no page reloads.
- **Place.** CSS masonry, lightbox with swipe (sideways to page, down to dismiss),
  arrow keys and Escape on desktop.
- **Visit.** Map, Directions, Copy address with toast, native Share sheet.
- Cross-page transitions via the View Transitions API where the browser supports it;
  a plain navigation everywhere else.
- Everything animated is disabled under `prefers-reduced-motion`.

## Notes

- Fonts load from Google Fonts (Fraunces, Inter, JetBrains Mono) with system
  fallbacks. To go fully offline, self-host the three files and swap the `<link>`.
- Colours come from the room: Railspur navy (signage, umbrellas, the blue cups),
  terracotta (the banners and patio chairs), fir green (the siding), brass, paper
  cream. Body text meets WCAG AA on its background.
- `assets/` holds resized copies. Originals are untouched in the parent folder.
  Converting them to WebP or AVIF before deploying would cut the payload roughly
  in half.
- If you edit `app.css` and don't see the change, hard-refresh — browsers cache it.
