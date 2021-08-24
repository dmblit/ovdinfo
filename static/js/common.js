/**
 * Кусок скрипта, использующегося на большинстве страниц https://*.ovdinfo.org/*
 */

(function ($) {
  // resize
  $(document).load($(window).bind("resize", resizer));
  function resizer() {
    if ($(window).width() < 940) {
      $('body').addClass('min-share');
    }
    else {
      $('body').removeClass('min-share');
    }
  }
  resizer();
}(jQuery));
