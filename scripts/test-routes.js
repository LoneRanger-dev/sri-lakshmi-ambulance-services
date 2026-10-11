const http = require('http');
const path = require('path');
const fs = require('fs');

// Ensure build runs first
require('./build.js');

// Test port
const testPort = process.env.TEST_PORT || 8019;
process.env.PORT = String(testPort);

require('../server.js');

setTimeout(async () => {
  console.log('\nRunning automated route validation suite...\n');
  const routes = [
    { path: '/', expected: 200, checks: ['<title>', 'application/ld+json', 'data-reveal'] },
    { path: '/about', expected: 200, checks: ['<title>', 'Our story', 'Gallery'] },
    { path: '/services', expected: 200, checks: ['<title>', 'Ambulance', 'Services'] },
    { path: '/contact', expected: 200, checks: ['<title>', 'web3forms', 'Get directions'] },
    { path: '/assets/css/style.css', expected: 200, checks: [':root', '--brand-red'] },
    { path: '/assets/css/theme.css', expected: 200, checks: ['--brand-red', '--hero-bg-image'] },
    { path: '/assets/js/main.js', expected: 200, checks: ['setupForm', 'fireTracking'] },
    { path: '/assets/js/client-config.js', expected: 200, checks: ['window.CLIENT_CONFIG'] },
    { path: '/sitemap.xml', expected: 200, checks: ['<urlset', '<loc>'] },
    { path: '/robots.txt', expected: 200, checks: ['User-agent', 'Sitemap'] },
    { path: '/site.webmanifest', expected: 200, checks: ['"name"', '"short_name"'] },
    { path: '/non-existent-page-slug', expected: 404, checks: ['404'] },
  ];

  let passed = 0;
  let failed = 0;

  for (const r of routes) {
    await new Promise((resolve) => {
      http.get(`http://localhost:${testPort}${r.path}`, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          const statusOk = res.statusCode === r.expected;
          const contentOk = r.checks.every(chk => body.includes(chk));
          if (statusOk && contentOk) {
            console.log(`  ✓ PASS: ${r.path} [HTTP ${res.statusCode}]`);
            passed++;
          } else {
            console.error(`  ✗ FAIL: ${r.path} [HTTP ${res.statusCode}, expected ${r.expected}, checks passed: ${contentOk}]`);
            failed++;
          }
          resolve();
        });
      }).on('error', (err) => {
        console.error(`  ✗ FAIL: ${r.path} -> ${err.message}`);
        failed++;
        resolve();
      });
    });
  }

  console.log(`\nTest results: ${passed} passed, ${failed} failed.\n`);
  process.exit(failed > 0 ? 1 : 0);
}, 600);
