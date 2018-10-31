var eventUI = {
    opts: {
        $el: $('#event')
        ,items: $('.event-nav-item')
        ,subevents: $('.event-details')
    }
    ,items: function __items__() {
        return this.opts.items;
    }
    ,subevents: function __subevents__() {
        // key subevents by id
        var o = {};
        $.each(this.opts.subevents,function __each__(i, obj) {
            o[$(obj).data('key')] = obj;
        });
        return o;
    }
    ,init: function(opts) {
        if (opts != null) this.opts = opts;
        this.bindHandlers();
        $('button.event-tool-edit-item, button.rsvp-widgets').delay(600).addClass('fadeIn');
        var style = $("<style type='text/css'>").appendTo('head');
        var span_height = document.body.children.mobileHeader.offsetHeight;
        var css = "\
                    .main-content{\
                        padding-top: "+span_height+"px;\
                    }";
        style.html(css);
    }
    ,bindHandlers: function() {
        var self = this;
        this.items().on('click', function __handler__(e) {
            e.preventDefault();
            e.stopPropagation();
            self.changeSubEvent($(this).data('key'));
        });
    }
    ,changeSubEvent: function(id) {
        if (id == '' || id == null) return
        var items = this.items();
        var subevents = this.subevents();
        var opts = this.opts;
        var $widgetContainers = $('.event-widget-container');
        if (!Number.isNaN(parseInt(id)) || id == 'private') {
            $widgetContainers.filter('.active').fadeOut(function _fadeout__() {
                $(this).removeClass('active');
                $widgetContainers.each(function(container) {
                    if ($(this).data('key') == id) {
                        $(this).addClass('active').fadeIn();
                    }
                });
            });
            $(opts.subevents).filter('.active').fadeOut(function _fadeout__() {
                $(this).removeClass('active');
                $(subevents[id]).addClass('active').fadeIn();
            });
        }
        for (var i = 0; i < items.length; i++) {
            var $item = $(items[i]);
            var itemDuplicateLeft = '-5em';
            if ($item.hasClass("event-nav-duplicate")) {
                itemDuplicateLeft = '500%';
            }
            if ($item.data('key') == id) {
                $item.find('.item-date').animate({
                    left: '100%'
                }, 250);
                $item.addClass('active');
            } else {
                $item.find('.item-date').animate({
                    left: itemDuplicateLeft
                }, 250);
                $item.removeClass('active');
            }
        }
    }
}
$(document).ready(function() {
    eventUI.init();
});

