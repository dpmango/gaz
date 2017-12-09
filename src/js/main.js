$(document).ready(function(){

  //////////
  // Global variables
  //////////

  var _window = $(window);
  var _document = $(document);

  var settings;

  function setSettings(){
    settings = {
      slickDelay: 500,
      tablet: 1023
    }
    if ( _window.width() < settings.tablet ){
      settings.slickDelay = 0;
    }
  }

  setSettings();
  _window.on('resize', debounce(setTimeout, 300));

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
      $('body').toggleClass('is-fixed');
      $('.mobile-navi').toggleClass('is-active');
    });

  function closeMobileMenu(){
    // close mobile menu
    if ( _window.width() < settings.tablet ){
      $('[js-hamburger]').removeClass('is-active');
      $('body').removeClass('is-fixed');
      $('.mobile-navi').removeClass('is-active');
    }
  }

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
      speed: 500,
      fade: true,
      useCSS: true,
      cssEase: 'ease',
      slidesToShow: 1,
      adaptiveHeight: false,
      draggable: false,
      swipe: false,
      touchMove: false,
      responsive: [
        {
          breakpoint: settings.tablet,
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
      $('.mobile-navi__menu li:nth-child('+nextSlideIndex+')').addClass('is-current').siblings().removeClass('is-current')
      setStageNav( nextSlideIndex );
      setStagePhoto(nextSlideIndex);

      // histoy API
      window.location.hash = '#section-'+ nextSlideIndex;

      // close mobile menu
      closeMobileMenu();

    });

    if ( window.location.hash ){
      slickEl.slick("slickGoTo", window.location.hash.split('-')[1] - 1)
    }

  }

  function navSlick(id){
    var currentSlide = $('[js-main-slider]').find('.slick-active');
    currentSlide.addClass('slick-removing');
    setTimeout(function(){
      slickEl.slick("slickGoTo", id - 1);
      currentSlide.removeClass('slick-removing')
    }, settings.slickDelay)
  }

  function navSlickPrevNext(direction){
    var currentSlide = $('[js-main-slider]').find('.slick-active');
    currentSlide.addClass('slick-removing');
    setTimeout(function(){
      if ( direction == "next" ){
        slickEl.slick("slickNext")
      } else if (  direction == "prev" ) {
        slickEl.slick("slickPrev")
      }
      currentSlide.removeClass('slick-removing')
    }, settings.slickDelay)
  }

  $(document)
    .on('click', '[js-slick-prev]', function(e){
      navSlickPrevNext("prev")
      e.preventDefault();
    })
    .on('click', '[js-slick-next]', function(e){
      navSlickPrevNext("next")
      e.preventDefault();
    })

  //////////
  // STAGE NAV
  //////////

  function setStagePhoto(num){
    $('.stage-photos__wrapper').find('img:nth-child('+num+')').addClass('is-active').siblings().removeClass('is-active');
  }

  function navClickSection(section){
    if ( section ){
      if( $(document).find('.homepage').length > 0 ){
        navSlick(section);
      } else {
        window.location.href = "/#section-" + section + ""
      }
    }
  }

  // click handler
  $(document)
    .on('click', '[js-stage-nav] li', function(e){
      // navigate slick
      var section = $(this).data('stage');
      navClickSection(section)
      e.preventDefault();
    })
    .on('click', '.mobile-navi__menu li', function(e){
      // navigate slick
      var section = $(this).data('stage');
      navClickSection(section)
      e.preventDefault();
    })

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

    if ( _window.width() > settings.tablet ){
      scrollListener = debounce(function(e){
        var scrollAvailable = false;
        var delta = e.originalEvent.deltaY

        if ( $('.mfp-ajax-holder').length == 0 ){
          if ( _window.height() >= _document.height() ){
            scrollAvailable = true;
          } else {
            var scrollBottomCond = _window.scrollTop() + _window.height() > _document.height() - 40;
            if ( scrollBottomCond && delta > 0 ){
              scrollAvailable = true;
            }
          }
        }

        if ( scrollAvailable && delta > 0 ){
          navSlickPrevNext("next");
        } else if ( scrollAvailable && delta < 0 ){
          navSlickPrevNext("prev");
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
  // FIT TEXT
  //////////

  function initFitText(){
    if ( _window.width() < settings.tablet ){
      $("[js-fit-text]").fitText(1, { minFontSize: '20px', maxFontSize: '67px' });
    }
  }

  initFitText()
  _window.on('resize', debounce(initFitText, 300))


  //////////
  // Magnific Popup
  //////////

  var startWindowScroll = 0;
  $('[js-popup]').magnificPopup({
    type: 'ajax',
    fixedContentPos: true,
    fixedBgPos: true,
    alignTop: true,
    overflowY: 'scroll',
    closeBtnInside: true,
    preloader: false,
    midClick: true,
    removalDelay: 300,
    mainClass: 'popup-buble',
    callbacks: {
      beforeOpen: function() {
        startWindowScroll = _window.scrollTop();
        // $('html').addClass('mfp-helper');
      },
      close: function() {
        // $('html').removeClass('mfp-helper');
        _window.scrollTop(startWindowScroll);
      }
    }
  });

  $('[js-close-popup]').on('click', function(e){
    $.magnificPopup.close();

    e.preventDefault();
  })



  //////////
  // GALLERY
  //////////
  function initFancybox(){
    $().fancybox({
      selector : '[js-fancybox] > span',
      margin : [50, 50, 100, 50],
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
      mobile : {
        margin: [0,0,0,0]
      },

    });
  }

  function openGallery(id){
    if ( id ){
      $('[data-gallery="'+id+'"]').find('span').first().click()
    }
  }

  $(document).on('click', '[js-open-gallery]', function(e){
    var galleryId = $(this).data('for-gallery');
    openGallery(galleryId)

    e.preventDefault();
  })

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

      openGallery(galleryId)
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
      //e.preventDefault();
      //e.stopPropagation();
    }

  });


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
  addRotateTransform(svgDoc, svgEl, 'wheel_1', 3, 1);
  addRotateTransform(svgDoc, svgEl, 'wheel_2', 3, 1);
}

// document.getElementsByClassName = function(cl) {
//   var retnode = [];
//   var elem = this.getElementsByTagName('*');
//   for (var i = 0; i < elem.length; i++) {
//     if((' ' + elem[i].className + ' ').indexOf(' ' + cl + ' ') > -1) retnode.push(elem[i]);
//   }
//   return retnode;
// };

function addRotateTransform(target_doc, target_el, target_class, dur, dir) {
  var my_element = target_el.getElementsByClassName(target_class)[0];
  var a = target_doc.createElementNS(svgNS, "animateTransform");

  var bb = my_element.getBBox();
  var cx = bb.x + bb.width / 2;
  var cy = bb.y + bb.height / 2;

  a.setAttributeNS(null, "attributeName", "transform");
  a.setAttributeNS(null, "attributeType", "XML");
  a.setAttributeNS(null, "type", "rotate");
  a.setAttributeNS(null, "dur", dur + "s");
  a.setAttributeNS(null, "repeatCount", "indefinite");
  a.setAttributeNS(null, "from", "0 " + cx + " " + cy);
  a.setAttributeNS(null, "to", 360 * dir + " " + cx + " " + cy);

  my_element.appendChild(a);
  a.beginElement();
}
