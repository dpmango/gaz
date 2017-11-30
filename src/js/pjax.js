$(document).ready(function(){
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
