// El mapa se prepara sin animar nada fuera de pantalla. Al aparecer, las
// calles se dibujan y el logo camina sobre Av. San Martín hasta el marcador.
(() => {
  const map = document.querySelector('.du-location-map');
  if (!map) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotion.matches || !('IntersectionObserver' in window) || !('requestAnimationFrame' in window)) return;

  const svgNS = 'http://www.w3.org/2000/svg';
  const WALK_DELAY = 850;
  const WALK_DURATION = 2750;

  const createWalker = () => {
    const walker = document.createElementNS(svgNS, 'g');
    walker.setAttribute('class', 'du-map-walker');
    walker.setAttribute('aria-hidden', 'true');
    // Las piernas se mueven en oposición, y el emblema da pequeños saltitos.
    walker.innerHTML = `
      <ellipse cx="0" cy="0" rx="20" ry="5" fill="#100b08" opacity=".35"/>
      <g class="du-walker-bounce">
        <g class="du-walker-leg du-walker-leg-back">
          <path d="M-10 -17 L-14 -2" stroke="#fff5e7" stroke-width="5" stroke-linecap="round"/>
          <path d="M-14 -2 L-20 -2" stroke="#ffb238" stroke-width="5" stroke-linecap="round"/>
        </g>
        <g class="du-walker-leg du-walker-leg-front">
          <path d="M10 -17 L14 -2" stroke="#fff5e7" stroke-width="5" stroke-linecap="round"/>
          <path d="M14 -2 L21 -2" stroke="#ffb238" stroke-width="5" stroke-linecap="round"/>
        </g>
        <circle cx="0" cy="-41" r="31" fill="#fff4e7" stroke="#ff6a00" stroke-width="7"/>
        <image href="./assets/delicias-logo-clean.webp" x="-24" y="-65" width="48" height="48" preserveAspectRatio="xMidYMid meet"/>
      </g>`;
    return walker;
  };

  // El archivo queda como <img> si falla la carga o si no hay JS, por lo que
  // el usuario siempre ve el mapa y el enlace para llegar al local.
  const image = map.querySelector('.du-map-art');
  if (!image) return;

  fetch(image.getAttribute('src'))
    .then(response => {
      if (!response.ok) throw new Error('No se pudo cargar el mapa SVG.');
      return response.text();
    })
    .then(markup => {
      const svg = new DOMParser().parseFromString(markup, 'image/svg+xml').documentElement;
      if (svg.localName !== 'svg' || svg.namespaceURI !== svgNS) throw new Error('SVG inválido.');

      const route = svg.querySelector('#du-walk-route');
      if (!route || typeof route.getTotalLength !== 'function') throw new Error('Falta la ruta del logo.');

      svg.classList.add('du-map-art', 'du-map-svg');
      svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
      svg.setAttribute('aria-hidden', 'true');
      svg.removeAttribute('role');

      const walker = createWalker();
      svg.appendChild(walker);
      image.replaceWith(svg);
      const pathLength = route.getTotalLength();
      if (!Number.isFinite(pathLength) || pathLength <= 0) throw new Error('Ruta de recorrido vacía.');

      // Recorta el inicio al sector visible para que el logo entre caminando
      // tanto en formato apaisado como en el mapa estrecho del celular.
      const routeStart = () => {
        const bounds = map.getBoundingClientRect();
        const viewBox = svg.viewBox.baseVal;
        const scale = Math.max(bounds.width / viewBox.width, bounds.height / viewBox.height);
        const visibleLeft = (viewBox.width - bounds.width / scale) / 2;
        const startX = Math.max(75, visibleLeft + 66);
        for (let i = 0; i <= 140; i++) {
          const length = pathLength * (i / 140);
          if (route.getPointAtLength(length).x >= startX) return length;
        }
        return 0;
      };

      const setWalker = length => {
        const point = route.getPointAtLength(Math.min(length, pathLength));
        walker.setAttribute('transform', `translate(${point.x.toFixed(2)} ${point.y.toFixed(2)})`);
      };

      let started = false;
      let frame = null;
      let walkTimer = null;
      let startedAt = null;
      let walkStart = 0;
      let replayFrame = null;

      const finish = () => {
        if (frame !== null) cancelAnimationFrame(frame);
        if (walkTimer !== null) clearTimeout(walkTimer);
        map.classList.remove('is-walking');
        map.classList.add('is-visible', 'is-complete');
        setWalker(pathLength);
      };

      const tick = now => {
        if (startedAt === null) startedAt = now;
        const progress = Math.min((now - startedAt) / WALK_DURATION, 1);
        // Paso casi constante, desacelerando levemente al llegar al local.
        const eased = progress < .86 ? progress / .92 : .86 / .92 + (1 - .86 / .92) * (1 - Math.pow((1 - progress) / .14, 2));
        setWalker(walkStart + (pathLength - walkStart) * eased);
        if (progress >= 1) finish();
        else frame = requestAnimationFrame(tick);
      };

      const start = () => {
        if (started) return;
        started = true;
        map.classList.add('is-visible');
        walkTimer = setTimeout(() => {
          walkStart = routeStart();
          setWalker(walkStart);
          if (reducedMotion.matches) return finish();
          map.classList.add('is-walking');
          frame = requestAnimationFrame(tick);
        }, WALK_DELAY);
      };

      // El control opcional «Repetir recorrido» puede reiniciar el mismo
      // trazado sin duplicar SVG, timers ni observadores de intersección.
      map.addEventListener('du:map:replay', () => {
        if (reducedMotion.matches) return finish();
        if (frame !== null) { cancelAnimationFrame(frame); frame = null; }
        if (walkTimer !== null) { clearTimeout(walkTimer); walkTimer = null; }
        if (replayFrame !== null) { cancelAnimationFrame(replayFrame); replayFrame = null; }
        started = false;
        startedAt = null;
        map.classList.remove('is-visible','is-complete','is-walking');
        // CSS sólo vuelve a dibujar las calles si se reinicia la animación
        // desde su estado oculto en el siguiente frame.
        replayFrame = requestAnimationFrame(() => {
          replayFrame = requestAnimationFrame(() => {
            replayFrame = null;
            start();
          });
        });
      });

      // La clase is-enhanced activa el estado inicial oculto del trazado.
      // Se añade recién cuando el SVG está insertado, evitando flashes.
      map.classList.add('is-enhanced');

      const observer = new IntersectionObserver(entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        observer.disconnect();
        if (reducedMotion.matches) finish();
        else start();
      }, { threshold: .2 });
      observer.observe(map);

      reducedMotion.addEventListener?.('change', event => {
        if (event.matches) {
          observer.disconnect();
          finish();
        }
      }, { once: true });
    })
    .catch(error => {
      // Deja el SVG estático y el marcador navegable como fallback.
      map.classList.remove('is-enhanced', 'is-walking');
      map.classList.add('is-visible', 'is-complete');
      console.warn('[Delicias Urbanas] El mapa animado no pudo iniciarse:', error);
    });
})();
