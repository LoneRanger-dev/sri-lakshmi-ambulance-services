const { chromium } = require('playwright');

(async () => {
  console.log('Launching browser to test mobile navigation...');
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 375, height: 667 }, // iPhone SE size
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
  });
  const page = await context.newPage();

  await page.goto('http://localhost:8002/');

  // 1. Verify desktop nav is hidden on mobile
  const desktopNavVisible = await page.locator('.nav').isVisible();
  console.log('Desktop nav visible on mobile:', desktopNavVisible, '(expected: false)');
  if (desktopNavVisible) throw new Error('Desktop nav should be hidden on mobile');

  // 2. Verify mobile toggle is visible
  const toggleVisible = await page.locator('.mobile-nav-toggle').isVisible();
  console.log('Mobile nav toggle visible:', toggleVisible, '(expected: true)');
  if (!toggleVisible) throw new Error('Mobile nav toggle must be visible');

  // 3. Click hamburger toggle
  await page.click('.mobile-nav-toggle');
  await page.waitForTimeout(400);

  const isDrawerOpen = await page.locator('.mobile-nav.is-open').isVisible();
  console.log('Mobile nav drawer is-open visible:', isDrawerOpen, '(expected: true)');
  if (!isDrawerOpen) throw new Error('Drawer should be open after clicking hamburger');

  // 4. Click About Us link in mobile drawer
  await page.click('.mobile-nav a[href="/about"]');
  await page.waitForURL('http://localhost:8002/about');
  console.log('Navigated to:', page.url());

  // 5. Verify page title or content on About page
  const aboutTitle = await page.title();
  console.log('About page title:', aboutTitle);

  // 6. On About page, click mobile toggle again and switch to Services
  await page.click('.mobile-nav-toggle');
  await page.waitForTimeout(400);
  await page.click('.mobile-nav a[href="/services"]');
  await page.waitForURL('http://localhost:8002/services');
  console.log('Navigated to:', page.url());

  // 7. On Services page, switch to Contact via footer nav
  await page.click('.footer-nav a[href="/contact"]');
  await page.waitForURL('http://localhost:8002/contact');
  console.log('Navigated via footer to:', page.url());

  console.log('\n Mobile navigation verification passed completely!\n');
  await browser.close();
  process.exit(0);
})().catch(err => {
  console.error('Error during mobile nav verification:', err);
  process.exit(1);
});
