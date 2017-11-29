$(document).ready(function(){

  //////////
  // Global variables
  //////////

  var _window = $(window);
  var _document = $(document);

  function isRetinaDisplay() {
    if (window.matchMedia) {
        var mq = window.matchMedia("only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen  and (min-device-pixel-ratio: 1.3), only screen and (min-resolution: 1.3dppx)");
        return (mq && mq.matches || (window.devicePixelRatio > 1));
    }
  }

  var _mobileDevice = isMobile();
  // detect mobile devices
  function isMobile(){
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      return true
    } else {
      return false
    }
  }

  function msieversion() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
      return true
    } else {
      return false
    }
  }

  if ( msieversion() ){
    $('body').addClass('is-ie');
  }

  //////////
  // COMMON
  //////////

  // svg support for laggy browsers
  svg4everybody();

  // Viewport units buggyfill
  // window.viewportUnitsBuggyfill.init({
  //   force: true,
  //   hacks: window.viewportUnitsBuggyfillHacks,
  //   refreshDebounceWait: 250,
  //   appendToBody: true
  // });


 	// Prevent # behavior
	$('[href="#"]').click(function(e) {
		e.preventDefault();
	});

	// Smoth scroll
	$('a[href^="#section"]').click( function() {
        var el = $(this).attr('href');
        $('body, html').animate({
            scrollTop: $(el).offset().top}, 1000);
        return false;
	});

  // HAMBURGER TOGGLER
  $('.hamburger').on('click', function(){
    $('.hamburger').toggleClass('active');
    $('.mobile-navi').toggleClass('active');
  });


  //////////
  // HORIZONTAL SCROLLER
  //////////

  if( $('.homepage').length > 0 ){
    initHomeScroll();
  }

  function initHomeScroll(){
    $.jInvertScroll([
      '.scroll'
    ], {
    	width: 'auto',	// Page width (auto or int value)
    	height: 'auto',	// Page height (the shorter, the faster the scroll)
    	onScroll: function(percent) {
        // get back multiplier
        var sPercent = percent * 2;

        // get sections
        var totalSections = $('.stage-background img').length;
        var currentSection = Math.ceil(sPercent * totalSections)

        setStagePhoto(currentSection);
  	   }
    });
  }

  function setStagePhoto(num){
    $('.stage-photos__wrapper').find('img:nth-child('+num+')').addClass('is-active').siblings().removeClass('is-active');
  }



  //////////
  // STAGE NAV
  //////////
  $('[js-stage-nav]').on('click', 'li', function(e){
    var section = $(this).data('stage');

    if ( section ){

      var totalSections = $('.stage-background img').length;

      $('body, html').animate({
          scrollTop: _document.height() / section }, 1000);

      // set class
      $(this).siblings().removeClass('is-active');
      $(this).addClass('is-active');
    }

    e.preventDefault();

  })

  //////////
  // GALLERY
  //////////
  $().fancybox({
    selector : '[js-fancybox] > span',
    loop     : true,
    infobar  : false,
    protect  : true,
    buttons : [
      // 'slideShow',
      // 'fullScreen',
      // 'thumbs',
      // 'share',
      //'download',
      //'zoom',
      'close'
    ],
    image : {
      // Wait for images to load before displaying
      // Requires predefined image dimensions
      // If 'auto' - will zoom in thumbnail if 'width' and 'height' attributes are found
      preload : "auto"
    },
    // Transition effect between slides
    //
    // Possible values:
    //   false            - disable
    //   "fade'
    //   "slide'
    //   "circular'
    //   "tube'
    //   "zoom-in-out'
    //   "rotate'
    //
    transitionEffect : "zoom-in-out",
    thumbs   : {
      autoStart : true
    },
    btnTpl : {

        close : '<button data-fancybox-close class="fancybox-button fancybox-button--close" title="{{CLOSE}}">' +
                    '<i class="icon icon-gallery-close"></i>' +
                '</button>',

        // Arrows
        arrowLeft : '<button data-fancybox-prev class="fancybox-button fancybox-button--arrow_left" title="{{PREV}}">' +
                        '<i class="icon icon-gallery-left"></i>' +
                      '</button>',

        arrowRight : '<button data-fancybox-next class="fancybox-button fancybox-button--arrow_right" title="{{NEXT}}">' +
                      '<i class="icon icon-gallery-right"></i>' +
                    '</button>'
    },

  });

  // TRIGGER WITH TRANSPARENT BG CLICK THROUG
  var ctx = document.createElement("canvas").getContext("2d");

  $('[js-png-clickthrough]').on("mousedown", function(event) {

    // Get click coordinates
    var x = event.pageX - this.offsetLeft,
        y = event.offsetY - this.offsetTop,
        w = ctx.canvas.width = this.width,
        h = ctx.canvas.height = this.height,
        alpha;

    // Draw image to canvas
    // and read Alpha channel value
    ctx.drawImage(this, 0, 0, w, h);
    alpha = ctx.getImageData(x, y, 1, 1).data[3]; // [0]R [1]G [2]B [3]A

    // If pixel is transparent,
    // retrieve the element underneath and trigger it's click event
    if( alpha===0 ) {
      $(this).hide();
      $(document.elementFromPoint(event.clientX, event.clientY)).trigger("click");
      $(this).show();
    } else {
      var galleryId = $(this).data('for-gallery');

      if ( galleryId ){
        $('[data-gallery="'+galleryId+'"]').find('span').first().click()
      }
    }
  });

  $('[js-png-hover]').on("mousemove", throttle(function(event) {
    // Get click coordinates
    var x = event.pageX - this.offsetLeft,
        y = event.offsetY - this.offsetTop,
        w = ctx.canvas.width = this.width,
        h = ctx.canvas.height = this.height,
        alpha;

    // Draw image to canvas
    // and read Alpha channel value
    ctx.drawImage(this, 0, 0, w, h);
    alpha = ctx.getImageData(x, y, 1, 1).data[3]; // [0]R [1]G [2]B [3]A

    // If pixel is transparent,
    // retrieve the element underneath and trigger it's click event
    if( alpha===0 ) {
      $(this).removeClass('is-hovered');

    } else {
      $(this).addClass('is-hovered')
    }
  }, 100));

  //////////
  // BARBA PJAX
  //////////

  Barba.Pjax.Dom.containerClass = "page";

  var FadeTransition = Barba.BaseTransition.extend({
    start: function() {
      Promise
        .all([this.newContainerLoading, this.fadeOut()])
        .then(this.fadeIn.bind(this));
    },

    fadeOut: function() {
      return $(this.oldContainer).animate({ opacity: .5 }, 200).promise();
    },

    fadeIn: function() {
      var _this = this;
      var $el = $(this.newContainer);

      $(this.oldContainer).hide();

      $el.css({
        visibility : 'visible',
        opacity : .5
      });

      $el.animate({ opacity: 1 }, 200, function() {
        document.body.scrollTop = 0;
        _this.done();
      });
    }
  });

  Barba.Pjax.getTransition = function() {
    return FadeTransition;
  };

  Barba.Prefetch.init();
  Barba.Pjax.start();

  Barba.Dispatcher.on('newPageReady', function(currentStatus, oldStatus, container, newPageRawHTML) {
    // console.log(oldStatus.url.split("/").pop())
    // if ( oldStatus.url.split("/").pop() !== "homepage.html" ){
    //   $('body').css('height', 'auto')
    // } else {
    //   initHomeScroll();
    // }

    if ( $(container).not('.homepage').length > 0 ) {
      $('body').css('height', 'auto')
    }
  });


});
