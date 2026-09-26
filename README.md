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

El servidor local escucha únicamente en `127.0.0.1`.

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

El guardado usa `PUT /api/catalog`, valida los datos y reemplaza `catalog.json` de forma atómica. La web pública carga el catálogo al iniciar y solo muestra productos con `active !== false`.

**Importante para producción:** el panel está pensado actualmente para administración local. Antes de exponer `/admin` y `PUT /api/catalog` en Internet hay que agregar autenticación y autorización en el hosting definitivo.

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

## Antes de publicar

1. Integrar esta versión en el hosting/repositorio que sirve `deliciasurbanas.com.ar`.
2. Proteger el panel admin con autenticación antes de exponerlo públicamente.
3. Cargar fotografías reales de producto desde el panel cuando estén disponibles y activar “Usar foto” solo después de verificarlas.
4. Confirmar Analytics/Meta Pixel existentes antes de agregar scripts nuevos.
5. Hacer una última prueba en staging/producción de enlaces, WhatsApp y caché sin enviar pedidos falsos al negocio.
