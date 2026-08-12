# VS Code Agent Prompt — Rebuild Sai Kumar Ambulance Service website

> Paste everything below the line into your VS Code CLI agent (Claude Code / Cline / Copilot CLI).
> Run it inside an **empty folder** — the agent will scaffold the whole project there.

---

## ROLE

You are a senior front-end engineer. You are rebuilding a small business website that the
client legally owns but has lost all hosting, domain and CMS access to. Your job is to
recover its content, reproduce it faithfully as a fast static site, improve its conversion
mechanics, and ship it to Vercel on a new domain.

Work autonomously. Do not ask me to confirm each step. Report at the end of each PHASE with a
short status, then continue to the next PHASE.

---

## PROJECT CONTEXT

| | |
|---|---|
| Business | Sai Kumar Ambulance Service |
| Location | Harini Hospital Road, R K, Chinagantyada, Gajuwaka, Visakhapatnam, Andhra Pradesh 530026 |
| Primary phone | **+91 90001 47902** (this is the number on the Google Business Profile — use it everywhere as the main CTA) |
| Alternate phone | +91 77024 38902 (show as secondary only) |
| Email | sk2600718@gmail.com |
| Google rating | 4.8 stars, 71 reviews |
| Hours | 24 hours, 7 days |
| Languages | English, Telugu, Hindi |
| Source site (to be replicated) | `https://saikumarambulanceservice.com/` |
| New home | A new domain, bought on Namecheap, deployed on Vercel |

The client owns this content — it is his own business, his own photographs, his own copy.
The previous developer controls the domain and hosting and has stopped responding, so we are
recovering the content and rebuilding on infrastructure the client controls.

**Time sensitivity:** the source site could be taken down at any moment. Complete PHASE 1 and
PHASE 2 (crawl + asset download) *first and fully* before doing any design work. Get everything
onto local disk before anything else.

---

## OBJECTIVE

Produce a **static, dependency-free website** that:

1. Reproduces the source site's structure, copy and imagery faithfully.
2. Loads in under 1.5 seconds on a 4G phone (the source is Elementor-based and slow).
3. Makes the phone call the unmistakable primary action on every page.
4. Deploys to Vercel with zero build step.
5. Has every tracking hook in place but inert until IDs are filled in.

---

## PHASE 0 — Scaffold

Create this structure:

```
/
├── index.html
├── about.html
├── services.html
├── contact.html
├── assets/
│   ├── css/style.css
│   ├── js/main.js
│   └── img/
├── _mirror/            ← raw scrape, kept for reference, NOT deployed
├── vercel.json
├── robots.txt
├── sitemap.xml
├── favicon.ico
├── .vercelignore       ← must contain: _mirror
└── NOTES.md            ← your running log + anything you could not recover
```

---

## PHASE 1 — Crawl and extract

Mirror the source site into `_mirror/`:

```bash
wget --mirror --page-requisites --adjust-extension --convert-links \
     --no-parent --span-hosts --domains=saikumarambulanceservice.com \
     --user-agent="Mozilla/5.0" --wait=1 --tries=3 \
     -P _mirror https://saikumarambulanceservice.com/
```

If `wget` is unavailable or the site blocks it, fall back to a Node script using `playwright`
(render each page, wait for network idle, save `document.documentElement.outerHTML` plus all
image/CSS/font responses). Elementor lazy-loads images, so **scroll each page to the bottom
before capturing** or you will miss assets.

Then, for every page found, write `NOTES.md` with an extraction table capturing:

- URL, `<title>`, meta description, H1
- Full visible copy, section by section, in reading order
- Every image: source URL, alt text, where it appears, its role (hero / gallery / icon / logo)
- Colour palette actually used (sample the rendered CSS — get exact hex values)
- Font families used
- Navigation structure and link targets
- Any phone numbers, emails, addresses, social links, embedded maps
- Anything interactive: forms, sliders, accordions, popups

**Report:** list of pages found, number of images, and any page that failed to fetch.

---

## PHASE 2 — Assets

- Move every real content image from `_mirror/` into `assets/img/` with descriptive kebab-case
  filenames (`ambulance-front-view.jpg`, not `IMG_2024_final_v3.jpg`).
- Convert every raster image to **WebP** (quality 82), keeping the original JPG/PNG as a
  `<picture>` fallback. Use `sharp` or `cwebp`.
- Resize: nothing wider than 1600px for heroes, 800px for cards, 400px for thumbnails.
- Strip EXIF.
- Recreate the logo as **SVG** if it is simple text or a basic mark; otherwise use a
  transparent PNG at 2× display size.
- Discard all Elementor/theme decorative sprites, spacers and placeholder stock images that
  add nothing.

**Report:** total asset weight before and after.

---

## PHASE 3 — Rebuild

Rebuild the pages as **hand-written semantic HTML5 + one CSS file + one small JS file.**

**Do not copy Elementor's generated markup, classes or stylesheets.** It is bloated,
unmaintainable, and carries theme licensing baggage. Reproduce the *visual result* and the
*content*, not the machine-generated code.

Requirements:

- **Visual fidelity:** same layout, same section order, same imagery, same colour palette,
  same general typographic feel as the source. A person who knew the old site should recognise
  this immediately as the same site, just faster and cleaner.
- **Mobile first.** Design at 390px, then scale up. Most traffic is emergency mobile traffic.
- **System font stack only.** No Google Fonts, no external font CDN. Zero third-party requests.
- **Inline critical CSS** in `<head>`; keep the rest in `assets/css/style.css`.
- **All icons inline SVG.** No icon-font libraries.
- **No framework.** No React, no jQuery, no Bootstrap, no Tailwind CDN. Vanilla only.
- **Accessibility:** every image has meaningful `alt`, colour contrast ≥ 4.5:1 for body text,
  visible focus states, tap targets ≥ 48×48px, correct heading hierarchy.
- Include a **Telugu subheading** on the homepage hero:
  `24 గంటలూ అంబులెన్స్ సేవ — గాజువాక, విశాఖపట్నం`
  (flag it in NOTES.md so the client can verify the wording).

---

## PHASE 4 — Conversion layer

The source site's only form is broken and there is no prominent call action. Fix that.

- **Sticky bottom call bar on mobile** (hidden ≥901px): a full-width red "Call Now" button plus
  a WhatsApp icon button.
- **Hero CTA:** oversized `tel:+919000147902` button, minimum 60px tall.
- **Phone number in the header** on every page, as a real `tel:` link.
- **WhatsApp deep link** with a pre-filled message:
  `https://wa.me/919000147902?text=I%20need%20an%20ambulance%20urgently.%20My%20location%20is%3A%20`
- **A working contact form** on `contact.html`. The site is static, so use **Web3Forms**
  (free, no backend, just an access key in a hidden input) — leave the key as
  `YOUR_WEB3FORMS_KEY` and note it in NOTES.md. Add a honeypot field for spam.
  Never ship a form that silently fails.
- **Trust strip** near the top of the homepage: `4.8★ · 71 Google reviews · 24×7 · Based in Gajuwaka`.
- **Areas served** section listing: Gajuwaka, Chinagantyada, NAD Junction, Kancharapalem,
  Sheela Nagar, Marripalem, Pendurthi, Kurmannapalem, Duvvada, Steel Plant, Malkapuram,
  Akkayyapalem, Madhurawada, MVP Colony, Anakapalli.

---

## PHASE 5 — Tracking, SEO and schema

**Tracking** — put this in a single clearly-commented block in `<head>` on every page, with
placeholder IDs so it stays inert until filled in:

```js
window.ADS_ID    = 'AW-XXXXXXXXXX';   // Google Ads conversion ID
window.ADS_LABEL = 'XXXXXXXXXXXXXXX'; // conversion label
window.GA4_ID    = '';                // e.g. 'G-XXXXXXXXXX', '' to skip
```

Load `gtag.js` **only if** a real ID is present. Then attach a single delegated click listener
that fires a Google Ads conversion plus a GA4 event on every `tel:` and `wa.me` click, tagged
with which button was used (`hero`, `header`, `sticky`, `contact`). It must fail silently when
IDs are placeholders.

**SEO per page:** unique `<title>` (≤60 chars) and meta description (≤155 chars), one `<h1>`,
canonical tag, Open Graph tags, `<html lang="en">`.

**Schema:** JSON-LD `["EmergencyService","LocalBusiness"]` on every page with name, telephone
`+91-90001-47902`, full postal address, `openingHoursSpecification` 00:00–23:59 all days,
`aggregateRating` 4.8 / 71, and `areaServed`. Validate the JSON parses.

Generate `robots.txt` (allow all, point to sitemap) and `sitemap.xml` (all pages).

---

## PHASE 6 — Vercel deployment

Create `vercel.json`:

- No build command — pure static output from the repo root.
- Clean URLs (`/about` not `/about.html`) and trailing-slash normalisation.
- Security headers: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: SAMEORIGIN`, a sensible `Permissions-Policy`.
- Cache headers: `assets/*` immutable for one year; HTML `max-age=0, must-revalidate`.
- A `/404` route.

Add `.vercelignore` containing `_mirror` so the raw scrape is never deployed.

Initialise git, commit everything, and print the exact commands for:

1. `vercel --prod` from the CLI, **and**
2. pushing to GitHub and importing the repo in the Vercel dashboard.

Then print the **Namecheap DNS records** needed to attach the domain, for both the apex and
`www`, in a copy-paste table.

---

## CONSTRAINTS

- Total page weight (HTML + CSS + JS + above-the-fold images) **under 500 KB**.
- **Zero third-party network requests** on load, except `gtag.js` once a real ID is added.
- Works with JavaScript disabled — all content and all `tel:` links must still function.
- No `localStorage`, no cookies, no consent banner needed.
- Every file must be readable and hand-editable. No minified blobs, no build pipeline.

## DO NOT

- Do not copy Elementor/Hostinger theme CSS, JS or class names into the new site.
- Do not invent testimonials, review text, certifications, response times, or prices.
  If the source site does not state it, do not state it.
- Do not write any response-time promise ("arrives in 10 minutes") — it violates Google Ads
  policy for this vertical and creates real-world liability.
- Do not add a cookie banner, chat widget, popup, or newsletter signup.
- Do not deploy `_mirror/`.

## ACCEPTANCE CRITERIA

Before you report done, verify and show me evidence for each:

1. Every page from the source site exists in the rebuild, or is listed in NOTES.md with a reason.
2. `tel:+919000147902` appears in the header, hero and sticky bar of every page.
3. Lighthouse mobile scores: **Performance ≥ 95, Accessibility ≥ 95, SEO 100.**
4. All JSON-LD parses (`JSON.parse` each block).
5. No broken images, no 404s, no console errors.
6. Renders correctly at 360px, 390px, 768px and 1440px — attach screenshots.
7. Total deployed size printed, and third-party request count = 0.

## REPORT BACK

At the end, output:

- The file tree with byte sizes.
- Anything from the source site you could **not** recover, and what you substituted.
- The exact list of placeholders I must fill in (`AW-…`, `G-…`, `YOUR_WEB3FORMS_KEY`, domain name).
- The Namecheap → Vercel DNS table.
- A one-paragraph plain-English summary the client can read.
