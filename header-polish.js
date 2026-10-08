/* Barra editorial Delicias Urbanas:
 * - indicador deslizante entre los enlaces
 * - sección activa según el desplazamiento, con soporte de anclas
 * - menú móvil accesible con Escape, clic externo y cierre tras navegación
 * - progreso de lectura y confirmación física al agregar al carrito
 *
 * No reemplaza los controladores comerciales de app.js.
 */
(() => {
  const header = document.querySelector('.site-header');
  const track = header?.querySelector('.du-nav-track');
  const desktopLinks = track ? [...track.querySelectorAll('a[href^="#"]')] : [];
  const toggle = header?.querySelector('.du-mobile-nav-toggle');
  const mobileNav = header?.querySelector('.du-mobile-navigation');
  const mobileLinks = mobileNav ? [...mobileNav.querySelectorAll('a[href^="#"]')] : [];
  const homeLink = header?.querySelector('.brand[href="#inicio"]');
  const cartButton = header?.querySelector('[data-open-cart]');
  const countLabel = header?.querySelector('[data-cart-count]');
  if (!header) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  let hoveredLink = null;
  let currentSection = null;
  let ticking = false;

  const anchors = desktopLinks.map(link => ({
    id: link.getAttribute('href')?.slice(1),
    desktop: link,
    mobile: mobileLinks.find(el => el.getAttribute('href') === link.getAttribute('href')),
    section: document.getElementById(link.getAttribute('href').slice(1))
  })).filter(item => item.section);

  function updateIndicator() {
    if (!track || !desktopLinks.length) return;
    const target = hoveredLink || anchors.find(item => item.id === currentSection)?.desktop;
    desktopLinks.forEach(el => el.classList.toggle('du-visual-active', el === target));
    track.classList.toggle('du-has-selection', Boolean(target));
    if (!target) return;
    track.style.setProperty('--du-nav-x', target.offsetLeft + 'px');
    track.style.setProperty('--du-nav-y', target.offsetTop + 'px');
    track.style.setProperty('--du-nav-width', target.offsetWidth + 'px');
    track.style.setProperty('--du-nav-item-height', target.offsetHeight + 'px');
  }

  function scrollSection() {
    // Una sección se considera activa cuando su título queda junto a la barra.
    // Esto también funciona cuando el catálogo cambia de altura tras cargar.
    const threshold = header.getBoundingClientRect().height + Math.min(160, window.innerHeight * .23);
    let id = null;
    for (const item of anchors) {
      if (item.section.getBoundingClientRect().top <= threshold) id = item.id;
    }
    return id;
  }

  function updatePosition() {
    ticking = false;
    const progressDenominator = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = clamp(window.scrollY / progressDenominator, 0, 1);
    header.style.setProperty('--du-page-progress', progress.toFixed(4));
    const active = scrollSection();
    if (active !== currentSection) {
      currentSection = active;
      for (const item of anchors) {
        for (const link of [item.desktop, item.mobile].filter(Boolean)) {
          if (item.id === active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        }
      }
    }
    updateIndicator();
  }

  function requestUpdate() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updatePosition);
  }

  for (const link of desktopLinks) {
    link.addEventListener('pointerenter', event => {
      if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
      hoveredLink = link;
      updateIndicator();
    });
    link.addEventListener('focus', () => {
      hoveredLink = link;
      updateIndicator();
    });
    link.addEventListener('blur', () => {
      hoveredLink = null;
      updateIndicator();
    });
  }
  track?.addEventListener('pointerleave', () => {
    hoveredLink = null;
    updateIndicator();
  });

  function setMobileMenu(open, restoreFocus = false) {
    if (!toggle || !mobileNav) return;
    const wasOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar navegación' : 'Abrir navegación');
    mobileNav.hidden = !open;
    header.classList.toggle('du-mobile-menu-open', open);
    if (!open && wasOpen && restoreFocus) toggle.focus({ preventScroll: true });
  }

  toggle?.addEventListener('click', () => {
    setMobileMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });
  // El destino #inicio está en un header sticky: el salto nativo puede
  // detenerse a mitad de página. Forzamos el inicio real del documento.
  homeLink?.addEventListener('click', event => {
    event.preventDefault();
    setMobileMenu(false);
    if (window.location.hash !== '#inicio') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search + '#inicio');
    }
    window.scrollTo({ top: 0, behavior: prefersReduced.matches ? 'instant' : 'smooth' });
    requestUpdate();
  });
  cartButton?.addEventListener('click', () => setMobileMenu(false));
  mobileNav?.addEventListener('click', event => {
    if (event.target.closest('a[href^="#"], button[data-open-orders]')) setMobileMenu(false);
  });
  document.addEventListener('pointerdown', event => {
    if (!mobileNav?.hidden && !header.contains(event.target)) setMobileMenu(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && mobileNav && !mobileNav.hidden) {
      event.preventDefault();
      setMobileMenu(false, true);
    }
  });

  let lastCount = Number(countLabel?.textContent) || 0;
  if (countLabel && cartButton && 'MutationObserver' in window) {
    const countObserver = new MutationObserver(() => {
      const nextCount = Number(countLabel.textContent) || 0;
      if (nextCount === lastCount) return;
      const increased = nextCount > lastCount;
      lastCount = nextCount;
      if (!increased || prefersReduced.matches) return;
      cartButton.classList.remove('du-cart-pulse');
      // Restart only when an item is actually added.
      void cartButton.offsetWidth;
      cartButton.classList.add('du-cart-pulse');
    });
    countObserver.observe(countLabel, { childList: true, characterData: true, subtree: true });
    cartButton.addEventListener('animationend', event => {
      if (event.animationName === 'du-cart-nudge') cartButton.classList.remove('du-cart-pulse');
    });
  }

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 890) setMobileMenu(false);
    requestUpdate();
  }, { passive: true });
  window.addEventListener('pageshow', requestUpdate);
  document.fonts?.ready?.then(requestUpdate);
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(requestUpdate);
    observer.observe(header);
    for (const item of anchors) observer.observe(item.section);
  }
  requestUpdate();
})();
