# Multi-Client Ambulance Website Template: Complete Setup & Operations Guide

## Overview

This repository has been structured as a production-ready, reusable white-label template for developing high-converting websites for multiple ambulance service clients.

The site is built with pure semantic HTML5, modern CSS custom properties, and zero-dependency Node.js build tooling, delivering optimal Core Web Vitals, 100/100 Lighthouse performance, and built-in local SEO and Google Ads call-conversion tracking.

---

## Quickstart

### 1. View Available Clients
Profile configurations are stored in the `/clients` directory:
- `clients/saikumarambulance.json` — Sai Kumar Ambulance Service (original baseline)
- `clients/srilakshmiambulance.json` — Sri Lakshmi Ambulance Services
- `clients/starter-template.json` — Clean starter profile for new clients

### 2. Build for a Specific Client
Run the compiler specifying the client ID:
```bash
# Build for Sri Lakshmi Ambulance Services
npm run build:client -- srilakshmiambulance

# Or build for Sai Kumar Ambulance Service
npm run build:client -- saikumarambulance

# Or compile the currently active client.config.json
npm run build
```

### 3. Run the Local Development Server
```bash
npm run dev
# Or: npm start
```
The server will automatically detect an available port (defaulting to 8000, 8001, etc.) and serve the website with clean URL routing.

### 4. Run Automated Health Checks
```bash
npm test
```
Validates compilation, HTTP 200 responses for all pages, 404 handling, and asset presence.

---

## Configuration Reference (`client.config.json`)

All client-specific information is centralized in a single JSON file.

### Business Identity
```json
"business": {
  "name": "Sri Lakshmi Ambulance Services",
  "shortName": "Sri Lakshmi Ambulance",
  "tagline": "24/7 DEDICATED EMERGENCY AMBULANCE CARE & TRANSPORT",
  "heroEyebrow": "24/7 Emergency Ambulance Service",
  "heroTitle": "24/7 Emergency Ambulance Service & Patient Transport",
  "heroCopy": "Prompt emergency ambulance service with ICU ventilator, oxygen support, and inter-city patient transfers.",
  "regionalNote": "24 గంటలూ అత్యవసర అంబులెన్స్ సేవలు అందుబాటులో ఉన్నాయి",
  "operatingHours": "24 hours, 7 days",
  "rating": "4.9",
  "reviewCount": "58",
  "reviewPlatform": "Google reviews"
}
```

### Contact & Deep-Links
```json
"contact": {
  "primaryPhone": "+91 98480 12345",
  "primaryPhoneRaw": "+919848012345",
  "secondaryPhone": "+91 98480 67890",
  "secondaryPhoneRaw": "+919848067890",
  "whatsappNumber": "+919848012345",
  "whatsappPrefill": "I need an ambulance urgently. My location is: ",
  "email": "contact@srilakshmiambulance.com",
  "address": {
    "street": "Main Road, Near Government Hospital",
    "locality": "Visakhapatnam",
    "region": "Visakhapatnam",
    "state": "Andhra Pradesh",
    "postalCode": "530002",
    "country": "IN",
    "full": "Main Road, Near Government Hospital, Visakhapatnam, Andhra Pradesh 530002"
  },
  "geo": {
    "latitude": 17.7041,
    "longitude": 83.2977
  },
  "googleMapsUrl": "https://www.google.com/maps/search/?api=1&query=..."
}
```

### Branding & Theme Colors
Colors are compiled into `assets/css/theme.css`:
```json
"branding": {
  "logo": {
    "src": "/assets/img/logo.webp",
    "alt": "Sri Lakshmi Ambulance Services logo",
    "width": 74,
    "height": 54
  },
  "heroImage": "/assets/img/ambulance-exterior.webp",
  "themeColor": "#087f3e",
  "colors": {
    "brandPrimary": "#087f3e",
    "brandPrimaryDark": "#055a2b",
    "brandPrimarySoft": "#ecfdf5",
    "brandSecondary": "#073b82",
    "brandSecondaryDark": "#05295c",
    "ink": "#0f2316",
    "muted": "#33513f",
    "line": "#d1fae5",
    "panel": "#f0fdf4",
    "white": "#ffffff"
  }
}
```

### Services & Service Areas
```json
"services": [
  {
    "id": "icu",
    "title": "ICU Ventilator Ambulance",
    "description": "Critical care equipped with ventilator, monitor, and paramedic.",
    "image": "/assets/img/ambulance-interior.webp"
  }
],
"serviceAreas": [
  "Visakhapatnam City",
  "MVP Colony",
  "Gajuwaka",
  "NAD Junction"
]
```

### Integrations
```json
"integrations": {
  "web3formsKey": "YOUR_WEB3FORMS_KEY",
  "googleAdsId": "AW-XXXXXXXXXX",
  "googleAdsLabel": "kEWyCOnWjOQcEN2suNA_",
  "ga4Id": "G-XXXXXXXXXX"
}
```

---

## Onboarding a New Client in 3 Steps

1. **Create the Client Profile**:
   Copy `clients/starter-template.json` to `clients/<new-client-name>.json` and update with the client's information.
2. **Add Client Assets**:
   Place the client's logo and photos into `assets/img/` (or run image optimization).
3. **Build the Site**:
   ```bash
   npm run build:client -- <new-client-name>
   ```
   Inspect the result with `npm run dev`.

---

## Safe GitHub Authentication Protocol

To push, clone private repositories, or deploy without exposing sensitive credentials in chat:

1. **Never send Personal Access Tokens (PAT) or passwords into the chat.**
2. **Use Git Credential Manager (GCM)**:
   When running `git push` on Windows, a browser popup will appear requesting GitHub authorization.
3. **Use SSH Keys**:
   Check if an SSH key exists:
   ```powershell
   ls ~/.ssh/id_ed25519.pub
   ```
   If not, generate one:
   ```powershell
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```
   Add the public key to your GitHub account under **Settings > SSH and GPG Keys**.
4. **Use GitHub CLI (`gh`)**:
   Authenticate locally in your terminal:
   ```powershell
   gh auth login
   ```
   Select `SSH` or `HTTPS` and complete the browser flow.

---

## Production Deployment Checklist

1. Replace `YOUR_WEB3FORMS_KEY` with the client's free Web3Forms access key from [web3forms.com](https://web3forms.com).
2. Set `seo.domain` in the client JSON file to the client's live production domain (e.g. `https://srilakshmiambulance.com`).
3. Add Google Ads Conversion ID & Label if running paid search ads.
4. Add Google Search Console verification token.
5. Deploy to Vercel:
   ```bash
   vercel --prod
   ```
   Or upload the static HTML/CSS/JS files to any standard web hosting service, Netlify, Cloudflare Pages, or Apache/cPanel.
