/* Delicias Urbanas — motion editorial del menú.
 * Solo UI. No modifica carrito, catálogo, stock, precios ni checkout.
 */
(() => {
  const menu = document.getElementById('menu');
  const strip = menu?.querySelector('[data-categories]');
  const list = menu?.querySelector('[data-products]');
  const search = menu?.querySelector('[data-search]');
  if (!menu || !strip || !list) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  let tabFrame = 0;
  let cursorFrame = 0;
  let cursorRow = null;
  let cursorX = 0;
  let cursorY = 0;
  const raf = window.requestAnimationFrame.bind(window);

  function syncPill() {
    tabFrame = 0;
    const active = strip.querySelector('.category-button[aria-pressed="true"]');
    const pill = strip.querySelector('.du-tabs-glider');
    if (!active || !pill) return;
    // offsetLeft mide el botón en coordenadas del strip aunque se desplace
    // horizontalmente en móviles. La pastilla siempre queda debajo del texto.
    strip.style.setProperty('--du-glider-x', active.offsetLeft + 'px');
    strip.style.setProperty('--du-glider-y', active.offsetTop + 'px');
    strip.style.setProperty('--du-glider-w', active.offsetWidth + 'px');
    strip.style.setProperty('--du-glider-h', active.offsetHeight + 'px');
    strip.classList.add('du-glider-ready');
  }
  function schedulePill() {
    if (!tabFrame) tabFrame = raf(syncPill);
  }

  // Con teclado también sigue la selección. Se conserva el deslizamiento,
  // no se crea/destruye la pastilla al cambiar de categoría.
  strip.addEventListener('click', event => {
    const button = event.target.closest('.category-button');
    if (!button) return;
    // Solo desplazar horizontalmente las pestañas, nunca la página completa.
    const left = button.offsetLeft;
    const right = left + button.offsetWidth;
    if (right > strip.scrollLeft + strip.clientWidth - 8 || left < strip.scrollLeft + 8) {
      strip.scrollTo({
        left: Math.max(0, left - (strip.clientWidth - button.offsetWidth) / 2),
        behavior: reduced.matches ? 'instant' : 'smooth'
      });
    }
    schedulePill();
  });
  document.addEventListener('du:menu:tabs', schedulePill);
  document.fonts?.ready?.then(schedulePill);
  if ('ResizeObserver' in window) new ResizeObserver(schedulePill).observe(strip);
  window.addEventListener('resize', schedulePill, { passive: true });

  // No esconder nada salvo cuando la funcionalidad está instalada; cuando
  // existe reduced-motion la página sigue totalmente estática.
  if (!reduced.matches && 'IntersectionObserver' in window) {
    menu.classList.add('du-wow-enabled');
    const io = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      menu.classList.add('du-wow-entered');
      io.disconnect();
    }, { threshold: 0.04, rootMargin: '0px 0px -8% 0px' });
    io.observe(menu);
  }

  // Spotlight reactivo al puntero sin dibujar un halo global ni reflow
  // continuo: solo se escribe una pareja de variables por frame solicitado.
  function paintCursor() {
    cursorFrame = 0;
    if (!cursorRow || !cursorRow.isConnected) return;
    const bounds = cursorRow.getBoundingClientRect();
    cursorRow.style.setProperty('--du-pointer-x', Math.round(cursorX - bounds.left) + 'px');
    cursorRow.style.setProperty('--du-pointer-y', Math.round(cursorY - bounds.top) + 'px');
  }
  if (fine.matches && !reduced.matches) {
    list.addEventListener('pointermove', event => {
      if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
      const row = event.target.closest('.du-menu-item');
      if (!row) return;
      cursorRow = row;
      cursorX = event.clientX;
      cursorY = event.clientY;
      if (!cursorFrame) cursorFrame = raf(paintCursor);
    }, { passive: true });
  }

  // Busca con respuesta inmediata. Al limpiar no se pierde el foco del campo;
  // todo el estado de filtros sigue en app.js.
  search?.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || !search.value) return;
    event.preventDefault();
    menu.querySelector('[data-clear-search]')?.click();
  });

  // Recalcular al cambiar la carta; las filas entran escalonadas vía CSS,
  // mientras app.js actualiza el DOM sin demoras artificiales.
  document.addEventListener('du:menu:render', schedulePill);
  reduced.addEventListener?.('change', event => {
    menu.classList.toggle('du-wow-enabled', !event.matches);
    if (event.matches) {
      menu.classList.add('du-wow-entered');
      if (cursorFrame) cancelAnimationFrame(cursorFrame);
      cursorFrame = 0;
    }
    schedulePill();
  });
  schedulePill();
})();
