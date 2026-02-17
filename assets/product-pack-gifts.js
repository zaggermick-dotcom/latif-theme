(function () {
  const giftWrapper = document.querySelector('.pack-free-gifts__list');
  if (!giftWrapper) {
    console.info('pack-free-gifts: gift wrapper not present');
    return;
  }

  const productPackNode = document.querySelector('product-pack') || giftWrapper.closest('.pack-free-gifts');

  function readGiftCount(packIndex) {
    if (!productPackNode) return 0;
    const dsKey = productPackNode.dataset && productPackNode.dataset['giftCount' + packIndex];
    if (typeof dsKey !== 'undefined') {
      return parseInt(dsKey, 10) || 0;
    }
    const attrKey = productPackNode.getAttribute && productPackNode.getAttribute('data-gift-count-' + packIndex);
    return parseInt(attrKey || '0', 10) || 0;
  }

  function readDisplayBehavior() {
    if (!productPackNode) return 'placeholder_until_selected';
    return productPackNode.dataset && productPackNode.dataset.giftDisplayBehavior
      || productPackNode.getAttribute && productPackNode.getAttribute('data-gift-display-behavior')
      || 'placeholder_until_selected';
  }

  function cssVarMs(varName, fallbackMs) {
    const root = document.querySelector('.pack-free-gifts') || document.documentElement;
    const val = getComputedStyle(root).getPropertyValue(varName).trim() || '';
    if (!val) return fallbackMs;
    if (val.endsWith('ms')) return parseFloat(val.replace('ms', ''));
    if (val.endsWith('s')) return parseFloat(val.replace('s', '')) * 1000;
    const numeric = parseFloat(val);
    return isFinite(numeric) ? numeric : fallbackMs;
  }

  const popMs = () => cssVarMs('--paper-pop-duration', 1000);
  const hideMs = () => cssVarMs('--paper-hide-duration', 400);
  const staggerMs = () => cssVarMs('--paper-stagger-step', 120);

  function showForPack(index) {
    const behaviour = readDisplayBehavior();
    const count = readGiftCount(index);

    for (let i = 1; i <= 3; i++) {
      const el = giftWrapper.querySelector('.pack-free-gift[data-gift-index="' + i + '"]');
      if (!el) continue;

      const shouldBeVisible = i <= count;
      const isVisible = el.classList.contains('visible');

      if (shouldBeVisible && !isVisible) {
        el.classList.remove('paper-hide');
        el.classList.add('visible');

        const delay = (i - 1) * staggerMs();
        el.style.setProperty('--reveal-delay', `${delay}ms`);

        requestAnimationFrame(() => {
          el.classList.remove('paper-reveal');
          void el.offsetWidth;
          el.classList.add('paper-reveal');
          const cleanup = Math.round(popMs() + 200);
          setTimeout(() => {
            el.classList.remove('paper-reveal');
            el.style.removeProperty('--reveal-delay');
          }, cleanup);
        });

      } else if (!shouldBeVisible && isVisible) {
        el.classList.remove('paper-reveal');
        el.classList.add('paper-hide');

        const cleanup = Math.round(hideMs() + 200);
        setTimeout(() => {
          el.classList.remove('paper-hide', 'visible');
          el.style.removeProperty('--reveal-delay');
        }, cleanup);
      } else {
        el.classList.remove('paper-hide');
        el.classList.remove('paper-reveal');
        el.style.removeProperty('--reveal-delay');
      }
    }
  }

  function indexOfPackNode(packNode) {
    return Array.prototype.indexOf.call(packNode.parentElement.querySelectorAll('.pack'), packNode);
  }

  const packs = document.querySelectorAll('.pack__wrapper .pack');
  packs.forEach(pack => {
    pack.addEventListener('click', function () {
      const idx = typeof pack.dataset.packIndex !== 'undefined' ? parseInt(pack.dataset.packIndex, 10) : indexOfPackNode(pack);
      showForPack(idx);
    });

    const obs = new MutationObserver(muts => {
      muts.forEach(m => {
        if (m.attributeName !== 'class') return;
        if (pack.classList.contains('pack__selected')) {
          const idx = typeof pack.dataset.packIndex !== 'undefined' ? parseInt(pack.dataset.packIndex, 10) : indexOfPackNode(pack);
          showForPack(idx);
        }
      });
    });
    obs.observe(pack, { attributes: true });
  });


  (function init() {
    const sel = document.querySelector('.pack__wrapper .pack.pack__selected');
    if (sel) {
      const idx = typeof sel.dataset.packIndex !== 'undefined' ? parseInt(sel.dataset.packIndex, 10) : indexOfPackNode(sel);
      showForPack(idx);
    } else {
      const behaviour = readDisplayBehavior();
      if (behaviour === 'show_images_always') {
        showForPack(0);
      }
    }
  })();

})();
