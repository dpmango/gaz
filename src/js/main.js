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
  $('[js-hamburger]').on('click', function(){
    $(this).toggleClass('is-active');
    $('.mobile-navi').toggleClass('is-active');
  });


  //////////
  // HORIZONTAL SCROLLER
  // with slick carousel
  //////////

  if( $('.homepage').length > 0 ){
    initSlick();
    listenScroll();

    _window.on('resize', debounce(listenScroll, 300))
  }

  var slickEl;

  function initSlick(){
    slickEl = $('[js-main-slider]');

    var slickOptions = {
      autoplay: false,
      accessibility: false,
      dots: false,
      arrows: false,
      infinite: false,
      speed: 1000,
      useCSS: true,
      cssEase: 'ease',
      slidesToShow: 1,
      adaptiveHeight: true
    }

    slickEl.slick(slickOptions);

    slickEl.on('beforeChange', function(event, slick, currentSlide, nextSlide){
      var nextSlideIndex = nextSlide + 1;

      // update states
      $('[js-stage-global]').attr('data-stage', nextSlideIndex);
      $('[js-stage-nav]').attr('data-stage', nextSlideIndex);
      setStageNav( nextSlideIndex );
      setStagePhoto(nextSlideIndex);
    });


  }

  //////////
  // STAGE NAV
  //////////

  function setStagePhoto(num){
    $('.stage-photos__wrapper').find('img:nth-child('+num+')').addClass('is-active').siblings().removeClass('is-active');
  }

  // click handler
  $('[js-stage-nav]').on('click', 'li', function(e){
    // navigate slick
    var section = $(this).data('stage');
    slickEl.slick("slickGoTo", section - 1)

    e.preventDefault();
  });

  function setStageNav(num){
    var el = $('[js-stage-nav] li[data-stage='+num+']')
    var section = el.data('stage');

    if ( section ){
      // set class
      el.siblings().removeClass('is-active');
      el.addClass('is-active');
    }
  }

  //////////
  // CUSTOM SCROLL FUNCTIONS
  //////////
  function listenScroll(){
    var scrollListener

    if ( _window.width() > 800 ){
      scrollListener = debounce(function(e){
        var delta = e.originalEvent.deltaY
        if ( delta > 0 ){
          slickEl.slick("slickNext")
        } else if ( delta < 0 ){
          slickEl.slick("slickPrev")
        }
      }, 300, {
        'leading': true
      });

      _window.on('wheel', scrollListener);
    } else {
      _window.off('wheel', scrollListener);
    }
  }




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


  //////////
  // PNG + CANVAS FUNCTIONS
  //////////

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

  // mobile toggler
  $('[js-start-gallery]').on('click', function(e){
    var galleryId = $(this).data('for-gallery');

    if ( galleryId ){
      $('[data-gallery="'+galleryId+'"]').find('span').first().click()
    }
  })

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


  // stage car click handler
  $('.stage-car').on('click', function(e){
    if ( $(e.target).is('img') ){

    } else {
      e.preventDefault();
      e.stopPropagation();
    }

  });


});
