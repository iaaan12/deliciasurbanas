const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = Number(process.env.PORT || 4173);
const catalogPath = path.join(root, "catalog.json");
const maxBodyBytes = 1024 * 1024;

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
};

function sendJson(res, status, payload) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(payload));
}

function readCatalog() {
  return JSON.parse(fs.readFileSync(catalogPath, "utf8"));
}

function validateCatalog(payload) {
  if (!payload || typeof payload !== "object" || !Array.isArray(payload.products)) {
    return "El catálogo no tiene el formato esperado.";
  }

  if (payload.products.length > 500) return "El catálogo supera el límite permitido.";

  const ids = new Set();
  for (const product of payload.products) {
    if (!product || typeof product !== "object") return "Hay un producto inválido.";
    if (typeof product.id !== "string" || !/^[a-z0-9_-]{1,64}$/i.test(product.id)) return "Hay un ID de producto inválido.";
    if (ids.has(product.id)) return `El ID ${product.id} está duplicado.`;
    ids.add(product.id);
    if (typeof product.name !== "string" || !product.name.trim() || product.name.length > 140) return `El producto ${product.id} necesita un nombre válido.`;
    if (!Number.isFinite(Number(product.price)) || Number(product.price) < 0 || Number(product.price) > 100000000) return `El precio de ${product.name} es inválido.`;
    if (typeof product.category !== "string" || !product.category.trim() || product.category.length > 80) return `La categoría de ${product.name} es inválida.`;
    if (typeof product.description !== "string" || product.description.length > 500) return `La descripción de ${product.name} es demasiado larga.`;
    if (product.image != null && typeof product.image !== "string") return `La imagen de ${product.name} es inválida.`;
    if (product.tags != null && !Array.isArray(product.tags)) return `Las etiquetas de ${product.name} son inválidas.`;
  }

  if (payload.featuredIds != null && !Array.isArray(payload.featuredIds)) return "Los destacados son inválidos.";
  return null;
}

function handleCatalogApi(req, res) {
  if (req.method === "GET") {
    try {
      sendJson(res, 200, readCatalog());
    } catch (error) {
      sendJson(res, 500, { error: "No se pudo leer el catálogo.", detail: error.message });
    }
    return;
  }

  if (req.method !== "PUT") {
    res.writeHead(405, { Allow: "GET, PUT" }).end();
    return;
  }

  let size = 0;
  const chunks = [];
  req.on("data", (chunk) => {
    size += chunk.length;
    if (size > maxBodyBytes) {
      req.destroy();
      return;
    }
    chunks.push(chunk);
  });

  req.on("end", () => {
    if (size > maxBodyBytes) {
      sendJson(res, 413, { error: "El catálogo es demasiado grande." });
      return;
    }

    try {
      const payload = JSON.parse(Buffer.concat(chunks).toString("utf8"));
      const validationError = validateCatalog(payload);
      if (validationError) {
        sendJson(res, 400, { error: validationError });
        return;
      }

      const normalized = {
        version: Number(payload.version || 1),
        updatedAt: new Date().toISOString(),
        featuredIds: Array.from(new Set((payload.featuredIds || []).filter((id) => typeof id === "string"))).slice(0, 6),
        products: payload.products.map((product) => ({
          ...product,
          name: product.name.trim(),
          description: product.description.trim(),
          category: product.category.trim(),
          price: Math.round(Number(product.price)),
          active: product.active !== false,
          promo: product.promo === true,
          usePhoto: product.usePhoto === true,
          tags: Array.from(new Set((product.tags || []).filter((tag) => typeof tag === "string"))),
        })),
      };

      const tempPath = `${catalogPath}.tmp`;
      fs.writeFileSync(tempPath, `${JSON.stringify(normalized, null, 2)}\n`, "utf8");
      fs.renameSync(tempPath, catalogPath);
      sendJson(res, 200, normalized);
    } catch (error) {
      sendJson(res, 400, { error: "No se pudo guardar el catálogo.", detail: error.message });
    }
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === "/api/catalog") {
    handleCatalogApi(req, res);
    return;
  }

  const requested = url.pathname === "/" ? "/index.html" : url.pathname === "/admin" ? "/admin.html" : url.pathname;
  const normalized = path.normalize(decodeURIComponent(requested)).replace(/^([.][.][\\/])+/, "");
  const filePath = path.join(root, normalized);

  if (!filePath.startsWith(root)) {
    res.writeHead(403).end("Forbidden");
    return;
  }

  fs.stat(filePath, (statError, stat) => {
    if (statError || !stat.isFile()) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("Not found");
      return;
    }

    res.writeHead(200, {
      "Content-Type": mime[path.extname(filePath).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Delicias Urbanas: http://127.0.0.1:${port}`);
  console.log(`Admin: http://127.0.0.1:${port}/admin`);
});
