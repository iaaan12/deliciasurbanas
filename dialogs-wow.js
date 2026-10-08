/* Microinteracciones para los paneles de Delicias Urbanas.
 * app.js conserva cantidades, validaciones, precios, estados y WhatsApp.
 */
(() => {
  const dialogs = [...document.querySelectorAll(
    '[data-cart-dialog], [data-orders-dialog], [data-customize-dialog], [data-checkout-dialog], [data-success-dialog]'
  )];
  if (!dialogs.length) return;
  const customization = document.querySelector('[data-customize-dialog]');
  const customizeBody = document.querySelector('[data-customize-body]');
  const customizeSubmit = customization?.querySelector('[type="submit"]');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  let refreshFrame = 0;

  function syncCustomization() {
    refreshFrame = 0;
    if (!customization || !customizeBody) return;
    const groups = [...customizeBody.querySelectorAll('[data-custom-group]')];
    if (!groups.length) { customizeSubmit?.classList.remove('du-ready'); return; }
    let complete = true;
    for (const group of groups) {
      const inputs = [...group.querySelectorAll('input[data-choice-group]')];
      let groupIsDone;
      if (inputs.length) groupIsDone = inputs.some(input => input.checked);
      else {
        const counts = group.querySelectorAll('[data-custom-count]');
        // app.js muestra «Listo» únicamente al alcanzar el total exacto.
        const label = group.querySelector('[data-group-total] span');
        groupIsDone = Boolean(counts.length && label?.textContent.trim() === 'Listo');
      }
      group.classList.toggle('du-completed', groupIsDone);
      if (!groupIsDone) complete = false;
    }
    customizeSubmit?.classList.toggle('du-ready', complete);
  }
  function scheduleCustomization() {
    if (!refreshFrame) refreshFrame = requestAnimationFrame(syncCustomization);
  }
  if (customizeBody) {
    const observer = new MutationObserver(scheduleCustomization);
    observer.observe(customizeBody, {childList:true,subtree:true,characterData:true});
    customizeBody.addEventListener('change', scheduleCustomization);
    customizeBody.addEventListener('click', event => {
      if (event.target.closest('[data-custom-qty]')) scheduleCustomization();
    });
    syncCustomization();
  }

  // Delegación para tickets regenerados dinámicamente.
  if (finePointer.matches && !reduced.matches) {
    document.addEventListener('pointermove', event => {
      if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
      const card = event.target.closest('.orders-dialog .order-card, .cart-drawer .cart-item');
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--du-dialog-x', Math.round(event.clientX - rect.left) + 'px');
      card.style.setProperty('--du-dialog-y', Math.round(event.clientY - rect.top) + 'px');
    }, {passive:true});
  }

  for (const dialog of dialogs) {
    dialog.addEventListener('close', () => {
      if (dialog === customization) customizeSubmit?.classList.remove('du-ready');
      const scroller = dialog.querySelector('.drawer-content,.customize-body,.checkout-layout');
      if (scroller) scroller.scrollTop = 0;
    });
  }
})();
