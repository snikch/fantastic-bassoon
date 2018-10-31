var widgets = (function widgets() {
    var hasInit = false;
    function init() {
        if (hasInit) return; // make sure no one calls init twice
        hasInint = true;

        $('.widget-photo-grid .widget-lightbox, .widget-base .widget-lightbox, .widget-image .widget-lightbox').each(function(){
            var that = $(this);
            that.on('click',
                function(e){
                    lightbox(e, that.parents('.widget-content-img'));
                }
            );
        });

        // $('.widget-lightbox').on('click',lightbox);
    }

    function lightbox(e, parent) {
        e.preventDefault();
        var items = [];
        var html;
        var t = this;
        $('.widget-lightbox', parent).each(function() {
            html = '';
            if (
                ($(this).data('src') != null)
                && $(this).data('src').length > 0
            ) {
                html = '<img src="'+$(this).data('src')+'" class="img-responsive"  />';
            } else {
                html = '<img src="'+$(this).attr('src')+'" class="img-responsive"  />';
            }
            var singItem = {
                src: $(this).data('src')
            };
            if ($(this).data('width') !== undefined && $(this).data('width') > 0) {
                singItem['w'] = $(this).data('width');
                singItem['h'] = $(this).data('height');
            }
            else {
                singItem = {
                    html: html
                };
            }
            items.push(singItem);
        });
        var pswpElement = document.querySelectorAll('.pswp')[0];
        var options = {
            shareEl: false
            ,closeOnScroll: false
            ,closeOnVerticalDrag: false
            ,index: parent.find('.widget-lightbox').index(e.currentTarget) || 0
            ,showHideOpacity: false
        };
        var g = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
        galleryInit(g, options);
        g.init();
    }

    window.EVT.on('init', init);
    var publicAPI = {

    };
    return publicAPI;
})();
