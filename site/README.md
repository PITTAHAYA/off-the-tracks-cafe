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

### Prices are indicative — read this before launch

Off the Tracks doesn't publish prices anywhere. The numbers in `MENU` are market
rates for Granville Island, put there so the finished design can be shown to the
café. **They have not been confirmed by the business.**

```js
const SHOW_PRICES = true;   // app.js — set to false to hide every price site-wide
```

Before this serves real customers, either confirm each number against the till or
set `SHOW_PRICES = false`. The layout is designed to look right either way: with
prices off, the dot leaders disappear and the rows read as a clean list.

Hours live in `HOURS` (24h clock, index 0 = Sunday). Change them there and the
open/closed pill and the hours table both follow. The JSON-LD at the bottom of
`index.html` is hand-written and needs the same edit.

Two menu items are worth a look before launch: `Baked` names the pastries generically
(Croissant, Cruffin, Tarts, Cakes, Pies) since the actual case rotates daily, and the
`Eats` list is exactly the eight items from tracksbistro.ca. If the kitchen has moved
on, that list is nine lines to update.

## Against the current site (tracksbistro.ca)

| | tracksbistro.ca | this |
|---|---|---|
| Home page weight | 6.7 MB, 61 requests | ~0.8 MB, 9 requests |
| Structure | one long scrolling page | five pages, one job each |
| Menu | 8 item names, no prices | full menu, photos, prices |
| Order for pickup | — | cart, checkout, pickup times |
| Book a table | — | live availability grid |
| Open right now? | you read a sentence | live pill, Vancouver time |
| Loyalty | — | stamp card, no plastic |
| Install to home screen | — | yes, works offline |
| Feedback | 5-field form | two taps |
| Structured data | — | JSON-LD for Google |

## Installable + offline

`manifest.webmanifest` + `sw.js` make this an installable app: added to the home
screen it opens full-screen with its own icon, and the menu, hours and photos stay
readable with no signal — which matters in a timber-and-steel building on Granville
Island. Chrome and Android get a one-time install invitation; iOS uses Share ▸ Add to
Home Screen. Requires https, so it's inactive on `file://` and live on Vercel.

Bump `CACHE` in `sw.js` when you want returning visitors to drop their old copy.

## Stamp card

`rewards.html` + `rewards.js`. Ten coffees, the eleventh free, stored in the visitor's
own browser — no account, no personal data held. **In the demo the button stamps the
card itself.** In production a stamp must come from the café's side (a rotating QR at
the till, or a code from the POS) or customers can stamp their own. `stamp()` is the seam.

## Reviews

The three quotes on the home page are illustrative. Replace them with real verbatim
Google reviews, or delete the `.says` section — don't ship invented attributed quotes.

## Ordering and booking are SIMULATED

Both flows are complete and interactive, but nothing leaves the browser.

| | file | switch |
|---|---|---|
| Pickup ordering | `order.js` | `DEMO_MODE = true` |
| Table booking | `reserve.js` | `DEMO_MODE = true` |

- **No card details are ever collected.** "Pay now by card" simulates a charge; there
  are no card fields anywhere on the site. Don't add any — a static page can't take a
  payment safely. When this goes live, `submitOrder()` in `order.js` is the one place
  to call Stripe Checkout, Square, or your POS, which handle the card on their side.
- **Both confirmations say they're a preview**, so a real customer who finds the URL
  can't believe they've booked a table or bought breakfast. Remove those lines only
  when the flows are genuinely wired up.
- **Availability is fake but deterministic** — the same date, time and party size always
  return the same answer, seeded by a hash, so it behaves like a real system instead of
  reshuffling on every render. Weekends and lunch are busier; parties of 5+ see fewer
  tables. `seatsFor()` in `reserve.js` holds that logic.
- **Times are real.** Pickup slots and booking slots are both derived from `HOURS`, so
  they can never offer a time the café is shut. Pickup allows 20 minutes' lead; bookings
  stop 60 minutes before close.
- GST is 5% (`GST` in `order.js`). The cart persists in `localStorage`.

To make it real: point `submitOrder()` at a payment provider and `book()` at a booking
provider (OpenTable, Tock, Resy), then set both `DEMO_MODE` flags to `false`.

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
