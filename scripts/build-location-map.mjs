// Genera un SVG a partir de calles reales de OpenStreetMap (Overpass `out geom`).
// Uso: node scripts/build-location-map.mjs [ruta al archivo JSON de Overpass]
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const source = process.argv[2];
if (!source) throw new Error('Falta el archivo JSON exportado de Overpass.');
const { elements } = JSON.parse(await readFile(source, 'utf8'));
if (!Array.isArray(elements)) throw new Error('Archivo de calles inválido.');

// Ubicación: Av. San Martín 532, Salta Capital (Nominatim/OSM).
const center = { lat: -24.7936666, lon: -65.4104919 };
const W = 1080, H = 620, scale = 1.15;
const lonMeters = 111320 * Math.cos(center.lat * Math.PI / 180);
const f = (n) => Math.round(n * 10) / 10;
const project = ({ lon, lat }) => [f(W / 2 + (lon - center.lon) * lonMeters * scale), f(H / 2 - (lat - center.lat) * 111320 * scale)];
const d = (pts) => pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join(' ');
const inView = ([x, y], pad = 0) => x > -pad && x < W + pad && y > -pad && y < H + pad;
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const safe = (s) => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const roads = elements.filter(w => w.type === 'way' && w.geometry?.length > 1)
  .filter(w => ['residential', 'living_street', 'pedestrian', 'tertiary', 'secondary', 'primary', 'unclassified'].includes(w.tags?.highway))
  .map(w => ({name: w.tags.name || '', type: w.tags.highway, points: w.geometry.map(project)}))
  .filter(w => w.points.some(p => inView(p, 100)));
const isSanMartin = r => /^(avenida\s+)?san\s+mart[ií]n$/i.test(r.name);
const isMain = r => ['secondary', 'tertiary', 'primary'].includes(r.type);
const main = roads.filter(r => isMain(r) && !isSanMartin(r));
const local = roads.filter(r => !isMain(r) && !isSanMartin(r));
const highlight = roads.filter(isSanMartin);
if (!highlight.length) throw new Error('No se encontró Av. San Martín en los datos.');
// pathLength permite animar el trazado con una longitud normalizada de 0 a 1.
const paths = (items, name) => `<g class="${name}">${items.map((r, i) => `<path pathLength="1" style="--road-step:${i % 13}" d="${d(r.points)}"/>`).join('')}</g>`;

// El recorrido sigue la geometría real de Av. San Martín, desde el oeste
// hasta la altura del local. No inventa atajos sobre las manzanas.
const routePoints = highlight.flatMap(road => road.points)
  .filter(([x, y]) => x >= 50 && x <= W / 2 && y >= 0 && y <= H)
  .sort((a, b) => a[0] - b[0])
  .filter((p, i, points) => i === 0 || dist(p, points[i - 1]) > 1);
if (routePoints.length < 3) throw new Error('No se pudo construir el recorrido sobre Av. San Martín.');
routePoints.push([W / 2, H / 2]);
const walkRoute = d(routePoints);

const names = new Map([
  ['Avenida San Martín','Av. San Martín'], ['Buenos Aires','Buenos Aires'],
  ['Córdoba','Córdoba'], ['Catamarca','Catamarca'], ['Florida','Florida'],
  ['Hernando de Lerma','Lerma'], ['Juan Bautista Alberdi','Alberdi'],
  ['Rudecindo Alvarado','Alvarado'], ['Mendoza','Mendoza'], ['San Juan','San Juan'],
  ['Caseros','Caseros'], ['Carlos Pellegrini','Pellegrini'], ['Justo José de Urquiza','Urquiza'],
]);
const chosen = [];
for (const [name, label] of names) {
  const candidate = roads.filter(r => r.name === name).map(r => {
    const points = r.points.filter(p => inView(p, -34));
    const length = points.slice(1).reduce((n, p, i) => n + dist(p, points[i]), 0);
    const mid = points[Math.floor(points.length / 2)];
    const centerDistance = mid ? dist(mid, [W/2, H/2]) : 0;
    return { label, points, mid, length, score: length - (centerDistance < 130 ? 150 : 0) };
  }).filter(r => r.points.length >= 2 && r.length > label.length * 10 && inView(r.mid, -64))
    .sort((a,b) => b.score - a.score)[0];
  if (candidate && !chosen.some(c => dist(c.mid, candidate.mid) < 95)) chosen.push(candidate);
}
const labels = chosen.map((c,i) => {
  const a=c.points[0], b=c.points.at(-1);
  const points = (a[0] > b[0] + 20 || (Math.abs(a[0]-b[0]) <= 20 && a[1] > b[1])) ? [...c.points].reverse() : c.points;
  return `<path id="du-street-${i}" d="${d(points)}" fill="none"/><text><textPath href="#du-street-${i}" startOffset="50%" text-anchor="middle">${safe(c.label)}</textPath></text>`;
}).join('');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" aria-labelledby="map-title" role="img">
<title id="map-title">Mapa ilustrado de calles alrededor de Delicias Urbanas, Salta</title>
<style>
  .local path,.main path,.san-base path,.san path{fill:none;stroke-linecap:round;stroke-linejoin:round}
  .local path{stroke:#694b3b;stroke-width:6.8;opacity:.96}
  .main path{stroke:#f4bb4c;stroke-width:11.5}
  .san-base path{stroke:#9c3516;stroke-width:16;opacity:.65}
  .san path{stroke:#ff6a00;stroke-width:12}
  .map-labels text{font:900 17px system-ui,-apple-system,sans-serif;letter-spacing:.6px;fill:#fff8ec;stroke:#29190f;stroke-width:4px;stroke-linejoin:round;paint-order:stroke}
</style>
<rect width="${W}" height="${H}" fill="#29190f"/>
${paths(local,'local')}
${paths(main,'main')}
${paths(highlight,'san-base')}
<g class="san">${highlight.map((r,i) => `<path pathLength="1" style="--road-step:${i % 6}" d="${d(r.points)}"/>`).join('')}</g>
<g class="map-labels">${labels}</g>
<path id="du-walk-route" d="${walkRoute}" fill="none" stroke="none" pointer-events="none"/>
</svg>\n`;

const dest = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../assets/location-map.svg');
await writeFile(dest, svg, 'utf8');
console.log(`SVG generado: ${dest}. ${roads.length} tramos, ${chosen.length} nombres.`);
