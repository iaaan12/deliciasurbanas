/* Motion de la carta editorial. Solo transform/opacity, sin listeners globales
   costosos ni movimiento continuo en equipos táctiles. */
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function setupReveals() {
    if (reduceMotion.matches || !('IntersectionObserver' in window)) return;
    const targets = [
      '.hero-v3-copy',
      '.hero-v3-media',
      '.featured-heading',
      '.featured-card',
      '.pickup-copy',
      '.du-location-map',
      '.footer-grid > div'
    ];
    const nodes = targets.flatMap(selector => [...document.querySelectorAll(selector)]);
    if (!nodes.length) return;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('du-seen');
        observer.unobserve(entry.target);
      }
    }, { threshold: .12, rootMargin: '0px 0px -5% 0px' });
    nodes.forEach((node, index) => {
      node.classList.add('du-reveal');
      node.style.setProperty('--du-delay', `${Math.min(index % 4, 3) * 95}ms`);
      observer.observe(node);
    });
    document.documentElement.classList.add('du-motion-ready');
  }

  function setupFollowingTicket() {
    const finePointer = window.matchMedia('(min-width: 920px) and (hover: hover) and (pointer: fine)');
    if (reduceMotion.matches || !finePointer.matches) return;
    const board = document.querySelector('.du-menu-board');
    const preview = board?.querySelector('.du-menu-ticket');
    const list = board?.querySelector('.du-menu-list');
    if (!board || !preview || !list) return;

    let x = 0, y = 0, angle = -5;
    let destX = 0, destY = 0, destAngle = -5;
    let frame = 0, started = false;
    let hovering = false;
    let pointerX = 0, pointerY = 0;
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

    function homePosition() {
      const boardRect = board.getBoundingClientRect();
      return {
        x: clamp(boardRect.width * .54, 8, Math.max(8, boardRect.width - preview.offsetWidth - 8)),
        y: clamp(Math.min(145, Math.max(86, window.innerWidth * .12)), 8, Math.max(8, boardRect.height - preview.offsetHeight - 8))
      };
    }

    function paint() {
      preview.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) rotate(${angle.toFixed(2)}deg)`;
    }

    function animate() {
      frame = 0;
      // Interpolación amortiguada: rápido al arrancar y desaceleración natural.
      x += (destX - x) * .17;
      y += (destY - y) * .17;
      angle += (destAngle - angle) * .13;
      if (Math.abs(destX - x) < .15 && Math.abs(destY - y) < .15 && Math.abs(destAngle - angle) < .08) {
        x = destX; y = destY; angle = destAngle;
        paint();
        return;
      }
      paint();
      frame = requestAnimationFrame(animate);
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(animate);
    }

    function moveTarget(clientX, clientY) {
      const bounds = board.getBoundingClientRect();
      const width = preview.offsetWidth;
      const height = preview.offsetHeight;
      const px = clientX - bounds.left;
      const py = clientY - bounds.top;
      // El ticket se coloca junto a la columna del plato señalado, no sobre
      // el nombre/precio que se está leyendo. Se mantiene dentro del board.
      const targetRow = document.elementFromPoint(clientX, clientY)?.closest('.du-menu-item');
      const itemRect = targetRow?.getBoundingClientRect();
      const rowMidX = itemRect ? (itemRect.left + itemRect.right) / 2 : bounds.left + px;
      const isLeftColumn = rowMidX < bounds.left + bounds.width / 2;
      const sideX = itemRect
        ? isLeftColumn ? itemRect.right - bounds.left + 15 : itemRect.left - bounds.left - width - 15
        : px + 28;
      destX = clamp(sideX, 8, Math.max(8, bounds.width - width - 8));
      destY = clamp(py - height * .46, 8, Math.max(8, bounds.height - height - 8));
      destAngle = clamp(-5 + (clientX - pointerX) * .12, -11, 2);
      pointerX = clientX;
      pointerY = clientY;
      schedule();
    }

    function reset() {
      hovering = false;
      board.classList.remove('is-hovering-ticket');
      const home = homePosition();
      destX = home.x;
      destY = home.y;
      destAngle = -5;
      schedule();
    }

    function activate() {
      if (started) return;
      started = true;
      const home = homePosition();
      x = destX = home.x;
      y = destY = home.y;
      angle = destAngle = -5;
      board.classList.add('du-ticket-ready');
      paint();
    }

    // Para mantener el ticket en su lugar al cambiar de categoría, iniciarlo
    // después de que la primera ficha tenga contenido y dimensiones.
    if (preview.querySelector('.du-ticket-paper')) activate();
    else {
      const observer = new MutationObserver(() => {
        if (!preview.querySelector('.du-ticket-paper')) return;
        observer.disconnect();
        activate();
      });
      observer.observe(preview, { childList: true });
    }

    list.addEventListener('pointermove', event => {
      if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
      if (!event.target.closest('.du-menu-item')) {
        if (hovering) reset();
        return;
      }
      if (!started) activate();
      hovering = true;
      board.classList.add('is-hovering-ticket');
      moveTarget(event.clientX, event.clientY);
    }, { passive: true });
    list.addEventListener('pointerleave', reset);
    document.addEventListener('du:menu:render', () => {
      if (!started) return;
      reset();
    });
    window.addEventListener('resize', () => {
      if (hovering || !started) return;
      const home = homePosition();
      x = destX = home.x;
      y = destY = home.y;
      paint();
    }, { passive: true });
    reduceMotion.addEventListener?.('change', event => {
      if (event.matches) {
        if (frame) cancelAnimationFrame(frame);
        board.classList.remove('du-ticket-ready');
        preview.style.transform = '';
      }
    }, { once: true });
  }

  function init() {
    const featured = document.querySelector('[data-featured-products]');
    if (!featured) return;
    if (featured.children.length) {
      setupReveals();
      setupFollowingTicket();
      return;
    }
    const observer = new MutationObserver(() => {
      if (!featured.children.length) return;
      observer.disconnect();
      setupReveals();
      setupFollowingTicket();
    });
    observer.observe(featured, { childList: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
