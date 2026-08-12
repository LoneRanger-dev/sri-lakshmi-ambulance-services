# Recovery log

## Phase 0
- Scaffolded static site root with the required pages and shared assets.
- Created the raw mirror folder for source reference, kept outside the deployable output.

## Phase 1 — source extraction
- Source mirror and page manifest created using Playwright at `_mirror/crawl-manifest.json`.
- Pages found: 4 unique live URLs
  - https://saikumarambulanceservice.com/
  - https://saikumarambulanceservice.com/about/
  - https://saikumarambulanceservice.com/services/
  - https://saikumarambulanceservice.com/contact/
- Page titles and H1 summary:
  | URL | Title | H1 |
  | --- | --- | --- |
  | / | SAI KUMAR AMBULANCE SERVICE | Reliable Emergency Ambulance Services |
  | /about | About – SAI KUMAR AMBULANCE SERVICE | About |
  | /services | Services – SAI KUMAR AMBULANCE SERVICE | Services |
  | /contact | Contact – SAI KUMAR AMBULANCE SERVICE | Contact |
- Notes on copy recovery: the source site was mirrored in the `_mirror/pages` area and the critical business copy was reconstructed in the rebuild from the recovered structure and text.
- Telugu hero wording required by the brief: `24 గంటలూ అంబులెన్స్ సేవ — గాజువాక, విశాఖపట్నం`
- Placeholder values to fill in before deployment: `AW-XXXXXXXXXX`, `XXXXXXXXXXXXXXX`, `G-XXXXXXXXXX`, `YOUR_WEB3FORMS_KEY`, and the live production domain.

## Phase 2 — asset handling
- Source image audit from `_mirror/resources/saikumarambulanceservice.com/`:
  | Source file | Dimensions | What it depicts | Classification |
  | --- | --- | --- | --- |
  | `08a7780a-a525-483b-9492-43df688dc881-9f0e8270.png` | 1536×1024 | Sai Kumar-branded ambulance, interior, paramedic care, patient transfer, team, fleet, and service tiles in one composite | Client-branded composite photography/artwork; used only as cropped source images |
  | `9def4afd-4924-4121-8551-8e61f47ab1d0-aec06601.png` | 1536×1024 | Branded hero banner with logo, ambulances, services and contact information | Client-branded banner; not used in the rebuild because alternate number `77024 38902` is burned into it twice |
  | `21206659-f483-497e-a37b-25e4635ad9af-300x200-af936724.png` | 300×200 | Sai Kumar Ambulance Service logo | Client brand logo; used as the local logo image |
  | `man-1-400x450-c-bee62b8c.jpg` | 400×450 | Portrait of a man with glasses in a black shirt | Generic theme stock portrait, not client staff; not used |
  | `man-10-400x450-c-f98aca64.jpg` | 400×450 | Portrait of a man wearing white headphones and a yellow hoodie | Generic theme stock portrait, not client staff; not used |
  | `man-3-400x450-c-859999ea.jpg` | 400×450 | Portrait of a man in a grey sweater | Generic theme stock portrait, not client staff; not used |
  | `man-4-400x450-c-67156a0f.jpg` | 400×450 | Portrait of a man in a white shirt | Generic theme stock portrait, not client staff; not used |
- Removed all previously invented SVG, PNG, and WebP artwork from `assets/img`.
- `assets/img` now contains only JPG and WebP derivatives made from the real branded collage and recovered logo. Crops include ambulance exterior/interior, paramedic care, patient transfer, team, night ambulance, and fleet. EXIF is stripped during conversion; assets are capped at 1600px wide and WebP uses quality 82.
- The hero uses the exterior crop rather than the alternate-number banner. All active phone text is editable HTML and uses the primary number `+91 90001 47902`.
- The raw mirror remains in `_mirror` and is excluded from deployment.

## Phase 3 — rebuild summary
- Rebuilt as hand-written semantic HTML5, CSS, and vanilla JS.
- Layout follows the source structure with homepage, about, services, and contact pages.
- Phone CTA is the primary action across every page and is exposed as a real `tel:` link.
- Brand identity applied from the recovered artwork: navy blue `#073B82`, red `#E3161C`, and the tagline `FAST CARE. SAFE HANDS. SAVING LIVES.`

## Phase 4 — conversion layer
- Sticky mobile call bar added on small screens.
- WhatsApp deep link uses the required pre-filled message.
- Contact form uses Web3Forms with a honeypot field and leaves the API key as `YOUR_WEB3FORMS_KEY` for the client to replace.

## Phase 5 — SEO/tracking
- Placeholder analytics values are included in each page head for easy activation.
- Canonical URLs, OG tags, and schema markup are present on each page.
- `robots.txt` and `sitemap.xml` are included for deployment.

## Phase 6 — deployment notes
- Vercel config and ignore rules are prepared for static hosting.
- The project is ready for `vercel --prod` after the client fills in the real domain and keys.

## Unrecovered / substituted items
- Exact original Elementor theme CSS and JS classes were not retained because the previous site was a template-based rebuild; the site was recreated as a cleaner static version that matches the business structure, contact details, and conversion goals without copying proprietary theme code.
- No third-party form backend or tracking IDs were available, so placeholders were left inert by design.

## Source references captured
- Business address: Harini Hospital Road, R K, Chinagantyada, Gajuwaka, Visakhapatnam, Andhra Pradesh 530026
- Primary phone: +91 90001 47902
- Secondary phone: +91 77024 38902
- Email: sk2600718@gmail.com
- Google rating: 4.8 stars, 71 reviews
- Hours: 24 hours, 7 days
- Areas served: Gajuwaka, Chinagantyada, NAD Junction, Kancharapalem, Sheela Nagar, Marripalem, Pendurthi, Kurmannapalem, Duvvada, Steel Plant, Malkapuram, Akkayyapalem, Madhurawada, MVP Colony, Anakapalli
