var $grid;
var locked = false; // by default editing is enabled for admins

// slideshow vars:
var ssRunning = false,
  ssOnce = false,
  ssDelay = 2500 /*ms*/,
  ssButtonClass = '.pswp__button--playpause';

var galleryPswp = null;
var galleryPswpElement = document.getElementById('gallery');
var gridImageListCache = null;

// easier to have separate to rebind between state changes
function gridItemClick(e) {
  e.preventDefault();
  $item = $(this).closest('.grid-item');
  // if the pic is being dragged, don't click.
  if ($item.hasClass('dragged') || $item.hasClass('is-positioning-post-drag')) {
    $item.removeClass('dragged');
    return false;
  }
  $('#gallery').addClass('gallery');

  var galleryOptions = {
    shareEl: false,
    closeOnScroll: false,
    closeOnVerticalDrag: false,
    index: $grid.packery('getItemElements').indexOf($(this).closest('.grid-item')[0]),
    //,preLoad: [1,3]
    // ,getThumbBoundsfn: function(index) {
    //     // find thumbnail element
    //     var thumbnail =  $galleryImgs[index];
    //     // get window scroll Y
    //     var pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
    //     // optionally get horizontal scroll
    //     // get position of element relative to viewport
    //     var rect = thumbnail.getBoundingClientRect();
    //     // w = width
    //     return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
    //     // Good guide on how to get element coordinates:
    //     // http://javascript.info/tutorial/coordinates
    // }
    showHideOpacity: true,
  };

  // galleryPswp.listen('imageLoadComplete', function(idx, item) {
  //     $(this).data('fp-src', $(this).attr('src')).attr('data-fp-src',$(this).attr('src'));
  // });

  if (gridImageListCache === null) {
    gridImageListCache = gridItemsLazyLoaded();
  }

  galleryPswp = new PhotoSwipe(galleryPswpElement, PhotoSwipeUI_Default, gridImageListCache, galleryOptions);

  //galleryPswp.options = galleryOptions;
  galleryInit(galleryPswp, galleryOptions);

  setSlideshowState(ssButtonClass, false /* not running from the start */);

  // start timer for the next slide in slideshow after prior image has loaded
  galleryPswp.listen('afterChange', function() {
    if (ssRunning && ssOnce) {
      ssOnce = false;
      setTimeout(gotoNextSlide, ssDelay);
    }
  });
  galleryPswp.listen('destroy', function() {
    galleryPswp = null;
  });

  galleryPswp.init();
}

/* slideshow management */
$(ssButtonClass).on('click', function(e) {
  // toggle slideshow on/off
  setSlideshowState(this, !ssRunning);
});

function setSlideshowState(el, running) {
  if (running) {
    setTimeout(gotoNextSlide, ssDelay / 2.0 /* first time wait less */);
  }
  var title = running ? 'Pause Slideshow' : 'Play Slideshow';
  $(el)
    .removeClass(running ? 'play' : 'pause') // change icons defined in css
    .addClass(running ? 'pause' : 'play')
    .prop('title', title);
  ssRunning = running;
}

function gotoNextSlide() {
  if (ssRunning && !!galleryPswp) {
    ssOnce = true;
    galleryPswp.next();
    // start counter for next slide in 'afterChange' listener
  }
}

jQuery(document).ready(function() {
  $('#address-collection').on('submit', function(e) {
    e.preventDefault();
    var content = Object.create(Appy.Content);
    var $state = $('#state');
    var $region = $('#region');
    var state = $state.val();
    var region = $region.val();

    if (!$state.is(':visible')) {
      state = null;
    } else {
      region = null;
    }
    content
      .save(
        {
          action: 'save_address',
          line1: $('#line1').val(),
          line2: $('#line2').val(),
          city: $('#city').val(),
          state: state,
          region: region,
          zip: $('#zip').val(),
          country: $('#country').val(),
          phone: $('#phone').val(),
          endpoint: eventData.endpointContent,
        },
        null,
        null,
        true
      )
      .then(function() {
        $('#address-save-btn').text('Saved');
        swal({
          title: 'Thanks!',
          text: "We've saved your address.",
          type: 'success',
          confirmButtonText: 'Saved',
          confirmButtonColor: '#fff',
        });
      })
      .catch(function(err) {
        swal({
          title: 'Oops!',
          text: 'Something went wrong, sorry about that. Please try again.',
          type: 'error',
          confirmButtonText: 'Close',
          confirmButtonColor: '#fff',
        });
      });
  });
  var summernoteToolbar = [['style', ['bold', 'italic', 'underline']], ['insert', ['video', 'image', 'link']]];
  if ($('body').hasClass('guestbook')) {
    summernoteToolbar = [];
  }
  $('.js-summernote').summernote({
    dialogsInBody: true,
    disableDragAndDrop: true,
    toolbar: summernoteToolbar,
  });

  // if ($('body').hasClass('guestbook')) {
  //     if (Cookies.get('guestbook-msg')) {
  //         $('.note-editor').find('.note-editable').html(Cookies.get('guestbook-msg'));
  //         $('#guestbook-note').val(Cookies.get('guestbook-msg'));
  //         Cookies.remove('guestbook-msg');
  //     }
  // }

  if ($('body.address')[0]) {
    bindCountryChange($('#country'), $('#state'), $('#state-label'), $('#region'), $('#region-label'), true);
  }

  if ($('body.gallery')[0]) {
    // init Masonry
    // $grid = new AnimOnScroll( document.getElementById( 'grid' ), {
    //     minDuration : 0.4,
    //     maxDuration : 0.7,
    //     viewportFactor : 0.2
    //     ,gutter: 6
    // } );

    var initializedPackery = false;

    $grid = $('.grid');
    var readyToScroll = false;

    $packery = $grid.packery({
      itemSelector: '.grid-item', // use a separate class for itemSelector, other than .col-
      columnWidth: '.grid-sizer',
      percentPosition: true,
      gutter: 6,
      initLayout: true,
      stamp: '.stamp',
    });

    $grid.imagesLoaded().progress(function(imgLoad, image) {
      readyToScroll = true;

      var $gridItem = $(image.img).closest('.grid-item');
      $gridItem.find('.grid-item-content').css('visibility', 'visible');

      $grid.packery('layout');
    });

    $packery.one('layoutComplete', function(event, laidOutItems) {
      if (initializedPackery === false) {
        $grid.trigger('galleryGrid:packeryLoaded');
      }
      initializedPackery = true;
      $(document).off('click', '.grid-item a');
      $(document).on('click', '.grid-item a', gridItemClick);
    });

    photoGalleryCount = 0;
    var w = $(window);
    var loadAnyway = false;

    if (photoGalleryArray.length > 0) {
      $('#gallerySpinnerScrollDown').show();
    }

    $('body').css('height', 'auto');

    var onScroll = function() {
      if (
        loadAnyway === true ||
        (w.innerHeight() + w.scrollTop() >= document.body.offsetHeight - 10 && readyToScroll === true)
      ) {
        readyToScroll = false;
        loadAnyway = false;
        $('#gallerySpinner').removeClass('hidden');
        $('#gallerySpinnerScrollDown').addClass('hidden');

        var items = '';
        for (i = 0; i < 10; i++) {
          if (
            photoGalleryArray[photoGalleryCount + i] !== undefined &&
            photoGalleryArray[photoGalleryCount + i] !== null
          ) {
            items +=
              '<div class="grid-item draggable-item col-xs-6 col-md-3" data-key="' +
              photoGalleryArray[photoGalleryCount + i].id +
              '" >' +
              '<div class="grid-item-content" style="visibility:hidden">' +
              '<a href="#">' +
              '<img ' +
              ' src="' +
              photoGalleryArray[photoGalleryCount + i].url_t +
              '"' +
              ' alt="' +
              photoGalleryArray[photoGalleryCount + i].caption +
              '"' +
              ' data-key="' +
              photoGalleryArray[photoGalleryCount + i].id +
              '"' +
              ' data-w="' +
              photoGalleryArray[photoGalleryCount + i].index +
              '"' +
              ' data-editable="' +
              photoGalleryArray[photoGalleryCount + i].editable +
              '"' +
              ' class="gallery-img img-responsive" />';
            if (
              photoGalleryArray[photoGalleryCount + i].caption !== null &&
              photoGalleryArray[photoGalleryCount + i].caption.length > 1
            ) {
              items +=
                ' <div class="grid-item-content-overlay"><div class="grid-item-content-text">' +
                photoGalleryArray[photoGalleryCount + i].caption +
                '</div></div>';
            }
            items += '</a>' + '</div>';
            if (photoGalleryArray[photoGalleryCount + i].role == 'admin') {
              items +=
                '<div id="toolbar-options-' +
                photoGalleryArray[photoGalleryCount + i].id +
                '" class="hidden">' +
                '<a href="#" class="tool-item gallery-tool-item" data-key="' +
                photoGalleryArray[photoGalleryCount + i].id +
                '" data-type="edit"><i class="fa fa-pencil" aria-hidden="true"></i></a>' +
                '<a href="#" class="tool-item gallery-tool-item" data-key="' +
                photoGalleryArray[photoGalleryCount + i].id +
                '" data-type="new"><i class="fa fa-plus" aria-hidden="true"></i></a>' +
                '<a href="#" class="tool-item gallery-tool-item" data-key="' +
                photoGalleryArray[photoGalleryCount + i].id +
                '" data-type="delete"><i class="fa fa-trash-o" aria-hidden="true"></i></a>' +
                '</div>';
            } else if (photoGalleryArray[photoGalleryCount + i].role == 'guest') {
              items +=
                '<div id="toolbar-options-' +
                photoGalleryArray[photoGalleryCount + i].id +
                '" class="hidden">' +
                '<a href="#" class="tool-item gallery-tool-item" data-key="' +
                photoGalleryArray[photoGalleryCount + i].id +
                '" data-type="new"><i class="fa fa-plus" aria-hidden="true"></i></a>' +
                '<a href="#" class="tool-item gallery-tool-item" data-key="' +
                photoGalleryArray[photoGalleryCount + i].id +
                '" data-type="delete"><i class="fa fa-trash-o" aria-hidden="true"></i></a>' +
                '</div>';
            }

            items += '</div>';
          } else {
            $('#gallerySpinner').addClass('hidden');
          }
        }

        photoGalleryCount += 10;

        var $items = $(items);

        // append items to grid
        $grid.append($items);

        // add and lay out newly appended items
        $grid.imagesLoaded(function() {
          $grid.packery('appended', $items);
          readyToScroll = true;
          $items.find('.grid-item-content').css('visibility', 'visible');
          $('#gallerySpinner').addClass('hidden');
          $grid.trigger('galleryGrid:packeryLoaded');
          $(document).off('click', '.grid-item a');
          $(document).on('click', '.grid-item a', gridItemClick);

          if ($(window).height() === $(document).height() && photoGalleryArray.length > 0) {
            loadAnyway = true;
            onScroll();
          }
        });
        $(document).off('click', '.grid-item a');
        $(document).on('click', '.grid-item a', gridItemClick);
      }
    };

    if ($(window).height() === $(document).height() && photoGalleryArray.length > 0) {
      loadAnyway = true;
      onScroll();
    }

    w.scroll(onScroll);
  }

  var $people = $('#people');
  if ($people) {
    // show the correct row based on which nav-pill was clicked
    $people.find('.nav-pills li > a:not(.category-tool-item)').on('click', function(e) {
      e.preventDefault();
      var self = this;
      $(this)
        .closest('.nav-pills')
        .find('.category-link')
        .removeClass('active');
      $(this).addClass('active');
      var $active = $('.grid .row.active');
      $active.removeClass('active');
      $people
        .find('.details')
        .stop()
        .fadeOut();
      $active.stop().fadeOut(500, function() {
        $('.grid .row.' + $(self).data('key')).addClass('active');
        $people
          .find('.row.active')
          .find('.person-link')
          .first()
          .trigger('click'); // load the first person
        $('.grid .row.' + $(self).data('key'))
          .stop()
          .fadeIn();
      });
    });

    // show person details
    $people.find('.person-link').on('click', function(e) {
      e.preventDefault();
      if ($(this).hasClass('is-animating')) return;

      $people
        .find('.person-link')
        .find('img')
        .removeClass('bright');
      $(this)
        .find('img')
        .addClass('bright');

      var self = this;
      var $key = $(this).data('key');
      $('.details').fadeOut(400, function() {
        var that = this;
        $(this)
          .find('.sticky')
          .remove();
        var html = '<div class="sticky hidden" style="display: none">';

        if (
          $(self)
            .find('img')
            .data('lg')
        ) {
          html +=
            '<img data-fp-src="' +
            $(self)
              .find('img')
              .data('lg') +
            '"  class="img-responsive img-circle center-block" />';
        } else {
          html += $(self)
            .find('.no-pic')
            .clone()
            .wrap('<div>')
            .parent()
            .html(); // get the _outerHTML_
        }
        html +=
          '<div class="name subhead">' +
          $(self)
            .find('.name')
            .html() +
          '</div>' +
          '<div class="title">' +
          $(self)
            .find('.title')
            .html() +
          '</div>' +
          '<div class="description"></div></div>';
        if (typeof Appy.Content.editor.isAdmin !== 'undefined' && Appy.Content.editor.isAdmin) {
          html +=
            '<div id="toolbar-options-details" class="hidden">' +
            '<a href="#" class="tool-item person-tool-item" data-key="' +
            $key +
            '" data-item="' +
            $key +
            '" data-type="edit"><i class="fa fa-pencil" aria-hidden="true"></i></a>' +
            '<a href="#" class="tool-item person-tool-item" data-key="' +
            $key +
            '" data-item="' +
            $key +
            '" data-type="new"><i class="fa fa-plus" aria-hidden="true"></i></a>' +
            '<a href="#" class="tool-item person-tool-item" data-key="' +
            $key +
            '" data-item="' +
            $key +
            '" data-type="delete"><i class="fa fa-trash-o" aria-hidden="true"></i></a>' +
            '</div>';
        }
        $(this).html(html);
        $(this)
          .find('.description')
          .html(
            $(self)
              .siblings('.description')
              .html()
          );
        objectFitImages();
        var detail_img = document.querySelector('#people .details img');
        if (detail_img != null) {
          $(detail_img).on('load', function() {
            objectFitImages(detail_img);
            $(that)
              .find('.sticky')
              .removeClass('hidden')
              .fadeIn(100);
          });
          filepicker.responsive(detail_img);
        } else {
          $(that)
            .find('.sticky')
            .removeClass('hidden')
            .fadeIn(100);
        }
        $(this).fadeIn(100);
        if (typeof Appy.Content.editor.isAdmin !== 'undefined' && Appy.Content.editor.isAdmin) {
          $(this)
            .find('.sticky')
            .toolbar({
              content: '#toolbar-options-details',
              position: 'right',
            });
        }
      });
    });
    $people
      .find('.' + $('.nav-pills li:first a').data('key') + ' .person-link')
      .first()
      .trigger('click'); // when page loads, load the first person for first category
  }

  if ($('#couple')[0]) {
    $('#couple-stories')
      .find('.story-text')
      .find('blockquote')
      .each(function() {})
      .expander({
        expandEffect: 'fadeIn',
        slicePoint: 500,
        moreClass: 'expand-read-more',
        lessClass: 'expand-read-less',
        afterExpand: function() {
          $('#couple-stories').css('height', $('#couple-stories').height() + ($(this).height() - 200));
        },
        afterCollapse: function() {
          $('#couple-stories').css(
            'height',
            $('#couple-stories').height() -
              ($(this)
                .closest('blockquote')
                .height() +
                200)
          );
        },
      });

    $(document).on('click', '.pswp .read-more', function() {
      $(this)
        .siblings('span')
        .addClass('show');
      $(this).hide();
    });

    $cs = $('#couple-stories');
    $('#scroll-left, #scroll-right').addClass('trans');

    var slideshows = $('.cycle-slideshow').on('cycle-next cycle-prev cycle', function(e, opts) {
      // advance the other slideshow
      //slideshows.cycle('pause');
      slideshows
        .not(this)
        .cycle('stop')
        .cycle('goto', opts.currSlide);
    });
    $cs.on('cycle-after', function(event, optionHash, outgoingSlideEl, incomingSlideEl, forwardFlag) {
      $('#couple-stories').css('min-height', $(incomingSlideEl).height()); //'#slider-element_'+
      //$('body').stop().animate({ scrollTop: 0 }, 'slow');
    });

    $cs.find('.cycle-slide').click(function() {
      var index = $cs.data('cycle.API').getSlideIndex(this);
      slideshows.cycle('stop').cycle('goto', index);
    });

    $('.sub-nav .cycle-slideshow li').click(function() {
      $('.sub-nav .menuitem').removeClass('cycle-slide-active');
      $(this).addClass('cycle-slide-active');

      var idx = $('.sub-nav .cycle-slideshow')
        .data('cycle.API')
        .getSlideIndex(this);
      $cs.cycle('stop').cycle('goto', idx);
    });

    $(document).on('click', '.story-img, .story .read-more', function(e) {
      e.preventDefault();
      var items = [];
      // loop each story(skip any w/o an id set). Cycle2 sets a "fake" element with no id
      $.each($('#couple-stories').find('.story[id]'), function() {
        console.log('st: ', this);
        var img = $(this)
          .find('img')
          .attr('src');
        var imgFull = $(this)
          .find('img')
          .attr('data-full-src');
        var blockquote = $(this)
          .find('blockquote .details p')
          .html();

        if (typeof img == 'undefined' && typeof blockquote == 'undefined') return; // empty
        if (typeof blockquote == 'undefined' && $(this).find('.story-title').length) {
          blockquote = $(this)
            .find('.story-title')
            .html();
        }
        var html = '';
        html = '<div class="row">' + '<div>';
        if (typeof imgFull != 'undefined') {
          html += '<img src="' + imgFull + '" class="img-responsive" />';
        }
        html += '</div>' + '<div>';
        if (typeof blockquote != 'undefined') {
          html += '<blockquote>' + blockquote + '</blockquote>';
        }
        html += '</div>' + '</div>';
        items.push({
          html: html,
        });
        console.log(items);
      });
      var pswpElement = document.querySelectorAll('.pswp')[0];
      var options = {
        shareEl: false,
        closeOnScroll: false,
        closeOnVerticalDrag: false,
        index:
          $(this)
            .parents('.story')
            .index() - 1 || 0,
        isClickableElement: function(el) {
          return el.tagName === 'A' && (el.className === 'more-link' || el.className === 'less-link');
        },
        getThumbBoundsfn: function(index) {
          // find thumbnail element
          var thumbnail = $('.story:not(.cycle-sentinel) img')[index];
          // get window scroll Y
          var pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
          // optionally get horizontal scroll
          // get position of element relative to viewport
          var rect = thumbnail.getBoundingClientRect();
          // w = width
          return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
          // Good guide on how to get element coordinates:
          // http://javascript.info/tutorial/coordinates
        },
        showHideOpacity: false,
      };
      var galleryCouple = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
      // gallery.listen('preventDragEvent', function(e, isDown, preventObj) {
      //     // e - original event
      //     // isDown - true = drag start, false = drag release
      //
      //     // Line below will force e.preventDefault() on:
      //     // touchstart/mousedown/pointerdown events
      //     // as well as on:
      //     // touchend/mouseup/pointerup events
      //     preventObj.prevent = true;
      // });
      galleryCouple.listen('afterInit', function() {
        $('body').css('overflow', 'hidden');
        var $img = $('.pswp img');
        console.log('img: ', $img);
        if ($img.width() < $img.height()) {
          $img.css('height', '100%');
          $img.css('width', 'auto');
        } else {
          $img.css('height', 'auto');
          $img.css('width', '100%');
        }
      });
      galleryCouple.listen('destroy', function() {
        $('body').css('overflow', 'auto');
      });
      galleryCouple.listen('afterChange', function() {
        $('.pswp__zoom-wrap')
          .find('blockquote')
          .each(function() {})
          .expander({
            expandEffect: 'fadeIn',
            slicePoint: 500,
            moreClass: 'expand-read-more',
            lessClass: 'expand-read-less',
            afterExpand: function() {},
            afterCollapse: function() {},
          });
      });

      // only init if there are items
      if ($('.story').length > 0) {
        galleryInit(galleryCouple, options);
        galleryCouple.init();
      }
    });
  }

  /* might not need this... */
  function isElementInViewport(el) {
    var rect = el.getBoundingClientRect();
    return (
      rect.bottom > 0 &&
      rect.right > 0 &&
      rect.left < (window.innerWidth || document.documentElement.clientWidth) &&
      rect.top < (window.innerHeight || document.documentElement.clientHeight)
    );
  }

  function getViewport() {
    var $w = $(window);
    return {
      l: $w.scrollLeft(),
      t: $w.scrollTop(),
      w: $w.width(),
      h: $w.height(),
    };
  }

  function adjustSectionHeight() {
    var $sub = $('.sub-nav');
    if ($sub.find('.cycle-carousel-wrap').width() < $sub.find('.cycle-slideshow').width()) {
      $sub.find('.scroll-left, .scroll-right').hide();
    } else {
      $sub.find('.scroll-left, .scroll-right').fadeIn('slow');
    }
  }
  adjustSectionHeight();
  $(window).on('resize', function() {
    $(this)
      .delay(250)
      .queue(function() {
        adjustSectionHeight();
        $(this).dequeue();
      });
  });

  // photoswipe fixe/photoswipe-4-0-initiate-swipe-to-next-programatically/28320098#28320098
  $('body')
    .on('mousedown', '.pswp__scroll-wrap', function(event) {
      // On mousedown, temporarily remove the transition class in preparation for swipe.     $(this).children('.pswp__container_transition').removeClass('pswp__container_transition');
    })
    .on('mousedown', '.pswp__button--arrow--left, .pswp__button--arrow--right', function(event) {
      // Exlude navigation arrows from the above event.
      event.stopPropagation();
    })
    .on('mousemove.detect', function(event) {
      // Detect mouseUsed before as early as possible to feed PhotoSwipe
      mouseUsed = true;
      $('body').off('mousemove.detect');
    });
});
