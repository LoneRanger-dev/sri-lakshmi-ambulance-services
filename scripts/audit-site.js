const { chromium } = require('playwright');

const breakpoints = [
  { name: '320px mobile', width: 320, height: 568 },
  { name: '360px mobile', width: 360, height: 640 },
  { name: '375px mobile', width: 375, height: 667 },
  { name: '390px mobile', width: 390, height: 844 },
  { name: '414px mobile', width: 414, height: 896 },
  { name: '430px mobile', width: 430, height: 932 },
  { name: '480px mobile', width: 480, height: 854 },
  { name: '768px tablet', width: 768, height: 1024 },
  { name: '820px tablet', width: 820, height: 1180 },
  { name: '1024px laptop', width: 1024, height: 768 },
  { name: '1280px desktop', width: 1280, height: 800 },
  { name: '1440px desktop', width: 1440, height: 900 },
  { name: '1920px large desktop', width: 1920, height: 1080 }
];

const pagesToTest = ['/', '/about', '/services', '/contact'];
const baseUrl = process.env.TEST_URL || 'http://localhost:8003';

(async () => {
  console.log(`Starting comprehensive audit on ${baseUrl}...`);
  const browser = await chromium.launch();
  let totalIssues = 0;

  for (const pagePath of pagesToTest) {
    console.log(`\n========================================`);
    console.log(`Auditing Page: ${pagePath}`);
    console.log(`========================================`);

    for (const bp of breakpoints) {
      const context = await browser.newContext({
        viewport: { width: bp.width, height: bp.height }
      });
      const page = await context.newPage();
      await page.goto(`${baseUrl}${pagePath}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(100);

      const overflowData = await page.evaluate((bpWidth) => {
        const docScrollWidth = document.documentElement.scrollWidth;
        const bodyScrollWidth = document.body.scrollWidth;
        const windowInnerWidth = window.innerWidth;
        const hasDocOverflow = docScrollWidth > windowInnerWidth + 1;
        const hasBodyOverflow = bodyScrollWidth > windowInnerWidth + 1;

        const overflowingElements = [];
        const allElements = Array.from(document.querySelectorAll('*'));
        for (const el of allElements) {
          const rect = el.getBoundingClientRect();
          // Ignore fixed or absolute overlays that are hidden
          const style = window.getComputedStyle(el);
          if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') continue;
          if (rect.right > windowInnerWidth + 1.5) {
            const tag = el.tagName.toLowerCase();
            const cls = el.className ? `.${String(el.className).trim().split(/\s+/).join('.')}` : '';
            const id = el.id ? `#${el.id}` : '';
            overflowingElements.push({
              selector: `${tag}${id}${cls}`,
              right: Math.round(rect.right),
              width: Math.round(rect.width),
              overflowPx: Math.round(rect.right - windowInnerWidth)
            });
          }
        }

        // Header check
        const toggle = document.querySelector('.mobile-nav-toggle');
        let toggleRect = null;
        if (toggle && window.getComputedStyle(toggle).display !== 'none') {
          const r = toggle.getBoundingClientRect();
          toggleRect = { right: Math.round(r.right), width: Math.round(r.width), clipped: r.right > windowInnerWidth };
        }

        return {
          windowInnerWidth,
          docScrollWidth,
          bodyScrollWidth,
          hasOverflow: hasDocOverflow || hasBodyOverflow,
          overflowingElements: overflowingElements.slice(0, 5),
          toggleRect
        };
      }, bp.width);

      if (overflowData.hasOverflow || (overflowData.toggleRect && overflowData.toggleRect.clipped)) {
        console.error(`  ❌ [${bp.name} (${bp.width}px)] HORIZONTAL OVERFLOW DETECTED:`);
        console.error(`     docScrollWidth: ${overflowData.docScrollWidth}px, innerWidth: ${overflowData.windowInnerWidth}px`);
        if (overflowData.toggleRect && overflowData.toggleRect.clipped) {
          console.error(`     HAMBURGER BUTTON CLIPPED: right=${overflowData.toggleRect.right}px vs screen=${bp.width}px`);
        }
        overflowData.overflowingElements.forEach((el) => {
          console.error(`     Overflowing: <${el.selector}> width=${el.width}px, overflows by ${el.overflowPx}px`);
        });
        totalIssues++;
      } else {
        console.log(`  ✓ [${bp.name}] Layout fits perfectly (scrollWidth: ${overflowData.docScrollWidth}px / ${bp.width}px)`);
      }

      await context.close();
    }
  }

  await browser.close();
  console.log(`\nAudit completed. Total issue count: ${totalIssues}`);
  process.exit(totalIssues > 0 ? 1 : 0);
})().catch(err => {
  console.error('Audit script failed:', err);
  process.exit(1);
});
