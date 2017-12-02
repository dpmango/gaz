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
  $(document)
  	.on('click', '[href="#"]', function(e) {
  		e.preventDefault();
  	})

    // HAMBURGER TOGGLER
    .on('click', '[js-hamburger]', function(){
      $(this).toggleClass('is-active');
      $('.mobile-navi').toggleClass('is-active');
    });


  //////////
  // TRIGGERED EACH TIME PJAX DONE
  //////////

  function pageReady(){
    if( $(document).find('.homepage').length > 0 ){
      initSlick();
      listenScroll();
      initFancybox();

      _window.on('resize', debounce(listenScroll, 300))
    }
  }

  pageReady();



  //////////
  // HORIZONTAL SCROLLER
  // with slick carousel
  //////////
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
      adaptiveHeight: false,
      draggable: false,
      swipe: false,
      touchMove: false,
      responsive: [
        {
          breakpoint: 800,
          settings: {
            speed: 500,
            draggable: true,
            swipe: true,
            touchMove: true,
          }
        }
      ]
    }

    slickEl.slick(slickOptions);
    // .slick('slickFilter', '  .stage-slide');

    slickEl.on('beforeChange', function(event, slick, currentSlide, nextSlide){
      var nextSlideIndex = nextSlide + 1;

      // update states
      $('[js-stage-global]').attr('data-stage', nextSlideIndex);
      $('[js-stage-nav]').attr('data-stage', nextSlideIndex);
      setStageNav( nextSlideIndex );
      setStagePhoto(nextSlideIndex);

      // histoy API
      window.location.hash = '#section-'+ nextSlideIndex;

    });

    if ( window.location.hash ){
      slickEl.slick("slickGoTo", window.location.hash.split('-')[1] - 1)
    }

  }

  //////////
  // STAGE NAV
  //////////

  function setStagePhoto(num){
    $('.stage-photos__wrapper').find('img:nth-child('+num+')').addClass('is-active').siblings().removeClass('is-active');
  }

  // click handler
  $(document).on('click', '[js-stage-nav] li', function(e){
    // navigate slick
    var section = $(this).data('stage');

    if( $(document).find('.homepage').length > 0 ){
      slickEl.slick("slickGoTo", section - 1)
    } else {
      window.location.href = "/#section-" + section + ""
    }
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
  function initFancybox(){
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
      transitionEffect : "slide",
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

  }

  //////////
  // PNG + CANVAS FUNCTIONS
  //////////

  // TRIGGER WITH TRANSPARENT BG CLICK THROUG
  var ctx = document.createElement("canvas").getContext("2d");

  $(document).on("mousedown", '[js-png-clickthrough]', function(event) {

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
  $(document).on('click', '[js-start-gallery]', function(e){
    var galleryId = $(this).data('for-gallery');

    if ( galleryId ){
      $('[data-gallery="'+galleryId+'"]').find('span').first().click()
    }
  })

  $(document).on("mousemove", '[js-png-hover]', throttle(function(event) {
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
  $(document).on('click', '.stage-car', function(e){
    if ( $(e.target).is('img') ){

    } else {
      e.preventDefault();
      e.stopPropagation();
    }

  });


  //////////
  // ANIMATE
  //////////
  // anime({
  //   targets: '.stage-car .wheel_1, .stage-car .wheel_2',
  //   // translateX: [
  //   //   { value: 100, duration: 1200 },
  //   //   { value: 0, duration: 800 }
  //   // ],
  //   rotate: '1turn',
  //   duration: 4000,
  //   loop: true
  // });

  //////////
  // TELEPORT PLUGIN
  //////////

  $('[js-teleport]').each(function(i, val) {
    var self = $(val)
    var objHtml = $(val).html();
    var target = $('[data-teleport-target=' + $(val).data('teleport-to') + ']');
    var conditionMedia = $(val).data('teleport-condition').substring(1);
    var conditionPosition = $(val).data('teleport-condition').substring(0, 1);

    if (target && objHtml && conditionPosition) {
      _window.resized(100, function() {
        teleport()
      })

      function teleport() {
        var condition;

        if (conditionPosition === "<") {
          condition = _window.width() < conditionMedia;
        } else if (conditionPosition === ">") {
          condition = _window.width() > conditionMedia;
        }

        if (condition) {
          target.html(objHtml)
          self.html('')
        } else {
          self.html(objHtml)
          target.html("")
        }

      }

      teleport();
    }
  })

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

    pageReady();

    // close mobile menu
    if ( _window.width() < 800 ){
      $('[js-hamburger]').toggleClass('is-active');
      $('.mobile-navi').toggleClass('is-active');
    }
  });


});



// GLOBAL WINDOW FUNCTIONS
var svgNS = "http://www.w3.org/2000/svg";
window.Custom = {}; // global obj

Custom.initSvg = function(evt){
  var svgDoc, svgEl;
  if ( window.svgDocument == null )
  {
    svgDoc = evt.target.ownerDocument;
    svgEl = evt.target;
  }
  addRotateTransform(svgDoc, svgEl, 'wheel_1', 4, 1);
  addRotateTransform(svgDoc, svgEl, 'wheel_2', 4, 1);
}

function addRotateTransform(target_doc, target_el, target_class, dur, dir){
  var my_element = target_el.getElementsByClassName(target_class)[0];
  var a = target_doc.createElementNS(svgNS, "animateTransform");

  var bb = my_element.getBBox();
  var cx = bb.x + bb.width/2;
  var cy = bb.y + bb.height/2;

  a.setAttributeNS(null, "attributeName", "transform");
  a.setAttributeNS(null, "attributeType", "XML");
  a.setAttributeNS(null, "type", "rotate");
  a.setAttributeNS(null, "dur", dur + "s");
  a.setAttributeNS(null, "repeatCount", "indefinite");
  a.setAttributeNS(null, "from", "0 "+cx+" "+cy);
  a.setAttributeNS(null, "to", 360*dir+" "+cx+" "+cy);

  my_element.appendChild(a);
  a.beginElement();
}
