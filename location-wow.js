/* Delicias Urbanas — interacciones de la postal de ubicación.
 * La animación de calles y caminata pertenece a location-map.js.
 * Acá: entrada editorial, efecto de profundidad, repetir y copiar dirección.
 */
(() => {
  const section = document.getElementById('ubicacion');
  if (!section) return;
  const map = section.querySelector('.du-location-map');
  const replay = section.querySelector('[data-map-replay]');
  const copy = section.querySelector('[data-copy-address]');
  const feedback = section.querySelector('[data-address-feedback]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  if (!reduceMotion.matches && 'IntersectionObserver' in window) {
    section.classList.add('du-loc-ready');
    const io = new IntersectionObserver(entries => {
      if (!entries.some(item => item.isIntersecting)) return;
      section.classList.add('du-loc-visible');
      io.disconnect();
    }, { threshold: 0.13, rootMargin: '0px 0px -4% 0px' });
    io.observe(section);
  }

  if (map && finePointer.matches && !reduceMotion.matches) {
    let frame = 0, targetX = 0, targetY = 0, currentX = 0, currentY = 0;
    let lightX = 50, lightY = 50;
    function paint() {
      frame = 0;
      currentX += (targetX - currentX) * .15;
      currentY += (targetY - currentY) * .15;
      map.style.setProperty('--loc-tilt-x', currentY.toFixed(3) + 'deg');
      map.style.setProperty('--loc-tilt-y', currentX.toFixed(3) + 'deg');
      map.style.setProperty('--loc-light-x', lightX.toFixed(1) + '%');
      map.style.setProperty('--loc-light-y', lightY.toFixed(1) + '%');
      if (Math.abs(targetX - currentX) > .01 || Math.abs(targetY - currentY) > .01) {
        frame = requestAnimationFrame(paint);
      }
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(paint); };
    map.addEventListener('pointermove', event => {
      if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
      const bounds = map.getBoundingClientRect();
      const nx = clamp((event.clientX - bounds.left) / bounds.width, 0, 1);
      const ny = clamp((event.clientY - bounds.top) / bounds.height, 0, 1);
      targetX = (nx - .5) * 1.8;
      targetY = (.5 - ny) * 1.8;
      lightX = nx * 100;
      lightY = ny * 100;
      schedule();
    }, { passive: true });
    map.addEventListener('pointerleave', () => {
      targetX = 0; targetY = 0; lightX = 50; lightY = 50;
      schedule();
    });
    reduceMotion.addEventListener?.('change', event => {
      if (!event.matches) return;
      if (frame) cancelAnimationFrame(frame);
      map.style.removeProperty('--loc-tilt-x');
      map.style.removeProperty('--loc-tilt-y');
    });
  }

  if (map && replay && 'MutationObserver' in window) {
    function syncReplay() {
      const ready = map.classList.contains('is-enhanced') && map.classList.contains('is-complete') && !reduceMotion.matches;
      replay.hidden = !ready;
      replay.disabled = !ready;
    }
    const observer = new MutationObserver(syncReplay);
    observer.observe(map, { attributes: true, attributeFilter: ['class'] });
    replay.addEventListener('click', () => {
      if (replay.disabled || replay.hidden) return;
      replay.disabled = true;
      map.dispatchEvent(new Event('du:map:replay'));
      syncReplay();
    });
    reduceMotion.addEventListener?.('change', syncReplay);
    syncReplay();
  }

  if (copy) {
    const originalLabel = copy.getAttribute('aria-label') || 'Copiar dirección';
    let feedbackTimer;
    copy.addEventListener('click', async () => {
      const address = 'Av. San Martín 532, Salta, Argentina';
      let succeeded = false;
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(address);
          succeeded = true;
        }
      } catch (_) { /* Se ofrece el método de selección como respaldo. */ }
      if (!succeeded) {
        const helper = document.createElement('textarea');
        helper.value = address;
        helper.setAttribute('readonly','');
        helper.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0';
        document.body.appendChild(helper);
        helper.select();
        try { succeeded = document.execCommand('copy'); } catch (_) { succeeded = false; }
        helper.remove();
      }
      if (feedback) feedback.textContent = succeeded ? 'Dirección copiada al portapapeles.' : 'No se pudo copiar la dirección.';
      copy.classList.toggle('is-copied', succeeded);
      copy.setAttribute('aria-label', succeeded ? 'Dirección copiada' : originalLabel);
      clearTimeout(feedbackTimer);
      feedbackTimer = setTimeout(() => {
        copy.classList.remove('is-copied');
        copy.setAttribute('aria-label', originalLabel);
        if (feedback) feedback.textContent = '';
      }, 1800);
    });
  }
})();
