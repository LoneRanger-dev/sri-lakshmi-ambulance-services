const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const baseUrl = process.env.BASE_URL || 'http://localhost:8010';
const outputDir = path.join(__dirname, 'validation');
const viewports = [
  { name: '360', width: 360, height: 800 },
  { name: '390', width: 390, height: 844 },
  { name: '768', width: 768, height: 1024 },
  { name: '1440', width: 1440, height: 1000 },
];

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });

  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
    const page = await context.newPage();
    const origins = new Set();
    page.on('request', request => origins.add(new URL(request.url()).origin));
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(outputDir, `home-${viewport.name}.png`), fullPage: true });
    const layout = await page.evaluate(() => ({ viewport: window.innerWidth, container: Math.round(document.querySelector('.container').getBoundingClientRect().width) }));
    console.log(JSON.stringify({ viewport: viewport.name, layout, requestOrigins: [...origins].sort() }));
    await context.close();
  }

  await browser.close();
})();