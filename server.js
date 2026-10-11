const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const port = process.env.PORT || 8000;
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
};

function resolveRequestPath(urlPath) {
  if (urlPath === '/') return path.join(root, 'index.html');
  const cleanPath = decodeURIComponent(urlPath).replace(/^\/+/, '');
  const direct = path.join(root, cleanPath);
  const withHtml = path.join(root, `${cleanPath}.html`);
  if (fs.existsSync(direct) && fs.statSync(direct).isFile()) return direct;
  if (fs.existsSync(withHtml) && fs.statSync(withHtml).isFile()) return withHtml;
  if (!path.extname(cleanPath)) {
    const indexLike = path.join(root, cleanPath, 'index.html');
    if (fs.existsSync(indexLike)) return indexLike;
  }
  return path.join(root, '404.html');
}

const server = http.createServer((req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const filePath = resolveRequestPath(requestUrl.pathname);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      const fallback = path.join(root, '404.html');
      fs.readFile(fallback, (fallbackErr, fallbackData) => {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(fallbackErr ? '404 Not Found' : fallbackData);
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const isVersionedAsset = ext !== '.html' && ext !== '.css' && ext !== '.js';
    const cacheControl = ext === '.html'
      ? 'no-cache'
      : isVersionedAsset
        ? 'public, max-age=31536000, immutable'
        : 'public, max-age=0, must-revalidate';
    const isNotFound = path.basename(filePath).toLowerCase() === '404.html' && requestUrl.pathname !== '/404.html' && requestUrl.pathname !== '/404';
    const statusCode = isNotFound ? 404 : 200;
    res.writeHead(statusCode, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream', 'Cache-Control': cacheControl });
    res.end(data);
  });
});

function startServer(initialPort, maxAttempts = 15) {
  let currentPort = Number(initialPort);
  let attempts = 0;

  function tryListen() {
    const onError = (err) => {
      if (err.code === 'EADDRINUSE') {
        attempts++;
        if (attempts < maxAttempts) {
          console.warn(`[Port busy] Port ${currentPort} is already in use. Retrying on port ${currentPort + 1}...`);
          currentPort++;
          setTimeout(tryListen, 100);
          return;
        }
      }
      console.error(`[Error] Failed to bind server starting at port ${initialPort}:`, err.message);
      process.exit(1);
    };

    server.once('error', onError);
    server.listen(currentPort, () => {
      server.removeListener('error', onError);
      console.log(`Local static server running at http://localhost:${currentPort}`);
    });
  }

  tryListen();
}

startServer(port);
