# Delicias Urbanas — rediseño 2026

Reimplementación mobile-first de la web pública de Delicias Urbanas, construida en un proyecto separado para no modificar producción durante auditoría y QA.

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

## Funcionalidades públicas

- Hero editorial con identidad naranja y fotografía oficial de Delicias Urbanas.
- Bloque de promos/favoritos configurable desde admin.
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
- Mapa, WhatsApp e Instagram.
- SEO, Open Graph y Schema.org `Restaurant`.
- Accesibilidad: landmarks, labels, diálogos nativos, foco visible y `prefers-reduced-motion`.
- Hooks de analytics sin imponer proveedor (`dataLayer` si existe + evento `delicias:analytics`).

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
