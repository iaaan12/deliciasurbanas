# Delicias Urbanas — rediseño 2026

Reimplementación mobile-first de la web pública de Delicias Urbanas. La producción estática se publica por GitHub Pages desde la rama main; el panel administrativo permanece local.

## Fuente de verdad comercial

Los datos operativos se tomaron de la web pública vigente al 25/09/2026:

- Dirección: Av. San Martín 532, Salta.
- WhatsApp: +54 9 387 502-0884.
- Horarios: lunes a sábado, 08:00–15:00 y 17:30–21:00.
- Métodos: efectivo al retirar o transferencia / Mercado Pago.
- Regla vigente: pedidos superiores a $15.000 requieren transferencia previa.
- Alias: `deliciasurbanas13`.
- Titular: Nahida Esther Leonor Zamar.
- Catálogo inicial, precios, descripciones, categorías y personalizaciones: migrados de la configuración de la web vigente.

Las fotografías stock históricas del catálogo se quitaron de `catalog.json` porque varias no representaban el producto. La web usa gráficas de marca específicas por producto/categoría hasta que se cargue una foto real correcta desde el panel.

## Ejecutar en local

```powershell
node server.cjs
```

- Web: `http://127.0.0.1:4173/`
- Admin: `http://127.0.0.1:4173/admin`

Por defecto escucha en `0.0.0.0`; podés limitarlo con `HOST=127.0.0.1` si querés usarlo solo en la PC.

## Panel de administración

El catálogo público vive en `catalog.json`. El panel permite modificarlo sin editar código:

- nombre;
- precio;
- descripción;
- categoría;
- visible / oculto;
- destacado;
- promo;
- “más pedido”;
- vegetariano;
- URL de imagen real y activación explícita de esa foto;
- creación de productos nuevos.

Los IDs internos existentes permanecen bloqueados para no romper carritos o personalizaciones guardadas. Las personalizaciones de docenas, baguette y pebete se preservan aunque cambien nombre, precio o descripción.

El guardado usa `PUT /api/catalog`, valida los datos y reemplaza el catálogo de forma atómica. La web pública carga el catálogo al iniciar y solo muestra productos con `active !== false`.

En producción, `/admin`, sus assets y las escrituras del catálogo están protegidos con HTTP Basic Auth mediante `ADMIN_USER` y `ADMIN_PASSWORD`. Si `NODE_ENV=production` y esas variables no están configuradas, el panel responde `503` en lugar de quedar expuesto.

Para persistencia entre deploys se puede definir `DATA_DIR=/data` y montar un volumen persistente en esa ruta. En el primer arranque, el servidor copia automáticamente el `catalog.json` incluido en el repositorio al volumen si todavía no existe.

Variables recomendadas:

```env
NODE_ENV=production
HOST=0.0.0.0
DATA_DIR=/data
ADMIN_USER=admin
ADMIN_PASSWORD=<contraseña-segura>
```

El endpoint `GET /healthz` devuelve `200` y se usa como healthcheck del hosting.

### Administración privada + publicación automática

La producción pública se puede servir de forma estática con GitHub Pages y mantener el panel fuera de Internet. Para administrar desde esta PC y publicar cada cambio automáticamente:

```powershell
$env:HOST="127.0.0.1"
$env:AUTO_PUSH_CATALOG="1"
node server.cjs
```

Después abrí `http://127.0.0.1:4173/admin`. Cada guardado modifica `catalog.json`, crea un commit solo para ese archivo y hace `git push origin main`. El workflow de GitHub Pages publica el catálogo actualizado.

En Windows también podés ejecutar directamente:

```powershell
.\admin-local.ps1
```

El script levanta el servidor únicamente en `127.0.0.1`, abre el panel en Chrome y lo apaga cuando presionás Enter en la consola. El panel no forma parte del artefacto público de GitHub Pages.

## Funcionalidades públicas

- Diálogos de pedidos unificados con el lenguaje retro/editorial de la marca en `dialogs-wow.css` y `dialogs-wow.js`: «Mis pedidos» muestra tickets con estados fieles al historial guardado, el carrito tiene un estado vacío ilustrado y fichas de producto, la personalización incorpora filas/steppers y barra de progreso existente con estado «listo» según los valores reales, y checkout y confirmación usan papel crema, mostaza y terracota. En escritorio, los paneles vacíos y personalizaciones simples adaptan su altura al contenido; en móvil funcionan como hojas inferiores compactas con desplazamiento interno. No se cambian importes, reglas de transferencia, datos de clientes ni el envío de WhatsApp. Animaciones puntuales y soporte `prefers-reduced-motion`.
- Ubicación renovada en `location-wow.css` y `location-wow.js`: recibo de papel crema para dirección/horarios/WhatsApp, copia de la dirección con feedback accesible, animación editorial de entrada, mapa con profundidad amortiguada en dispositivos con mouse, botón «Repetir recorrido» y pulso único de llegada del marcador. `location-map.js` sigue siendo el dueño del trazado real y ahora admite reiniciar la secuencia sin duplicar elementos. En móvil la animación de calles empieza cuando el mapa entra en pantalla; `prefers-reduced-motion` conserva el SVG estático sin recorrido, tilt ni botón de replay.
- Destacados renovados en `featured-polish.css` y `featured-polish.js`: una tarjeta grande y dos secundarias con gráficas tipográficas de marca, números ornamentales y movimiento suave de profundidad al pasar el cursor. Cuando el panel tenga imágenes reales verificadas, se muestran enteras (`object-fit: contain`) sin recortes ni fotografías inventadas. Se conservan los precios del catálogo, las promociones y los botones de compra. El borde de la torta PNG se suaviza con una máscara alfa para que los ingredientes no terminen con cortes rectangulares, y su animación reduce opacidad al cruzar promociones para no ocultar información.
- La tarjeta de «Mis pedidos» queda centrada en escritorio; con el historial vacío ocupa una altura reducida. Los pedidos largos siguen teniendo desplazamiento interno; la versión móvil no cambia.
- Barra de navegación pulida en `header-polish.css` y `header-polish.js`: píldora terracota que acompaña hover/foco y marca la sección visible, cambio suave de tamaño sobre fondo chocolate al hacer scroll, indicador fino de progreso, interacción discreta con el logo, respuesta del carrito al agregar artículos y menú móvil accesible con Escape y cierre al navegar. Al pulsar la marca vuelve al comienzo real incluso con el header sticky; `prefers-reduced-motion` desactiva transiciones/feedback animado.
- Hero tipo póster mostaza con fotografía **real PNG transparente de torta salada** (`assets/torta-scroll.png`, archivo facilitado por el negocio), lettering enorme, barra flotante crema y botones de menú/ubicación. La pieza se anima reversiblemente por scroll con `poster-scroll.js` y llega visualmente a la transición hacia `#menu`, donde desaparece; para `prefers-reduced-motion` queda estática.
- Carta condensada: `poster-compact.css` presenta dos columnas en escritorio y una columna legible en celular; Sándwiches tiene subfiltros «Docenas» / «Por unidad» y Bebidas se separa por presentaciones basadas en los nombres existentes del catálogo. Los productos, precios y acciones de compra siguen procediendo del panel, sin artículos ficticios.
- Identidad editorial integral estilo carta gastronómica: superficies chocolate, crema, mostaza y naranja, tipografías Lilita One/Lobster, header y footer de marca, hero, favoritos y ubicación cohesionados. `site-editorial.css` es la capa pública de estilo actual por encima de las reglas heredadas; los formularios de compra conservan su estructura.
- Animaciones fluidas y accesibles con `site-editorial.js`: revelado progresivo al entrar en pantalla, hover de productos y ficha del menú que sigue el cursor con amortiguación dentro de los límites del listado en escritorio. En pantallas táctiles permanece estática bajo el listado; `prefers-reduced-motion` evita los efectos animados.
- Hero editorial con identidad naranja y fotografía oficial de Delicias Urbanas.
- Bloque de promos/favoritos configurable desde admin.
- Menú editorial estilo carta gastronómica (fondo chocolate, categorías, precios unidos por puntos y ficha inclinada con detalle dinámico), con datos y precios tomados del mismo `catalog.json` del panel.
- Menú instantáneo sin loading artificial.
- Búsqueda instantánea y categorías sticky.
- Gráficas coherentes con cada producto; no se muestran fotos incorrectas.
- Personalización de docenas, baguette y pebete.
- Carrito persistente en `localStorage`.
- Bottom bar de carrito en mobile y drawer en desktop.
- Control de cantidades, eliminación y cross-sell de productos existentes.
- Checkout de retiro con validación.
- Fechas para los próximos días de atención y slots de 30 minutos.
- Para hoy, se ocultan horarios pasados y los de menos de 30 minutos de anticipación.
- Transferencia obligatoria únicamente cuando el total es superior a $15.000.
- Datos bancarios visibles solo al elegir transferencia.
- Mensaje de WhatsApp con ítems, personalizaciones, total, retiro, nombre, pago y notas.
- Historial local “Mis pedidos”.
- Estado abierto/cerrado calculado en `America/Argentina/Salta`.
- Mapa ilustrado de calles reales (SVG de OpenStreetMap), con marcador de marca y enlace a Google Maps; WhatsApp e Instagram.
- SEO, Open Graph y Schema.org `Restaurant`.
- Publicación SEO: npm run build genera _site con los estilos/scripts realmente usados, assets públicos, catálogo en HTML rastreable sin JavaScript y JSON-LD Restaurant/Menu con precios ARS exactos extraídos de catalog.json. npm run check:seo comprueba automáticamente integridad, enlaces, imágenes y exclusión de archivos del panel. El workflow de Pages ejecuta ambos en cada deploy y nunca incluye admin.html, admin.js, server.cjs, capturas ni credenciales.
- Accesibilidad: landmarks, labels, diálogos nativos, foco visible y `prefers-reduced-motion`.
- Hooks de analytics sin imponer proveedor (`dataLayer` si existe + evento `delicias:analytics`).

### Menú editorial

`menu-editorial.css` controla solamente la sección `#menu`. El menú abre en la categoría «Pollo» cuando existe y permite cambiar a Sándwiches, Guarniciones, Bebidas o Todos; la búsqueda trabaja sobre todas las categorías. Los botones «Agregar» y «Elegir opciones» conservan los flujos de carrito y personalización del sitio. La ficha de papel se actualiza con el producto seleccionado usando sus datos reales, sin repetir precios manualmente.

`menu-wow.css` y `menu-wow.js` son la capa final de interacción del menú: revelado por scroll y filas escalonadas, indicador dorado persistente que se desplaza entre categorías sin recrear los botones, interacciones de precio/botón, spotlight radial localizado por puntero, búsqueda con foco animado y respuesta inmediata. La ficha de papel sigue el cursor en escritorio con un movimiento amortiguado y se coloca a un lado del producto señalado para no tapar su nombre o precio. En tablet y celular permanece oculta por claridad; la carta sigue compacta y navegable por tacto. `prefers-reduced-motion` anula los movimientos sin desactivar ningún filtro ni opción de compra.

El botón «Ver menú completo» muestra todos los productos activos; no anuncia un menú impreso que no exista. Todas las etiquetas, precios y descripciones provienen del catálogo.

### Mapa ilustrado de la sucursal

El bloque «Dónde estamos» usa `assets/location-map.svg`, generado con datos de calles de OpenStreetMap. El centro se fija en las coordenadas de Av. San Martín 532, Salta Capital (`-24.7936666, -65.4104919`), contrastadas con Nominatim. La avenida está resaltada en naranja y el pin se mantiene centrado al cambiar de tamaño de pantalla. El mapa es ilustrativo y abre Google Maps al hacer clic; no incluye zoom ni navegación interna.

`location-map.js` reemplaza la imagen por el mismo SVG en línea cuando puede cargarlo correctamente. Un `IntersectionObserver` espera hasta que el usuario llega a la sección: recién ahí los caminos comienzan a dibujarse y un logo con piernas recorre el camino real de Av. San Martín, adaptando su punto de partida al ancho visible del mapa. Al finalizar, aparece el pin con la dirección. Si falla JavaScript o la carga del SVG, se conserva el mapa estático; con `prefers-reduced-motion` tampoco se inicia la animación.

Para actualizar las geometrías, exportar desde Overpass un JSON con esta consulta y ejecutar `node scripts/build-location-map.mjs ruta/al/overpass.json`:

```text
[out:json][timeout:25];way[highway](around:580,-24.7936666,-65.4104919);out geom;
```

La atribución a los colaboradores de OpenStreetMap debe permanecer visible junto al mapa. La animación respeta `prefers-reduced-motion`.

## QA realizado

Se revisaron visual y funcionalmente home, promos, menú, ubicación, footer, carrito vacío/lleno, personalización, checkout, éxito, pedidos guardados y panel admin.

Breakpoints comprobados sin overflow horizontal: 360×800, 375×812, 390×844, 430×932, 768×1024, 1024×768, 1366×768, 1440×900 y 1920×1080.

También se validó:

- catálogo de 29 productos;
- búsqueda sin resultados;
- carrito persistente;
- límite de pago: $15.000 permite efectivo y $17.000 fuerza transferencia;
- creación del mensaje de WhatsApp sin enviarlo durante QA;
- historial de pedidos local;
- lectura y guardado real del admin sobre `catalog.json` con restauración posterior del valor probado;
- sintaxis de `app.js`, `admin.js` y `server.cjs`.

## Checklist de producción

1. Desplegar el servicio Node y configurar `NODE_ENV`, `ADMIN_USER`, `ADMIN_PASSWORD` y `DATA_DIR`.
2. Montar almacenamiento persistente en `DATA_DIR` si el hosting usa filesystem efímero.
3. Configurar `GET /healthz` como healthcheck.
4. Apuntar `deliciasurbanas.com.ar` y `www.deliciasurbanas.com.ar` al servicio y verificar HTTPS.
5. Cargar fotografías reales de producto desde el panel cuando estén disponibles y activar “Usar foto” solo después de verificarlas.
6. Confirmar Analytics/Meta Pixel existentes antes de agregar scripts nuevos.
7. Hacer una última prueba en producción de enlaces, WhatsApp y caché sin enviar pedidos falsos al negocio.
