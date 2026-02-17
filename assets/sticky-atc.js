// Sticky Add to Cart - Version corrigée
(function() {
  'use strict';
  
  let isInitialized = false;
  
  function handleScroll() {
    const atcButton = document.querySelector('.product-form__submit, .pack-conversion__button, [name="add"], .add-to-cart-button');
    const stickyAtc = document.querySelector('.sticky-atc, .sticky-add-to-cart');
    
    // Si les éléments n'existent pas, on arrête
    if (!atcButton || !stickyAtc) return;
    
    try {
      const rect = atcButton.getBoundingClientRect();
      
      if (rect.bottom < 0) {
        stickyAtc.classList.add('visible', 'active', 'show');
      } else {
        stickyAtc.classList.remove('visible', 'active', 'show');
      }
    } catch(e) {
      // Silently fail - element might not exist on this page
    }
  }

  function init() {
    if (isInitialized) return;
    
    const atcButton = document.querySelector('.product-form__submit, .pack-conversion__button, [name="add"], .add-to-cart-button');
    
    // Ne pas initialiser si le bouton n'existe pas sur cette page
    if (!atcButton) return;
    
    isInitialized = true;
    
    // Utiliser passive: true pour de meilleures performances
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Premier check
    handleScroll();
  }

  // Initialisation sécurisée
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(init, 500);
    });
  } else {
    setTimeout(init, 500);
  }
})();
