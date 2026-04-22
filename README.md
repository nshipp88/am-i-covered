# Am I Covered? — Insurance Education Lead Funnel

**Live URL:** https://nshipp88.github.io/am-i-covered/  
**Repo:** https://github.com/nshipp88/am-i-covered  
**Version:** 2.0

A mobile-first interactive insurance education funnel. Prospects watch a scenario (collision, hail, flood, fire), answer a cost question, get their state's real coverage gap, pick a second scenario, answer a confidence question, and submit their phone number. Leads captured to Google Sheets and emailed instantly.

---

## One-Time Setup

### 1. Deploy Google Apps Script Backend (~3 minutes)

1. Go to [script.google.com](https://script.google.com) → **New project**
2. Paste the contents of `google-apps-script.js` (replace all existing code)
3. Change `NOTIFICATION_EMAIL` to your email address
4. Click **Deploy** → **New deployment**
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Click **Deploy** → authorize when prompted → **Copy the Web App URL**

### 2. Update index.html with your URL

Find the CONFIG block at the top of the `<script>` tag:

```javascript
const CONFIG = {
  LEAD_ENDPOINT: 'YOUR_GOOGLE_APPS_SCRIPT_URL', // <-- paste URL here
  FALLBACK_WEB3FORMS_KEY: 'YOUR_WEB3FORMS_KEY',
  DEBUG: false
};
```

Replace `YOUR_GOOGLE_APPS_SCRIPT_URL` with the URL you copied. Commit the change — GitHub Pages deploys in ~60 seconds.

---

## Ad Campaign UTM URLs

### TikTok

| Scenario | URL |
|---|---|
| Porsche collision | `https://nshipp88.github.io/am-i-covered/?s=car&utm_source=tiktok&utm_medium=paid_social&utm_campaign=porsche_collision` |
| Hail storm | `https://nshipp88.github.io/am-i-covered/?s=hail&utm_source=tiktok&utm_medium=paid_social&utm_campaign=hail_storm` |
| Flash flood | `https://nshipp88.github.io/am-i-covered/?s=flood&utm_source=tiktok&utm_medium=paid_social&utm_campaign=flash_flood` |
| Kitchen fire | `https://nshipp88.github.io/am-i-covered/?s=fire&utm_source=tiktok&utm_medium=paid_social&utm_campaign=kitchen_fire` |

For Instagram replace `utm_source=tiktok` with `utm_source=instagram`. For Facebook use `utm_source=facebook`.

---

## AI Video Prompts (Kling AI / Runway Gen-3)

**Specs:** 9:16 vertical, 15–22 seconds, MP4, captions burned in

**Porsche Collision**
```
Cinematic slow-motion dashcam footage, distracted driver in a gray sedan rear-ends 
a red Porsche 911 GT3 at a quiet suburban intersection, freeze frame on impact, 
glass suspended in mid-air, golden hour lighting, 9:16 vertical, photorealistic
```

**Hail Storm**
```
Aerial neighborhood view, golf ball-sized hailstones pelting suburban rooftops and 
parked cars on a quiet residential street, progressive damage visible, sky darkens, 
9:16 vertical, cinematic, photorealistic
```

**Flash Flood**
```
Street-level footage of brown water rising rapidly on a suburban road, cars partially 
submerged, storm drain overflowing, overcast sky, 9:16 vertical, cinematic, photorealistic
```

**Kitchen Fire**
```
Interior kitchen, grease fire erupts on stovetop and spreads to overhead cabinets, 
smoke filling room, dramatic orange light, nobody in frame, 9:16 vertical, cinematic
```

**CapCut overlay (free):** At 10-second mark add text layer — left (red): WITHOUT COVERAGE / $47,300 — right (green): WITH COVERAGE / $500–$2,000. Hold 4 seconds. Add source citation below.

---

## Lead Management

Every submission creates a row in **Am I Covered — Lead Database** (Google Sheets, auto-created) and sends an HTML email with click-to-call phone link.

**Update the Status column manually:** New → Called → Sold / No answer / Callback

**Retrieve locally-stored backup leads** (open browser console on funnel page):
```javascript
JSON.parse(localStorage.getItem('aic_leads') || '[]')
```

---

## Phase 1 → Phase 2 Flip

**Phase 1 (now):** Target CO, OK, KS, MO, NE hail belt. Sell leads to independent agents at $45–$75 exclusive.

**Phase 2 (August 2026):** Switch ad targeting to Katy TX zips (77494, 77450, 77493, 77449, 77084). Redirect lead flow to Emerald Insurance Agency. Open doors with a warm pipeline on day one.

---

## Files

| File | Purpose |
|---|---|
| `index.html` | Complete funnel — 9 screens, UTM, A/B test, dual-backend lead capture |
| `privacy.html` | TCPA-compliant privacy policy linked from consent checkbox |
| `google-apps-script.js` | Paste into script.google.com — creates Sheet + sends email on every lead |
| `README.md` | This file |

---

## A/B Test

50/50 headline split, session-sticky, tracked per lead in `ab_variant` column:
- **Variant A:** "Watch what happens next."
- **Variant B:** "One tap. Real numbers. Real exposure."

After 100+ leads compare close rates by variant and pick a winner.
