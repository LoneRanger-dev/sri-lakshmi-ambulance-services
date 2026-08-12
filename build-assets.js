const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dir = path.join(__dirname, 'assets', 'img');
fs.mkdirSync(dir, { recursive: true });

const sourceDir = path.join(__dirname, '_mirror', 'resources', 'saikumarambulanceservice.com');
const collage = path.join(sourceDir, '08a7780a-a525-483b-9492-43df688dc881-9f0e8270.png');
const logo = path.join(sourceDir, '21206659-f483-497e-a37b-25e4635ad9af-300x200-af936724.png');

const crops = [
  ['ambulance-exterior', { left: 0, top: 0, width: 800, height: 550 }],
  ['ambulance-interior', { left: 805, top: 0, width: 435, height: 330 }],
  ['paramedic-care', { left: 1245, top: 0, width: 290, height: 330 }],
  ['night-ambulance', { left: 805, top: 335, width: 730, height: 210 }],
  ['patient-transfer', { left: 0, top: 550, width: 390, height: 295 }],
  ['ambulance-team', { left: 395, top: 550, width: 500, height: 295 }],
  ['ambulance-fleet', { left: 900, top: 780, width: 635, height: 244 }],
];

async function writeDerivatives(name, pipeline) {
  const jpgPath = path.join(dir, `${name}.jpg`);
  const webpPath = path.join(dir, `${name}.webp`);
  await pipeline.clone().rotate().resize({ width: 1600, withoutEnlargement: true, fit: 'inside' }).jpeg({ quality: 82, mozjpeg: true }).toFile(jpgPath);
  await pipeline.clone().rotate().resize({ width: 1600, withoutEnlargement: true, fit: 'inside' }).webp({ quality: 82 }).toFile(webpPath);
}

(async () => {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });

  await writeDerivatives('logo', sharp(logo).flatten({ background: '#ffffff' }));
  for (const [name, crop] of crops) {
    await writeDerivatives(name, sharp(collage).extract(crop));
  }

  console.log(`Created ${crops.length + 1} source-derived image pairs from client-branded source files.`);
})();
