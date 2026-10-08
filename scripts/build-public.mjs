/**
 * Delicias Urbanas — static GitHub Pages artifact.
 *
 * Never publish the admin, local server, screenshots or credentials.
 * The deployed, indexable HTML menu and Menu schema always use catalog.json.
 * Run: node scripts/build-public.mjs
 */
import { readFile, copyFile, cp, mkdir, rm, writeFile, stat } from 'node:fs/promises';
import { dirname, resolve, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dest = resolve(root, '_site');
if (dest !== resolve(root, '_site') || dest === root) throw new Error('Invalid build destination');
const canonical = 'https://deliciasurbanas.com.ar/';
const htmlEscape = value => String(value ?? '').replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[c]));
const read = async file => readFile(resolve(root, file), 'utf8');
const catalog = JSON.parse(await read('catalog.json'));
if (!Array.isArray(catalog.products) || !catalog.products.length) throw new Error('Catalog is empty');
const active = catalog.products.filter(p => p.active !== false);
if (!active.length) throw new Error('No active menu products');
const ids = new Set();
for (const p of catalog.products) {
  if (!p.id || ids.has(p.id) || !p.name || !p.category || !Number.isFinite(p.price) || p.price < 0)
    throw new Error('Invalid or duplicate catalog product: ' + p.id);
  ids.add(p.id);
}
const groups = new Map();
for (const p of active) {
  if (!groups.has(p.category)) groups.set(p.category, []);
  groups.get(p.category).push(p);
}
const money = value => '$ ' + Number(value).toLocaleString('es-AR');
const listing = [...groups].map(([category, products]) => `
  <section class="du-menu-group" aria-label="${htmlEscape(category)}">
    <h3 class="du-menu-group-title">${htmlEscape(category)}</h3>
    <div class="du-menu-group-grid">
      ${products.map((product, index) => `
        <article class="du-menu-item${index === 0 ? ' du-menu-pick' : ''}">
          <div class="du-menu-line">
            <h4 class="du-menu-name">${htmlEscape(product.name)}</h4>
            <span class="du-menu-dots" aria-hidden="true"></span>
            <strong class="du-menu-price">${htmlEscape(money(product.price))}</strong>
          </div>
          <div class="du-menu-details"><p>${htmlEscape(product.description)}</p></div>
        </article>`).join('')}
    </div>
  </section>`).join('');

const menuSections = [...groups].map(([category, products]) => ({
  '@type': 'MenuSection',
  name: category,
  hasMenuItem: products.map(product => ({
    '@type': 'MenuItem',
    name: product.name,
    ...(product.description ? { description: product.description } : {}),
    offers: { '@type': 'Offer', price: product.price, priceCurrency: 'ARS' }
  }))
}));
const menuSchema = {
  '@context': 'https://schema.org',
  '@type': 'Menu',
  '@id': canonical + '#carta',
  name: 'Menú de Delicias Urbanas',
  url: canonical + '#menu',
  inLanguage: 'es-AR',
  hasMenuSection: menuSections
};
let html = await read('index.html');
const marker = '<div class="product-grid du-menu-list" data-products></div>';
if (!html.includes(marker)) throw new Error('Menu placeholder not found');
html = html.replace(marker,
  `<div class="product-grid du-menu-list" data-products>${listing}</div>`);
if (!html.includes('</head>')) throw new Error('Document head not found');
html = html.replace('</head>',
  `<script type="application/ld+json" id="du-menu-schema">${JSON.stringify(menuSchema).replace(/</g, '\\u003c')}</script>\n  </head>`);
html = html.replace('</div>\n      </section>\n\n      <section class="pickup-section',
  '</div>\n        <noscript><p>Podés ver los productos y precios en esta carta. Para hacer un pedido sin JavaScript, escribinos por <a href="https://wa.me/5493875020884">WhatsApp</a>.</p></noscript>\n      </section>\n\n      <section class="pickup-section');

// Only explicitly public root files and assets are allowed in _site.
const rootFiles = ['catalog.json', 'robots.txt', 'sitemap.xml', 'CNAME', '.nojekyll'];
const assetRefs = [...html.matchAll(/(?:src|href)=["']\.\/([^"'?#]+\.(?:css|js))["']/g)]
  .map(match => match[1]);
const scriptsAndStyles = [...new Set(assetRefs)];
for (const name of scriptsAndStyles) {
  if (basename(name) !== name || !/^[a-z][\w-]*\.(?:css|js)$/.test(name) || name.startsWith('admin'))
    throw new Error('Unexpected script/stylesheet in public HTML: ' + name);
  await stat(resolve(root, name)); // Fail build if an entry point was missed.
}
await rm(dest, { recursive: true, force: true });
await mkdir(dest, { recursive: true });
for (const file of rootFiles) await copyFile(resolve(root, file), resolve(dest, file));
for (const file of scriptsAndStyles) await copyFile(resolve(root, file), resolve(dest, file));
await cp(resolve(root, 'assets'), resolve(dest, 'assets'), { recursive: true });
await writeFile(resolve(dest, 'index.html'), html, 'utf8');
// Google ignores priority/changefreq; lastmod reflects the actual deployment.
let sitemap = await read('sitemap.xml');
sitemap = sitemap.replace(/\s*<changefreq>[^<]+<\/changefreq>/g, '')
  .replace(/\s*<priority>[^<]+<\/priority>/g, '');
sitemap = sitemap.replace(/(<loc>https:\/\/deliciasurbanas\.com\.ar\/<\/loc>)(?:\s*<lastmod>[^<]*<\/lastmod>)?/,
  `$1\n    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>`);
await writeFile(resolve(dest, 'sitemap.xml'), sitemap, 'utf8');
console.log(`Static artifact: ${scriptsAndStyles.length} JS/CSS files, ${active.length} active products, ${groups.size} indexed menu sections`);
