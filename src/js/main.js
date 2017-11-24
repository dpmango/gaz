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

  $.jInvertScroll([
    '.scroll'
  ], {
  	width: 'auto',	// Page width (auto or int value)
  	height: 'auto',	// Page height (the shorter, the faster the scroll)
  	onScroll: function(percent) {
  		// Callback function that will be called each time the user
  		// scrolls up or down, useful for animating other parts
  		// on the page depending on how far the user has scrolled down
  		// values go from 0.0 to 1.0 (with 4 decimals precision)
	   }
  });



  //////////
  // STAGE NAV
  //////////
  $('[js-stage-nav]').on('click', 'li', function(e){
    var section = $(this).data('stage');

    if ( section ){
      // do scrolling?
      //

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
        y = event.pageY - this.offsetTop,
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


  //////////
  // MODALS
  //////////

  // Magnific Popup
  // var startWindowScroll = 0;
  $('.js-popup').magnificPopup({
    type: 'inline',
    fixedContentPos: true,
    fixedBgPos: true,
    overflowY: 'auto',
    closeBtnInside: true,
    preloader: false,
    midClick: true,
    removalDelay: 300,
    mainClass: 'popup-buble',
    callbacks: {
      beforeOpen: function() {
        // startWindowScroll = _window.scrollTop();
        // $('html').addClass('mfp-helper');
      },
      close: function() {
        // $('html').removeClass('mfp-helper');
        // _window.scrollTop(startWindowScroll);
      }
    }
  });

  // $('.popup-gallery').magnificPopup({
	// 	delegate: 'a',
	// 	type: 'image',
	// 	tLoading: 'Loading image #%curr%...',
	// 	mainClass: 'mfp-img-mobile',
	// 	gallery: {
	// 		enabled: true,
	// 		navigateByImgClick: true,
	// 		preload: [0,1]
	// 	},
	// 	image: {
	// 		tError: '<a href="%url%">The image #%curr%</a> could not be loaded.'
	// 	}
	// });


});
