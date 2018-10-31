//jQuery(document).ready(function() {
//     objectFitImages(null, {watchMQ: true});
//     filepicker.setKey('AR8R7qULjSKCgBVrWM8Lwz');
//     filepicker.setResponsiveOptions({
//         pixelRound: 50
//         ,onResize: 'up'
//     });
//});

window.EVT = new EventEmitter2();
function gridItems() {
    var $items = $grid.packery('getItemElements');// $('#grid').find('.grid-item').find('img');
    var items = [];
    $.each($items, function () {
        var $img = $(this).find('img');
        var item = {
            src: $img.attr('src')
            , url: $img.attr('src')
            , w: $img[0].naturalWidth
            , h: $img[0].naturalHeight
            , title: $img.attr('alt')
        };
        items.push(item);
    });
    return items;
}

function gridItemsLazyLoaded() {

     var items = [];
     $.each(photoGalleryArrayDom, function () {
        var item = {
            src: this.url
            , url: this.url
            , w: this.width
            , h: this.height
            , title: this.caption
        };
        items.push(item);
    });

     $.each(photoGalleryArray, function () {
        var item = {
            src: this.url
            , url: this.url
            , w: this.width
            , h: this.height
            , title: this.caption
        };
        items.push(item);
    });
    return items;
}

function getImgDimensions(img) {
    var t = new Image();
    t.src = (img.getAttribute ? img.getAttribute("src") : false) || img.src;
    return [t.width, t.height];
}

// photoswipe fix for animations
// Transition Manager function (triggers only on mouseUsed)
var mouseUsed = false;
var galleryInit = function(gallery, opts) {
    function transitionManager() {
        // Create var to store slide index
        var currentSlide = opts.index;
        // Listen for photoswipe change event to re-apply transition class
        gallery.listen('beforeChange', function() {
            // Only apply transition class if difference between last and next slide is < 2
            // If difference > 1, it means we are at the loop seam.
            var transition = Math.abs(gallery.getCurrentIndex()-currentSlide) < 2;
            // Apply transition class depending on above
            $('.pswp__container').toggleClass('pswp__container_transition', transition);
            // Update currentSlide
            currentSlide = gallery.getCurrentIndex();
        });
    }
    // Only apply transition manager functionality if mouse
    if(mouseUsed) {
        transitionManager();
    } else {
        gallery.listen('mouseUsed', function(){
            mouseUsed = true;
            transitionManager();
        });
    }
};

jQuery(document).ready(function() {
    $('#preview-toggle').on('change', function(e) {
        e.preventDefault();
        if ($(this).prop('checked')) {
            $('#preview-multi-link')[0].click();
        } else {
            $('#preview-single-link')[0].click();
        }
    });
    $('.form-material.floating > .form-control').each(function(){
        var $input  = jQuery(this);
        var $parent = $input.parent('.form-material');

        if ($input.val()) {
            $parent.addClass('open');
        }

        $input.on('change', function(){
            if ($input.val()) {
                $parent.addClass('open');
            } else {
                $parent.removeClass('open');
            }
        });
    });
});

