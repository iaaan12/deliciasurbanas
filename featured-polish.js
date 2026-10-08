/* Microinteracciones de la sección de destacados.
   No altera el catálogo, los botones ni los eventos comerciales de app.js. */
(() => {
  const grid = document.querySelector('[data-featured-products]');
  if (!grid) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktopPointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const activeFrames = new WeakMap();

  function mount() {
    const cards = [...grid.querySelectorAll('.featured-card')];
    if (!cards.length) return;
    if (!reduced.matches && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('du-feature-in-view');
          io.unobserve(entry.target);
        }
      }, { threshold: .17, rootMargin: '0px 0px -3% 0px' });
      cards.forEach(card => io.observe(card));
    } else cards.forEach(card => card.classList.add('du-feature-in-view'));

    if (!desktopPointer.matches || reduced.matches) return;
    cards.forEach(card => {
      const poster = card.querySelector('.du-feature-poster');
      if (!poster) return;
      let targetX = 0, targetY = 0, currentX = 0, currentY = 0, frame = 0;
      const paint = () => {
        frame = 0;
        currentX += (targetX - currentX) * .15;
        currentY += (targetY - currentY) * .15;
        poster.style.setProperty('--du-poster-move-x', currentX.toFixed(2) + 'px');
        poster.style.setProperty('--du-poster-move-y', currentY.toFixed(2) + 'px');
        if (Math.abs(targetX - currentX) > .1 || Math.abs(targetY - currentY) > .1) {
          frame = requestAnimationFrame(paint);
        }
      };
      const schedule = () => { if (!frame) frame = requestAnimationFrame(paint); };
      card.addEventListener('pointermove', event => {
        if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
        const rect = card.getBoundingClientRect();
        targetX = clamp((event.clientX - rect.left) / rect.width - .5, -.5, .5) * 11;
        targetY = clamp((event.clientY - rect.top) / rect.height - .5, -.5, .5) * 11;
        schedule();
      }, { passive: true });
      card.addEventListener('pointerleave', () => {
        targetX = 0; targetY = 0;
        schedule();
      });
      activeFrames.set(card, () => frame && cancelAnimationFrame(frame));
    });
  }

  if (grid.querySelector('.featured-card')) mount();
  else {
    const observer = new MutationObserver(() => {
      if (!grid.querySelector('.featured-card')) return;
      observer.disconnect();
      mount();
    });
    observer.observe(grid, { childList: true });
  }
  reduced.addEventListener?.('change', event => {
    if (!event.matches) return;
    grid.querySelectorAll('.featured-card').forEach(card => {
      activeFrames.get(card)?.();
      const art = card.querySelector('.du-feature-poster');
      art?.style.removeProperty('--du-poster-move-x');
      art?.style.removeProperty('--du-poster-move-y');
      card.classList.add('du-feature-in-view');
    });
  });
})();
