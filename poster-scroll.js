/* La torta salada viaja desde el afiche amarillo hasta el menú.
   Scroll-scrub reversible y suavizado, sin GSAP ni cálculos de layout por frame.
   En reduced-motion queda el PNG estático y no se inyecta un duplicado. */
(() => {
  const product = document.querySelector('[data-scroll-product]');
  const menu = document.querySelector('#menu');
  const hero = document.querySelector('.du-poster-hero');
  const header = document.querySelector('.site-header');
  if (!product || !hero || !menu) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const mix = (a, b, t) => a + (b - a) * t;

  function updateHeader() {
    header?.classList.toggle('du-header-scrolled', window.scrollY > Math.max(220, hero.offsetHeight - 100));
  }
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
  if (reduced.matches) return;

  let clone;
  let begin = { x: 0, y: 0, w: 0, h: 0 };
  let endAt = 1;
  let current = null;
  let desired = 0;
  let frame = 0;
  let resizeFrame = 0;

  function measure() {
    if (!clone) return;
    const rect = product.getBoundingClientRect();
    begin = {
      x: rect.left,
      y: rect.top + window.scrollY,
      w: rect.width,
      h: rect.height
    };
    clone.style.width = `${begin.w}px`;
    clone.style.height = `${begin.h}px`;
    const menuTop = menu.getBoundingClientRect().top + window.scrollY;
    // Termina cuando el encabezado del menú llega casi al borde superior,
    // no cuando apenas asoma debajo de las promociones.
    endAt = Math.max(280, menuTop - window.innerHeight * .10);
  }

  function path(progress) {
    const vw = window.innerWidth, vh = window.innerHeight;
    const points = [
      { p: 0,   x: begin.x,       y: begin.y,      s: 1,    a: -4,  o: 1 },
      { p: .22, x: vw * .26,      y: vh * .16,     s: .78,  a: 7,   o: 1 },
      { p: .4,  x: vw * .36,      y: vh * .25,     s: .63,  a: -6,  o: .34 },
      { p: .51, x: vw * .40,      y: vh * .29,     s: .55,  a: -9,  o: .025 },
      { p: .79, x: vw * .54,      y: vh * .37,     s: .35,  a: 13,  o: 0 },
      { p: 1,   x: vw * .70,      y: vh * .52,     s: .14,  a: 22,  o: 0 }
    ];
    for (let i = 1; i < points.length; i++) {
      if (progress > points[i].p) continue;
      const from = points[i - 1], to = points[i];
      const t = clamp((progress - from.p) / (to.p - from.p), 0, 1);
      const eased = t * t * (3 - 2 * t);
      return Object.fromEntries(['x', 'y', 's', 'a', 'o'].map(k => [k, mix(from[k], to[k], eased)]));
    }
    return points[points.length - 1];
  }

  function paint(progress) {
    const v = path(progress);
    clone.style.transform = `translate3d(${v.x.toFixed(2)}px,${v.y.toFixed(2)}px,0) rotate(${v.a.toFixed(2)}deg) scale(${v.s.toFixed(4)})`;
    clone.style.opacity = v.o.toFixed(3);
    clone.style.visibility = progress > .998 ? 'hidden' : 'visible';
  }

  function animate() {
    frame = 0;
    const diff = desired - current;
    // Suavizado temporal, reversibilidad natural cuando el usuario sube.
    current += diff * .2;
    if (Math.abs(diff) < .0006) current = desired;
    paint(current);
    if (current !== desired) frame = requestAnimationFrame(animate);
  }

  function onScroll() {
    desired = clamp(window.scrollY / endAt, 0, 1);
    if (!frame) frame = requestAnimationFrame(animate);
  }

  function refreshBounds() {
    if (!clone) return;
    measure();
    onScroll();
  }

  function scheduleBounds() {
    if (resizeFrame) return;
    resizeFrame = requestAnimationFrame(() => {
      resizeFrame = 0;
      refreshBounds();
    });
  }

  function mount() {
    if (clone || reduced.matches) return;
    clone = document.createElement('img');
    clone.className = 'du-product-flight';
    clone.src = product.currentSrc || product.src;
    clone.alt = '';
    clone.setAttribute('aria-hidden', 'true');
    clone.decoding = 'async';
    document.body.appendChild(clone);
    measure();
    desired = clamp(window.scrollY / endAt, 0, 1);
    current = desired;
    paint(current);
    document.documentElement.classList.add('du-flight-active');
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => {
      refreshBounds();
      desired = clamp(window.scrollY / endAt, 0, 1);
      current = desired;
      paint(current);
    }, { passive: true });
    // El catálogo se inyecta de forma asíncrona y modifica la altura de
    // Promociones. Medir solo al abrir deja el final del recorrido adelantado.
    if ('ResizeObserver' in window) {
      const observer = new ResizeObserver(scheduleBounds);
      [hero, document.querySelector('.featured-section'), menu].filter(Boolean).forEach(el => observer.observe(el));
    }
    document.fonts?.ready?.then(scheduleBounds);
    window.addEventListener('load', scheduleBounds, { once: true });
    reduced.addEventListener?.('change', event => {
      if (!event.matches) return;
      if (frame) cancelAnimationFrame(frame);
      document.documentElement.classList.remove('du-flight-active');
      clone?.remove();
      clone = null;
    }, { once: true });
  }

  if (product.complete && product.naturalWidth) mount();
  else product.addEventListener('load', mount, { once: true });
})();
