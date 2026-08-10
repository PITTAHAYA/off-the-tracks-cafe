# Sandwich shot list

Seven menu items are live with no photo. They're the highest-margin things on the
menu, and right now they read as a text list while the pastries look gorgeous.

The site already handles this gracefully — items without a photo show the house
mark on a subtle cream weave, so nothing looks broken. But a photo sells a
sandwich and a placeholder doesn't.

## What's needed

| Item | Status |
|---|---|
| Avocado Toast | ✅ `IMG_4184.jpg` |
| Chicken Fig | ✅ `IMG_4180.jpg` |
| **Egg Sandwich** | ❌ needs a shot |
| **Breakfast Burrito** | ❌ needs a shot |
| **Grilled Cheese** | ❌ needs a shot |
| **Tomato Pesto** | ❌ needs a shot |
| **Chicken Club** | ❌ needs a shot |
| **Beet-L-T** | ❌ needs a shot |
| **Sides** (fries / soup / salad) | ❌ needs a shot |

Seven photos. About twenty minutes on a bright morning.

## How to shoot them so they match

Everything on the site was shot on the café's own wooden tables in daylight, and
the new ones need to sit beside those without looking like a different restaurant.

- **Light:** by the windows or out on the patio. Daylight only — no flash, no
  overhead lights. Mid-morning is ideal; the alley gets sun from about 10.
- **Surface:** the bare wooden tables, or the pale boards used for the pastry shots.
- **Angle:** straight down (flat lay) or low and close at about 30°. Pick one and
  use it for all seven so the grid looks deliberate.
- **Framing:** square. Fill the frame with the food — leave a little board or table
  showing at the edges, nothing else. No cutlery clutter, no phones, no hands.
- **Cut sandwiches in half** and stack or angle one piece so the filling shows.
  A closed sandwich is a beige lump; an open one is lunch.
- Shoot each one **three or four times**, slightly different angles. Pick later.

Portrait mode is fine. A recent phone is completely good enough — every existing
photo on this site came from one.

## Adding them

1. Drop the files into `site/assets/` with any name (e.g. `grilled-cheese.jpg`).
2. Regenerate the WebP versions:

```bash
cd "site" && python3 -c "
from PIL import Image; import glob, os
os.makedirs('assets/w', exist_ok=True)
for p in glob.glob('assets/*.jpg'):
    n = os.path.splitext(os.path.basename(p))[0]
    im = Image.open(p).convert('RGB')
    f = im.copy(); f.thumbnail((1400,1400), Image.LANCZOS); f.save(f'assets/w/{n}.webp','WEBP',quality=76,method=6)
    s = im.copy(); s.thumbnail((700,700), Image.LANCZOS);  s.save(f'assets/w/{n}-sm.webp','WEBP',quality=74,method=6)
print('done')"
```

3. In `content.js`, add `img:"grilled-cheese.jpg"` to that menu item. The
   placeholder is replaced automatically.
