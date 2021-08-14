(function ($) {

  $.fn.autoMenu = function (settings) {
    settings = $.extend({ // this defines the defaults
      startDepth: 2, // starting level param
      endDepth: 4, // ending level param
      scanLocation: "#content", // scan location param
      ignoreLocation: "#page-outline", // ignore location param
      offset: 40 // how much further to scroll down past the header
    }, settings);
    var result = $('<div/>');
    var curDepth = 0;

    var arr = [];


    var startDepth = settings.startDepth;
    var endDepth = settings.endDepth; // where you want the depth to end
    var first = false
    $(settings.scanLocation).find('h1,h2,h3,h4,h5,h6').each(function () {
      //creates a li element, containing a link via slug to the current header
      // the depth you want to start at
      var depth = parseInt(this.tagName.substring(1)); // looks at the number of the heading tag
      if (startDepth <= depth && depth <= endDepth) {
        if ($(this).closest(settings.ignoreLocation).length == 0) {
          if (depth - startDepth + 1 > arr.length) { // going deeper
            while (depth - startDepth + 1 > arr.length) {
              result.append($('<ul/>'));
              result = result.children('ul');
              arr.push(1);
            }
          }
          else if (depth - startDepth + 1 < arr.length) { // going shallower
            while (depth - startDepth + 1 < arr.length) {
              result = result.parents('ul:first');
              arr.pop()
            }
            result = result.parents('ul:first');
            arr[arr.length - 1] = arr[arr.length - 1] + 1
          }
          else { // same level
            result = result.parent()
            arr[arr.length - 1] = arr[arr.length - 1] + 1
          }

          var slug = arr.join('-')

          $(this).attr('id', slug); // anchoring
          var li = $('<li/>').html($('<a/>', {
            href: '#' + slug,
            text: $(this).text()
          }));
          result.append(li); // if stepping down into another list, create it, and add the li to it
          result = li; // the new result is the li we just appended to the unordered list
        }
      }
    }); // end list building function
    result = result.parents('ul:last'); // gather the list
    result.find('li').has('ul').each(function () {
      $(this).addClass('has-children')
      var txt = $(this).children('a').text();
      /*var gr = "group-"+$(this).children('a').attr("href").substr(1)
      $(this).children('a').remove()

      $(this).prepend($('<label/>', {for: gr, name: gr, id: gr}).text(txt))
      $(this).prepend($('<input/>', {type: 'checkbox', name: gr, id: gr}))*/
    });
    result.addClass("cd-accordion-menu")
    result.addClass("animated")
    $(this).append(result); // append to desired location
  }

  // menu class active //
  if ($($("#main").children(":first"))[0].tagName.toLowerCase() != 'h2' && $('#main>h2, #main>.field-name-body>h2').length > 0) {
    var regex = /[а-яА-Я ]/g
    var txt = $($('#main>h2, #main>.field-name-body>h2')[0]).text()
    if ([...txt.matchAll(regex)].length > txt.length / 3) {
      $("#main").prepend('<h2 style="visibility:hidden">В начало</h2>')
    }
    else {
      $("#main").prepend('<h2 style="visibility:hidden">To beginning</h2>')
    }
  }
  $("#menu").autoMenu({
    startDepth: 2,
    endDepth: $("#menu").data("depth"),
    scanLocation: "#main"
  });

  $('a[href*="#"]').not('[href="#"]').click(function (event) {
    if ($(this).attr("href").substr(0, 1) != "#") {
      return;
    }
    event.stopPropagation();
    event.preventDefault();
    var target = $(this.hash);
    // Does a scroll target exist?
    if (target.length) {
      // Only prevent default if animation is actually gonna happen
      //event.preventDefault();
      scrollAllow = false
      var a = $('#menu li>a[href=#' + target.attr("id") + ']')
      if (a.length) {
        changeMenuItem(a)
      }
      $('html, body').stop(true).animate({
        scrollTop: target.offset().top - 42
      }, 500, function () {
        scrollAllow = true
      });
    }
  });

  var anchors_by_buts = [];
  $('#menu li>a').each(function () {
    anchors_by_buts.push($(this.hash));
  });


  // stycky //


  // Get the navbar
  var navbar = document.getElementById("sidebar");
  var main = document.getElementById("main");
  var sharebutt = document.getElementById("share-butt");

  // When the user scrolls the page, execute myFunction
  $(window).scroll(onScrollFunc);

  function changeMenuItem(a) {
    $('#menu li>a').removeClass("active");
    a.addClass("active")
    a.parents('li.has-children').not(':has(a.open)').children('ul').attr('style', 'display:none;').slideDown(300)
    a.parents('li.has-children').children('a').not('.open').addClass('open')

    $('#menu').find('li.has-children').not(a.parents()).has('a.open').children('ul').attr('style', 'display:block;').slideUp(300)
    $('#menu').find('li.has-children').not(a.parents()).children('a.open').removeClass('open')
    var hash = a.attr("href");
    var id = hash.substr(1)
    var target = $(hash);
    target.removeAttr('id');
    location.hash = hash;
    target.attr('id', id);
  }

  // Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
  var scrollAllow = true

  function onScrollFunc() {
    /*if (window.pageYOffset >= start) {
          navbar.classList.add("sticky");
        } else {
          navbar.classList.remove("sticky");
      }*/

    if (scrollAllow) {
      var st = $('html').scrollTop()
      var removeMenu = true
      for (var i = anchors_by_buts.length - 1; i >= 0; i--) {
        target = anchors_by_buts[i]
        if (st >= target.offset().top - 43) {
          var a = $('#menu li>a[href=#' + target.attr("id") + ']')
          changeMenuItem(a)
          removeMenu = false
          break
        }
      }
      if (removeMenu) {
        navbar.classList.remove("sticky");
      }
      else {
        navbar.classList.add("sticky");
      }
    }
  }

  // pragressbar page */

  $("body").prognroll({
    height: 5, //Progress bar height
    color: "#f04e23", //Progress bar background color
    custom: false //If you make it true, you can add your custom div and see it's scroll progress on the page
  });

  // Sticky Header
  $(window).scroll(function () {
    var st = $(window).scrollTop();
    /*if($('body').hasClass('sticky-header')){
        st +=85;
    }*/
    if (st > 100) {
      $('body').addClass('sticky-header');
    }
    else {
      $('body').removeClass('sticky-header');
    }
  });

  // Sticky Header
  /*$(window).scroll(function () {
    if ($(window).scrollTop() > 500) {
      $('#donate').removeClass('hide');
    }
    else {
      $('#donate').addClass('hide');
    }
  });*/

  // Mobile Navigation
  $('.mobile-toggle').click(function () {
    if ($('#header').hasClass('open-nav')) {
      $('#header').removeClass('open-nav');
    }
    else {
      $('#header').addClass('open-nav');
    }
  });

  $('#header li a').click(function () {
    if ($('#header').hasClass('open-nav')) {
      $('.navigation').removeClass('open-nav');
      $('#header').removeClass('open-nav');
    }
  });

  function showShareButt(el) {
    if (!el.hasClass("active")) {
      $(".social-likes").removeClass("active");
      $("#share-link").addClass("icon-cancel");
      $("#share-link").removeClass("icon-share");

      el.addClass("active");
    }
  }

  function hideShareButt(el) {
    if (el.hasClass("active")) {
      $(".social-likes").addClass("active");

      $("#share-link").addClass("icon-share");
      $("#share-link").removeClass("icon-cancel");
      el.removeClass("active");
    }
  }

  $("#share-link").on("click", function (e) {
    e.stopPropagation();
    if ($(".social-likes").hasClass("active")) {
      hideShareButt($(".social-likes"));
    }
    else {
      showShareButt($(".social-likes"));
    }
  });

  /* left bar */

  $("#burger").on("click", function (e) {
    e.stopPropagation();
    $("#sidebar").toggleClass("activeN");
  });

  $("body").on("click", function (e) {
    if (!$(e.target).parents('#sidebar').length && $("#sidebar").hasClass("activeN")) {
      $("#burger").trigger("click");
    }
  })


  $('body').on('click', '.modal-quotation, b[data-text]', function (e) {
    var text = $(this).data('text');
    if (!text) {
      text = ''
    }
    text = text.replace(/(?:\r\n|\r|\n){2,}/g, '</p><p>');
    text = text.replace(/(?:\r\n|\r|\n)/g, '<br />');
    var cite = $(this).data('cite');
    var href = $(this).data('href');
    if (cite) {
      if (href) {
        cite = '<a href="' + href + '" target="_blank">' + cite + '</a>'
      }
      cite = '<cite>' + cite + '</cite>'
    }
    else {
      cite = ''
      if (href) {
        text = '<a href="' + href + '" target="_blank">' + text + '</a>'
      }
    }

    var c = $('<div class="box-modal" />');
    var txt = '<blockquote>' + cite + '<p>' + text + '</p></blockquote>'
    c.append(txt);
    c.prepend('<div class="box-modal_close arcticmodal-close">X</div>');
    $.arcticmodal({
      content: c
    });
  });

  $('body').on('click', '.button-modal', function (e) {
    var id = $(this).data('target');
    $('#' + id).arcticmodal();
  });

  if (location.hash) {
    setTimeout(function () {
      var but = $('#menu li>a[href=' + location.hash + ']');
      if (but.length) {
        //but.trigger("click");
        $('html, body').scrollTop($(location.hash).offset().top - 42);
      }
    }, 1);
  }
})(jQuery);

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
