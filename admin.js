"use strict";

const state = {
  catalog: null,
  savedSnapshot: "",
  query: "",
  category: "",
  status: "",
  saving: false,
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

const els = {
  products: $("[data-products]"),
  search: $("[data-search]"),
  category: $("[data-category-filter]"),
  status: $("[data-status-filter]"),
  resultCount: $("[data-result-count]"),
  empty: $("[data-empty]"),
  saveState: $("[data-save-state]"),
  stickySave: $("[data-sticky-save]"),
  total: $("[data-stat-total]"),
  active: $("[data-stat-active]"),
  featured: $("[data-stat-featured]"),
  toast: $("[data-toast]"),
};

boot();

async function boot() {
  try {
    let response = await fetch("/api/catalog", { cache: "no-store" });
    if (!response.ok) response = await fetch("./catalog.json", { cache: "no-store" });
    if (!response.ok) throw new Error("No se pudo abrir el catálogo.");
    state.catalog = await response.json();
    normalizeCatalog();
    state.savedSnapshot = snapshot();
    renderAll();
    bindEvents();
  } catch (error) {
    els.products.innerHTML = `<div class="empty-state"><strong>No pudimos abrir el catálogo.</strong><br>${escapeHtml(error.message)}</div>`;
  }
}

function normalizeCatalog() {
  state.catalog.featuredIds = Array.isArray(state.catalog.featuredIds) ? state.catalog.featuredIds : [];
  state.catalog.products = Array.isArray(state.catalog.products) ? state.catalog.products.map((product) => ({
    ...product,
    active: product.active !== false,
    promo: product.promo === true,
    usePhoto: product.usePhoto === true,
    tags: Array.isArray(product.tags) ? product.tags : [],
  })) : [];
}

function bindEvents() {
  els.search.addEventListener("input", (event) => {
    state.query = event.target.value.trim().toLowerCase();
    renderProducts();
  });
  els.category.addEventListener("change", (event) => {
    state.category = event.target.value;
    renderProducts();
  });
  els.status.addEventListener("change", (event) => {
    state.status = event.target.value;
    renderProducts();
  });

  $$('[data-save]').forEach((button) => button.addEventListener("click", saveCatalog));
  $("[data-add-product]").addEventListener("click", addProduct);

  els.products.addEventListener("input", handleEditorInput);
  els.products.addEventListener("change", handleEditorInput);
  els.products.addEventListener("click", handleEditorDisclosure, true);

  window.addEventListener("beforeunload", (event) => {
    if (!isDirty()) return;
    event.preventDefault();
    event.returnValue = "";
  });
}

function handleEditorDisclosure(event) {
  const summary = event.target.closest(".editor-summary");
  if (!summary || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const card = summary.closest(".editor-card");
  const body = card?.querySelector(".editor-body");
  if (!card || !body || card.dataset.animating === "true") return;

  event.preventDefault();
  card.dataset.animating = "true";
  const opening = !card.open;
  if (opening) card.open = true;

  const height = body.scrollHeight;
  body.style.overflow = "hidden";
  const animation = body.animate(
    opening
      ? [
          { height: "0px", opacity: 0, transform: "translateY(-8px)" },
          { height: `${height}px`, opacity: 1, transform: "translateY(0)" },
        ]
      : [
          { height: `${height}px`, opacity: 1, transform: "translateY(0)" },
          { height: "0px", opacity: 0, transform: "translateY(-8px)" },
        ],
    { duration: opening ? 300 : 240, easing: "cubic-bezier(.18,.9,.2,1)" },
  );

  animation.onfinish = () => {
    if (!opening) card.open = false;
    body.style.removeProperty("overflow");
    body.style.removeProperty("height");
    body.style.removeProperty("opacity");
    body.style.removeProperty("transform");
    delete card.dataset.animating;
  };
}

function renderAll() {
  renderFilters();
  renderProducts();
  renderStats();
  updateDirtyUI();
}

function renderFilters() {
  const current = els.category.value;
  const categories = Array.from(new Set(state.catalog.products.map((product) => product.category).filter(Boolean))).sort((a, b) => a.localeCompare(b, "es"));
  els.category.innerHTML = `<option value="">Todas las categorías</option>${categories.map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`).join("")}`;
  els.category.value = categories.includes(current) ? current : "";
  state.category = els.category.value;
}

function filteredProducts() {
  return state.catalog.products.filter((product) => {
    const haystack = `${product.id} ${product.name} ${product.category} ${product.description}`.toLowerCase();
    if (state.query && !haystack.includes(state.query)) return false;
    if (state.category && product.category !== state.category) return false;
    if (state.status === "active" && product.active === false) return false;
    if (state.status === "inactive" && product.active !== false) return false;
    if (state.status === "featured" && !state.catalog.featuredIds.includes(product.id)) return false;
    if (state.status === "promo" && product.promo !== true) return false;
    return true;
  });
}

function renderProducts() {
  const products = filteredProducts();
  els.resultCount.textContent = `${products.length} de ${state.catalog.products.length}`;
  els.empty.hidden = products.length > 0;
  els.products.hidden = products.length === 0;
  els.products.innerHTML = products.map(renderProductEditor).join("");
}

function renderProductEditor(product) {
  const featured = state.catalog.featuredIds.includes(product.id);
  const popular = product.tags.includes("popular");
  const veggie = product.tags.includes("veggie");
  return `
    <details class="editor-card ${product.active === false ? "is-inactive" : ""}" data-product-id="${escapeHtml(product.id)}">
      <summary class="editor-summary">
        <div class="editor-title">
          <span class="editor-id">${escapeHtml(product.id)}</span>
          <strong>${escapeHtml(product.name)}</strong>
        </div>
        <div class="editor-meta"><span>${escapeHtml(product.category)}</span><b>${formatMoney(product.price)}</b></div>
      </summary>
      <div class="editor-body">
        <div class="editor-grid">
          <label class="field">
            <span>Nombre</span>
            <input type="text" maxlength="140" value="${escapeAttr(product.name)}" data-field="name" />
          </label>
          <label class="field">
            <span>Precio (ARS)</span>
            <input type="number" min="0" max="100000000" step="1" value="${Number(product.price) || 0}" data-field="price" inputmode="numeric" />
          </label>
          <label class="field">
            <span>Categoría</span>
            <input type="text" maxlength="80" value="${escapeAttr(product.category)}" data-field="category" list="category-options" />
          </label>
          <label class="field">
            <span>ID interno</span>
            <input type="text" value="${escapeAttr(product.id)}" disabled />
            <small>No cambia para no romper carritos o personalizaciones guardadas.</small>
          </label>
          <label class="field field-wide">
            <span>Descripción</span>
            <textarea maxlength="500" data-field="description">${escapeHtml(product.description || "")}</textarea>
          </label>
          <label class="field field-wide">
            <span>URL de imagen real <small>(opcional)</small></span>
            <input type="url" value="${escapeAttr(product.image || "")}" data-field="image" placeholder="https://..." />
            <small>Solo se muestra como foto cuando activás “Usar foto”. Si no, la web usa la gráfica de marca.</small>
          </label>
        </div>
        <div class="toggle-grid">
          <label class="toggle"><input type="checkbox" data-field="active" ${product.active !== false ? "checked" : ""} /> Visible</label>
          <label class="toggle"><input type="checkbox" data-field="featured" ${featured ? "checked" : ""} /> Destacado</label>
          <label class="toggle"><input type="checkbox" data-field="promo" ${product.promo ? "checked" : ""} /> Promo</label>
          <label class="toggle"><input type="checkbox" data-field="popular" ${popular ? "checked" : ""} /> Más pedido</label>
          <label class="toggle"><input type="checkbox" data-field="veggie" ${veggie ? "checked" : ""} /> Vegetariano</label>
          <label class="toggle"><input type="checkbox" data-field="usePhoto" ${product.usePhoto ? "checked" : ""} /> Usar foto</label>
        </div>
        ${product.customization ? `<p class="editor-note">Este producto tiene opciones de personalización configuradas. El panel preserva esa lógica aunque cambies nombre, precio o descripción.</p>` : ""}
      </div>
    </details>
  `;
}

function handleEditorInput(event) {
  const field = event.target.dataset.field;
  if (!field) return;
  const card = event.target.closest("[data-product-id]");
  const product = state.catalog.products.find((item) => item.id === card?.dataset.productId);
  if (!product) return;

  if (field === "featured") {
    if (event.target.checked) {
      if (!state.catalog.featuredIds.includes(product.id)) state.catalog.featuredIds.push(product.id);
      state.catalog.featuredIds = state.catalog.featuredIds.slice(0, 6);
    } else {
      state.catalog.featuredIds = state.catalog.featuredIds.filter((id) => id !== product.id);
    }
  } else if (field === "popular" || field === "veggie") {
    const tag = field === "popular" ? "popular" : "veggie";
    const tags = new Set(product.tags || []);
    if (event.target.checked) tags.add(tag); else tags.delete(tag);
    product.tags = Array.from(tags);
  } else if (["active", "promo", "usePhoto"].includes(field)) {
    product[field] = event.target.checked;
  } else if (field === "price") {
    product.price = Math.max(0, Math.round(Number(event.target.value) || 0));
  } else {
    product[field] = event.target.value;
  }

  card.classList.toggle("is-inactive", product.active === false);
  const summaryName = $(".editor-title strong", card);
  const meta = $(".editor-meta", card);
  if (summaryName) summaryName.textContent = product.name || "Sin nombre";
  if (meta) meta.innerHTML = `<span>${escapeHtml(product.category || "Sin categoría")}</span><b>${formatMoney(product.price)}</b>`;

  renderStats();
  updateDirtyUI();
}

function addProduct() {
  let index = 1;
  let id = `nuevo-${index}`;
  const ids = new Set(state.catalog.products.map((product) => product.id));
  while (ids.has(id)) id = `nuevo-${++index}`;
  const product = {
    id,
    name: "Nuevo producto",
    description: "",
    price: 0,
    category: "Otros",
    image: "",
    tags: [],
    promo: false,
    active: true,
    usePhoto: false,
  };
  state.catalog.products.push(product);
  state.query = "";
  state.category = "";
  state.status = "";
  els.search.value = "";
  els.status.value = "";
  renderAll();
  const card = $(`[data-product-id="${id}"]`);
  if (card) {
    card.open = true;
    card.scrollIntoView({ behavior: "smooth", block: "center" });
    $("[data-field='name']", card)?.select();
  }
  showToast("Producto creado. Completá sus datos y guardá.");
}

async function saveCatalog() {
  if (state.saving || !isDirty()) return;
  const invalid = state.catalog.products.find((product) => !product.name.trim() || !product.category.trim() || !Number.isFinite(Number(product.price)) || Number(product.price) < 0);
  if (invalid) {
    showToast(`Revisá los datos de ${invalid.name || invalid.id}.`);
    return;
  }

  state.saving = true;
  setSaveState("Guardando…");
  $$('[data-save]').forEach((button) => button.disabled = true);
  try {
    const response = await fetch("/api/catalog", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state.catalog),
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || "No se pudo guardar.");
    state.catalog = payload;
    normalizeCatalog();
    state.savedSnapshot = snapshot();
    renderAll();
    showToast("Cambios guardados. La web ya usa este catálogo.");
  } catch (error) {
    setSaveState("Error al guardar");
    showToast(error.message);
  } finally {
    state.saving = false;
    $$('[data-save]').forEach((button) => button.disabled = false);
    updateDirtyUI();
  }
}

function renderStats() {
  els.total.textContent = state.catalog.products.length;
  els.active.textContent = state.catalog.products.filter((product) => product.active !== false).length;
  els.featured.textContent = state.catalog.featuredIds.filter((id) => state.catalog.products.some((product) => product.id === id && product.active !== false)).length;
}

function snapshot() {
  return JSON.stringify({ featuredIds: state.catalog.featuredIds, products: state.catalog.products });
}

function isDirty() {
  return Boolean(state.catalog) && snapshot() !== state.savedSnapshot;
}

function updateDirtyUI() {
  const dirty = isDirty();
  els.stickySave.hidden = !dirty;
  setSaveState(dirty ? "Cambios sin guardar" : "Todo guardado");
  $$('[data-save]').forEach((button) => button.disabled = !dirty || state.saving);
}

function setSaveState(text) {
  els.saveState.textContent = text;
}

function formatMoney(value) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(Number(value) || 0).replace("ARS", "$ ").replace(/\s+/g, " ").trim();
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]));
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, "&#96;");
}

let toastTimer;
function showToast(message) {
  clearTimeout(toastTimer);
  els.toast.textContent = message;
  els.toast.classList.add("is-visible");
  toastTimer = setTimeout(() => els.toast.classList.remove("is-visible"), 2200);
}
