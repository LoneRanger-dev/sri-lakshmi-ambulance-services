const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const baseUrl = process.env.BASE_URL || 'http://localhost:8010';
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const pages = ['/', '/about', '/services', '/contact'];

  for (const route of pages) {
    const url = baseUrl + route;
    const requestOrigins = new Set();
    const collectOrigin = request => requestOrigins.add(new URL(request.url()).origin);
    page.on('request', collectOrigin);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    const jsonLdValid = await page.evaluate(() => Array.from(document.querySelectorAll('script[type="application/ld+json"]')).every(script => {
      try {
        JSON.parse(script.textContent);
        return true;
      } catch {
        return false;
      }
    }));
    const out = {
      url,
      title: await page.title(),
      h1: (await page.locator('h1').first().textContent()) || '',
      telCount: await page.locator('a[href*="tel:+919000147902"]').count(),
      waCount: await page.locator('a[href*="wa.me/919000147902"]').count(),
      brokenImages: await page.evaluate(() => Array.from(document.images).filter(img => !img.complete || img.naturalWidth === 0).length),
      jsonLd: await page.locator('script[type="application/ld+json"]').count(),
      jsonLdValid,
      thirdPartyRequestCount: [...requestOrigins].filter(origin => origin !== new URL(baseUrl).origin).length,
      requestOrigins: [...requestOrigins].sort(),
    };
    console.log(JSON.stringify(out));
    page.off('request', collectOrigin);
  }

  await browser.close();
})();
