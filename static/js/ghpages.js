(function() {
  'use strict';

  function buildMobileLayout() {
    var mobileColumn = document.getElementById('ghpages-mobile');
    if (!mobileColumn) return;

    var mobileColumnItems = Array.prototype.slice.call(
      document.querySelectorAll('[data-ghpages-mobile-order]')
    );
    mobileColumnItems.sort(function(firstItem, secondItem) {
      return (
        Number(secondItem.dataset.ghpagesMobileOrder) - Number(firstItem.dataset.ghpagesMobileOrder)
      );
    });
    mobileColumnItems.forEach(function(item) {
      var cloned = item.cloneNode(true);
      if (item.id) {
        cloned.id = item.id + '-mobile';
      }
      cloned.classList.add('ghpages-mobile__item');
      delete cloned.dataset.ghpagesMobileOrder;
      mobileColumn.insertAdjacentElement('afterbegin', cloned);
    });
  }

  function onReady() {
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
      document.removeEventListener('readystatechange', onReady);
      buildMobileLayout();
    } else {
      document.addEventListener('readystatechange', onReady);
    }
  }
  onReady();
})();
