const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const shotsDir = path.resolve(__dirname, '..', 'visual-qa');
  if (!fs.existsSync(shotsDir)) fs.mkdirSync(shotsDir, { recursive: true });

  const viewports = [
    { name: 'mobile-360-home', width: 360, height: 740, url: 'http://localhost:8003/' },
    { name: 'mobile-360-about', width: 360, height: 740, url: 'http://localhost:8003/about' },
    { name: 'mobile-360-services', width: 360, height: 740, url: 'http://localhost:8003/services' },
    { name: 'mobile-360-contact', width: 360, height: 740, url: 'http://localhost:8003/contact' },
    { name: 'tablet-768-home', width: 768, height: 1024, url: 'http://localhost:8003/' },
    { name: 'desktop-1280-home', width: 1280, height: 800, url: 'http://localhost:8003/' },
  ];

  for (const v of viewports) {
    const context = await browser.newContext({ viewport: { width: v.width, height: v.height } });
    const page = await context.newPage();
    await page.goto(v.url, { waitUntil: 'networkidle' });
    const file = path.join(shotsDir, `${v.name}.png`);
    await page.screenshot({ path: file, fullPage: false });
    console.log(`Saved screenshot: ${file}`);
    await context.close();
  }

  await browser.close();
  console.log('Visual QA screenshots captured successfully.');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
