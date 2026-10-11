# Ambulance Client Website Template

A high-performance, mobile-first static website template designed for emergency ambulance services. Built for multi-client white-label reusability with zero-dependency static compilation, local SEO optimization, Schema.org structured data, and Google Ads call conversion tracking.

## Key Features

- **Multi-Client Architecture**: Centralized `client.config.json` profile system with ready profiles in `/clients`.
- **Instant Compilation**: Zero runtime dependencies; compiles a complete client site in <50ms with `npm run build`.
- **High-Converting UX**:
  - One-tap emergency call CTA (`tel:`) across all headers and sections
  - Urgent WhatsApp pre-filled chat launcher with animated pulse effect
  - Sticky mobile emergency call bar
  - Interactive Web3Forms contact form with anti-spam honeypot
  - Accessible animations with `prefers-reduced-motion` compliance
- **Local SEO & Analytics Ready**:
  - Full Schema.org JSON-LD structured data (`EmergencyService`, `LocalBusiness`)
  - Automated XML sitemap, `robots.txt`, and Open Graph tags
  - Google Ads Call Conversion and GA4 integration hooks
- **Resilient Local Preview**:
  - Zero-dependency Node.js HTTP server (`server.js`) with automatic port discovery if port 8000 is occupied.

## Quick Start

```bash
# 1. Compile active profile
npm run build

# 2. Switch/compile for a specific client (e.g. Sri Lakshmi Ambulance)
npm run build:client -- srilakshmiambulance

# 3. Start local development server
npm run dev

# 4. Run automated test suite
npm test
```

For complete documentation on creating and deploying new client websites, see [CLIENT_SETUP_GUIDE.md](./CLIENT_SETUP_GUIDE.md).
