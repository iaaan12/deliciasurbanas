/**
 * Verify built static artifact prior to deploying GitHub Pages.
 * Run: node scripts/seo-check.mjs _site
 */
import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';
const root = resolve(process.cwd(), process.argv[2] ?? '_site');
const load = filename => readFile(resolve(root, filename), 'utf8');
const html = await load('index.html');
const catalog = JSON.parse(await load('catalog.json'));
const live = catalog.products.filter(p => p.active !== false);
assert.match(html, /<html\s+lang="es-AR"/);
assert.match(html, /<meta\s+name="description"\s+content="[^"]+"/);
assert.match(html, /<link\s+rel="canonical"\s+href="https:\/\/deliciasurbanas\.com\.ar\/"/);
assert.match(html, /<meta\s+name="robots"\s+content="index,follow"/);
assert.match(html, /<h1\b[^>]*>/);
assert.equal((html.match(/<h1\b/g) ?? []).length, 1, 'Exactly one H1');
const menuScripts = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1]));
const restaurant = menuScripts.find(s => s['@type'] === 'Restaurant');
const menu = menuScripts.find(s => s['@type'] === 'Menu');
assert(restaurant && menu, 'Restaurant and Menu schemas required');
assert.equal(restaurant.hasMenu['@id'], menu['@id']);
const items = menu.hasMenuSection.flatMap(s => s.hasMenuItem);
assert.equal(items.length, live.length, 'Schema and catalog product count mismatch');
for (const p of live) {
  const indexed = items.find(item => item.name === p.name);
  assert(indexed, 'Product missing from schema: ' + p.name);
  assert.equal(indexed.offers.price, p.price);
  assert.equal(indexed.offers.priceCurrency, 'ARS');
  assert(html.includes(p.name.replace(/&/g, '&amp;')), 'Product missing from source HTML: ' + p.name);
}
assert.match(await load('robots.txt'), /Sitemap:\s*https:\/\/deliciasurbanas\.com\.ar\/sitemap\.xml/);
assert.match(await load('sitemap.xml'), /<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/);
const roots = await readdir(root);
for (const name of roots) {
  assert(!/^admin|^server|^production-|^\.env|\.ps1$|\.log$/.test(name), 'Private file in public output: ' + name);
}
for (const [, path] of html.matchAll(/(?:src|href)=["']\.\/([^"'?#]+)["']/g)) {
  const file = resolve(root, path);
  assert(file.startsWith(root + '\\') || file.startsWith(root + '/'), 'Escaping asset path: ' + path);
  await stat(file);
}
const socialImage = await stat(resolve(root,'assets/og-delicias-urbanas.jpg'));
assert(socialImage.size > 10_000 && socialImage.size < 500_000, 'Social image unexpectedly sized');
console.log(`SEO CHECK PASS: canonical, structured data, ${live.length} HTML/schema products, robots, sitemap, public assets and protected files`);
