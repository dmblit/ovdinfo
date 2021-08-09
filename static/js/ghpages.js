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

  // подправляет адреса/ссылки в HTML, если вдруг сайт находится не в корне домена
  // (some-user.github.io/ovdinfo вместо ovdinfo.github.io)
  function patchSiteRoot() {
    var rootUrl = new URL(window.location);
    if (rootUrl.hostname === 'localhost') return;

    function getPatchedURL(urlStr) {
      var url = new URL(urlStr);
      if (url.origin !== rootUrl.origin) return url;
      if (!/ovdinfo/.test(url.host) && !/^\/ovdinfo/.test(url.pathname)) {
        url.pathname = '/ovdinfo' + url.pathname;
      }
      return url;
    }
    document.querySelectorAll('a').forEach(function(link) {
      link.href = getPatchedURL(link.href);
    });
    document.querySelectorAll('img').forEach(function(img) {
      img.src = getPatchedURL(img.src);
    });
    document.querySelectorAll('[style]').forEach(function(node) {
      var bgImg = getComputedStyle(node).backgroundImage.replace('url("', '').replace('")', '');
      if (bgImg === 'none') return;
      node.style.backgroundImage = 'url("' + getPatchedURL(bgImg) + '")';
    });
  }

  function onReady() {
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
      document.removeEventListener('readystatechange', onReady);
      buildMobileLayout();
      patchSiteRoot();
    } else {
      document.addEventListener('readystatechange', onReady);
    }
  }
  onReady();
})();
