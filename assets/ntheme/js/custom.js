/*
------------------------------------------------------------------------
* Template Name    : Elvish | Responsive Bootstrap 4 Personal Template * 
* Author           : ThemesBoss                                        *
* Version          : 1.0.0                                             *
* Created          : May 2018                                          *
* File Description : Main Js file of the template                      *
*-----------------------------------------------------------------------
*/
$(window).on('load', function() {
  $('#preloader').css({
    "transform": "translateY(-100%)",
    "transition-delay": "0.6s"
  });
  $('.loader').css({
    "opacity": "0",
    "transform": "translate(-50%,-100%)",
    "transition-delay": "0.3s"
  });

  $('.loader_text_unit').each(function() {
    var $this = $(this),
        countTo = $this.attr('data-count');

    $({ countNum: $this.text()}).animate({
      countNum: countTo
    },

    {

      duration: 500,
      easing:'linear',
      step: function() {
        $this.text(Math.floor(this.countNum));
      },
      complete: function() {
        $this.text(this.countNum);
      }
    });
  });

});


        $("body").delay(350).css({overflow:"visible"}),$(window).on("scroll",function(){$(window).scrollTop()>=150?$(".sticky").addClass("stickyadd"):$(".sticky").removeClass("stickyadd")});
