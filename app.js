"use strict";

const SHOP = Object.freeze({
  name: "Delicias Urbanas",
  phone: "5493875020884",
  phoneDisplay: "+54 9 387 502-0884",
  address: "Av. San Martín 532, Salta",
  instagram: "https://instagram.com/delicias.urbanas",
  transferAlias: "deliciasurbanas13",
  transferHolder: "Nahida Esther Leonor Zamar",
  transferLimit: 15000,
});

const COMMON_FLAVORS = ["Jamón y Queso", "Salame y Queso"];
const SPECIAL_FLAVORS = ["Ternera, Tomate y Huevo", "Aceituna, Huevo y Queso", "Roquefort y Jamón", "Jamón Crudo y Queso"];

let MENU = [
  { id: "c1", name: "Pollo al Spiedo Entero", description: "Nuestro clásico pollo asado lentamente al spiedo, tierno y sabroso.", price: 15000, category: "Pollo", image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&q=80&w=900", tags: ["popular"] },
  { id: "p3", name: "Pollo Entero + Arroz", sourceName: "PROMO: Pollo Entero + Arroz", description: "¡Ideal familia! Pollo entero al spiedo con una guarnición de arroz incluida.", price: 17000, category: "Pollo", image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&q=80&w=900", tags: ["popular"], promo: true },
  { id: "p2", name: "Medio Pollo + Arroz", sourceName: "PROMO: Medio Pollo + Arroz", description: "¡Oportunidad! Medio pollo al spiedo con una guarnición de arroz incluida.", price: 11000, category: "Pollo", image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&q=80&w=900", tags: [], promo: true },
  { id: "d1", name: "Docena Sándwiches Comunes", description: "12 sándwiches de miga clásicos.", price: 16500, category: "Sándwiches", image: "https://images.unsplash.com/photo-1553909489-cd47e0907d3f?auto=format&fit=crop&q=80&w=900", tags: ["popular"], customization: [{ title: "Elegí los 12 sándwiches", type: "quantity", total: 12, options: COMMON_FLAVORS }] },
  { id: "d2", name: "Docena Sándwiches Surtidos", description: "4 Especiales y 8 Comunes a elección.", price: 20000, category: "Sándwiches", image: "https://images.unsplash.com/photo-1626078299034-75466d7412f1?auto=format&fit=crop&q=80&w=900", tags: ["popular"], customization: [{ title: "Elegí 4 especiales", type: "quantity", total: 4, options: SPECIAL_FLAVORS }, { title: "Elegí 8 comunes", type: "quantity", total: 8, options: COMMON_FLAVORS }] },
  { id: "d3", name: "Docena Sándwiches Especiales", description: "12 sándwiches premium surtidos.", price: 27500, category: "Sándwiches", image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&q=80&w=900", tags: [], customization: [{ title: "Elegí los 12 especiales", type: "quantity", total: 12, options: SPECIAL_FLAVORS }] },
  { id: "s1", name: "Sándwich Jamón y Queso", description: "Clásico sándwich con abundante jamón cocido y queso tybo.", price: 1500, category: "Sándwiches", image: "https://images.unsplash.com/photo-1553909489-cd47e0907d3f?auto=format&fit=crop&q=80&w=900", tags: [] },
  { id: "s2", name: "Sándwich Salame y Queso", description: "Sabroso salame milán y queso en fetas en pan fresco.", price: 1500, category: "Sándwiches", image: "https://images.unsplash.com/photo-1626078299034-75466d7412f1?auto=format&fit=crop&q=80&w=900", tags: [] },
  { id: "s3", name: "Sándwich Ternera y Queso", description: "Finas fetas de ternera con queso derretido o natural.", price: 2000, category: "Sándwiches", image: "https://images.unsplash.com/photo-1481070414801-51fd732d7184?auto=format&fit=crop&q=80&w=900", tags: [] },
  { id: "s4", name: "Sándwich Ternera y Lechuga", description: "Ternera seleccionada con lechuga fresca y crocante.", price: 2000, category: "Sándwiches", image: "https://images.unsplash.com/photo-1509722747041-619f383b8326?auto=format&fit=crop&q=80&w=900", tags: [] },
  { id: "s5", name: "Ternera, Tomate y Huevo", description: "Completo: ternera, tomate fresco y huevo duro picado.", price: 2500, category: "Sándwiches", image: "https://images.unsplash.com/photo-1547496502-ffa222d79a80?auto=format&fit=crop&q=80&w=900", tags: [] },
  { id: "s6", name: "Aceituna, Huevo y Queso", description: "Opción vegetariana con aceitunas verdes, huevo y mucho queso.", price: 2500, category: "Sándwiches", image: "https://images.unsplash.com/photo-1539252554452-da37fa1d9357?auto=format&fit=crop&q=80&w=900", tags: ["veggie"] },
  { id: "s7", name: "Roquefort y Jamón", description: "Para los amantes del sabor fuerte: roquefort premium y jamón.", price: 2500, category: "Sándwiches", image: "https://images.unsplash.com/photo-1559466273-d95e71deb58a?auto=format&fit=crop&q=80&w=900", tags: [] },
  { id: "s8", name: "Jamón Crudo y Queso", description: "Jamón crudo estacionado y queso de campo.", price: 2500, category: "Sándwiches", image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&q=80&w=900", tags: [] },
  { id: "s9", name: "Sándwich de Milanesa", description: "Clásico argentino: milanesa de carne en pan francés con lechuga y tomate.", price: 4500, category: "Sándwiches", image: "https://images.unsplash.com/photo-1619860860774-1e2e17343432?auto=format&fit=crop&q=80&w=900", tags: ["popular"] },
  { id: "s10", name: "Baguette Especial", description: "Sándwich en pan baguette con ingredientes a elección.", price: 3000, category: "Sándwiches", image: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&q=80&w=900", tags: [], customization: [{ title: "Elegí el relleno", type: "choice", options: ["Ternera, Tomate y Huevo", "Ternera y Queso", "Salame y Queso"] }] },
  { id: "s11", name: "Pebete", description: "Clásico pan pebete suave con relleno a elección.", price: 1000, category: "Sándwiches", image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=900", tags: [], customization: [{ title: "Elegí el relleno", type: "choice", options: ["Jamón y Queso", "Salame y Queso"] }] },
  { id: "g1", name: "Guarnición de Arroz", description: "Arroz blanco al dente, el acompañamiento ideal.", price: 3000, category: "Guarniciones", image: "https://images.unsplash.com/photo-1539755530862-00f623c00f52?auto=format&fit=crop&q=80&w=900", tags: ["veggie"] },
  { id: "g2", name: "Papas Doradas al Horno", description: "Papas cortadas en cubos, doradas al horno con un toque de romero.", price: 3000, category: "Guarniciones", image: "https://images.unsplash.com/photo-1619684784943-415eb634e062?auto=format&fit=crop&q=80&w=900", tags: ["veggie", "popular"] },
  { id: "b1", name: "Coca Cola 250ml", description: "Botella de vidrio o lata pequeña bien helada.", price: 1500, category: "Bebidas", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=900", tags: [] },
  { id: "b2", name: "Fanta 250ml", description: "Sabor naranja refrescante.", price: 1500, category: "Bebidas", image: "https://images.unsplash.com/photo-1624517452488-04869289c4ca?auto=format&fit=crop&q=80&w=900", tags: [] },
  { id: "b3", name: "Sprite 250ml", description: "Sabor lima-limón.", price: 1500, category: "Bebidas", image: "https://images.unsplash.com/photo-1625772290748-39093c022a16?auto=format&fit=crop&q=80&w=900", tags: [] },
  { id: "b4", name: "Coca Cola 350ml", description: "Lata clásica.", price: 2000, category: "Bebidas", image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&q=80&w=900", tags: [] },
  { id: "b5", name: "Fanta 350ml", description: "Lata de Fanta naranja.", price: 2000, category: "Bebidas", image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80&w=900", tags: [] },
  { id: "b6", name: "Sprite 350ml", description: "Lata de Sprite lima-limón.", price: 2000, category: "Bebidas", image: "https://images.unsplash.com/photo-1543253687-c931c8e01820?auto=format&fit=crop&q=80&w=900", tags: [] },
  { id: "b7", name: "Coca Cola 600ml", description: "Botella individual.", price: 2500, category: "Bebidas", image: "https://images.unsplash.com/photo-1596803244618-8dce7f5067d8?auto=format&fit=crop&q=80&w=900", tags: ["popular"] },
  { id: "b8", name: "Fanta 600ml", description: "Botella individual de Fanta.", price: 2500, category: "Bebidas", image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80&w=900", tags: [] },
  { id: "b9", name: "Sprite 600ml", description: "Botella individual de Sprite.", price: 2500, category: "Bebidas", image: "https://images.unsplash.com/photo-1625772290748-39093c022a16?auto=format&fit=crop&q=80&w=900", tags: [] },
  { id: "b10", name: "Monster Energy", description: "Cualquier sabor disponible (Original, Mango Loco, Ultra, etc).", price: 4500, category: "Bebidas", image: "https://images.unsplash.com/photo-1622543925917-763c34d1538c?auto=format&fit=crop&q=80&w=900", tags: [] },
];

let PHOTO_SAFE_IDS = new Set();
let FEATURED_IDS = ["p3", "d2", "s9"];

const STORAGE = {
  cart: "delicias_urbanas_cart_v2",
  orders: "delicias_urbanas_orders",
};

const state = {
  cart: safeParse(localStorage.getItem(STORAGE.cart), []),
  orders: safeParse(localStorage.getItem(STORAGE.orders), []),
  category: "Todos",
  subcategory: "Todos",
  query: "",
  customizing: null,
  customizationValues: {},
  lastOrderId: null,
  submitting: false,
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

const els = {
  featuredProducts: $("[data-featured-products]"),
  products: $("[data-products]"),
  menuPreview: $("[data-menu-preview]"),
  categories: $("[data-categories]"),
  subcategories: $("[data-subcategories]"),
  search: $("[data-search]"),
  clearSearch: $("[data-clear-search]"),
  resultsCount: $("[data-results-count]"),
  emptyState: $("[data-empty-state]"),
  menuTools: $("[data-menu-tools]"),
  storeStatus: $("[data-store-status]"),
  cartDialog: $("[data-cart-dialog]"),
  cartItems: $("[data-cart-items]"),
  cartFooter: $("[data-cart-footer]"),
  crossSellSection: $("[data-cross-sell-section]"),
  crossSell: $("[data-cross-sell]"),
  drawerTotal: $("[data-drawer-total]"),
  checkoutDialog: $("[data-checkout-dialog]"),
  checkoutForm: $("[data-checkout-form]"),
  checkoutItems: $("[data-checkout-items]"),
  checkoutTotal: $("[data-checkout-total]"),
  dateSelect: $("[data-date-select]"),
  timeSelect: $("[data-time-select]"),
  availabilityNote: $("[data-availability-note]"),
  paymentOptions: $("[data-payment-options]"),
  transferDetails: $("[data-transfer-details]"),
  forcedTransfer: $("[data-forced-transfer]"),
  submitOrder: $("[data-submit-order]"),
  submitError: $("[data-submit-error]"),
  customizeDialog: $("[data-customize-dialog]"),
  customizeTitle: $("[data-customize-title]"),
  customizeBody: $("[data-customize-body]"),
  customizeForm: $("[data-customize-form]"),
  customizeError: $("[data-customize-error]"),
  ordersDialog: $("[data-orders-dialog]"),
  ordersList: $("[data-orders-list]"),
  successDialog: $("[data-success-dialog]"),
  successSummary: $("[data-success-summary]"),
  whatsappLink: $("[data-whatsapp-link]"),
  toast: $("[data-toast]"),
  mobileCart: $("[data-mobile-cart]"),
};

boot();

async function boot() {
  try {
    const localAdminHost = location.hostname === "127.0.0.1" || location.hostname === "localhost";
    let response = await fetch(localAdminHost ? "/api/catalog" : "./catalog.json", { cache: "no-store" });
    if (!response.ok && localAdminHost) response = await fetch("./catalog.json", { cache: "no-store" });
    if (response.ok) {
      const catalog = await response.json();
      if (Array.isArray(catalog.products)) {
        MENU = catalog.products.filter((product) => product.active !== false);
        FEATURED_IDS = Array.isArray(catalog.featuredIds) ? catalog.featuredIds : FEATURED_IDS;
        PHOTO_SAFE_IDS = new Set(MENU.filter((product) => product.usePhoto === true && product.image).map((product) => product.id));
      }
    }
  } catch (error) {
    console.warn("No se pudo cargar catalog.json; se usa el catálogo embebido.", error);
  }

  // El menú editorial abre en una categoría concreta como la carta de referencia.
  state.category = MENU.some((product) => product.category === "Pollo") ? "Pollo" : "Todos";
  state.subcategory = "Todos";
  init();
  // El catálogo se inyecta luego del primer render. Reposicionar anclas
  // iniciales evita que #menu y #ubicacion apunten a coordenadas antiguas.
  if (["#menu", "#promos", "#ubicacion"].includes(location.hash)) {
    requestAnimationFrame(() => document.querySelector(location.hash)?.scrollIntoView({ behavior: "instant", block: "start" }));
  }
}

function init() {
  sanitizeStoredCart();
  renderFeaturedProducts();
  renderCategories();
  renderSubcategories();
  renderProducts();
  renderCart();
  renderOrders();
  updateStoreStatus();
  bindEvents();
  setupStickyObserver();
  setupMotionSystem();
  track("view_menu", { item_count: MENU.length });
}

function renderFeaturedProducts() {
  if (!els.featuredProducts) return;
  const products = FEATURED_IDS.map((id) => MENU.find((item) => item.id === id)).filter(Boolean);
  els.featuredProducts.innerHTML = products.map((product, index) => `
    <article class="featured-card ${index === 0 ? "featured-card-main" : ""}" style="--du-feature-order:${index}" data-featured-product="${escapeHtml(product.id)}">
      <div class="featured-media">
        ${PHOTO_SAFE_IDS.has(product.id) ? renderProductVisual(product, "featured") : `
          <div class="du-feature-poster du-feature-poster--${product.category === "Pollo" ? "pollo" : product.category === "Sándwiches" ? "sandwich" : product.category === "Bebidas" ? "bebida" : "otro"}" aria-hidden="true">
            <div class="du-feature-poster-ring"></div>
            <span class="du-feature-poster-number">${String(index + 1).padStart(2,"0")}</span>
            <span class="du-feature-poster-swoop" aria-hidden="true">✦</span>
            <span class="du-feature-poster-seal">DU<span>Salta</span></span>
          </div>
        `}
        ${renderProductBadges(product, "featured")}
      </div>
      <div class="featured-copy">
        <span>${escapeHtml(product.category)}</span>
        <h3>${escapeHtml(product.name)}</h3>
        <p>${escapeHtml(product.description)}</p>
        <div>
          <strong>${formatMoney(product.price)}</strong>
          <button type="button" data-add-product="${escapeHtml(product.id)}" aria-label="${product.customization ? "Elegir opciones de" : "Agregar"} ${escapeHtml(product.name)} al pedido">${product.customization ? "Elegir" : "Agregar"} <span aria-hidden="true">→</span></button>
        </div>
      </div>
    </article>
  `).join("");
}

function bindEvents() {
  els.search.addEventListener("input", (event) => {
    state.query = event.target.value.trim().toLowerCase();
    els.clearSearch.hidden = !state.query;
    if (state.query && state.category !== "Todos") {
      state.category = "Todos";
      state.subcategory = "Todos";
      renderCategories();
      renderSubcategories();
    }
    renderProducts();
    if (state.query.length >= 2) track("search_product", { search_term: event.target.value.trim() });
  });

  els.clearSearch.addEventListener("click", () => {
    state.query = "";
    els.search.value = "";
    els.clearSearch.hidden = true;
    renderProducts();
    els.search.focus();
  });

  const showAllMenu = $("[data-show-all-menu]");
  showAllMenu?.addEventListener("click", () => {
    state.category = "Todos";
    state.subcategory = "Todos";
    state.query = "";
    els.search.value = "";
    els.clearSearch.hidden = true;
    renderCategories();
    renderSubcategories();
    renderProducts();
    document.querySelector(".du-menu-board")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  const previewFromEvent = (event) => {
    const row = event.target.closest("[data-preview-id]");
    if (!row || !els.products.contains(row)) return;
    selectMenuPreview(row.dataset.previewId);
  };
  els.products.addEventListener("pointerover", previewFromEvent);
  els.products.addEventListener("focusin", previewFromEvent);

  $("[data-reset-filters]").addEventListener("click", () => {
    state.query = "";
    state.category = "Todos";
    state.subcategory = "Todos";
    els.search.value = "";
    els.clearSearch.hidden = true;
    renderCategories();
    renderSubcategories();
    renderProducts();
  });

  document.addEventListener("click", (event) => {
    const category = event.target.closest("[data-category]");
    if (category) {
      state.category = category.dataset.category;
      state.subcategory = defaultSubcategory(state.category);
      state.query = "";
      els.search.value = "";
      els.clearSearch.hidden = true;
      renderCategories();
      renderSubcategories();
      renderProducts();
      track("select_category", { item_category: state.category });
      return;
    }
    const subcategory = event.target.closest("[data-subcategory]");
    if (subcategory) {
      state.subcategory = subcategory.dataset.subcategory;
      renderSubcategories();
      renderProducts();
      return;
    }

    const add = event.target.closest("[data-add-product]");
    if (add) {
      handleAddProduct(add.dataset.addProduct, add);
      return;
    }

    const qty = event.target.closest("[data-cart-qty]");
    if (qty) {
      updateCartQuantity(qty.dataset.cartQty, Number(qty.dataset.delta));
      return;
    }

    const remove = event.target.closest("[data-remove-cart]");
    if (remove) {
      removeCartItem(remove.dataset.removeCart);
      return;
    }

    const customQty = event.target.closest("[data-custom-qty]");
    if (customQty) {
      updateCustomQuantity(customQty.dataset.customQty, customQty.dataset.optionIndex, Number(customQty.dataset.delta), customQty);
      return;
    }

    const resend = event.target.closest("[data-resend-order]");
    if (resend) {
      const order = state.orders.find((item) => String(item.id) === resend.dataset.resendOrder);
      if (order) window.open(buildWhatsAppUrl(order), "_blank", "noopener");
      return;
    }

    const copy = event.target.closest("[data-copy]");
    if (copy) copyText(copy.dataset.copy, copy);

    const goMenu = event.target.closest("[data-go-menu]");
    if (goMenu) {
      closeDialog(els.cartDialog, () => document.querySelector("#menu")?.scrollIntoView({ behavior: "smooth" }));
    }
  });

  $$('[data-open-cart]').forEach((button) => button.addEventListener("click", () => openDialog(els.cartDialog)));
  $("[data-close-cart]").addEventListener("click", () => closeDialog(els.cartDialog));
  $("[data-start-checkout]").addEventListener("click", openCheckout);
  $("[data-close-checkout]").addEventListener("click", () => closeDialog(els.checkoutDialog));

  $$('[data-open-orders]').forEach((button) => button.addEventListener("click", () => {
    renderOrders();
    openDialog(els.ordersDialog);
  }));
  $("[data-close-orders]").addEventListener("click", () => closeDialog(els.ordersDialog));

  $("[data-close-customize]").addEventListener("click", () => closeDialog(els.customizeDialog));
  els.customizeForm.addEventListener("submit", confirmCustomization);
  els.customizeBody.addEventListener("change", handleCustomizationChange);

  els.dateSelect.addEventListener("change", renderTimeSlots);
  els.checkoutForm.addEventListener("change", (event) => {
    if (event.target.name === "payment") updatePaymentUI();
  });
  els.checkoutForm.addEventListener("submit", submitOrder);

  els.whatsappLink.addEventListener("click", markLastOrderSent);
  $("[data-close-success]").addEventListener("click", () => {
    closeDialog(els.successDialog, () => document.querySelector("#menu")?.scrollIntoView({ behavior: "smooth" }));
  });

  [els.cartDialog, els.checkoutDialog, els.customizeDialog, els.ordersDialog, els.successDialog].forEach((dialog) => {
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog && dialog !== els.checkoutDialog) closeDialog(dialog);
    });
    dialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      closeDialog(dialog);
    });
  });

  setupMobileSheetGestures();
}

function setupStickyObserver() {
  const observer = new IntersectionObserver(([entry]) => {
    els.menuTools.classList.toggle("is-stuck", entry.boundingClientRect.top <= Number.parseInt(getComputedStyle(document.documentElement).getPropertyValue("--header-height"), 10) + 2 && !entry.isIntersecting);
  }, { rootMargin: "-74px 0px 0px 0px", threshold: 1 });

  const sentinel = document.createElement("span");
  sentinel.setAttribute("aria-hidden", "true");
  els.menuTools.before(sentinel);
  observer.observe(sentinel);
}

function renderCategories() {
  const categories = [...new Set(MENU.map((item) => item.category)), "Todos"];
  const currentButtons = [...els.categories.querySelectorAll("[data-category]")];
  const sameCategories = currentButtons.length === categories.length
    && currentButtons.every((button, index) => button.dataset.category === categories[index]);
  // Mantener los nodos de los botones evita que la píldora activa salte.
  if (!sameCategories) {
    els.categories.innerHTML = `<span class="du-tabs-glider" aria-hidden="true"></span>` + categories.map((category) => `
      <button class="category-button" type="button" data-category="${escapeHtml(category)}" aria-pressed="${String(state.category === category)}">
        ${escapeHtml(category)}
      </button>
    `).join("");
  } else currentButtons.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.category === state.category)));
  document.dispatchEvent(new CustomEvent("du:menu:tabs"));
}

function productSubcategory(product) {
  if (product.category === "Sándwiches") return /^docena\b/i.test(product.name) ? "Docenas" : "Por unidad";
  if (product.category === "Bebidas") {
    const size = product.name.match(/(250|350|600)\s*ml\b/i);
    return size ? `${size[1]} ml` : "Otras bebidas";
  }
  return null;
}

function subcategoryOptions(category) {
  if (category === "Sándwiches") return ["Docenas", "Por unidad"];
  if (category === "Bebidas") return ["250 ml", "350 ml", "600 ml", "Otras bebidas"];
  return [];
}

function defaultSubcategory(category) {
  if (category === "Sándwiches") return "Docenas";
  if (category === "Bebidas") return "600 ml";
  return "Todos";
}

function renderSubcategories() {
  if (!els.subcategories) return;
  const options = subcategoryOptions(state.category).filter(name => MENU.some(p => p.category === state.category && productSubcategory(p) === name));
  els.subcategories.hidden = options.length < 2 || Boolean(state.query);
  const existing = [...els.subcategories.querySelectorAll("[data-subcategory]")];
  if (existing.length !== options.length || existing.some((el, i) => el.dataset.subcategory !== options[i])) {
    els.subcategories.innerHTML = options.map(name => `
      <button type="button" class="du-subcategory-button" data-subcategory="${escapeHtml(name)}" aria-pressed="${String(state.subcategory === name)}">${escapeHtml(name)}</button>
    `).join("");
  } else existing.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.subcategory === state.subcategory)));
  document.dispatchEvent(new CustomEvent("du:menu:subtabs"));
}

function filteredProducts() {
  return MENU.filter((product) => {
    const categoryOk = state.category === "Todos" || product.category === state.category;
    const subcategoryOk = state.category === "Todos" || state.subcategory === "Todos" || productSubcategory(product) === state.subcategory;
    const haystack = `${product.name} ${product.sourceName || ""} ${product.description} ${product.category}`.toLowerCase();
    const queryOk = !state.query || haystack.includes(state.query);
    return categoryOk && subcategoryOk && queryOk;
  });
}

function renderProducts() {
  const products = filteredProducts();
  els.resultsCount.textContent = `${products.length} ${products.length === 1 ? "producto" : "productos"}`;
  els.emptyState.hidden = products.length > 0;
  els.products.hidden = products.length === 0;

  const grouped = new Map();
  products.forEach(product => {
    const group = state.category === "Todos"
      ? product.category
      : state.category === "Sándwiches" || state.category === "Bebidas"
        ? productSubcategory(product) : "";
    if (!grouped.has(group)) grouped.set(group, []);
    grouped.get(group).push(product);
  });

  els.products.innerHTML = [...grouped.entries()].map(([group, items]) => `
    <section class="du-menu-group" aria-label="${escapeHtml(group || state.category)}">
      ${group && (state.category === "Todos" || grouped.size > 1) ? `<h3 class="du-menu-group-title">${escapeHtml(group)}</h3>` : ""}
      <div class="du-menu-group-grid">
      ${items.map((product, index) => `
      <article class="du-menu-item ${index === 0 ? "is-current du-menu-pick" : ""}" style="--du-item-index:${Math.min(index, 9)}" data-product-card="${escapeHtml(product.id)}" data-preview-id="${escapeHtml(product.id)}">
        <div class="du-menu-line">
          <h4 class="du-menu-name">${escapeHtml(product.name)}</h4>
          <span class="du-menu-dots" aria-hidden="true"></span>
          <strong class="du-menu-price">${formatMoney(product.price)}</strong>
        </div>
        <div class="du-menu-details">
          <p>${escapeHtml(product.description)}</p>
          <button class="du-menu-add" type="button" data-add-product="${escapeHtml(product.id)}" aria-label="${product.customization ? "Personalizar" : "Agregar"} ${escapeHtml(product.name)} al pedido"><span aria-hidden="true">+</span> ${product.customization ? "Elegir opciones" : "Agregar"}</button>
        </div>
      </article>
    `).join("")}
      </div>
    </section>
  `).join("");
  els.products.closest(".du-menu-board")?.classList.toggle("is-empty", products.length === 0);
  if (products.length) selectMenuPreview(products[0].id);
  else if (els.menuPreview) {
    els.menuPreview.innerHTML = "";
    delete els.menuPreview.dataset.productId;
  }
  document.dispatchEvent(new CustomEvent("du:menu:render", { detail: { count: products.length, category: state.category, query: state.query } }));
}

function selectMenuPreview(id) {
  const product = MENU.find((item) => item.id === id);
  const preview = els.menuPreview;
  if (!product || !preview || !els.products.querySelector(`[data-preview-id="${CSS.escape(id)}"]`)) return;
  if (preview.dataset.productId === id) return;
  els.products.querySelectorAll("[data-preview-id]").forEach((row) => row.classList.toggle("is-current", row.dataset.previewId === id));
  preview.dataset.productId = id;
  const badge = product.tags?.includes("popular") ? "Uno de los más elegidos" : product.category;
  preview.innerHTML = `
    <div class="du-ticket-paper">
      <span class="du-ticket-heading">${escapeHtml(badge)}</span>
      <strong class="du-ticket-name">${escapeHtml(product.name)}</strong>
      <p class="du-ticket-description">${escapeHtml(product.description)}</p>
      <div class="du-ticket-rule" aria-hidden="true"></div>
      <strong class="du-ticket-price">${formatMoney(product.price)}</strong>
    </div>
  `;
}

function handleAddProduct(id, button) {
  const product = MENU.find((item) => item.id === id);
  if (!product) return;
  track("view_item", { item_id: product.id, item_name: product.name, value: product.price });

  if (product.customization) {
    openCustomization(product);
    return;
  }

  addToCart(product, null);
  flashAddButton(button);
}

function openCustomization(product) {
  state.customizing = product;
  state.customizationValues = {};
  product.customization.forEach((group, groupIndex) => {
    state.customizationValues[groupIndex] = group.type === "choice" ? "" : Object.fromEntries(group.options.map((option) => [option, 0]));
  });
  els.customizeTitle.textContent = product.name;
  els.customizeError.textContent = "";
  renderCustomization();
  openDialog(els.customizeDialog);
}

function renderCustomization() {
  const product = state.customizing;
  if (!product) return;
  els.customizeBody.innerHTML = product.customization.map((group, groupIndex) => {
    if (group.type === "choice") {
      return `
        <section class="customize-group" data-custom-group="${groupIndex}">
          <h3>${escapeHtml(group.title)}</h3>
          <p>Elegí una opción.</p>
          <div class="option-list">
            ${group.options.map((option) => `
              <label class="option-row choice-row">
                <input type="radio" name="custom-${groupIndex}" value="${escapeHtml(option)}" data-choice-group="${groupIndex}" ${state.customizationValues[groupIndex] === option ? "checked" : ""} />
                <span>${escapeHtml(option)}</span>
              </label>
            `).join("")}
          </div>
        </section>
      `;
    }

    const values = state.customizationValues[groupIndex];
    const total = Object.values(values).reduce((sum, value) => sum + value, 0);
    return `
      <section class="customize-group" data-custom-group="${groupIndex}">
        <h3>${escapeHtml(group.title)}</h3>
        <p>Distribuí ${group.total} unidades como prefieras.</p>
        <div class="option-list">
          ${group.options.map((option, optionIndex) => `
            <div class="option-row">
              <span>${escapeHtml(option)}</span>
              <div class="qty-control">
                <button type="button" data-custom-qty="${groupIndex}" data-option-index="${optionIndex}" data-delta="-1" aria-label="Quitar un ${escapeHtml(option)}" ${values[option] <= 0 ? "disabled" : ""}>−</button>
                <span data-custom-count="${groupIndex}" data-option-index="${optionIndex}">${values[option]}</span>
                <button type="button" data-custom-qty="${groupIndex}" data-option-index="${optionIndex}" data-delta="1" aria-label="Agregar un ${escapeHtml(option)}" ${total >= group.total ? "disabled" : ""}>+</button>
              </div>
            </div>
          `).join("")}
        </div>
        <div class="group-progress" aria-hidden="true"><i style="--progress:${Math.min(100, (total / group.total) * 100)}%"></i></div>
        <div class="group-total" data-group-total="${groupIndex}"><span>${total === group.total ? "Listo" : `Te faltan ${group.total - total}`}</span><strong>${total} de ${group.total}</strong></div>
      </section>
    `;
  }).join("");
}

function handleCustomizationChange(event) {
  if (!event.target.matches("[data-choice-group]")) return;
  state.customizationValues[event.target.dataset.choiceGroup] = event.target.value;
  const row = event.target.closest(".choice-row");
  row?.classList.remove("choice-confirmed");
  void row?.offsetWidth;
  row?.classList.add("choice-confirmed");
  setTimeout(() => row?.classList.remove("choice-confirmed"), 420);
  els.customizeError.textContent = "";
}

function updateCustomQuantity(groupIndex, optionIndex, delta, sourceButton) {
  const product = state.customizing;
  if (!product) return;
  const normalizedGroupIndex = Number(groupIndex);
  const normalizedOptionIndex = Number(optionIndex);
  const group = product.customization[normalizedGroupIndex];
  const option = group?.options?.[normalizedOptionIndex];
  const values = state.customizationValues[normalizedGroupIndex];
  if (!group || !option || !values) return;
  const total = Object.values(values).reduce((sum, value) => sum + value, 0);
  const current = values[option] || 0;
  if (delta > 0 && total >= group.total) return;
  values[option] = Math.max(0, current + delta);
  updateCustomizationGroupUI(normalizedGroupIndex, normalizedOptionIndex, sourceButton);
}

function updateCustomizationGroupUI(groupIndex, optionIndex, sourceButton) {
  const product = state.customizing;
  const group = product?.customization?.[groupIndex];
  const values = state.customizationValues[groupIndex];
  if (!group || !values) return;

  const section = els.customizeBody.querySelector(`[data-custom-group="${groupIndex}"]`);
  if (!section) return;
  const total = Object.values(values).reduce((sum, value) => sum + value, 0);

  group.options.forEach((option, index) => {
    const countNode = section.querySelector(`[data-custom-count="${groupIndex}"][data-option-index="${index}"]`);
    if (countNode) {
      countNode.textContent = values[option] || 0;
      countNode.classList.remove("is-popping");
      void countNode.offsetWidth;
      if (index === optionIndex) countNode.classList.add("is-popping");
    }
    const minus = section.querySelector(`[data-custom-qty="${groupIndex}"][data-option-index="${index}"][data-delta="-1"]`);
    const plus = section.querySelector(`[data-custom-qty="${groupIndex}"][data-option-index="${index}"][data-delta="1"]`);
    if (minus) minus.disabled = (values[option] || 0) <= 0;
    if (plus) plus.disabled = total >= group.total;
  });

  const totalNode = section.querySelector(`[data-group-total="${groupIndex}"]`);
  if (totalNode) totalNode.innerHTML = `<span>${total === group.total ? "Listo" : `Te faltan ${group.total - total}`}</span><strong>${total} de ${group.total}</strong>`;
  const progress = section.querySelector(".group-progress i");
  if (progress) progress.style.setProperty("--progress", `${Math.min(100, (total / group.total) * 100)}%`);
  section.classList.toggle("is-complete", total === group.total);
  sourceButton?.classList.add("is-hit");
  setTimeout(() => sourceButton?.classList.remove("is-hit"), 180);
  els.customizeError.textContent = "";
}

function confirmCustomization(event) {
  event.preventDefault();
  const product = state.customizing;
  if (!product) return;
  const errors = [];
  const normalized = [];

  product.customization.forEach((group, groupIndex) => {
    const value = state.customizationValues[groupIndex];
    if (group.type === "choice") {
      if (!value) errors.push(group.title);
      else normalized.push({ title: group.title, values: [value] });
      return;
    }

    const total = Object.values(value).reduce((sum, count) => sum + count, 0);
    if (total !== group.total) errors.push(`${group.title}: faltan ${group.total - total}`);
    else normalized.push({ title: group.title, values: Object.entries(value).filter(([, count]) => count > 0).map(([name, count]) => `${count} × ${name}`) });
  });

  if (errors.length) {
    els.customizeError.textContent = errors.length === 1 ? `Completá ${errors[0]}.` : "Completá todas las opciones antes de agregar.";
    return;
  }

  addToCart(product, normalized);
  closeDialog(els.customizeDialog);
}

function addToCart(product, customization) {
  const key = cartItemKey(product.id, customization);
  const existing = state.cart.find((item) => item.key === key);
  if (existing) existing.quantity += 1;
  else state.cart.push({ key, productId: product.id, quantity: 1, customization });
  persistCart();
  renderCart();
  showToast(`${product.name} agregado`);
  track("add_to_cart", { item_id: product.id, item_name: product.name, value: product.price, quantity: 1 });
}

function updateCartQuantity(key, delta) {
  const item = state.cart.find((cartItem) => cartItem.key === key);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) state.cart = state.cart.filter((cartItem) => cartItem.key !== key);
  persistCart();
  renderCart();
}

function removeCartItem(key) {
  const item = state.cart.find((cartItem) => cartItem.key === key);
  const product = item && MENU.find((entry) => entry.id === item.productId);
  state.cart = state.cart.filter((cartItem) => cartItem.key !== key);
  persistCart();
  renderCart();
  if (product) track("remove_from_cart", { item_id: product.id, item_name: product.name, value: product.price, quantity: item.quantity });
}

function renderCart() {
  const count = cartCount();
  const total = cartTotal();

  $$('[data-cart-count]').forEach((node) => {
    node.textContent = count;
    node.hidden = count === 0;
  });
  $$('[data-cart-total]').forEach((node) => node.textContent = formatMoney(total));
  $("[data-mobile-count]").textContent = count;
  $("[data-mobile-label]").textContent = count === 1 ? "producto" : "productos";
  $("[data-mobile-total]").textContent = formatMoney(total);
  els.mobileCart.hidden = count === 0;
  els.drawerTotal.textContent = formatMoney(total);

  if (!state.cart.length) {
    els.cartItems.innerHTML = `<div class="cart-empty"><span class="du-empty-icon" aria-hidden="true"><svg viewBox="0 0 88 88" fill="none"><path d="M21 31h46l5 40H16l5-40Z" stroke="currentColor" stroke-width="3.2" stroke-linejoin="round"/><path d="M32 34V25c0-17 24-17 24 0v9" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/><path d="m35 53 7 7 14-15" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg></span><strong>Tu pedido está vacío.</strong><p>Elegí algo del menú y lo vas a ver acá.</p><button class="button button-secondary" type="button" data-go-menu>Ir al menú <span aria-hidden="true">→</span></button></div>`;
    els.cartFooter.hidden = true;
    els.crossSellSection.hidden = true;
    return;
  }

  els.cartFooter.hidden = false;
  els.crossSellSection.hidden = false;
  els.cartItems.innerHTML = state.cart.map((item) => {
    const product = MENU.find((entry) => entry.id === item.productId);
    if (!product) return "";
    return `
      <article class="cart-item du-cart-ticket">
        ${renderCartVisual(product)}
        <div class="cart-item-main">
          <div class="cart-item-top"><strong>${escapeHtml(product.name)}</strong><button class="remove-button" type="button" data-remove-cart="${escapeHtml(item.key)}">Eliminar</button></div>
          ${item.customization ? `<p class="cart-customization">${formatCustomization(item.customization)}</p>` : ""}
          <div class="cart-item-bottom">
            <div class="qty-control">
              <button type="button" data-cart-qty="${escapeHtml(item.key)}" data-delta="-1" aria-label="Quitar uno">−</button>
              <span>${item.quantity}</span>
              <button type="button" data-cart-qty="${escapeHtml(item.key)}" data-delta="1" aria-label="Agregar uno">+</button>
            </div>
            <strong>${formatMoney(product.price * item.quantity)}</strong>
          </div>
        </div>
      </article>
    `;
  }).join("");

  renderCrossSell();
}

function renderCrossSell() {
  const inCart = new Set(state.cart.map((item) => item.productId));
  const candidates = ["g2", "g1", "b7", "b1", "b2"].map((id) => MENU.find((item) => item.id === id)).filter((item) => item && !inCart.has(item.id)).slice(0, 3);
  els.crossSell.innerHTML = candidates.map((product) => `
    <div class="cross-sell-item">
      <span>${escapeHtml(product.name)}<small>${formatMoney(product.price)}</small></span>
      <button type="button" data-add-product="${product.id}">Agregar</button>
    </div>
  `).join("");
}

function openCheckout() {
  if (!state.cart.length) return;
  renderCheckoutSummary();
  populatePickupDates();
  updatePaymentUI();
  clearCheckoutErrors();
  const revealCheckout = () => openDialog(els.checkoutDialog);
  if (els.cartDialog.open) closeDialog(els.cartDialog, revealCheckout);
  else revealCheckout();
  track("begin_checkout", { value: cartTotal(), item_count: cartCount() });
}

function renderCheckoutSummary() {
  els.checkoutItems.innerHTML = state.cart.map((item) => {
    const product = MENU.find((entry) => entry.id === item.productId);
    if (!product) return "";
    return `<div class="checkout-summary-item"><span>${item.quantity} × ${escapeHtml(product.name)}${item.customization ? `<small>${formatCustomization(item.customization)}</small>` : ""}</span><strong>${formatMoney(product.price * item.quantity)}</strong></div>`;
  }).join("");
  els.checkoutTotal.textContent = formatMoney(cartTotal());
}

function populatePickupDates() {
  const options = [];
  for (let offset = 0; offset < 7; offset += 1) {
    const date = new Date(Date.now() + offset * 86400000);
    const parts = getSaltaDateParts(date);
    if (parts.weekday === 0) continue;
    const value = `${parts.year}-${pad(parts.month)}-${pad(parts.day)}`;
    const label = offset === 0 ? `Hoy · ${parts.day}/${parts.month}` : offset === 1 ? `Mañana · ${parts.day}/${parts.month}` : `${capitalize(parts.weekdayLabel)} · ${parts.day}/${parts.month}`;
    options.push(`<option value="${value}">${label}</option>`);
  }
  els.dateSelect.innerHTML = options.join("");
  renderTimeSlots();
}

function renderTimeSlots() {
  const selectedDate = els.dateSelect.value;
  const now = getSaltaNow();
  const isToday = selectedDate === `${now.year}-${pad(now.month)}-${pad(now.day)}`;
  const slots = buildTimeSlots().filter((slot) => {
    if (!isToday) return true;
    return timeToMinutes(slot) >= now.hour * 60 + now.minute + 30;
  });

  els.timeSelect.innerHTML = slots.length ? `<option value="">Elegí un horario</option>${slots.map((slot) => `<option value="${slot}">${slot}</option>`).join("")}` : `<option value="">No quedan horarios hoy</option>`;
  els.timeSelect.disabled = slots.length === 0;
  els.availabilityNote.textContent = slots.length ? "Mostramos únicamente horarios dentro de las franjas de atención." : "Hoy ya no quedan horarios. Elegí otro día para preparar tu pedido.";
}

function buildTimeSlots() {
  return [...rangeTimes("08:00", "15:00", 30), ...rangeTimes("17:30", "21:00", 30)];
}

function rangeTimes(start, end, step) {
  const values = [];
  for (let minutes = timeToMinutes(start); minutes <= timeToMinutes(end); minutes += step) values.push(minutesToTime(minutes));
  return values;
}

function updatePaymentUI() {
  const forced = cartTotal() > SHOP.transferLimit;
  const cash = $('input[name="payment"][value="Efectivo"]', els.checkoutForm);
  const transfer = $('input[name="payment"][value="Transferencia / MP"]', els.checkoutForm);
  cash.disabled = forced;
  if (forced) transfer.checked = true;
  const transferSelected = transfer.checked;
  els.forcedTransfer.hidden = !forced;
  els.transferDetails.hidden = !transferSelected;
  if (transferSelected) track("select_payment_method", { payment_type: "Transferencia / MP", value: cartTotal() });
}

function submitOrder(event) {
  event.preventDefault();
  if (state.submitting || !state.cart.length) return;
  clearCheckoutErrors();

  const formData = new FormData(els.checkoutForm);
  const data = {
    name: String(formData.get("name") || "").trim(),
    phone: String(formData.get("phone") || "").trim(),
    date: String(formData.get("date") || ""),
    time: String(formData.get("time") || ""),
    payment: String(formData.get("payment") || ""),
    notes: String(formData.get("notes") || "").trim(),
  };

  const errors = validateCheckout(data);
  if (Object.keys(errors).length) {
    showCheckoutErrors(errors);
    return;
  }

  state.submitting = true;
  els.submitOrder.disabled = true;
  els.submitOrder.textContent = "Preparando pedido…";

  const order = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    status: "Pendiente de enviar por WhatsApp",
    customer: { name: data.name, phone: data.phone },
    pickup: { date: data.date, time: data.time },
    payment: data.payment,
    notes: data.notes,
    items: state.cart.map((item) => ({ ...item })),
    total: cartTotal(),
  };

  state.orders.unshift(order);
  state.orders = state.orders.slice(0, 30);
  state.lastOrderId = order.id;
  persistOrders();
  renderOrders();
  renderSuccess(order);
  track("order_confirm", { value: order.total, payment_type: order.payment, item_count: cartCount() });

  setTimeout(() => {
    state.submitting = false;
    els.submitOrder.disabled = false;
    els.submitOrder.textContent = "Confirmar pedido";
    closeDialog(els.checkoutDialog, () => openDialog(els.successDialog));
  }, 180);
}

function validateCheckout(data) {
  const errors = {};
  if (data.name.length < 2) errors.name = "Ingresá el nombre de la persona que va a retirar.";
  const digits = data.phone.replace(/\D/g, "");
  if (digits.length < 7) errors.phone = "Ingresá un teléfono para poder confirmar el pedido.";
  if (!data.date) errors.date = "Elegí qué día vas a retirar.";
  if (!data.time) errors.time = "Elegí un horario disponible.";
  if (data.date && data.time && !isValidPickup(data.date, data.time)) errors.time = "Ese horario ya no está disponible. Elegí otro.";
  if (!data.payment) errors.payment = "Elegí cómo vas a pagar.";
  if (cartTotal() > SHOP.transferLimit && data.payment !== "Transferencia / MP") errors.payment = "Para este total, el pago debe hacerse por transferencia.";
  return errors;
}

function isValidPickup(dateValue, timeValue) {
  const slots = buildTimeSlots();
  if (!slots.includes(timeValue)) return false;
  const [year, month, day] = dateValue.split("-").map(Number);
  const candidate = new Date(`${dateValue}T12:00:00-03:00`);
  const parts = getSaltaDateParts(candidate);
  if (parts.year !== year || parts.month !== month || parts.day !== day || parts.weekday === 0) return false;
  const now = getSaltaNow();
  const todayValue = `${now.year}-${pad(now.month)}-${pad(now.day)}`;
  if (dateValue < todayValue) return false;
  if (dateValue === todayValue && timeToMinutes(timeValue) < now.hour * 60 + now.minute + 30) return false;
  return true;
}

function showCheckoutErrors(errors) {
  Object.entries(errors).forEach(([name, message]) => {
    if (name === "payment") {
      els.submitError.textContent = message;
      return;
    }
    const errorNode = $(`[data-error-for="${name}"]`, els.checkoutForm);
    const field = errorNode?.closest(".field");
    if (errorNode) errorNode.textContent = message;
    field?.classList.add("has-error");
  });
  const firstError = $(".has-error input, .has-error select", els.checkoutForm);
  firstError?.focus();
}

function clearCheckoutErrors() {
  $$(".field-error", els.checkoutForm).forEach((node) => node.textContent = "");
  $$(".field", els.checkoutForm).forEach((node) => node.classList.remove("has-error"));
  els.submitError.textContent = "";
}

function renderSuccess(order) {
  els.successSummary.innerHTML = `
    <div><span>Total</span><strong>${formatMoney(order.total)}</strong></div>
    <div><span>Retiro</span><strong>${formatPickup(order.pickup.date, order.pickup.time)}</strong></div>
    <div><span>Pago</span><strong>${escapeHtml(order.payment)}</strong></div>
  `;
  els.whatsappLink.href = buildWhatsAppUrl(order);
}

function buildWhatsAppUrl(order) {
  const lines = [
    `Hola, quiero hacer este pedido en ${SHOP.name}:`,
    "",
  ];

  order.items.forEach((item) => {
    const product = MENU.find((entry) => entry.id === item.productId);
    if (!product) return;
    lines.push(`${item.quantity} × ${product.name} — ${formatMoney(product.price * item.quantity)}`);
    if (item.customization) item.customization.forEach((group) => lines.push(`  ${group.title}: ${group.values.join(", ")}`));
  });

  lines.push(
    "",
    `Total: ${formatMoney(order.total)}`,
    "",
    "Retiro:",
    formatPickup(order.pickup.date, order.pickup.time),
    "",
    "Nombre:",
    order.customer.name,
    "",
    "Forma de pago:",
    order.payment,
  );

  if (order.notes) lines.push("", "Notas:", order.notes);
  if (order.payment === "Transferencia / MP") lines.push("", "Voy a enviar el comprobante por este chat.");
  return `https://wa.me/${SHOP.phone}?text=${encodeURIComponent(lines.join("\n"))}`;
}

function markLastOrderSent() {
  const order = state.orders.find((item) => item.id === state.lastOrderId);
  if (order) {
    order.status = "Enviado a WhatsApp";
    order.whatsappOpenedAt = new Date().toISOString();
    persistOrders();
  }
  track("whatsapp_checkout", { value: order?.total || cartTotal(), order_id: order?.id });
  state.cart = [];
  persistCart();
  renderCart();
  renderOrders();
}

function renderOrders() {
  if (!state.orders.length) {
    els.ordersList.innerHTML = `<div class="cart-empty"><strong>Todavía no hay pedidos guardados.</strong><p>Cuando armes uno, va a quedar acá en este dispositivo para que puedas volver a verlo.</p></div>`;
    return;
  }

  els.ordersList.innerHTML = state.orders.map((order) => {
    const summary = order.items.map((item) => {
      const product = MENU.find((entry) => entry.id === item.productId);
      return product ? `${item.quantity} × ${product.name}` : null;
    }).filter(Boolean).join(" · ");
    return `
      <article class="order-card" style="--du-order-index:${Math.min(state.orders.indexOf(order),8)}">
        <div class="order-card-head"><strong>Pedido ${formatShortDate(order.createdAt)}</strong><small>${formatMoney(order.total)}</small></div>
        <p>${escapeHtml(summary)}</p>
        <div class="order-card-foot"><span class="order-status ${order.status === "Enviado a WhatsApp" ? "is-sent" : order.status === "Pendiente de enviar por WhatsApp" ? "is-pending" : ""}">${escapeHtml(order.status || "Guardado")}</span><button class="text-button" type="button" data-resend-order="${order.id}">Enviar de nuevo <span aria-hidden="true">→</span></button></div>
      </article>
    `;
  }).join("");
}

function updateStoreStatus() {
  const now = getSaltaNow();
  const minutes = now.hour * 60 + now.minute;
  const open = now.weekday !== 0 && ((minutes >= 480 && minutes <= 900) || (minutes >= 1050 && minutes <= 1260));
  els.storeStatus.classList.toggle("is-closed", !open);
  els.storeStatus.textContent = open ? `Abierto ahora · hasta ${minutes < 900 ? "15:00" : "21:00"}` : nextOpeningText(now);
}

function nextOpeningText(now) {
  if (now.weekday === 0) return "Cerrado ahora · abre el lunes a las 08:00";
  const minutes = now.hour * 60 + now.minute;
  if (minutes < 480) return "Cerrado ahora · abre a las 08:00";
  if (minutes > 900 && minutes < 1050) return "Cerrado ahora · abre a las 17:30";
  if (minutes > 1260) return now.weekday === 6 ? "Cerrado ahora · abre el lunes a las 08:00" : "Cerrado ahora · abre mañana a las 08:00";
  return "Cerrado ahora";
}

function openDialog(dialog) {
  if (!dialog.open) {
    dialog.showModal();
    document.body.classList.add("dialog-open");
    dialog.classList.remove("dialog-closing");
    dialog.classList.remove("dialog-enter");
    requestAnimationFrame(() => dialog.classList.add("dialog-enter"));
  }
}

function closeDialog(dialog, onClosed) {
  if (!dialog?.open || dialog.classList.contains("dialog-closing")) {
    if (!dialog?.open && typeof onClosed === "function") onClosed();
    return;
  }
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) {
    dialog.close();
    dialog.classList.remove("dialog-enter", "dialog-closing", "is-dragging");
    dialog.style.removeProperty("--sheet-drag");
    syncDialogBodyState();
    onClosed?.();
    return;
  }

  dialog.classList.remove("dialog-enter", "is-dragging");
  dialog.classList.add("dialog-closing");
  dialog.style.removeProperty("--sheet-drag");
  const shell = dialog.querySelector(".drawer-shell, .customize-shell, .checkout-shell, .success-shell");
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    dialog.close();
    dialog.classList.remove("dialog-enter", "dialog-closing", "is-dragging");
    syncDialogBodyState();
    onClosed?.();
  };
  shell?.addEventListener("animationend", (event) => {
    if (event.target === shell) finish();
  }, { once: true });
  setTimeout(finish, 360);
}

function syncDialogBodyState() {
  const anyOpen = [els.cartDialog, els.checkoutDialog, els.customizeDialog, els.ordersDialog, els.successDialog].some((dialog) => dialog.open);
  document.body.classList.toggle("dialog-open", anyOpen);
}

function setupMobileSheetGestures() {
  const sheets = [els.cartDialog, els.customizeDialog, els.ordersDialog];
  sheets.forEach((dialog) => {
    const handle = dialog.querySelector(".drawer-header");
    if (!handle) return;
    let startY = 0;
    let lastY = 0;
    let dragging = false;

    handle.addEventListener("pointerdown", (event) => {
      if (!window.matchMedia("(max-width: 699px)").matches || event.pointerType === "mouse") return;
      if (event.target.closest("button, a, input")) return;
      startY = event.clientY;
      lastY = startY;
      dragging = true;
      dialog.classList.add("is-dragging");
      try { handle.setPointerCapture?.(event.pointerId); } catch {}
    });

    handle.addEventListener("pointermove", (event) => {
      if (!dragging) return;
      lastY = event.clientY;
      const distance = Math.max(0, lastY - startY);
      dialog.style.setProperty("--sheet-drag", `${Math.min(distance, 180)}px`);
    });

    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      const distance = Math.max(0, lastY - startY);
      dialog.classList.remove("is-dragging");
      if (distance > 76) closeDialog(dialog);
      else {
        dialog.classList.add("sheet-snapback");
        dialog.style.setProperty("--sheet-drag", "0px");
        setTimeout(() => dialog.classList.remove("sheet-snapback"), 260);
      }
    };
    handle.addEventListener("pointerup", endDrag);
    handle.addEventListener("pointercancel", endDrag);
  });
}

function setupMotionSystem() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const revealTargets = [
    ".hero-v3-copy",
    ".hero-v3-media",
    ".featured-heading",
    ".featured-card",
    ".section-heading",
    ".pickup-copy",
    ".map-wrap",
    ".footer-grid > div",
  ];
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-revealed");
      observer.unobserve(entry.target);
    });
  }, { threshold: .12, rootMargin: "0px 0px -7% 0px" });
  revealTargets.forEach((selector) => $$(selector).forEach((node, index) => {
    node.classList.add("motion-reveal");
    node.style.setProperty("--reveal-index", index % 5);
    observer.observe(node);
  }));

  document.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") return;
    const target = event.target.closest(".product-card, .featured-card, .button, .add-button, .category-button, .cart-button, .payment-card, .option-row");
    if (!target) return;
    const rect = target.getBoundingClientRect();
    target.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    target.style.setProperty("--my", `${event.clientY - rect.top}px`);
    target.style.setProperty("--rx", `${((event.clientY - rect.top) / rect.height - .5) * -4}deg`);
    target.style.setProperty("--ry", `${((event.clientX - rect.left) / rect.width - .5) * 4}deg`);
  }, { passive: true });

  document.addEventListener("pointerleave", (event) => {
    const target = event.target.closest?.(".product-card, .featured-card");
    if (!target) return;
    target.style.setProperty("--rx", "0deg");
    target.style.setProperty("--ry", "0deg");
  }, true);

  document.addEventListener("pointerdown", (event) => {
    const target = event.target.closest("button, .button, .category-button, .payment-card");
    if (!target || target.disabled) return;
    const rect = target.getBoundingClientRect();
    const ripple = document.createElement("span");
    ripple.className = "liquid-ripple";
    const size = Math.max(rect.width, rect.height) * 1.45;
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
    target.append(ripple);
    ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
  }, { passive: true });
}

function cartCount() {
  return state.cart.reduce((sum, item) => sum + item.quantity, 0);
}

function cartTotal() {
  return state.cart.reduce((sum, item) => {
    const product = MENU.find((entry) => entry.id === item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);
}

function persistCart() {
  localStorage.setItem(STORAGE.cart, JSON.stringify(state.cart));
}

function persistOrders() {
  localStorage.setItem(STORAGE.orders, JSON.stringify(state.orders));
}

function sanitizeStoredCart() {
  state.cart = Array.isArray(state.cart) ? state.cart.filter((item) => MENU.some((product) => product.id === item.productId) && Number.isFinite(Number(item.quantity)) && Number(item.quantity) > 0).map((item) => ({ ...item, quantity: Math.min(99, Math.floor(Number(item.quantity))) })) : [];
  state.orders = Array.isArray(state.orders) ? state.orders : [];
}

function cartItemKey(productId, customization) {
  return `${productId}::${customization ? stableStringify(customization) : "standard"}`;
}

function productImage(product) {
  return product.image || "./assets/delicias-hero.jpeg";
}

function renderProductVisual(product, context = "card") {
  if (PHOTO_SAFE_IDS.has(product.id)) {
    return `<img src="${productImage(product)}" alt="${escapeHtml(product.name)}" width="900" height="675" loading="${context === "featured" ? "eager" : "lazy"}" decoding="async" onerror="this.onerror=null;this.closest('.product-image, .featured-media')?.classList.add('visual-fallback');this.remove()" />`;
  }

  if (product.category === "Bebidas") {
    const lower = product.name.toLowerCase();
    const brand = lower.includes("coca") ? "coca" : lower.includes("fanta") ? "fanta" : lower.includes("sprite") ? "sprite" : "monster";
    return `<div class="beverage-visual beverage-${brand}" role="img" aria-label="${escapeHtml(product.name)}"><strong>${escapeHtml(product.name)}</strong></div>`;
  }

  const visualClass = product.category === "Pollo" ? "visual-pollo" : product.category === "Guarniciones" ? "visual-guarnicion" : "visual-sandwich";
  return `<div class="ingredient-visual ${visualClass}" role="img" aria-label="Representación gráfica de ${escapeHtml(product.name)}"><strong>${escapeHtml(product.name)}</strong></div>`;
}

function renderProductBadges(product, context = "card") {
  const badges = [];
  if (product.promo) badges.push(`<span class="product-badge product-badge-promo">Promo</span>`);
  if (product.tags?.includes("popular")) badges.push(`<span class="product-badge product-badge-popular">Más pedido</span>`);
  if (product.tags?.includes("veggie")) badges.push(`<span class="product-badge product-badge-veggie">Vegetariano</span>`);
  if (!badges.length) return "";
  return `<div class="product-badges product-badges-${context}" aria-label="Etiquetas del producto">${badges.join("")}</div>`;
}

function renderCartVisual(product) {
  if (PHOTO_SAFE_IDS.has(product.id) && product.image) {
    return `<img class="cart-visual-photo" src="${productImage(product)}" alt="" width="64" height="64" loading="lazy" decoding="async" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'cart-visual cart-visual-default',textContent:'DU'}))" />`;
  }
  const cls = product.category === "Bebidas" ? "cart-visual-drink" : product.category === "Pollo" ? "cart-visual-pollo" : product.category === "Guarniciones" ? "cart-visual-side" : "cart-visual-sandwich";
  const label = product.category === "Bebidas" ? product.name.split(" ")[0].slice(0, 3).toUpperCase() : "DU";
  return `<div class="cart-visual ${cls}" aria-hidden="true">${escapeHtml(label)}</div>`;
}

function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
}

function formatCustomization(customization) {
  return customization.map((group) => `${escapeHtml(group.title)}: ${group.values.map(escapeHtml).join(", ")}`).join(" · ");
}

function formatMoney(value) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(value).replace("ARS", "$ ").replace(/\s+/g, " ").trim();
}

function formatPickup(dateValue, time) {
  const date = new Date(`${dateValue}T12:00:00-03:00`);
  const label = new Intl.DateTimeFormat("es-AR", { weekday: "long", day: "numeric", month: "numeric", timeZone: "America/Argentina/Salta" }).format(date);
  return `${capitalize(label)} · ${time}`;
}

function formatShortDate(iso) {
  const date = new Date(iso);
  return new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", timeZone: "America/Argentina/Salta" }).format(date);
}

function getSaltaNow() {
  return getSaltaDateParts(new Date(), true);
}

function getSaltaDateParts(date, includeTime = true) {
  const options = { timeZone: "America/Argentina/Salta", year: "numeric", month: "numeric", day: "numeric", weekday: "long" };
  if (includeTime) Object.assign(options, { hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-US", options).formatToParts(date).filter((part) => part.type !== "literal").map((part) => [part.type, part.value]));
  const weekdayMap = { Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 };
  const weekdayLabel = new Intl.DateTimeFormat("es-AR", { weekday: "long", timeZone: "America/Argentina/Salta" }).format(date);
  return { year: Number(parts.year), month: Number(parts.month), day: Number(parts.day), hour: Number(parts.hour || 0), minute: Number(parts.minute || 0), weekday: weekdayMap[parts.weekday], weekdayLabel };
}

function timeToMinutes(time) {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

function minutesToTime(minutes) {
  return `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function capitalize(value) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
}

function safeParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]));
}

function flashAddButton(button) {
  if (!button) return;
  const original = button.textContent;
  button.textContent = "Agregado";
  button.classList.add("is-added");
  setTimeout(() => {
    button.textContent = original;
    button.classList.remove("is-added");
  }, 850);
}

let toastTimer;
function showToast(message) {
  clearTimeout(toastTimer);
  els.toast.textContent = message;
  els.toast.classList.add("is-visible");
  toastTimer = setTimeout(() => els.toast.classList.remove("is-visible"), 1600);
}

async function copyText(text, button) {
  try {
    await navigator.clipboard.writeText(text);
    showToast("Alias copiado");
    button.textContent = "Copiado";
    setTimeout(() => button.textContent = "Copiar", 1200);
  } catch {
    showToast(`Alias: ${text}`);
  }
}

function track(eventName, params = {}) {
  const payload = { event: eventName, ...params };
  if (Array.isArray(window.dataLayer)) window.dataLayer.push(payload);
  window.dispatchEvent(new CustomEvent("delicias:analytics", { detail: payload }));
}
