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
    var pageUrl = new URL(window.location);

    function getPatchedURL(urlStr) {
      var url = new URL(urlStr);
      // пропускаем ссылки на другие домены и на подзаголовки внутри самой страницы
      if (url.origin !== pageUrl.origin || url.pathname === pageUrl.pathname) {
        return url;
      }
      if (!/^\/ovdinfo/.test(url.pathname)) {
        url.pathname = '/ovdinfo' + url.pathname;
      }
      return url;
    }

    var img = new Image();
    var src = '/static/img/favicon.ico';
    // предположим, что ошибка значит, что сайт не в корне домена
    img.onerror = function() {
      document.querySelectorAll('a, link').forEach(function(link) {
        var patched = getPatchedURL(link.href);
        if (String(patched) !== link.href) {
          link.href = patched;
        }
      });
      document.querySelectorAll('img').forEach(function(img) {
        img.src = getPatchedURL(img.src);
      });
      document.querySelectorAll('[style]').forEach(function(node) {
        var bgImg = getComputedStyle(node).backgroundImage.replace('url("', '').replace('")', '');
        if (bgImg === 'none') return;
        node.style.backgroundImage = 'url("' + getPatchedURL(bgImg) + '")';
      });
      document.querySelectorAll('script').forEach(function(script) {
        if (!script.src || /\/ghpages\.js$/.test(script.src)) {
          return;
        }
        var clone = document.createElement('script');
        clone.src = getPatchedURL(script.src);
        script.insertAdjacentElement('afterend', clone);
      });
    };
    img.src = src;
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
