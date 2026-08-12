const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const START_URL = 'https://saikumarambulanceservice.com/';
const ROOT = __dirname;
const MIRROR_DIR = path.join(ROOT, '_mirror');
const RESOURCES_DIR = path.join(MIRROR_DIR, 'resources');
const PAGE_DIR = path.join(MIRROR_DIR, 'pages');

fs.mkdirSync(MIRROR_DIR, { recursive: true });
fs.mkdirSync(RESOURCES_DIR, { recursive: true });
fs.mkdirSync(PAGE_DIR, { recursive: true });

const seen = new Set();
const queue = [START_URL];
const pageRecords = [];
const seenAssets = new Set();

function sanitizeName(input) {
  return String(input || 'page')
    .replace(/https?:\/\//gi, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'page';
}

function getLocalFileName(url) {
  const u = new URL(url);
  const pathname = u.pathname === '/' ? '/index.html' : u.pathname;
  const ext = path.extname(pathname) || '.html';
  const fileName = pathname.replace(/^\//, '').replace(/\//g, '/');
  if (fileName.endsWith('/')) return 'index.html';
  if (fileName === '' || fileName === '/') return 'index.html';
  if (ext === '.html' || ext === '.htm' || ext === '.php' || !ext) {
    return fileName.replace(/\/$/, '') || 'index.html';
  }
  const hash = crypto.createHash('md5').update(url).digest('hex').slice(0, 8);
  return `${path.basename(fileName, path.extname(fileName))}-${hash}${path.extname(fileName)}`;
}

function ensureDirFor(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

async function saveRawResponse(response, baseUrl, requestUrl) {
  const url = new URL(requestUrl);
  const allowed = ['image/', 'text/css', 'font/', 'application/font', 'application/javascript', 'text/javascript', 'text/html'];
  const ctype = (response.headers()['content-type'] || '').toLowerCase();
  const isAsset = allowed.some((token) => ctype.includes(token));
  if (!isAsset && !['.css', '.js', '.svg', '.png', '.jpg', '.jpeg', '.webp', '.woff', '.woff2', '.ttf', '.ico', '.gif'].some((ext) => url.pathname.toLowerCase().endsWith(ext))) {
    return;
  }

  const key = url.href;
  if (seenAssets.has(key)) return;
  seenAssets.add(key);

  try {
    const body = await response.body();
    const target = path.join(RESOURCES_DIR, sanitizeName(url.origin), getLocalFileName(url.href));
    ensureDirFor(target);
    fs.writeFileSync(target, body);
  } catch (error) {
    // ignore binary response write failures for unsupported types
  }
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 2200 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
  });

  page.on('response', async (response) => {
    const url = response.url();
    if (!url.startsWith('https://saikumarambulanceservice.com') && !url.startsWith('http://saikumarambulanceservice.com')) {
      return;
    }
    if (url.includes('wp-json') || url.includes('xmlrpc')) return;
    try {
      await saveRawResponse(response, START_URL, url);
    } catch (error) {
      // ignore one-off request errors
    }
  });

  while (queue.length) {
    const current = queue.shift();
    if (!current || seen.has(current)) continue;
    seen.add(current);

    try {
      await page.goto(current, { waitUntil: 'networkidle', timeout: 120000 });
      await page.evaluate(async () => {
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        window.scrollTo({ top: 0, behavior: 'auto' });
        const maxScrolls = 12;
        for (let i = 0; i < maxScrolls; i += 1) {
          window.scrollTo({ top: document.body.scrollHeight * (i + 1) / maxScrolls, behavior: 'auto' });
          await delay(400);
        }
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'auto' });
        await delay(1200);
      });
      await page.waitForLoadState('networkidle');

      const title = await page.title();
      const metaDescription = await page.$eval('meta[name="description"]', (el) => el.getAttribute('content') || '').catch(() => '');
      const h1 = await page.$eval('h1', (el) => el.textContent.trim()).catch(() => '');
      const url = page.url();
      const safeName = sanitizeName(url);
      const filePath = path.join(PAGE_DIR, `${safeName}.html`);
      const html = await page.content();
      fs.writeFileSync(filePath, html, 'utf8');
      pageRecords.push({ url, title, metaDescription, h1, file: path.relative(ROOT, filePath) });

      const links = await page.$$eval('a[href]', (anchors) => anchors.map((a) => a.href).filter(Boolean));
      for (const link of links) {
        try {
          const parsed = new URL(link);
          if (parsed.origin === 'https://saikumarambulanceservice.com' || parsed.origin === 'http://saikumarambulanceservice.com') {
            const normalized = parsed.href.replace(/#.*$/, '');
            if (!seen.has(normalized) && normalized !== '') {
              queue.push(normalized);
            }
          }
        } catch (error) {
          // ignore invalid URL values
        }
      }
    } catch (error) {
      console.log('FAILED PAGE:', current, error.message);
    }
  }

  fs.writeFileSync(path.join(MIRROR_DIR, 'crawl-manifest.json'), JSON.stringify({ pages: pageRecords }, null, 2));
  console.log('Pages found:', pageRecords.length);
  for (const record of pageRecords) {
    console.log(record.url);
  }

  await browser.close();
})();
