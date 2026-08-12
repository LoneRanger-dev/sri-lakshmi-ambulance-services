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
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream', 'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable' });
    res.end(data);
  });
});

server.listen(port, () => {
  console.log(`Local static server running at http://localhost:${port}`);
});
