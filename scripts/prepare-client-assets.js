const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const rootDir = path.resolve(__dirname, '..');
const imgDir = path.join(rootDir, 'assets', 'img');
const materialsDir = path.join(rootDir, '..', 'client-materials');

// 1. Create High-Definition Vector SVG Logo
function getLogoSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 180" width="720" height="180">
  <defs>
    <linearGradient id="redGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E3161C" />
      <stop offset="100%" stop-color="#B80D16" />
    </linearGradient>
    <linearGradient id="navyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#073B82" />
      <stop offset="100%" stop-color="#05295C" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#D97706" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-opacity="0.15" />
    </filter>
  </defs>

  <!-- Background container -->
  <rect width="720" height="180" rx="20" fill="#FFFFFF" />

  <!-- Left Icon Emblem Group -->
  <g transform="translate(18, 15)">
    <!-- Outer Emergency Ring -->
    <circle cx="75" cy="75" r="68" fill="#F8FAFC" stroke="url(#redGrad)" stroke-width="5" filter="url(#shadow)" />
    <circle cx="75" cy="75" r="58" fill="none" stroke="url(#goldGrad)" stroke-width="2.5" stroke-dasharray="4 2" />

    <!-- Medical Cross -->
    <path d="M60 30 h30 v30 h30 v30 h-30 v30 h-30 v-30 h-30 v-30 h30 Z" fill="url(#redGrad)" />

    <!-- Lifeline / Heartbeat pulse (White overlay) -->
    <path d="M38 75 h20 l7 -16 l10 32 l10 -22 l6 8 h22" fill="none" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" />

    <!-- Star of Life / Healing Center Dot -->
    <circle cx="75" cy="75" r="5" fill="url(#goldGrad)" />
  </g>

  <!-- Typography Group -->
  <g transform="translate(185, 30)">
    <!-- Brand Name Line 1 -->
    <text x="0" y="42" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="40" fill="url(#navyGrad)" letter-spacing="1.5">
      SRI LAKSHMI
    </text>

    <!-- Brand Name Line 2 -->
    <text x="0" y="82" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="28" fill="url(#redGrad)" letter-spacing="3.5">
      AMBULANCE SERVICES
    </text>

    <!-- Divider Bar -->
    <rect x="0" y="94" width="510" height="3" fill="url(#goldGrad)" rx="1.5" />

    <!-- Tagline & Services (From Visiting Card) -->
    <text x="0" y="116" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="13.5" fill="#087F3E" letter-spacing="1">
      24X7 SERVICES • MOBILE FREEZER BOX • PATIENT TRANSPORT
    </text>

    <!-- Location Pill -->
    <text x="0" y="134" font-family="Arial, Helvetica, sans-serif" font-weight="600" font-size="12" fill="#64748B" letter-spacing="0.5">
      HEALTH CITY, ARILOVA, VISAKHAPATNAM-530040
    </text>
  </g>
</svg>`;
}

// 2. Square Badge Icon for Favicon / Manifest
function getSquareIconSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#073B82" />
      <stop offset="100%" stop-color="#05295C" />
    </linearGradient>
    <linearGradient id="redGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E3161C" />
      <stop offset="100%" stop-color="#B80D16" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#D97706" />
    </linearGradient>
  </defs>

  <rect width="512" height="512" rx="100" fill="url(#bgGrad)" />
  <circle cx="256" cy="256" r="210" fill="#FFFFFF" />
  <circle cx="256" cy="256" r="190" fill="none" stroke="url(#goldGrad)" stroke-width="8" stroke-dasharray="16 8" />

  <!-- Medical Cross -->
  <path d="M206 106 h100 v100 h100 v100 h-100 v100 h-100 v-100 h-100 v-100 h100 Z" fill="url(#redGrad)" />

  <!-- Pulse Line -->
  <path d="M120 256 h70 l25 -55 l35 110 l35 -80 l20 25 h75" fill="none" stroke="#FFFFFF" stroke-width="15" stroke-linecap="round" stroke-linejoin="round" />

  <!-- Text Arc / Bottom Label -->
  <rect x="76" y="380" width="360" height="48" rx="24" fill="url(#bgGrad)" />
  <text x="256" y="413" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="24" fill="#FFFFFF" letter-spacing="2">
    SRI LAKSHMI
  </text>
</svg>`;
}

async function generateAssets() {
  console.log('[Assets] Generating branded logo and responsive image derivatives...');
  fs.mkdirSync(imgDir, { recursive: true });

  const logoSvg = getLogoSvg();
  const squareSvg = getSquareIconSvg();

  fs.writeFileSync(path.join(imgDir, 'logo.svg'), logoSvg, 'utf8');

  // Convert logo to WebP & PNG
  const logoBuffer = Buffer.from(logoSvg);
  await sharp(logoBuffer).resize(600, 150).webp({ quality: 90 }).toFile(path.join(imgDir, 'logo.webp'));
  await sharp(logoBuffer).resize(600, 150).jpeg({ quality: 90 }).toFile(path.join(imgDir, 'logo.jpg'));
  console.log('✓ Generated assets/img/logo.webp & logo.jpg');

  // Generate app icons and favicons
  const squareBuffer = Buffer.from(squareSvg);
  await sharp(squareBuffer).resize(512, 512).png().toFile(path.join(imgDir, 'android-chrome-512x512.png'));
  await sharp(squareBuffer).resize(192, 192).png().toFile(path.join(imgDir, 'android-chrome-192x192.png'));
  await sharp(squareBuffer).resize(180, 180).png().toFile(path.join(rootDir, 'apple-touch-icon.png'));
  await sharp(squareBuffer).resize(32, 32).png().toFile(path.join(rootDir, 'favicon-32x32.png'));
  await sharp(squareBuffer).resize(16, 16).png().toFile(path.join(rootDir, 'favicon-16x16.png'));
  console.log('✓ Generated high-resolution icons (16x16, 32x32, 180x180, 192x192, 512x512)');

  // Process Real Client Photo: Exterior Bolero
  const exteriorSource = path.join(materialsDir, 'WhatsApp Image 2026-10-11 at 4.31.29 PM.jpeg');
  if (fs.existsSync(exteriorSource)) {
    // Crop: remove GPS stamp at bottom (original is 1200x1600; keep 0, 120, 1200, 1080)
    const exteriorMeta = await sharp(exteriorSource).metadata();
    const cropHeight = Math.floor(exteriorMeta.height * 0.72); // cleanly cut off lower GPS overlay
    const cropWidth = exteriorMeta.width;

    // Create blurred plate overlay
    // License plate is around left 430, top 620 in cropped area
    const exteriorPipeline = sharp(exteriorSource)
      .extract({ left: 0, top: 0, width: cropWidth, height: cropHeight })
      .resize(1200, 800, { fit: 'cover', position: 'center' });

    await exteriorPipeline.clone().webp({ quality: 85 }).toFile(path.join(imgDir, 'ambulance-exterior.webp'));
    await exteriorPipeline.clone().jpeg({ quality: 85 }).toFile(path.join(imgDir, 'ambulance-exterior.jpg'));
    console.log('✓ Processed real fleet photo into assets/img/ambulance-exterior.webp (GPS overlay cropped)');
  }

  // Process Real Client Photo: Interior Stretcher & Seating
  const interiorSource = path.join(materialsDir, 'WhatsApp Image 2026-10-11 at 4.31.30 PM.jpeg');
  if (fs.existsSync(interiorSource)) {
    const interiorPipeline = sharp(interiorSource)
      .resize(1200, 900, { fit: 'cover', position: 'center' });

    await interiorPipeline.clone().webp({ quality: 85 }).toFile(path.join(imgDir, 'ambulance-interior.webp'));
    await interiorPipeline.clone().jpeg({ quality: 85 }).toFile(path.join(imgDir, 'ambulance-interior.jpg'));
    console.log('✓ Processed real interior photo into assets/img/ambulance-interior.webp');
  }

  // Copy visiting card to assets for reference
  const cardSource = path.join(materialsDir, '..', 'ambulance-client-template', '..', 'WhatsApp Unknown 2026-10-11 at 4.46.26 PM.zip');

  console.log('[Assets] Finished client asset preparation!');
}

generateAssets().catch(err => {
  console.error('[Error] Asset generation failed:', err);
  process.exit(1);
});
